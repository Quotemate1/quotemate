import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { emailLimiter, getClientIp } from '../../lib/ratelimit'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    // RATE LIMIT - 5 emails per minute per IP
    const ip = getClientIp(req)
    const { success: notRateLimited, reset } = await emailLimiter.limit(ip)

    if (!notRateLimited) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000)
      return NextResponse.json(
        {
          success: false,
          error: 'Too many emails sent. Please wait a moment.',
          rateLimited: true,
          retryAfter,
        },
        { status: 429, headers: { 'Retry-After': retryAfter.toString() } }
      )
    }

    const body = await req.json()
    const { invoiceId } = body

    if (!invoiceId) {
      return NextResponse.json({ error: 'invoiceId required' }, { status: 400 })
    }

    // Service role to fetch invoice + business details
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: invoice, error: fetchError } = await supabase
      .from('invoices')
      .select('*, business:businesses(*)')
      .eq('id', invoiceId)
      .single()

    if (fetchError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    const business = invoice.business
    const invoiceLink = `https://smokohq.app/invoice/${invoice.public_token}`
    const dueDate = new Date(invoice.due_date).toLocaleDateString('en-AU', {
      day: 'numeric', month: 'long', year: 'numeric'
    })

    const itemsHtml = (invoice.line_items || []).map((item: any) =>
      `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${item.description}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">$${parseFloat(item.amount).toFixed(2)}</td></tr>`
    ).join('')

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
        <div style="background:#1a1a2e;color:white;padding:32px;text-align:center;">
          <p style="margin:0;color:#fbbf24;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;">Tax Invoice</p>
          <h1 style="margin:8px 0 0;font-size:28px;">${business.business_name}</h1>
          <p style="margin:8px 0 0;opacity:0.7;text-transform:capitalize;">${business.trade_type}</p>
          ${business.abn ? `<p style="margin:8px 0 0;opacity:0.5;font-size:12px;">ABN: ${business.abn}</p>` : ''}
        </div>
        <div style="padding:32px;line-height:1.6;">
          <p>G'day ${invoice.customer_name},</p>

          <p>Please find your invoice <strong>${invoice.invoice_number}</strong> from ${business.business_name} attached below.</p>

          <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:20px;margin:24px 0;">
            <p style="margin:0;font-size:14px;color:#92400e;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Amount Due</p>
            <p style="margin:4px 0;font-size:32px;font-weight:bold;color:#1a1a2e;">$${parseFloat(invoice.total).toFixed(2)}</p>
            <p style="margin:8px 0 0;font-size:14px;color:#666;">Due by <strong>${dueDate}</strong> (${invoice.payment_terms_days} days)</p>
          </div>

          <div style="text-align:center;margin:32px 0;">
            <a href="${invoiceLink}" style="display:inline-block;background:#f59e0b;color:white;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">View Invoice →</a>
          </div>

          <h3 style="color:#1a1a2e;margin-top:24px;">Charges</h3>
          <table style="width:100%;border-collapse:collapse;">
            ${itemsHtml}
            <tr><td style="padding:8px;color:#666;">Subtotal</td><td style="padding:8px;text-align:right;color:#666;">$${parseFloat(invoice.subtotal).toFixed(2)}</td></tr>
            <tr><td style="padding:8px;color:#666;">GST (10%)</td><td style="padding:8px;text-align:right;color:#666;">$${parseFloat(invoice.gst).toFixed(2)}</td></tr>
            <tr style="background:#f5f5f5;"><td style="padding:12px 8px;font-weight:bold;">Total (inc. GST)</td><td style="padding:12px 8px;text-align:right;font-weight:bold;font-size:18px;color:#f59e0b;">$${parseFloat(invoice.total).toFixed(2)}</td></tr>
          </table>

          <p style="margin-top:24px;">Cheers,<br>${business.business_name}</p>

          <p style="font-size:12px;color:#999;border-top:1px solid #eee;padding-top:16px;margin-top:24px;">
            Invoiced with SmokoHQ — for Aussie tradies<br>
            <a href="https://smokohq.app" style="color:#999;">smokohq.app</a>
          </p>
        </div>
      </div>
    `

    const { data, error } = await resend.emails.send({
      from: `${business.business_name} <quotes@smokohq.app>`,
      to: invoice.customer_email,
      subject: `Invoice ${invoice.invoice_number} from ${business.business_name}`,
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