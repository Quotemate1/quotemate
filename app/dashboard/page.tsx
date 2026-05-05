'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quotes, setQuotes] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, sent: 0, revenue: 0 })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)

      const { data: biz } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (biz) {
        const { data: quotesData } = await supabase
          .from('quotes')
          .select('*, customers(name, email)')
          .eq('business_id', biz.id)
          .order('created_at', { ascending: false })

        if (quotesData) {
          setQuotes(quotesData)
          const sent = quotesData.filter((q: any) => q.status === 'sent' || q.status === 'opened' || q.status === 'accepted').length
          const revenue = quotesData.reduce((sum: number, q: any) => sum + (parseFloat(q.total) || 0), 0)
          setStats({ total: quotesData.length, sent, revenue })
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
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
        <h1 className="text-xl font-bold text-white">QuoteMate</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{user?.email}</span>
          <button onClick={handleSignOut} className="text-sm text-gray-400 hover:text-white transition-colors">Sign out</button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">G'day! 👋</h2>
            <p className="text-gray-400">Here's how your quotes are tracking.</p>
          </div>
          <a href="/create-quote" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded transition-colors">
            + Create New Quote
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-sm text-gray-400 mb-1">Total Quotes</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-sm text-gray-400 mb-1">Quotes Sent</p>
            <p className="text-3xl font-bold text-emerald-400">{stats.sent}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-sm text-gray-400 mb-1">Revenue Quoted</p>
            <p className="text-3xl font-bold text-white">${stats.revenue.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</p>
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
              <div key={quote.id} className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-800 hover:bg-gray-800 transition-colors items-center">
                <span className="text-white font-mono text-sm">{quote.quote_number}</span>
                <div>
                  <p className="text-white text-sm">{quote.customers?.name || 'Unknown'}</p>
                  <p className="text-gray-500 text-xs">{quote.customers?.email || ''}</p>
                </div>
                <span className="text-white font-semibold">${parseFloat(quote.total).toFixed(2)}</span>
                <span className={`text-xs px-2 py-1 rounded capitalize w-fit ${statusColor(quote.status)}`}>{quote.status}</span>
                <span className="text-gray-400 text-sm">{new Date(quote.created_at).toLocaleDateString('en-AU')}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}