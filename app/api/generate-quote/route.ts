import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { quoteGenLimiter, getClientIp } from '../../lib/ratelimit'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const DAILY_LIMIT = 20

export async function POST(req: NextRequest) {
  try {
    // RATE LIMIT CHECK - 10 requests/minute per IP
    const ip = getClientIp(req)
    const { success: notRateLimited, remaining, reset } = await quoteGenLimiter.limit(ip)

    if (!notRateLimited) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000)
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please slow down and try again in a moment.',
          rateLimited: true,
          retryAfter,
        },
        { status: 429, headers: { 'Retry-After': retryAfter.toString() } }
      )
    }

    const body = await req.json()

    if (!body.userId) {
      return NextResponse.json(
        { success: false, error: 'Missing user identity' },
        { status: 401 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: business, error: bizError } = await supabase
      .from('businesses')
      .select('id, daily_quote_count, quote_count_reset_at')
      .eq('user_id', body.userId)
      .single()

    if (bizError || !business) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }

    const lastReset = new Date(business.quote_count_reset_at)
    const now = new Date()
    const isNewDay =
      lastReset.getUTCFullYear() !== now.getUTCFullYear() ||
      lastReset.getUTCMonth() !== now.getUTCMonth() ||
      lastReset.getUTCDate() !== now.getUTCDate()

    let currentCount = business.daily_quote_count

    if (isNewDay) {
      await supabase
        .from('businesses')
        .update({
          daily_quote_count: 0,
          quote_count_reset_at: now.toISOString(),
        })
        .eq('id', business.id)
      currentCount = 0
    }

    if (currentCount >= DAILY_LIMIT) {
      return NextResponse.json(
        {
          success: false,
          error: `Daily limit of ${DAILY_LIMIT} quotes reached. Try again tomorrow.`,
          limitReached: true,
        },
        { status: 429 }
      )
    }

    const items = body.lineItems
      .map((i: any) => i.description + ': $' + i.amount)
      .join(', ')

    const msg = await anthropic.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: 'You write quotes for Australian tradies. Business: ' + body.businessName + '. Trade: ' + body.tradeType + '. Customer: ' + body.customerName + '. Job: ' + body.jobDescription + '. Items: ' + items + '. Return ONLY raw JSON with these keys: greeting, scopeOfWork, inclusions (array), exclusions (array), terms, validityPeriod, closingMessage. Australian English. No markdown. No backticks. Just JSON.'
      }]
    })

    const txt = msg.content[0]
    if (txt.type !== 'text') throw new Error('No text')

    const clean = txt.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsedQuote = JSON.parse(clean)

    await supabase
      .from('businesses')
      .update({ daily_quote_count: currentCount + 1 })
      .eq('id', business.id)

    return NextResponse.json({
      success: true,
      quote: parsedQuote,
      remainingToday: DAILY_LIMIT - (currentCount + 1),
      remainingMinute: remaining,
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}
