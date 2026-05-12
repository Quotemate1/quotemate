import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      customerName,
      customerEmail,
      businessName,
      tradeType,
      jobAddress,
      quote,
      lineItems,
      subtotal,
      gst,
      total,
      quoteId,
    } = body

    // Get the public_token for this quote
    let quoteLink = ''
    if (quoteId) {
      const { data: quoteData } = await supabase
        .from('quotes')
        .select('public_token')
        .eq('id', quoteId)
        .single()

      if (quoteData?.public_token) {
        quoteLink = `https://quotemate-eta.vercel.app/quote/${quoteData.public_token}`
      }
    }

    const itemsHtml = lineItems.map((item: any) =>
      `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${item.description}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">$${parseFloat(item.amount).toFixed(2)}</td></tr>`
    ).join('')

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
        <div style="background:#1a1a2e;color:white;padding:32px;text-align:center;">
          <h1 style="margin:0;font-size:28px;">${businessName}</h1>
          <p style="margin:8px 0 0;opacity:0.7;text-transform:capitalize;">${tradeType}</p>
        </div>
        <div style="padding:32px;line-height:1.6;">
          <p>G'day ${customerName},</p>

          <p>${quote.greeting}</p>

          ${quoteLink ? `
          <div style="text-align:center;margin:32px 0;">
            <a href="${quoteLink}" style="display:inline-block;background:#10b981;color:white;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">View Full Quote →</a>
            <p style="font-size:12px;color:#999;margin-top:8px;">Click to view, accept, or request changes</p>
          </div>
          ` : ''}

          <h3 style="color:#1a1a2e;margin-top:24px;">Scope of Work</h3>
          <p>${quote.scopeOfWork}</p>

          <h3 style="color:#1a1a2e;">Pricing</h3>
          <table style="width:100%;border-collapse:collapse;">
            ${itemsHtml}
            <tr><td style="padding:8px;color:#666;">Subtotal</td><td style="padding:8px;text-align:right;color:#666;">$${parseFloat(subtotal).toFixed(2)}</td></tr>
            <tr><td style="padding:8px;color:#666;">GST (10%)</td><td style="padding:8px;text-align:right;color:#666;">$${parseFloat(gst).toFixed(2)}</td></tr>
            <tr style="background:#f5f5f5;"><td style="padding:12px 8px;font-weight:bold;">Total (inc. GST)</td><td style="padding:12px 8px;text-align:right;font-weight:bold;font-size:18px;color:#10b981;">$${parseFloat(total).toFixed(2)}</td></tr>
          </table>

          <p style="margin-top:24px;">${quote.closingMessage}</p>

          ${quoteLink ? `
          <div style="text-align:center;margin:32px 0;">
            <a href="${quoteLink}" style="display:inline-block;background:#10b981;color:white;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:bold;">View & Accept Quote →</a>
          </div>
          ` : ''}

          <p style="font-size:12px;color:#999;border-top:1px solid #eee;padding-top:16px;margin-top:24px;">
            Quoted with SmokoHQ — AI quotes for Aussie tradies<br>
            <a href="https://quotemate-eta.vercel.app" style="color:#999;">quotemate-eta.vercel.app</a>
          </p>
        </div>
      </div>
    `

    const { data, error } = await resend.emails.send({
      from: `${businessName} <onboarding@resend.dev>`,
      to: customerEmail,
      subject: `Quote from ${businessName}`,
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