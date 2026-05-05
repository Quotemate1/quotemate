'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setEmail(user.email || '')
    }
    getUser()
  }, [])

  const handleCheckout = async (priceId: string, plan: string) => {
    setLoading(plan)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, email }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      alert('Error starting checkout')
    }
    setLoading(null)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <a href="/dashboard" className="text-xl font-bold text-white">QuoteMate</a>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Stop losing jobs to better-looking quotes</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">Professional AI quotes in 60 seconds. GST calculated. Sent to your customer. Auto follow-up included. Try free for 7 days.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 flex flex-col">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">Starter</h2>
              <p className="text-gray-500 text-sm">For tradies getting started</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$59</span>
              <span className="text-gray-400">/mo AUD</span>
              <p className="text-emerald-400 text-sm mt-1">7-day free trial</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-emerald-400 mt-0.5">✓</span>20 AI-powered quotes per month</li>
              <li className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-emerald-400 mt-0.5">✓</span>Professional branded PDF quotes</li>
              <li className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-emerald-400 mt-0.5">✓</span>Automatic GST calculation</li>
              <li className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-emerald-400 mt-0.5">✓</span>Email delivery to customers</li>
              <li className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-emerald-400 mt-0.5">✓</span>Quote dashboard & history</li>
            </ul>
            <button
              onClick={() => handleCheckout('price_1TTBftPTh9bzSYAcKfbIIHkE', 'starter')}
              disabled={loading === 'starter'}
              className="w-full py-3 border border-emerald-500 text-emerald-400 hover:bg-emerald-900 font-semibold rounded transition-colors disabled:opacity-50"
            >
              {loading === 'starter' ? 'Loading...' : 'Start Free Trial'}
            </button>
          </div>

          <div className="bg-gray-900 border-2 border-emerald-500 rounded-lg p-8 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">Pro</h2>
              <p className="text-gray-500 text-sm">For tradies who want to win more jobs</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$99</span>
              <span className="text-gray-400">/mo AUD</span>
              <p className="text-emerald-400 text-sm mt-1">7-day free trial</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-emerald-400 mt-0.5">✓</span>Unlimited AI-powered quotes</li>
              <li className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-emerald-400 mt-0.5">✓</span>Everything in Starter</li>
              <li className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-emerald-400 mt-0.5">✓</span>Auto follow-up emails to customers</li>
              <li className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-emerald-400 mt-0.5">✓</span>Quote open tracking</li>
              <li className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-emerald-400 mt-0.5">✓</span>Saved line items for repeat jobs</li>
              <li className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-emerald-400 mt-0.5">✓</span>Priority support</li>
            </ul>
            <button
              onClick={() => handleCheckout('price_1TTBgePTh9bzSYAcxlhErm4d', 'pro')}
              disabled={loading === 'pro'}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded transition-colors disabled:opacity-50"
            >
              {loading === 'pro' ? 'Loading...' : 'Start Free Trial'}
            </button>
          </div>

        </div>

        <p className="text-center text-gray-600 text-sm mt-8">Cancel anytime. No lock-in contracts. Prices include GST.</p>
      </main>
    </div>
  )
}