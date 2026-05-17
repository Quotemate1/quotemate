import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY!)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const now = new Date()
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)

    // Get all sent quotes that might need follow-up
    const { data: sentQuotes } = await supabase
      .from('quotes')
      .select('*, customers(name, email), businesses(business_name, trade_type)')
      .eq('status', 'sent')
      .not('sent_at', 'is', null)

    if (!sentQuotes || sentQuotes.length === 0) {
      return NextResponse.json({ message: 'No quotes need follow-up', followed_up: 0 })
    }

    let followedUp = 0

    for (const quote of sentQuotes) {
      const sentAt = new Date(quote.sent_at)
      const customerEmail = quote.customers?.email
      const customerName = quote.customers?.name || 'there'
      const businessName = quote.businesses?.business_name || 'us'

      if (!customerEmail) continue

      // Check existing follow-ups for this quote
      const { data: existingFollowUps } = await supabase
        .from('follow_ups')
        .select('*')
        .eq('quote_id', quote.id)
        .order('sent_at', { ascending: false })

      const followUpCount = existingFollowUps?.length || 0

      // First follow-up: 48 hours after sending, if no follow-ups yet
      if (followUpCount === 0 && sentAt < fortyEightHoursAgo) {
        const html = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
            <div style="background:#1a1a2e;color:white;padding:24px 32px;">
              <h1 style="margin:0;font-size:24px;">${businessName}</h1>
            </div>
            <div style="padding:32px;">
              <p>Hi ${customerName},</p>
              <p>Just a quick follow-up — we sent through a quote a couple of days ago and wanted to make sure it landed in your inbox.</p>
              <p>If you've got any questions about the quote or would like to chat through the details, we're happy to help. No pressure at all — just didn't want it to slip through the cracks!</p>
              <p>Cheers,<br>${businessName}</p>
              <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:12px;color:#999;">
                Sent via SmokoHQ — AI-powered quotes for Aussie tradies
              </div>
            </div>
          </div>
        `

        const { error } = await resend.emails.send({
          from: 'SmokoHQ <quotes@smokohq.app>',
          to: customerEmail,
          subject: `Following up on your quote from ${businessName}`,
          html: html,
        })

        if (!error) {
          await supabase.from('follow_ups').insert({
            quote_id: quote.id,
            type: 'email',
            message: 'First follow-up (48 hours)',
          })
          followedUp++
        }
      }

      // Second follow-up: 5 days after sending, if only 1 follow-up exists
      if (followUpCount === 1 && sentAt < fiveDaysAgo) {
        const html = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
            <div style="background:#1a1a2e;color:white;padding:24px 32px;">
              <h1 style="margin:0;font-size:24px;">${businessName}</h1>
            </div>
            <div style="padding:32px;">
              <p>Hi ${customerName},</p>
              <p>Just touching base one last time about the quote we sent through. We understand things get busy!</p>
              <p>If you'd like to go ahead, we're ready to lock in a time that works for you. If the timing isn't right, no worries at all — the quote is valid for 30 days if you'd like to come back to it.</p>
              <p>Either way, we appreciate you considering ${businessName}.</p>
              <p>Cheers,<br>${businessName}</p>
              <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:12px;color:#999;">
                Sent via SmokoHQ — AI-powered quotes for Aussie tradies
              </div>
            </div>
          </div>
        `

        const { error } = await resend.emails.send({
          from: 'SmokoHQ <quotes@smokohq.app>',
          to: customerEmail,
          subject: `Quick follow-up — your quote from ${businessName}`,
          html: html,
        })

        if (!error) {
          await supabase.from('follow_ups').insert({
            quote_id: quote.id,
            type: 'email',
            message: 'Second follow-up (5 days)',
          })
          followedUp++
        }
      }
    }

    return NextResponse.json({ message: 'Follow-ups processed', followed_up: followedUp })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}