'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function OnboardingPage() {
  const [user, setUser] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    businessName: '',
    tradeType: 'plumber',
    abn: '',
    phone: '',
    email: '',
    address: '',
  })

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)
      setForm(f => ({ ...f, email: user.email || '' }))

      // Check if user already has a business — skip onboarding
      const { data: existing } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .single()
      if (existing) {
        window.location.href = '/dashboard'
      }
    }
    init()
  }, [])

  const saveBusiness = async () => {
    if (!user) return
    setSaving(true)
    try {
      const { error } = await supabase.from('businesses').insert({
        user_id: user.id,
        business_name: form.businessName,
        trade_type: form.tradeType,
        abn: form.abn || null,
        phone: form.phone || null,
        email: form.email || null,
        address: form.address || null,
      })
      if (error) throw error

      // Send welcome email (don't block redirect if it fails)
      fetch('/api/send-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: form.businessName,
        }),
      }).catch(() => {})

      window.location.href = '/dashboard'
    } catch (error: any) {
      alert('Error saving: ' + error.message)
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <nav className="border-b border-gray-800 px-6 py-4">
        <span className="text-xl font-bold text-white">SmokoHQ</span>
      </nav>

      <main className="flex-1 max-w-xl mx-auto px-6 py-12 w-full">
        <div className="inline-block px-3 py-1 bg-emerald-900 text-emerald-400 text-xs font-semibold rounded-full mb-4 tracking-wide uppercase">
          Welcome to SmokoHQ
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Let's set up your business</h1>
        <p className="text-gray-400 mb-8">Quick one-time setup. We'll save these details so you never have to retype them on a quote again.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Business Name *</label>
            <input
              type="text"
              value={form.businessName}
              onChange={(e) => setForm({...form, businessName: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Smith's Plumbing"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Trade Type *</label>
            <select
              value={form.tradeType}
              onChange={(e) => setForm({...form, tradeType: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="plumber">Plumber</option>
              <option value="electrician">Electrician</option>
              <option value="builder">Builder</option>
              <option value="painter">Painter</option>
              <option value="carpenter">Carpenter</option>
              <option value="landscaper">Landscaper</option>
              <option value="tiler">Tiler</option>
              <option value="roofer">Roofer</option>
              <option value="concreter">Concreter</option>
              <option value="fencer">Fencer</option>
              <option value="cleaner">Cleaner</option>
              <option value="hvac">HVAC / Air Conditioning</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">ABN <span className="text-gray-600">(optional)</span></label>
            <input
              type="text"
              value={form.abn}
              onChange={(e) => setForm({...form, abn: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              placeholder="e.g. 12 345 678 901"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone <span className="text-gray-600">(optional)</span></label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({...form, phone: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              placeholder="e.g. 0412 345 678"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Business Email <span className="text-gray-600">(optional)</span></label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              placeholder="e.g. quotes@smithsplumbing.com.au"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Business Address <span className="text-gray-600">(optional)</span></label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({...form, address: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              placeholder="e.g. 123 Main St, Parramatta NSW 2150"
            />
          </div>

          <button
            onClick={saveBusiness}
            disabled={saving || !form.businessName}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Continue to Dashboard →'}
          </button>

          <p className="text-xs text-gray-600 text-center mt-2">You can always update these details later from your dashboard.</p>
        </div>
      </main>
    </div>
  )
}