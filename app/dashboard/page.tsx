'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [quotes, setQuotes] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, sent: 0, revenue: 0, won: 0, lost: 0, revenueWon: 0, conversionRate: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState<any>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

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

    // Refresh data and update selected quote
    await loadData()
    setSelectedQuote((prev: any) => prev ? { ...prev, status: newStatus } : null)
    setUpdatingStatus(false)
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
      case 'draft': return 'text-gray-400 bg-gray-800'
      case 'sent': return 'text-blue-400 bg-blue-900'
      case 'opened': return 'text-amber-400 bg-amber-900'
      case 'accepted': return 'text-emerald-400 bg-emerald-900'
      case 'declined': return 'text-red-400 bg-red-900'
      case 'expired': return 'text-gray-500 bg-gray-800'
      default: return 'text-gray-400 bg-gray-800'
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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">SmokoHQ</h1>
          {business && (
            <span className="hidden md:inline text-sm text-gray-500 border-l border-gray-700 pl-4">
              {business.business_name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <a href="/settings" className="text-sm text-gray-400 hover:text-white transition-colors">Settings</a>
          <span className="text-sm text-gray-400 hidden md:inline">{user?.email}</span>
          <button onClick={handleSignOut} className="text-sm text-gray-400 hover:text-white transition-colors">
            Sign out
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">G'day {getFirstName()} 👋</h2>
            <p className="text-gray-400">Here's how your quotes are tracking.</p>
          </div>
          <a href="/create-quote" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded transition-colors">
            + Create New Quote
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-sm text-gray-400 mb-1">Total Quotes</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-gray-600 mt-1">{stats.sent} sent to customers</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-sm text-gray-400 mb-1">Conversion Rate</p>
            <p className="text-3xl font-bold text-emerald-400">{stats.conversionRate}%</p>
            <p className="text-xs text-gray-600 mt-1">{stats.won} won · {stats.lost} lost</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-sm text-gray-400 mb-1">Revenue Won</p>
            <p className="text-3xl font-bold text-emerald-400">${stats.revenueWon.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
            <p className="text-xs text-gray-600 mt-1">${stats.revenue.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} quoted total</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-sm text-gray-400 mb-1">Follow-Ups Sent</p>
            <p className="text-3xl font-bold text-blue-400">{stats.sent}</p>
            <p className="text-xs text-gray-600 mt-1">Auto-chasing money for you</p>
          </div>
        </div>

        {quotes.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
            <p className="text-gray-400 mb-4">No quotes yet. Create your first one!</p>
            <a href="/create-quote" className="text-emerald-400 hover:text-emerald-300 font-semibold">+ Create New Quote</a>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
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
                className="w-full grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-800 hover:bg-gray-800 transition-colors items-center text-left cursor-pointer"
              >
                <span className="text-white font-mono text-sm">{quote.quote_number}</span>
                <div>
                  <p className="text-white text-sm">{quote.customers?.name || 'Unknown'}</p>
                  <p className="text-gray-500 text-xs">{quote.customers?.email || ''}</p>
                </div>
                <span className="text-white font-semibold">${parseFloat(quote.total).toFixed(2)}</span>
                <span className={`text-xs px-2 py-1 rounded capitalize w-fit ${statusColor(quote.status)}`}>
                  {statusLabel(quote.status)}
                </span>
                <span className="text-gray-400 text-sm">{new Date(quote.created_at).toLocaleDateString('en-AU')}</span>
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
            className="bg-gray-900 border border-gray-800 rounded-lg max-w-3xl w-full my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider">Quote</p>
                <p className="text-white font-mono">{selectedQuote.quote_number}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1 rounded capitalize ${statusColor(selectedQuote.status)}`}>
                  {statusLabel(selectedQuote.status)}
                </span>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="text-gray-400 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Won/Lost action bar */}
            {(selectedQuote.status === 'sent' || selectedQuote.status === 'opened' || selectedQuote.status === 'draft') && (
              <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
                <p className="text-sm text-gray-300 mb-3">Did you win this job?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => updateQuoteStatus(selectedQuote.id, 'accepted')}
                    disabled={updatingStatus}
                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded transition-colors disabled:opacity-50"
                  >
                    🎉 Mark as Won
                  </button>
                  <button
                    onClick={() => updateQuoteStatus(selectedQuote.id, 'declined')}
                    disabled={updatingStatus}
                    className="flex-1 py-2 bg-gray-700 hover:bg-red-900 text-white font-semibold rounded transition-colors disabled:opacity-50"
                  >
                    ✗ Mark as Lost
                  </button>
                </div>
              </div>
            )}

            {(selectedQuote.status === 'accepted' || selectedQuote.status === 'declined') && (
              <div className={`border-b px-6 py-3 flex items-center justify-between ${selectedQuote.status === 'accepted' ? 'bg-emerald-950 border-emerald-900' : 'bg-red-950 border-red-900'}`}>
                <p className={`text-sm font-semibold ${selectedQuote.status === 'accepted' ? 'text-emerald-300' : 'text-red-300'}`}>
                  {selectedQuote.status === 'accepted' ? '🎉 Job won!' : '✗ Job lost'}
                </p>
                <button
                  onClick={() => updateQuoteStatus(selectedQuote.id, 'sent')}
                  disabled={updatingStatus}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Reset status
                </button>
              </div>
            )}

            <div className="p-6">
              <div className="bg-white text-gray-900 rounded-lg p-8">
                <div className="border-b pb-4 mb-6">
                  <h3 className="text-2xl font-bold">{business?.business_name}</h3>
                  <p className="text-gray-500 capitalize">{business?.trade_type}</p>
                </div>

                <div className="mb-6">
                  <p className="text-gray-500 text-sm">Quote for:</p>
                  <p className="font-semibold text-lg">{selectedQuote.customers?.name || 'Unknown'}</p>
                  {selectedQuote.customers?.email && (
                    <p className="text-gray-500 text-sm">{selectedQuote.customers.email}</p>
                  )}
                </div>

                {(() => {
                  const content = parseQuoteContent(selectedQuote.ai_generated_content)
                  if (!content) {
                    return <p className="text-gray-500 italic">Quote content unavailable</p>
                  }
                  return (
                    <>
                      {content.greeting && <p className="mb-6 text-gray-700">{content.greeting}</p>}

                      {content.scopeOfWork && (
                        <div className="mb-6">
                          <h4 className="font-bold mb-2">Scope of Work</h4>
                          <p className="text-gray-700">{content.scopeOfWork}</p>
                        </div>
                      )}

                      {content.inclusions && content.inclusions.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-bold mb-2">What's Included</h4>
                          <ul className="list-disc list-inside text-gray-700">
                            {content.inclusions.map((item: string, i: number) => (<li key={i}>{item}</li>))}
                          </ul>
                        </div>
                      )}

                      {content.exclusions && content.exclusions.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-bold mb-2">Exclusions</h4>
                          <ul className="list-disc list-inside text-gray-700">
                            {content.exclusions.map((item: string, i: number) => (<li key={i}>{item}</li>))}
                          </ul>
                        </div>
                      )}

                      <div className="bg-gray-50 rounded p-4 mb-6">
                        {selectedQuote.line_items?.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between py-1">
                            <span>{item.description}</span>
                            <span className="font-semibold">${parseFloat(item.amount).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t mt-2 pt-2 flex justify-between text-sm text-gray-500">
                          <span>Subtotal</span>
                          <span>${parseFloat(selectedQuote.subtotal || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>GST (10%)</span>
                          <span>${parseFloat(selectedQuote.gst || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-1">
                          <span>Total (inc. GST)</span>
                          <span>${parseFloat(selectedQuote.total || 0).toFixed(2)}</span>
                        </div>
                      </div>

                      {content.terms && (
                        <div className="mb-4">
                          <h4 className="font-bold mb-1">Terms & Conditions</h4>
                          <p className="text-gray-700 text-sm">{content.terms}</p>
                        </div>
                      )}

                      {content.validityPeriod && (
                        <p className="text-gray-600 text-sm italic">Quote valid for {content.validityPeriod}</p>
                      )}

                      {content.closingMessage && (
                        <p className="mt-4 text-gray-700">{content.closingMessage}</p>
                      )}
                    </>
                  )
                })()}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-800 rounded p-4">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Created</p>
                  <p className="text-white">{new Date(selectedQuote.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="bg-gray-800 rounded p-4">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Valid Until</p>
                  <p className="text-white">{selectedQuote.valid_until ? new Date(selectedQuote.valid_until).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}