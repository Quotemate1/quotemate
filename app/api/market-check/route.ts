import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const { description, tradeType } = await req.json()

    if (!description || !description.trim()) {
      return NextResponse.json({ success: false, error: 'Description required' }, { status: 400 })
    }

    const prompt = `You are an expert on Australian trade pricing. A ${tradeType || 'tradie'} is quoting for the following item or service:

"${description}"

Provide a typical Australian market price range for this. Respond ONLY with valid JSON (no markdown, no backticks) in this exact format:
{
  "lowPrice": 0,
  "highPrice": 0,
  "unit": "per item / per hour / per sqm / etc",
  "notes": "Brief context — supplier, region variation, what affects price",
  "tradeRate": "Typical trade/wholesale rate if applicable, or null",
  "confidence": "high / medium / low"
}

Rules:
- Use realistic Australian pricing in AUD, GST-inclusive
- If it's a product (e.g. "Rinnai 26L"), give retail price ranges
- If it's a service (e.g. "Service call"), give labour rate ranges
- If unclear, set confidence to "low" and explain in notes
- Keep notes under 150 characters
- All prices are numbers, no $ signs`

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    const cleaned = responseText.replace(/```json\n?|\n?```/g, '').trim()
    const result = JSON.parse(cleaned)

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}