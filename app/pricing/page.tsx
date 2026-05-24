'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (plan: 'starter' | 'pro') => {
    setLoading(plan)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, email: user.email }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Error: ' + (data.error || 'Could not start checkout'))
      }
    } catch (error: any) {
      alert('Error: ' + error.message)
    }
    setLoading(null)
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      <nav className="border-b border-stone-800 bg-stone-900 px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-xl font-bold">SmokoHQ</a>
        <div className="flex gap-3 text-sm items-center">
          <a href="/blog" className="px-4 py-2 text-stone-400 hover:text-white rounded-full transition-colors">Blog</a>
          <a href="/pricing" className="px-4 py-2 text-emerald-400">Pricing</a>
          <a href="/login" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-colors">Login</a>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16">

        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-full mb-6 tracking-wide uppercase">
            Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pricing that pays for itself.</h1>
          <p className="text-lg text-stone-400 max-w-2xl mx-auto">Win one extra job and SmokoHQ pays for itself 10x over. Start with a 7-day free trial - no credit card needed.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">

          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 hover:border-stone-700 transition-colors">
            <h3 className="text-xl font-bold mb-1">Starter</h3>
            <p className="text-stone-500 text-sm mb-4">Perfect for solo tradies getting started</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$59</span>
              <span className="text-stone-400">/mo AUD</span>
              <p className="text-xs text-stone-500 mt-1">GST included</p>
            </div>
            <ul className="space-y-3 text-sm text-stone-300 mb-8">
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">✓</span>20 AI quotes per month</li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">✓</span>Professional PDF quotes</li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">✓</span>GST auto-calculated</li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">✓</span>Email delivery to customers</li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">✓</span>Customer-facing accept/decline</li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">✓</span>Quote tracking dashboard</li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">✓</span>Saved line items + templates</li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">✓</span>AI market price check</li>
            </ul>
            <button onClick={() => handleCheckout('starter')} disabled={loading !== null} className="block w-full text-center py-3 border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 rounded-full font-bold transition-colors disabled:opacity-50">
              {loading === 'starter' ? 'Loading...' : 'Start Free Trial'}
            </button>
            <p className="text-xs text-stone-500 text-center mt-3">7-day free trial · Cancel anytime</p>
          </div>

          <div className="bg-stone-900 border-2 border-emerald-500 rounded-2xl p-8 relative shadow-xl shadow-emerald-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</div>
            <h3 className="text-xl font-bold mb-1">Pro</h3>
            <p className="text-stone-500 text-sm mb-4">For tradies who want it all</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$99</span>
              <span className="text-stone-400">/mo AUD</span>
              <p className="text-xs text-stone-500 mt-1">GST included</p>
            </div>
            <ul className="space-y-3 text-sm text-stone-300 mb-8">
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">✓</span><strong>Unlimited</strong> AI quotes</li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">✓</span>Everything in Starter, plus:</li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">✓</span>Auto follow-up emails (48hr + 5d)</li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">✓</span>Quote open tracking</li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">✓</span>Accept/decline email alerts</li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">✓</span>Priority support</li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">✓</span>Conversion rate analytics</li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">✓</span>Revenue won tracking</li>
            </ul>
            <button onClick={() => handleCheckout('pro')} disabled={loading !== null} className="block w-full text-center py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50">
              {loading === 'pro' ? 'Loading...' : 'Start Free Trial'}
            </button>
            <p className="text-xs text-stone-500 text-center mt-3">7-day free trial · Cancel anytime</p>
          </div>

        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Questions?</h2>
          <div className="space-y-4">

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-2">What happens after the free trial?</h3>
              <p className="text-stone-400 text-sm">If you love it, you keep going at your chosen plan. If not, just cancel from your dashboard - no charges, no questions asked. We never charge a card during the trial period.</p>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-2">Can I cancel anytime?</h3>
              <p className="text-stone-400 text-sm">Yes. Cancel from your dashboard in one click. You will keep access until the end of your billing period, then it stops. No refunds for partial months, but no contracts either.</p>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-2">Do you handle GST properly?</h3>
              <p className="text-stone-400 text-sm">Yes - prices shown include GST. Quotes you create through SmokoHQ also auto-calculate 10% GST on subtotal, displayed properly on PDF and email. Your ABN appears prominently on every quote.</p>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-2">What if I run out of quotes on Starter?</h3>
              <p className="text-stone-400 text-sm">You can upgrade to Pro anytime (instant), or just wait until your monthly quota resets. We never auto-charge for extras.</p>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-2">Is my data safe?</h3>
              <p className="text-stone-400 text-sm">Yes. Your data is hosted in Sydney (Supabase), encrypted in transit and at rest. We never sell your data or your customer&apos;s data. See our <a href="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</a> for details.</p>
            </div>

          </div>
        </div>

        <div className="text-center mt-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Still on the fence?</h2>
          <p className="text-stone-400 mb-8">Try SmokoHQ free for 7 days. No credit card needed. If it doesn&apos;t save you hours every week, just walk away.</p>
          <a href="/login" className="inline-block px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded-full transition-colors shadow-lg shadow-emerald-500/20">
            Start Your Free Trial
          </a>
        </div>

      </main>

      <footer className="border-t border-stone-800 py-10 px-8 bg-stone-900 mt-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-stone-600">© 2026 SmokoHQ. Built in Australia for Australian tradies.</span>
          <div className="flex gap-6 text-sm">
            <a href="/blog" className="text-stone-500 hover:text-stone-300">Blog</a>
            <a href="/pricing" className="text-stone-500 hover:text-stone-300">Pricing</a>
            <a href="/privacy" className="text-stone-500 hover:text-stone-300">Privacy</a>
            <a href="/terms" className="text-stone-500 hover:text-stone-300">Terms</a>
            <a href="/login" className="text-stone-500 hover:text-stone-300">Sign In</a>
          </div>
        </div>
      </footer>
    </div>
  )
}