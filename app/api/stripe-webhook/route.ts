import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (!session.customer_email) break

        // Find the business by email
        const { data: business } = await supabase
          .from('businesses')
          .select('id, email, user_id, referred_by, free_months_earned, free_months_used, beta_weeks_earned')
          .eq('email', session.customer_email)
          .single()

        // Fallback: try matching by auth user email
        let foundBusiness = business
        if (!foundBusiness) {
          const { data: { users } } = await supabase.auth.admin.listUsers()
          const user = users.find(u => u.email === session.customer_email)
          if (user) {
            const { data: biz } = await supabase
              .from('businesses')
              .select('id, email, user_id, referred_by, free_months_earned, free_months_used, beta_weeks_earned')
              .eq('user_id', user.id)
              .single()
            foundBusiness = biz
          }
        }

        if (!foundBusiness) break

        const subscriptionId = session.subscription as string
        const customerId = session.customer as string

        // Determine plan from line items
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
        const priceId = lineItems.data[0]?.price?.id
        let plan = 'starter'
        if (priceId === 'price_1TTBgePTh9bzSYAcxlhErm4d') plan = 'pro'

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const periodEnd = new Date((subscription as any).current_period_end * 1000).toISOString()

        await supabase
          .from('businesses')
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_status: subscription.status,
            subscription_plan: plan,
            subscription_period_end: periodEnd,
          })
          .eq('id', foundBusiness.id)

        // LIVE-PHASE REFERRAL LOGIC
        // If this user was referred AND the referrer hasn't claimed their one-time bonus yet,
        // give the referrer 1 free month
        if (foundBusiness.referred_by) {
          const { data: referrer } = await supabase
            .from('businesses')
            .select('id, free_months_earned, referral_one_time_claimed, stripe_subscription_id, subscription_period_end')
            .eq('referral_code', foundBusiness.referred_by)
            .single()

          if (referrer && !referrer.referral_one_time_claimed) {
            // Mark the one-time bonus as claimed
            await supabase
              .from('businesses')
              .update({
                referral_one_time_claimed: true,
                free_months_earned: (referrer.free_months_earned || 0) + 1,
              })
              .eq('id', referrer.id)

            // If the referrer has an active Stripe subscription, extend their billing by 30 days
            if (referrer.stripe_subscription_id) {
              try {
                const referrerSub = await stripe.subscriptions.retrieve(referrer.stripe_subscription_id)
                const currentPeriodEnd = (referrerSub as any).current_period_end
                const newPeriodEnd = currentPeriodEnd + (30 * 24 * 60 * 60) // add 30 days

                await stripe.subscriptions.update(referrer.stripe_subscription_id, {
                  trial_end: newPeriodEnd,
                  proration_behavior: 'none',
                })

                console.log(`Extended referrer ${referrer.id} subscription by 30 days`)
              } catch (err) {
                console.error('Failed to extend referrer subscription:', err)
              }
            }
            // If they don't have an active sub yet, the free month sits as credit and applies
            // automatically when they subscribe later (handled via free_months_earned counter)
          }
        }

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: business } = await supabase
          .from('businesses')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!business) break

        const periodEnd = new Date((subscription as any).current_period_end * 1000).toISOString()

        await supabase
          .from('businesses')
          .update({
            subscription_status: subscription.status,
            subscription_period_end: periodEnd,
          })
          .eq('id', business.id)

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await supabase
          .from('businesses')
          .update({
            subscription_status: 'canceled',
          })
          .eq('stripe_customer_id', customerId)

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}