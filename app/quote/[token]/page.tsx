'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function PublicQuotePage() {
  const params = useParams()
  const token = params.token as string

  const [quote, setQuote] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [responding, setResponding] = useState(false)
  const [showChangesForm, setShowChangesForm] = useState(false)
  const [changesMessage, setChangesMessage] = useState('')
  const [responded, setResponded] = useState<string | null>(null)

  useEffect(() => {
    loadQuote()
  }, [token])

  const loadQuote = async () => {
    const { data: q } = await supabase
      .from('quotes')
      .select('*, business:businesses(*), customer:customers(*)')
      .eq('public_token', token)
      .single()

    if (q) {
      setQuote(q)
      setBusiness(q.business)
      setCustomer(q.customer)

      if (q.status === 'accepted') setResponded('accepted')
      if (q.status === 'declined') setResponded('declined')

      // Mark as opened if not already
      if (q.status === 'sent' && !q.opened_at) {
        await supabase
          .from('quotes')
          .update({
            status: 'opened',
            opened_at: new Date().toISOString()
          })
          .eq('public_token', token)
      }
    }
    setLoading(false)
  }

  const handleAccept = async () => {
    setResponding(true)
    await supabase
      .from('quotes')
      .update({
        status: 'accepted',
        customer_responded_at: new Date().toISOString(),
      })
      .eq('public_token', token)
    setResponded('accepted')
    setResponding(false)
  }

  const handleRequestChanges = async () => {
    if (!changesMessage.trim()) return
    setResponding(true)
    await supabase
      .from('quotes')
      .update({
        status: 'declined',
        customer_response_message: changesMessage,
        customer_responded_at: new Date().toISOString(),
      })
      .eq('public_token', token)
    setResponded('declined')
    setResponding(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading quote...</p>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quote not found</h1>
          <p className="text-gray-600">This quote link may be invalid or expired.</p>
        </div>
      </div>
    )
  }

  const aiContent = typeof quote.ai_generated_content === 'string'
    ? JSON.parse(quote.ai_generated_content)
    : quote.ai_generated_content

  const validUntil = quote.valid_until ? new Date(quote.valid_until).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : null

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white text-center py-3 px-4 text-sm">
        Quote from <strong>{business?.business_name}</strong> · Powered by <a href="https://quotemate-eta.vercel.app" className="text-emerald-400 hover:underline">SmokoHQ</a>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">

          <div className="bg-gray-900 text-white px-8 py-10">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">Quote</p>
                <h1 className="text-3xl font-bold">{business?.business_name}</h1>
                <p className="text-gray-400 capitalize mt-1">{business?.trade_type}</p>
                {business?.phone && <p className="text-gray-400 text-sm mt-2">📞 {business.phone}</p>}
                {business?.email && <p className="text-gray-400 text-sm">✉️ {business.email}</p>}
                {business?.abn && <p className="text-gray-500 text-xs mt-2">ABN: {business.abn}</p>}
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">Quote #</p>
                <p className="text-2xl font-bold">{quote.quote_number}</p>
                <p className="text-gray-400 text-xs mt-2">Date</p>
                <p className="text-sm">{new Date(quote.created_at).toLocaleDateString('en-AU')}</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 bg-gray-50 border-b">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Quote prepared for</p>
            <p className="text-xl font-semibold text-gray-900">{customer?.name}</p>
            {customer?.address && <p className="text-gray-600 text-sm mt-1">📍 {customer.address}</p>}
          </div>

          <div className="px-8 py-8">

            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{aiContent.greeting}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-3">Scope of Work</h2>
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">{aiContent.scopeOfWork}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-3">What's Included</h2>
                <ul className="space-y-2">
                  {aiContent.inclusions?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-emerald-500 flex-shrink-0 mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Exclusions</h2>
                <ul className="space-y-2">
                  {aiContent.exclusions?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <span className="text-gray-400 flex-shrink-0 mt-1">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4">Pricing</h2>
              {quote.line_items?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                  <span className="text-gray-800">{item.description}</span>
                  <span className="text-gray-900 font-semibold">${parseFloat(item.amount).toFixed(2)}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t-2 border-gray-300 space-y-1">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${parseFloat(quote.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>GST (10%)</span>
                  <span>${parseFloat(quote.gst).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span className="text-emerald-600">${parseFloat(quote.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Terms & Conditions</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{aiContent.terms}</p>
            </div>

            {validUntil && (
              <p className="text-sm text-gray-500 italic mb-8">
                ⏱ Quote valid until <strong>{validUntil}</strong>
              </p>
            )}

            <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-2">{aiContent.closingMessage}</p>
          </div>

          {!responded ? (
            <div className="bg-emerald-50 border-t-2 border-emerald-200 px-8 py-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to go ahead?</h3>
              <p className="text-gray-600 text-sm mb-6">Let {business?.business_name} know your decision. They'll be notified instantly.</p>

              {!showChangesForm ? (
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={handleAccept}
                    disabled={responding}
                    className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 min-w-[200px]"
                  >
                    {responding ? 'Sending...' : '✓ Accept Quote'}
                  </button>
                  <button
                    onClick={() => setShowChangesForm(true)}
                    className="flex-1 py-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-lg transition-colors border-2 border-gray-300 min-w-[200px]"
                  >
                    Request Changes
                  </button>
                </div>
              ) : (
                <div>
                  <textarea
                    value={changesMessage}
                    onChange={(e) => setChangesMessage(e.target.value)}
                    rows={4}
                    placeholder="What would you like to change? Be as specific as possible..."
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-emerald-500 mb-3"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setShowChangesForm(false); setChangesMessage('') }}
                      className="px-6 py-3 text-gray-700 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRequestChanges}
                      disabled={responding || !changesMessage.trim()}
                      className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {responding ? 'Sending...' : 'Send Request →'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : responded === 'accepted' ? (
            <div className="bg-emerald-50 border-t-2 border-emerald-200 px-8 py-10 text-center">
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Quote Accepted!</h3>
              <p className="text-gray-700">{business?.business_name} has been notified and will be in touch shortly.</p>
            </div>
          ) : (
            <div className="bg-amber-50 border-t-2 border-amber-200 px-8 py-10 text-center">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Changes Requested</h3>
              <p className="text-gray-700">{business?.business_name} has been notified and will revise the quote.</p>
            </div>
          )}

        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          Quoted with <a href="https://quotemate-eta.vercel.app" className="text-emerald-600 hover:underline">SmokoHQ</a> — AI quotes for Aussie tradies
        </p>
      </main>
    </div>
  )
}