import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const customerEmail = session.customer_email
        const subscriptionId = session.subscription as string
        const customerId = session.customer as string

        if (!customerEmail || !subscriptionId) break

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const priceId = subscription.items.data[0].price.id

        // Determine plan from price ID
        const plan = priceId === 'price_1TTBftPTh9bzSYAcKfbIIHkE' ? 'starter' : 'pro'

        // Find user by email
        const { data: { users } } = await supabase.auth.admin.listUsers()
        const user = users?.find(u => u.email === customerEmail)
        if (!user) break

        // Update business with subscription info
        await supabase
          .from('businesses')
          .update({
            subscription_status: subscription.status,
            subscription_plan: plan,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
          })
          .eq('user_id', user.id)

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await supabase
          .from('businesses')
          .update({
            subscription_status: subscription.status,
            subscription_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await supabase
          .from('businesses')
          .update({
            subscription_status: 'cancelled',
            subscription_plan: null,
          })
          .eq('stripe_subscription_id', subscription.id)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}