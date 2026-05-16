import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json()

    const firstName = name || email.split('@')[0].split('.')[0].charAt(0).toUpperCase() + email.split('@')[0].split('.')[0].slice(1)

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
        <div style="background:#1a1a2e;color:white;padding:32px;text-align:center;">
          <h1 style="margin:0;font-size:28px;">Welcome to SmokoHQ 🍺</h1>
          <p style="margin:8px 0 0;opacity:0.7;">You take your smoko. We'll handle the quotes.</p>
        </div>
        <div style="padding:32px;line-height:1.6;">
          <p>G'day ${firstName},</p>

          <p>Welcome to SmokoHQ — you're now part of the smartest way for Aussie tradies to win more work.</p>

          <p>Here's what you can do right now:</p>

          <div style="background:#f5f5f5;padding:20px;border-radius:8px;margin:20px 0;">
            <h3 style="margin-top:0;color:#1a1a2e;">⚡ Create your first quote in 60 seconds</h3>
            <ol style="margin:8px 0;padding-left:20px;">
              <li>Tell us about the job (a few words is fine)</li>
              <li>Add what you're charging</li>
              <li>Click "Generate Quote with AI"</li>
              <li>Email or download the PDF</li>
            </ol>
            <a href="https://smokohq.app/create-quote" style="display:inline-block;background:#10b981;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;margin-top:8px;">Create Your First Quote →</a>
          </div>

          <h3 style="color:#1a1a2e;">What makes SmokoHQ different</h3>
          <ul style="padding-left:20px;">
            <li><strong>AI writes your quotes</strong> — professional scope, T&Cs, GST, all done for you</li>
            <li><strong>Auto follow-ups</strong> — if customers don't respond in 48hrs, we chase them automatically</li>
            <li><strong>Saved line items</strong> — add your common items once, tap to use forever</li>
            <li><strong>Won/Lost tracking</strong> — see your conversion rate and revenue won</li>
          </ul>

          <h3 style="color:#1a1a2e;">Quick tips</h3>
          <ul style="padding-left:20px;">
            <li><strong>Set up your saved items first</strong> — common things you charge for. Saves time on every future quote. <a href="https://smokohq.app/settings" style="color:#10b981;">Go to Settings →</a></li>
            <li><strong>The AI is good but check it</strong> — click any text on the quote preview to edit it before sending.</li>
            <li><strong>Free plan = 2 quotes</strong> — to keep going, start your 7-day free trial of Starter or Pro. <a href="https://smokohq.app/pricing" style="color:#10b981;">View pricing →</a></li>
          </ul>

          <p>Got questions? Just reply to this email — I read every one.</p>

          <p>Cheers,<br><strong>Lucas</strong><br>Founder, SmokoHQ</p>

          <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:12px;color:#999;text-align:center;">
            SmokoHQ — Built in Australia for Australian tradies<br>
            <a href="https://smokohq.app" style="color:#999;">smokohq.app</a>
          </div>
        </div>
      </div>
    `

    const { data, error } = await resend.emails.send({
      from: 'SmokoHQ <onboarding@resend.dev>',
      to: email,
      subject: `Welcome to SmokoHQ, ${firstName} 🍺`,
      html: html,
    })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, emailId: data?.id })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}