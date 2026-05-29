'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [quotes, setQuotes] = useState<any>([])
  const [stats, setStats] = useState({ total: 0, sent: 0, revenue: 0, won: 0, lost: 0, revenueWon: 0, conversionRate: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState<any>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [invoiceTerms, setInvoiceTerms] = useState(14)
  const [creatingInvoice, setCreatingInvoice] = useState(false)
  const [createdInvoice, setCreatedInvoice] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    setUser(user)

    const { data: biz } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!biz) { window.location.href = '/onboarding'; return }
    setBusiness(biz)

    const { data: quotesData } = await supabase
      .from('quotes')
      .select('*, customers(name, email)')
      .eq('business_id', biz.id)
      .order('created_at', { ascending: false })

    if (quotesData) {
      setQuotes(quotesData)
      const total = quotesData.length
      const sent = quotesData.filter(q => q.status === 'sent' || q.status === 'opened' || q.status === 'accepted' || q.status === 'declined').length
      const won = quotesData.filter(q => q.status === 'accepted').length
      const lost = quotesData.filter(q => q.status === 'declined').length
      const revenue = quotesData.reduce((sum, q) => sum + parseFloat(q.total || 0), 0)
      const revenueWon = quotesData.filter(q => q.status === 'accepted').reduce((sum, q) => sum + parseFloat(q.total || 0), 0)
      const decided = won + lost
      const conversionRate = decided > 0 ? Math.round((won / decided) * 100) : 0
      setStats({ total, sent, revenue, won, lost, revenueWon, conversionRate })
    }
    setLoading(false)
  }

  const updateQuoteStatus = async (quoteId: string, newStatus: string) => {
    setUpdatingStatus(true)
    const { error } = await supabase
      .from('quotes')
      .update({ status: newStatus })
      .eq('id', quoteId)

    if (error) {
      alert('Error updating status: ' + error.message)
      setUpdatingStatus(false)
      return
    }

    await loadData()
    setSelectedQuote((prev: any) => prev ? { ...prev, status: newStatus } : null)
    setUpdatingStatus(false)
  }

  const createInvoice = async () => {
    if (!selectedQuote || !user) return
    setCreatingInvoice(true)
    setCreatedInvoice(null)
    try {
      const res = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId: selectedQuote.id,
          paymentTermsDays: invoiceTerms,
          userId: user.id,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert('Error creating invoice: ' + (data.error || 'Unknown error'))
        setCreatingInvoice(false)
        return
      }
      setCreatedInvoice(data.invoice)
      // Auto-send invoice email to customer (background, don't block UI)
      fetch('/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: data.invoice.id }),
      }).catch(() => {})
    } catch (error: any) {
      alert('Error: ' + error.message)
    }
    setCreatingInvoice(false)
  }
  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await supabase.auth.signOut()
      window.location.href = '/'
    }
  }

  const getFirstName = () => {
    if (!user?.email) return 'Mate'
    const name = user.email.split('@')[0].split('.')[0]
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-stone-400 bg-stone-800'
      case 'sent': return 'text-sky-400 bg-sky-950'
      case 'opened': return 'text-amber-400 bg-amber-950'
      case 'accepted': return 'text-emerald-400 bg-emerald-950'
      case 'declined': return 'text-red-400 bg-red-950'
      case 'expired': return 'text-stone-500 bg-stone-800'
      default: return 'text-stone-400 bg-stone-800'
    }
  }

  const statusLabel = (status: string) => {
    if (status === 'accepted') return 'Won'
    if (status === 'declined') return 'Lost'
    return status
  }

  const parseQuoteContent = (raw: any) => {
    if (!raw) return null
    try {
      return typeof raw === 'string' ? JSON.parse(raw) : raw
    } catch {
      return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#13151a] flex items-center justify-center">
        <p className="text-stone-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#13151a]">
      <nav className="border-b border-stone-800 bg-[#181a20] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">SmokoHQ</h1>
          {business && (
            <span className="hidden md:inline text-sm text-stone-500 border-l border-stone-700 pl-4">
              {business.business_name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <a
            href="/referrals"
            className="px-3 py-2 md:px-4 md:py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:text-amber-300 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5"
          >
            <span>🎁</span>
            <span className="hidden sm:inline">Refer &amp; Earn</span>
            <span className="sm:hidden">Refer</span>
          </a>
          <a
            href="/settings"
            className="px-3 py-2 md:px-4 md:py-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 hover:text-white rounded-full text-sm font-semibold transition-all flex items-center gap-1.5"
          >
            <span>⚙️</span>
            <span className="hidden sm:inline">Settings</span>
          </a>
          <span className="text-sm text-stone-500 hidden lg:inline">{user?.email}</span>
          <button
            onClick={handleSignOut}
            className="text-sm text-stone-500 hover:text-white transition-colors px-2"
          >
            Sign out
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">

        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              G&apos;day {getFirstName()} <span className="text-amber-400">🍺</span>
            </h2>
            <p className="text-stone-400">Here&apos;s how your quotes are tracking.</p>
          </div>
          <a
            href="/create-quote"
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            <span>New Quote</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-[#1a1d24] border border-stone-800 rounded-2xl p-5 hover:border-stone-700 transition-colors">
            <p className="text-xs text-stone-500 uppercase tracking-wider mb-2 font-semibold">Total Quotes</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-stone-500 mt-1">{stats.sent} sent to customers</p>
          </div>
          <div className="bg-[#1a1d24] border border-stone-800 rounded-2xl p-5 hover:border-stone-700 transition-colors">
            <p className="text-xs text-stone-500 uppercase tracking-wider mb-2 font-semibold">Conversion Rate</p>
            <p className="text-3xl font-bold text-emerald-400">{stats.conversionRate}%</p>
            <p className="text-xs text-stone-500 mt-1">{stats.won} won · {stats.lost} lost</p>
          </div>
          <div className="bg-[#1a1d24] border border-stone-800 rounded-2xl p-5 hover:border-stone-700 transition-colors">
            <p className="text-xs text-stone-500 uppercase tracking-wider mb-2 font-semibold">Revenue Won</p>
            <p className="text-3xl font-bold text-amber-400">${stats.revenueWon.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
            <p className="text-xs text-stone-500 mt-1">${stats.revenue.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} quoted total</p>
          </div>
          <div className="bg-[#1a1d24] border border-stone-800 rounded-2xl p-5 hover:border-stone-700 transition-colors">
            <p className="text-xs text-stone-500 uppercase tracking-wider mb-2 font-semibold">Follow-Ups Sent</p>
            <p className="text-3xl font-bold text-sky-400">{stats.sent}</p>
            <p className="text-xs text-stone-500 mt-1">Auto-chasing money for you</p>
          </div>
        </div>

        {quotes.length === 0 ? (
          <div className="bg-[#1a1d24] border border-stone-800 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-stone-300 text-lg font-semibold mb-2">No quotes yet</p>
            <p className="text-stone-500 mb-6">Create your first one — it takes 60 seconds.</p>
            <a
              href="/create-quote"
              className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-colors"
            >
              + Create Your First Quote
            </a>
          </div>
        ) : (
          <div className="bg-[#1a1d24] border border-stone-800 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-stone-800 text-xs text-stone-500 uppercase tracking-wider font-semibold">
              <span>Quote #</span>
              <span>Customer</span>
              <span>Total</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            {quotes.map((quote: any) => (
              <button
                key={quote.id}
                onClick={() => setSelectedQuote(quote)}
                className="w-full grid grid-cols-5 gap-4 px-6 py-4 border-b border-stone-800 hover:bg-stone-800/50 transition-colors items-center text-left cursor-pointer"
              >
                <span className="text-white font-mono text-sm">{quote.quote_number}</span>
                <div>
                  <p className="text-white text-sm">{quote.customers?.name || 'Unknown'}</p>
                  <p className="text-stone-500 text-xs">{quote.customers?.email || ''}</p>
                </div>
                <span className="text-white font-semibold">${parseFloat(quote.total).toFixed(2)}</span>
                <span className={`text-xs px-3 py-1 rounded-full capitalize w-fit ${statusColor(quote.status)}`}>
                  {statusLabel(quote.status)}
                </span>
                <span className="text-stone-500 text-sm">{new Date(quote.created_at).toLocaleDateString('en-AU')}</span>
              </button>
            ))}
          </div>
        )}
      </main>

      {selectedQuote && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-start justify-center p-6 z-50 overflow-y-auto"
          onClick={() => setSelectedQuote(null)}
        >
          <div
            className="bg-[#1a1d24] border border-stone-700 rounded-2xl max-w-3xl w-full my-8"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="border-b border-stone-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#1a1d24] z-10 rounded-t-2xl">
              <div>
                <p className="text-stone-400 text-xs uppercase tracking-wider">Quote</p>
                <p className="text-white font-mono">{selectedQuote.quote_number}</p>
              </div>
              <div className="flex items-center gap-3">
              <button
                  onClick={() => { setShowInvoiceModal(true); setCreatedInvoice(null); }}
                  className="px-4 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-full text-xs font-semibold transition-all"
                >
                  Convert to Invoice
                </button>
                <span className={`text-xs px-3 py-1 rounded-full capitalize ${statusColor(selectedQuote.status)}`}>
                  {statusLabel(selectedQuote.status)}
                </span>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="text-stone-400 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {(selectedQuote.status === 'sent' || selectedQuote.status === 'opened' || selectedQuote.status === 'draft') && (
              <div className="bg-[#1a1d24] border-b border-stone-700 px-6 py-4">
                <p className="text-sm text-stone-400 mb-3">Did you win this job?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => updateQuoteStatus(selectedQuote.id, 'accepted')}
                    disabled={updatingStatus}
                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-colors disabled:opacity-50"
                  >
                    🎉 Mark as Won
                  </button>
                  <button
                    onClick={() => updateQuoteStatus(selectedQuote.id, 'declined')}
                    disabled={updatingStatus}
                    className="flex-1 py-2 bg-stone-700 hover:bg-red-900 text-white font-semibold rounded-full transition-colors disabled:opacity-50"
                  >
                    ✕ Mark as Lost
                  </button>
                </div>
              </div>
            )}

            {(selectedQuote.status === 'accepted' || selectedQuote.status === 'declined') && (
              <div className={`border-b px-6 py-3 flex items-center justify-between ${selectedQuote.status === 'accepted' ? 'bg-emerald-950 border-emerald-900' : 'bg-red-950 border-red-900'}`}>
                <p className="text-sm font-semibold">
                  {selectedQuote.status === 'accepted' ? '🎉 Job won!' : '✕ Job lost'}
                </p>
                <button
                  onClick={() => updateQuoteStatus(selectedQuote.id, 'sent')}
                  disabled={updatingStatus}
                  className="text-xs text-stone-400 hover:text-white"
                >
                  Reset status
                </button>
              </div>
            )}

            <div className="p-6">
              <div className="bg-white text-stone-900 rounded-lg p-8">
                <div className="border-b pb-4 mb-6">
                  <h3 className="text-2xl font-bold">{business?.business_name}</h3>
                  <p className="text-stone-500 capitalize">{business?.trade_type}</p>
                </div>

                <div className="mb-6">
                  <p className="text-stone-500 text-sm">Quote for:</p>
                  <p className="font-semibold text-lg">{selectedQuote.customers?.name || 'Unknown'}</p>
                  {selectedQuote.customers?.email && (
                    <p className="text-stone-500 text-sm">{selectedQuote.customers.email}</p>
                  )}
                </div>

                {(() => {
                  const content = parseQuoteContent(selectedQuote.ai_generated_content)
                  if (!content) {
                    return <p className="text-stone-500 italic">Quote content unavailable</p>
                  }
                  return (
                    <>
                      {content.greeting && <p className="mb-6 text-stone-700">{content.greeting}</p>}

                      {content.scopeOfWork && (
                        <div className="mb-6">
                          <h4 className="font-bold mb-2">Scope of Work</h4>
                          <p className="text-stone-700">{content.scopeOfWork}</p>
                        </div>
                      )}

                      {content.inclusions && content.inclusions.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-bold mb-2">What&apos;s Included</h4>
                          <ul className="list-disc list-inside text-stone-700">
                            {content.inclusions.map((item: string, i: number) => <li key={i}>{item}</li>)}
                          </ul>
                        </div>
                      )}

                      {content.exclusions && content.exclusions.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-bold mb-2">Exclusions</h4>
                          <ul className="list-disc list-inside text-stone-700">
                            {content.exclusions.map((item: string, i: number) => <li key={i}>{item}</li>)}
                          </ul>
                        </div>
                      )}

                      <div className="bg-stone-50 rounded p-4 mb-6">
                        {selectedQuote.line_items?.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between py-1">
                            <span>{item.description}</span>
                            <span className="font-semibold">${parseFloat(item.amount).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t mt-2 pt-2 flex justify-between text-sm text-stone-500">
                          <span>Subtotal</span>
                          <span>${parseFloat(selectedQuote.subtotal || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-stone-500">
                          <span>GST (10%)</span>
                          <span>${parseFloat(selectedQuote.gst || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-1">
                          <span>Total (inc. GST)</span>
                          <span>${parseFloat(selectedQuote.total || 0).toFixed(2)}</span>
                        </div>
                      </div>

                      {content.terms && (
                        <div className="mb-6">
                          <h4 className="font-bold mb-1">Terms &amp; Conditions</h4>
                          <p className="text-stone-700 text-sm">{content.terms}</p>
                        </div>
                      )}

                      {content.validityPeriod && (
                        <p className="text-stone-600 text-sm italic">Quote valid for {content.validityPeriod}</p>
                      )}

                      {content.closingMessage && (
                        <p className="mt-4 text-stone-700">{content.closingMessage}</p>
                      )}
                    </>
                  )
                })()}
              </div>
            </div>

          </div>
        </div>
      )}
  {showInvoiceModal && selectedQuote ? (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-6 z-[60]" onClick={() => setShowInvoiceModal(false)}>
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>

            {!createdInvoice ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Convert to Invoice</h3>
                  <button onClick={() => setShowInvoiceModal(false)} className="text-stone-400 hover:text-white text-2xl leading-none">×</button>
                </div>
                <p className="text-stone-400 text-sm mb-6">Turn {selectedQuote.quote_number} into an invoice. The customer gets {selectedQuote.quote_number.replace('QUO-', 'INV-')} with the same totals.</p>

                <label className="block text-sm font-semibold text-stone-300 mb-2">Payment terms</label>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[7, 14, 30].map((days) => (
                    <button
                      key={days}
                      onClick={() => setInvoiceTerms(days)}
                      className={`py-3 rounded-xl text-sm font-semibold transition-all border ${invoiceTerms === days ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-700'}`}
                    >
                      Net {days}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-stone-500 mb-6">Due date: {new Date(Date.now() + invoiceTerms * 86400000).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowInvoiceModal(false)}
                    className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 text-white font-semibold rounded-full transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createInvoice}
                    disabled={creatingInvoice}
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full transition-colors disabled:opacity-50"
                  >
                    {creatingInvoice ? 'Creating...' : 'Create Invoice'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-bold rounded-full mb-4">✓ Invoice Created &amp; Emailed</div>
                  <p className="text-2xl font-bold text-white mb-1">{createdInvoice.invoice_number}</p>
                  <p className="text-stone-400 text-sm">Total: ${parseFloat(createdInvoice.total).toFixed(2)}</p>
                  <p className="text-stone-500 text-xs mt-2">Due {new Date(createdInvoice.due_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>

                <p className="text-sm text-stone-400 mb-2">Shareable link:</p>
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    readOnly
                    value={`https://smokohq.app/invoice/${createdInvoice.public_token}`}
                    className="flex-1 px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-white text-xs font-mono"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <button
                    onClick={() => { navigator.clipboard.writeText(`https://smokohq.app/invoice/${createdInvoice.public_token}`); alert('Copied!') }}
                    className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-semibold"
                  >
                    Copy
                  </button>
                </div>

                <button
                  onClick={() => { setShowInvoiceModal(false); setCreatedInvoice(null); }}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-colors"
                >
                  Done
                </button>
              </>
            )}

          </div>
        </div>
      ) : null}
      </div>
  )
}