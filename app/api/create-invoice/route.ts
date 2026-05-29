import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { quoteId, paymentTermsDays, userId } = body

    if (!quoteId) {
      return NextResponse.json({ error: 'quoteId is required' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const terms = paymentTermsDays || 14

    // Service role client (bypasses RLS) - safe because we manually check ownership below
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get the source quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .select('*, customers(name, email, phone)')
      .eq('id', quoteId)
      .single()

    if (quoteError || !quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Verify the user owns the business that owns the quote
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('id', quote.business_id)
      .eq('user_id', userId)
      .single()

    if (!business) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })
    }

    // Build invoice number from quote number: QUO-0001 -> INV-0001
    const invoiceNumber = quote.quote_number
      ? quote.quote_number.replace(/^QUO-/, 'INV-')
      : 'INV-' + Date.now()

    // Calculate due date
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + terms)

    // Generate unique public token
    const publicToken = crypto.randomBytes(8).toString('hex')

    // Create invoice
    const { data: invoice, error: insertError } = await supabase
      .from('invoices')
      .insert({
        business_id: quote.business_id,
        quote_id: quote.id,
        invoice_number: invoiceNumber,
        public_token: publicToken,
        customer_name: quote.customers?.name || 'Customer',
        customer_email: quote.customers?.email || '',
        customer_phone: quote.customers?.phone || null,
        job_address: quote.job_address,
        scope_of_work: quote.scope_of_work,
        line_items: quote.line_items,
        subtotal: quote.subtotal,
        gst: quote.gst,
        total: quote.total,
        payment_terms_days: terms,
        due_date: dueDate.toISOString().split('T')[0],
        status: 'unpaid',
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, invoice })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}