'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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

  const downloadPDF = () => {
    if (!invoice || !business) return
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    // Header bar (dark navy)
    doc.setFillColor(26, 26, 46)
    doc.rect(0, 0, pageWidth, 40, 'F')

    // TAX INVOICE label
    doc.setTextColor(251, 191, 36)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('TAX INVOICE', 15, 12)

    // Business name
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(business.business_name, 15, 22)

    // Trade type
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(business.trade_type.charAt(0).toUpperCase() + business.trade_type.slice(1), 15, 30)

    // Business contact (right side of header)
    doc.setFontSize(8)
    doc.setTextColor(220, 220, 220)
    let contactY = 10
    if (business.abn) { doc.text('ABN: ' + business.abn, pageWidth - 15, contactY, { align: 'right' }); contactY += 5 }
    if (business.phone) { doc.text('Phone: ' + business.phone, pageWidth - 15, contactY, { align: 'right' }); contactY += 5 }
    if (business.email) { doc.text('Email: ' + business.email, pageWidth - 15, contactY, { align: 'right' }); contactY += 5 }
    if (business.address) { doc.text(business.address, pageWidth - 15, contactY, { align: 'right' }); contactY += 5 }

    // Invoice metadata
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Invoice #: ' + invoice.invoice_number, 15, 55)
    doc.setFont('helvetica', 'normal')
    doc.text('Issued: ' + new Date(invoice.created_at).toLocaleDateString('en-AU'), 15, 62)
    doc.text('Due: ' + new Date(invoice.due_date).toLocaleDateString('en-AU'), 15, 69)

    // Customer
    doc.setFont('helvetica', 'bold')
    doc.text('Invoice To:', pageWidth - 80, 55)
    doc.setFont('helvetica', 'normal')
    doc.text(invoice.customer_name, pageWidth - 80, 62)
    if (invoice.customer_email) doc.text(invoice.customer_email, pageWidth - 80, 69)
    if (invoice.job_address) doc.text(invoice.job_address, pageWidth - 80, 76)

    let y = 90

    // Scope of work
    if (invoice.scope_of_work) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text('Work Completed', 15, y)
      y += 7
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      const lines = doc.splitTextToSize(invoice.scope_of_work, pageWidth - 30)
      doc.text(lines, 15, y)
      y += lines.length * 5 + 6
    }

    // Line items table
    autoTable(doc, {
      startY: y,
      head: [['Description', 'Amount']],
      body: (invoice.line_items || []).map((item: any) => [item.description, '$' + parseFloat(item.amount).toFixed(2)]),
      foot: [
        ['Subtotal', '$' + parseFloat(invoice.subtotal).toFixed(2)],
        ['GST (10%)', '$' + parseFloat(invoice.gst).toFixed(2)],
        ['Total Due', '$' + parseFloat(invoice.total).toFixed(2)],
      ],
      headStyles: { fillColor: [245, 158, 11], textColor: 255, fontStyle: 'bold' },
      footStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
      columnStyles: { 1: { halign: 'right' } },
      margin: { left: 15, right: 15 },
    })

    const finalY = (doc as any).lastAutoTable.finalY + 10

    // Payment terms box
    doc.setFillColor(255, 251, 235)
    doc.setDrawColor(253, 230, 138)
    doc.rect(15, finalY, pageWidth - 30, 25, 'FD')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(146, 64, 14)
    doc.text('PAYMENT TERMS', 20, finalY + 7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(9)
    doc.text(`Payment of $${parseFloat(invoice.total).toFixed(2)} is due within ${invoice.payment_terms_days} days.`, 20, finalY + 14)
    doc.text(`Due by ${new Date(invoice.due_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}.`, 20, finalY + 20)

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('Invoiced with SmokoHQ - smokohq.app', pageWidth / 2, 285, { align: 'center' })

    doc.save(`${invoice.invoice_number}-${invoice.customer_name.replace(/\s+/g, '-')}.pdf`)
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

            <div className="mt-6 text-center space-y-3">
              <button
                onClick={downloadPDF}
                className="w-full sm:w-auto px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg transition-colors"
              >
                📄 Download PDF
              </button>

              {!isPaid && (
                <div className="pt-4 border-t border-gray-200">
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

        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          Invoiced with <a href="https://smokohq.app" className="text-amber-600 hover:underline">SmokoHQ</a> — for Aussie tradies
        </p>
      </main>
    </div>
  )
}