'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function PublicInvoicePage() {
  const params = useParams()
  const token = params.token as string

  const [invoice, setInvoice] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [markingPaid, setMarkingPaid] = useState(false)

  useEffect(() => {
    loadInvoice()
  }, [token])

  const loadInvoice = async () => {
    const { data: inv } = await supabase
      .from('invoices')
      .select('*, business:businesses(*)')
      .eq('public_token', token)
      .single()

    if (inv) {
      setInvoice(inv)
      setBusiness(inv.business)
    }
    setLoading(false)
  }

  const handleMarkPaid = async () => {
    if (!confirm('Mark this invoice as paid? Only do this if payment has been received.')) return
    setMarkingPaid(true)
    await supabase
      .from('invoices')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('public_token', token)
    await loadInvoice()
    setMarkingPaid(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading invoice...</p>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice not found</h1>
          <p className="text-gray-600">This invoice link may be invalid or expired.</p>
        </div>
      </div>
    )
  }

  const dueDate = new Date(invoice.due_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
  const issueDate = new Date(invoice.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
  const isPaid = invoice.status === 'paid'
  const isOverdue = !isPaid && new Date(invoice.due_date) < new Date()

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white text-center py-3 px-4 text-sm">
        Invoice from <strong>{business?.business_name}</strong> · Powered by <a href="https://smokohq.app" className="text-emerald-400 hover:underline">SmokoHQ</a>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">

          <div className="bg-gray-900 text-white px-8 py-10">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">Tax Invoice</p>
                <h1 className="text-3xl font-bold">{business?.business_name}</h1>
                <p className="text-gray-400 capitalize mt-1">{business?.trade_type}</p>
                {business?.phone && <p className="text-gray-400 text-sm mt-2">📞 {business.phone}</p>}
                {business?.email && <p className="text-gray-400 text-sm">✉️ {business.email}</p>}
                {business?.abn && <p className="text-gray-500 text-xs mt-2">ABN: {business.abn}</p>}
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">Invoice #</p>
                <p className="text-2xl font-bold">{invoice.invoice_number}</p>
                <p className="text-gray-400 text-xs mt-2">Issued</p>
                <p className="text-sm">{issueDate}</p>
                <p className="text-gray-400 text-xs mt-2">Due</p>
                <p className={`text-sm font-semibold ${isOverdue ? 'text-red-400' : 'text-amber-400'}`}>{dueDate}</p>
              </div>
            </div>
          </div>

          {isPaid && (
            <div className="bg-emerald-50 border-b-2 border-emerald-200 px-8 py-4 text-center">
              <p className="text-emerald-700 font-bold text-lg">✓ Paid {invoice.paid_at ? `on ${new Date(invoice.paid_at).toLocaleDateString('en-AU')}` : ''}</p>
            </div>
          )}

          {isOverdue && !isPaid && (
            <div className="bg-red-50 border-b-2 border-red-200 px-8 py-4 text-center">
              <p className="text-red-700 font-bold">⚠ Overdue — payment was due on {dueDate}</p>
            </div>
          )}

          <div className="px-8 py-6 bg-gray-50 border-b">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Invoice to</p>
            <p className="text-xl font-semibold text-gray-900">{invoice.customer_name}</p>
            {invoice.customer_email && <p className="text-gray-600 text-sm mt-1">{invoice.customer_email}</p>}
            {invoice.job_address && <p className="text-gray-600 text-sm mt-1">📍 {invoice.job_address}</p>}
          </div>

          <div className="px-8 py-8">

            {invoice.scope_of_work && (
              <div className="mb-8">
                <h2 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-3">Work Completed</h2>
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">{invoice.scope_of_work}</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-4">Charges</h2>
              {invoice.line_items?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                  <span className="text-gray-800">{item.description}</span>
                  <span className="text-gray-900 font-semibold">${parseFloat(item.amount).toFixed(2)}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t-2 border-gray-300 space-y-1">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${parseFloat(invoice.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>GST (10%)</span>
                  <span>${parseFloat(invoice.gst).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-gray-900 pt-2 border-t">
                  <span>Total Due</span>
                  <span className={isPaid ? 'text-emerald-600' : 'text-amber-600'}>${parseFloat(invoice.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-4">
              <h3 className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-2">Payment Terms</h3>
              <p className="text-gray-800 text-sm leading-relaxed">
                Payment of <strong>${parseFloat(invoice.total).toFixed(2)}</strong> is due within <strong>{invoice.payment_terms_days} days</strong> of the invoice date.
              </p>
              <p className="text-gray-700 text-sm mt-2">
                Due by: <strong>{dueDate}</strong>
              </p>
            </div>

            {!isPaid && (
              <div className="mt-6 text-center">
                <p className="text-gray-500 text-xs mb-3">For the business owner:</p>
                <button
                  onClick={handleMarkPaid}
                  disabled={markingPaid}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {markingPaid ? 'Marking...' : '✓ Mark as Paid'}
                </button>
              </div>
            )}

          </div>

        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          Invoiced with <a href="https://smokohq.app" className="text-amber-600 hover:underline">SmokoHQ</a> — for Aussie tradies
        </p>
      </main>
    </div>
  )
}