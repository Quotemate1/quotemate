'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function ReferralsPage() {
  const [user, setUser] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [referrals, setReferrals] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
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

    const { data: refs } = await supabase
      .from('referrals')
      .select('*, referred_business:businesses!referred_business_id(business_name, created_at)')
      .eq('referrer_business_id', biz.id)
      .order('created_at', { ascending: false })

    if (refs) setReferrals(refs)
    setLoading(false)
  }

  const copyLink = () => {
    const link = `https://quotemate-eta.vercel.app/login?ref=${business.referral_code}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareViaText = () => {
    const link = `https://quotemate-eta.vercel.app/login?ref=${business.referral_code}`
    const message = `G'day mate, you should try SmokoHQ — AI quoting for tradies. Sign up with my code: ${link}`
    window.location.href = `sms:?body=${encodeURIComponent(message)}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  const link = `https://quotemate-eta.vercel.app/login?ref=${business.referral_code}`
  const weeksEarned = business?.beta_weeks_earned || 0

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <a href="/dashboard" className="text-xl font-bold text-white">SmokoHQ</a>
        <a href="/dashboard" className="text-sm text-gray-400 hover:text-white">← Dashboard</a>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="inline-block px-3 py-1 bg-emerald-900 text-emerald-400 text-xs font-semibold rounded-full mb-4 tracking-wide uppercase">
          Beta Referral Program
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Refer a mate. Earn weeks free.</h1>
        <p className="text-gray-400 mb-10">For every tradie who signs up with your code during the beta, you'll get <strong className="text-emerald-400">1 week of SmokoHQ free</strong> when we launch. Refer 10 mates — get 10 weeks free.</p>

        <div className="bg-amber-950 border border-amber-900 rounded-lg p-4 mb-10">
          <p className="text-sm text-amber-300">
            <strong>🍻 Beta phase:</strong> Your free weeks will be applied to your subscription when SmokoHQ launches publicly. They'll appear in your account automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-sm text-gray-400 mb-1">Mates referred</p>
            <p className="text-3xl font-bold text-white">{referrals.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-sm text-gray-400 mb-1">Free weeks earned</p>
            <p className="text-3xl font-bold text-emerald-400">{weeksEarned}</p>
            <p className="text-xs text-gray-600 mt-1">Applied at launch</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-sm text-gray-400 mb-1">Value</p>
            <p className="text-3xl font-bold text-white">${(weeksEarned * 25).toLocaleString('en-AU')}</p>
            <p className="text-xs text-gray-600 mt-1">Based on Pro plan</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-emerald-800 rounded-lg p-6 mb-10">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Your referral code</p>
          <p className="text-3xl font-bold text-emerald-400 font-mono mb-4">{business?.referral_code}</p>

          <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Your unique link</p>
          <div className="bg-gray-800 border border-gray-700 rounded p-3 mb-4 break-all text-sm text-gray-300 font-mono">
            {link}
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={copyLink}
              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded transition-colors"
            >
              {copied ? '✓ Copied!' : '🔗 Copy Link'}
            </button>
            <button
              onClick={shareViaText}
              className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded transition-colors border border-gray-700"
            >
              💬 Share via Text
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-4">Mates you've referred</h2>

        {referrals.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
            <p className="text-gray-400 mb-2">No referrals yet.</p>
            <p className="text-gray-500 text-sm">Share your link above to start earning free weeks.</p>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            {referrals.map((ref: any) => (
              <div key={ref.id} className="flex items-center justify-between px-6 py-4 border-b border-gray-800 last:border-b-0">
                <div>
                  <p className="text-white">{ref.referred_business?.business_name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{new Date(ref.created_at).toLocaleDateString('en-AU')}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded bg-emerald-900 text-emerald-400">
                  +1 week earned
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 p-5 bg-gray-900 border border-gray-800 rounded-lg">
          <h3 className="text-white font-semibold mb-2">💡 How it works (Beta phase)</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>1. Share your unique link with a mate (text, Facebook, in person)</li>
            <li>2. They sign up and enter your code during onboarding</li>
            <li>3. You earn 1 week free for every mate who signs up</li>
            <li>4. Weeks are applied to your subscription when SmokoHQ launches publicly</li>
            <li>5. No limit during beta — refer as many mates as you want</li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500"><strong className="text-gray-300">Post-launch:</strong> The referral program will change to a one-time bonus of 1 month free when a referred mate becomes a paying subscriber.</p>
          </div>
        </div>
      </main>
    </div>
  )
}