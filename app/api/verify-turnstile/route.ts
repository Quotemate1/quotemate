import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Missing CAPTCHA token' },
        { status: 400 }
      )
    }

    const secret = process.env.TURNSTILE_SECRET_KEY
    if (!secret) {
      return NextResponse.json(
        { success: false, error: 'CAPTCHA not configured on server' },
        { status: 500 }
      )
    }

    // Verify with Cloudflare
    const formData = new FormData()
    formData.append('secret', secret)
    formData.append('response', token)

    const verifyRes = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body: formData }
    )

    const data = await verifyRes.json()

    if (data.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: 'CAPTCHA verification failed', codes: data['error-codes'] },
        { status: 403 }
      )
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}
