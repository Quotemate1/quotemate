import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PRICE_IDS: Record<string, string | undefined> = {
  starter: process.env.STRIPE_PRICE_STARTER,
  pro: process.env.STRIPE_PRICE_PRO,
}

export async function POST(req: NextRequest) {
  try {
    const { plan, email } = await req.json()

    const priceId = PRICE_IDS[plan]
    if (!priceId) {
      return NextResponse.json({ error: `Invalid plan: ${plan}` }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://smokohq.app/dashboard?payment=success',
      cancel_url: 'https://smokohq.app/pricing?payment=cancelled',
      subscription_data: {
        trial_period_days: 7,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}