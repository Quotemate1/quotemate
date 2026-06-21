import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const DAILY_LIMIT = 20

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // userId is required for rate limiting
    if (!body.userId) {
      return NextResponse.json(
        { success: false, error: 'Missing user identity' },
        { status: 401 }
      )
    }

    // Service role client (bypasses RLS - we manually check ownership)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Fetch the user's business + their current quote count
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

    // Check if we need to reset the counter (new day)
    const lastReset = new Date(business.quote_count_reset_at)
    const now = new Date()
    const isNewDay =
      lastReset.getUTCFullYear() !== now.getUTCFullYear() ||
      lastReset.getUTCMonth() !== now.getUTCMonth() ||
      lastReset.getUTCDate() !== now.getUTCDate()

    let currentCount = business.daily_quote_count

    if (isNewDay) {
      // Reset the counter
      await supabase
        .from('businesses')
        .update({
          daily_quote_count: 0,
          quote_count_reset_at: now.toISOString(),
        })
        .eq('id', business.id)
      currentCount = 0
    }

    // Hard block if at limit
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

    // Generate the quote
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

    // Increment the count (only AFTER successful generation)
    await supabase
      .from('businesses')
      .update({ daily_quote_count: currentCount + 1 })
      .eq('id', business.id)

    return NextResponse.json({
      success: true,
      quote: parsedQuote,
      remainingToday: DAILY_LIMIT - (currentCount + 1),
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}
