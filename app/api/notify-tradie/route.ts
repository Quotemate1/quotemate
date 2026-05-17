import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { quoteId, response, message } = await req.json()
    // response: 'accepted' or 'declined'

    if (!quoteId || !response) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // Fetch quote + business + customer details
    const { data: quote } = await supabase
      .from('quotes')
      .select('*, business:businesses(business_name, email, user_id), customer:customers(name, email, phone)')
      .eq('id', quoteId)
      .single()

    if (!quote) {
      return NextResponse.json({ success: false, error: 'Quote not found' }, { status: 404 })
    }

    // Get tradie's email — try business email first, fall back to user email
    let tradieEmail = quote.business?.email
    if (!tradieEmail && quote.business?.user_id) {
      const { data: userData } = await supabase.auth.admin.getUserById(quote.business.user_id)
      tradieEmail = userData?.user?.email
    }

    if (!tradieEmail) {
      return NextResponse.json({ success: false, error: 'No tradie email found' }, { status: 400 })
    }

    const isAccepted = response === 'accepted'
    const customerName = quote.customer?.name || 'Your customer'
    const customerEmail = quote.customer?.email || ''
    const customerPhone = quote.customer?.phone || ''
    const total = parseFloat(quote.total || 0).toFixed(2)

    const subject = isAccepted
      ? `🎉 ${customerName} accepted your quote — $${total}`
      : `📝 ${customerName} requested changes on your quote`

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
        <div style="background:${isAccepted ? '#10b981' : '#f59e0b'};color:white;padding:32px;text-align:center;">
          <div style="font-size:48px;margin-bottom:8px;">${isAccepted ? '🎉' : '📝'}</div>
          <h1 style="margin:0;font-size:24px;">${isAccepted ? 'Quote Accepted!' : 'Changes Requested'}</h1>
        </div>

        <div style="padding:32px;line-height:1.6;">
          <p>G'day,</p>

          <p>${isAccepted
            ? `<strong>${customerName}</strong> just accepted your quote for <strong>$${total}</strong>. Time to get on the job! 💪`
            : `<strong>${customerName}</strong> wants some changes to your quote. Have a look below and update it when you can.`
          }</p>

          <div style="background:#f5f5f5;padding:20px;border-radius:8px;margin:20px 0;">
            <h3 style="margin-top:0;color:#1a1a2e;">Quote details</h3>
            <table style="width:100%;font-size:14px;">
              <tr><td style="padding:4px 0;color:#666;">Quote #:</td><td style="text-align:right;font-weight:bold;">${quote.quote_number}</td></tr>
              <tr><td style="padding:4px 0;color:#666;">Total:</td><td style="text-align:right;font-weight:bold;color:${isAccepted ? '#10b981' : '#333'};">$${total}</td></tr>
              <tr><td style="padding:4px 0;color:#666;">Customer:</td><td style="text-align:right;">${customerName}</td></tr>
              ${customerEmail ? `<tr><td style="padding:4px 0;color:#666;">Email:</td><td style="text-align:right;"><a href="mailto:${customerEmail}" style="color:#10b981;">${customerEmail}</a></td></tr>` : ''}
              ${customerPhone ? `<tr><td style="padding:4px 0;color:#666;">Phone:</td><td style="text-align:right;"><a href="tel:${customerPhone}" style="color:#10b981;">${customerPhone}</a></td></tr>` : ''}
            </table>
          </div>

          ${!isAccepted && message ? `
          <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px;margin:20px 0;border-radius:4px;">
            <p style="margin:0 0 8px 0;font-weight:bold;color:#92400e;">Customer's message:</p>
            <p style="margin:0;color:#451a03;font-style:italic;">"${message}"</p>
          </div>
          ` : ''}

          ${isAccepted ? `
            <p><strong>What happens next:</strong></p>
            <ul style="padding-left:20px;">
              <li>Reach out to confirm scheduling</li>
              <li>Send any final paperwork or deposit invoice</li>
              <li>Mark the quote as "Won" in your dashboard</li>
            </ul>
          ` : `
            <p><strong>What happens next:</strong></p>
            <ul style="padding-left:20px;">
              <li>Reach out to discuss the changes</li>
              <li>Create a revised quote in SmokoHQ</li>
              <li>Send it through and we'll auto-follow-up again</li>
            </ul>
          `}

          <div style="text-align:center;margin:32px 0;">
            <a href="https://smokohq.app/dashboard" style="display:inline-block;background:#10b981;color:white;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:bold;">View Dashboard →</a>
          </div>

          <p style="font-size:12px;color:#999;border-top:1px solid #eee;padding-top:16px;margin-top:24px;text-align:center;">
            SmokoHQ — AI quotes for Aussie tradies<br>
            <a href="https://smokohq.app" style="color:#999;">smokohq.app</a>
          </p>
        </div>
      </div>
    `

    const { data, error } = await resend.emails.send({
      from: 'SmokoHQ <quotes@smokohq.app>',
      to: tradieEmail,
      subject: subject,
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