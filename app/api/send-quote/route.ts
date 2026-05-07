import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { customerName, customerEmail, businessName, tradeType, quote, lineItems, subtotal, gst, total } = await req.json()

    const itemsHtml = lineItems
      .map((i: any) => `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${i.description}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">$${parseFloat(i.amount).toFixed(2)}</td></tr>`)
      .join('')

    const inclusionsHtml = quote.inclusions?.map((i: string) => `<li>${i}</li>`).join('') || ''
    const exclusionsHtml = quote.exclusions?.map((i: string) => `<li>${i}</li>`).join('') || ''

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
        <div style="background:#1a1a2e;color:white;padding:24px 32px;">
          <h1 style="margin:0;font-size:24px;">${businessName}</h1>
          <p style="margin:4px 0 0;opacity:0.7;text-transform:capitalize;">${tradeType}</p>
        </div>
        <div style="padding:32px;">
          <p>Hi ${customerName},</p>
          <p>${quote.greeting}</p>
          <h3 style="margin-top:24px;">Scope of Work</h3>
          <p>${quote.scopeOfWork}</p>
          <h3>What's Included</h3>
          <ul>${inclusionsHtml}</ul>
          <h3>Exclusions</h3>
          <ul>${exclusionsHtml}</ul>
          <table style="width:100%;border-collapse:collapse;margin:24px 0;">
            <thead><tr style="background:#f5f5f5;"><th style="padding:8px;text-align:left;">Item</th><th style="padding:8px;text-align:right;">Amount</th></tr></thead>
            <tbody>
              ${itemsHtml}
              <tr><td style="padding:8px;color:#666;">Subtotal</td><td style="padding:8px;text-align:right;color:#666;">$${subtotal.toFixed(2)}</td></tr>
              <tr><td style="padding:8px;color:#666;">GST (10%)</td><td style="padding:8px;text-align:right;color:#666;">$${gst.toFixed(2)}</td></tr>
              <tr style="font-weight:bold;font-size:18px;"><td style="padding:12px 8px;">Total (inc. GST)</td><td style="padding:12px 8px;text-align:right;">$${total.toFixed(2)}</td></tr>
            </tbody>
          </table>
          <h3>Terms & Conditions</h3>
          <p style="font-size:14px;color:#666;">${quote.terms}</p>
          <p style="font-size:14px;color:#666;font-style:italic;">Quote valid for ${quote.validityPeriod}</p>
          <p style="margin-top:24px;">${quote.closingMessage}</p>
          <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:12px;color:#999;">
            Sent via SmokoHQ — AI-powered quotes for Aussie tradies
          </div>
        </div>
      </div>
    `

    const { data, error } = await resend.emails.send({
      from: 'SmokoHQ <onboarding@resend.dev>',
      to: customerEmail,
      subject: `Quote from ${businessName} — ${tradeType}`,
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