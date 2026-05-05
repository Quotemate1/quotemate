import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

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
    return NextResponse.json({ success: true, quote: JSON.parse(clean) })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}