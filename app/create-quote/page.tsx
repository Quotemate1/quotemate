'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function CreateQuotePage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generatedQuote, setGeneratedQuote] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [saved, setSaved] = useState(false)
  const [savedQuoteId, setSavedQuoteId] = useState<string | null>(null)

  const [form, setForm] = useState({
    businessName: '',
    tradeType: 'plumber',
    customerName: '',
    customerEmail: '',
    jobDescription: '',
  })

  const [lineItems, setLineItems] = useState([
    { description: '', amount: '' }
  ])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)
    }
    getUser()
  }, [])

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', amount: '' }])
  }

  const updateLineItem = (index: number, field: string, value: string) => {
    const updated = [...lineItems]
    updated[index] = { ...updated[index], [field]: value }
    setLineItems(updated)
  }

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index))
    }
  }

  const subtotal = lineItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
  const gst = subtotal * 0.1
  const total = subtotal + gst

  const generateQuote = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          lineItems: lineItems.filter(item => item.description && item.amount)
        })
      })
      const data = await res.json()
      if (data.success) {
        setGeneratedQuote(data.quote)
        setSaved(false)
        setSavedQuoteId(null)
        setStep(3)
      } else {
        alert('Error generating quote: ' + data.error)
      }
    } catch (error) {
      alert('Error connecting to AI. Please try again.')
    }
    setLoading(false)
  }

  const saveQuote = async () => {
    if (!user) return
    setSaving(true)
    try {
      let businessId = null
      const { data: existingBiz } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (existingBiz) {
        businessId = existingBiz.id
      } else {
        const { data: newBiz } = await supabase
          .from('businesses')
          .insert({
            user_id: user.id,
            business_name: form.businessName,
            trade_type: form.tradeType,
          })
          .select('id')
          .single()
        businessId = newBiz?.id
      }

      if (!businessId) { alert('Error creating business'); setSaving(false); return }

      const { data: customer } = await supabase
        .from('customers')
        .insert({
          business_id: businessId,
          name: form.customerName,
          email: form.customerEmail,
        })
        .select('id')
        .single()

      const quoteNumber = 'SHQ-' + Date.now().toString().slice(-6)

      const { data: newQuote } = await supabase.from('quotes').insert({
        business_id: businessId,
        customer_id: customer?.id,
        quote_number: quoteNumber,
        job_description: form.jobDescription,
        ai_generated_content: JSON.stringify(generatedQuote),
        line_items: lineItems.filter(i => i.description && i.amount),
        subtotal: subtotal,
        gst: gst,
        total: total,
        status: 'draft',
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }).select('id').single()

      if (newQuote) setSavedQuoteId(newQuote.id)
      setSaved(true)
    } catch (error: any) {
      alert('Error saving quote: ' + error.message)
    }
    setSaving(false)
  }

  const sendQuoteEmail = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          businessName: form.businessName,
          tradeType: form.tradeType,
          quote: generatedQuote,
          lineItems: lineItems.filter(i => i.description && i.amount),
          subtotal,
          gst,
          total,
        })
      })
      const data = await res.json()
      if (data.success) {
        if (savedQuoteId) {
          await supabase.from('quotes').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', savedQuoteId)
        }
        alert('Quote sent to ' + form.customerEmail + '!')
      } else {
        alert('Error sending email: ' + data.error)
      }
    } catch (error) {
      alert('Error sending email')
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <a href="/dashboard" className="text-xl font-bold text-white">SmokoHQ</a>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className={step >= 1 ? 'text-emerald-400' : ''}>Details</span>
          <span>→</span>
          <span className={step >= 2 ? 'text-emerald-400' : ''}>Line Items</span>
          <span>→</span>
          <span className={step >= 3 ? 'text-emerald-400' : ''}>Preview</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Job Details</h2>
            <p className="text-gray-400 mb-8">Tell us about the job and we'll generate a professional quote.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Your Business Name</label>
                <input type="text" value={form.businessName} onChange={(e) => setForm({...form, businessName: e.target.value})} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" placeholder="e.g. Smith's Plumbing" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Trade Type</label>
                <select value={form.tradeType} onChange={(e) => setForm({...form, tradeType: e.target.value})} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-emerald-500">
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
                <label className="block text-sm text-gray-400 mb-1">Customer Name</label>
                <input type="text" value={form.customerName} onChange={(e) => setForm({...form, customerName: e.target.value})} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" placeholder="e.g. John Smith" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Customer Email</label>
                <input type="email" value={form.customerEmail} onChange={(e) => setForm({...form, customerEmail: e.target.value})} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" placeholder="e.g. john@email.com" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Job Description</label>
                <textarea value={form.jobDescription} onChange={(e) => setForm({...form, jobDescription: e.target.value})} rows={4} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" placeholder="Describe the job in your own words..." />
              </div>
              <button onClick={() => setStep(2)} disabled={!form.businessName || !form.customerName || !form.jobDescription} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                Next → Add Line Items
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Line Items & Pricing</h2>
            <p className="text-gray-400 mb-8">Add what you're charging for. GST will be calculated automatically.</p>
            <div className="space-y-3 mb-6">
              {lineItems.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <input type="text" value={item.description} onChange={(e) => updateLineItem(index, 'description', e.target.value)} className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" placeholder="e.g. Supply & install Rinnai 26L" />
                  <input type="number" value={item.amount} onChange={(e) => updateLineItem(index, 'amount', e.target.value)} className="w-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" placeholder="$ Amount" />
                  <button onClick={() => removeLineItem(index)} className="px-3 text-gray-500 hover:text-red-400 transition-colors">✕</button>
                </div>
              ))}
            </div>
            <button onClick={addLineItem} className="text-sm text-emerald-400 hover:text-emerald-300 mb-8 block">+ Add another line item</button>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
              <div className="flex justify-between text-gray-400 mb-2"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-400 mb-2"><span>GST (10%)</span><span>${gst.toFixed(2)}</span></div>
              <div className="flex justify-between text-white font-bold text-lg border-t border-gray-700 pt-2"><span>Total (inc. GST)</span><span>${total.toFixed(2)}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 py-3 border border-gray-700 text-gray-400 hover:text-white rounded transition-colors">← Back</button>
              <button onClick={generateQuote} disabled={loading || !lineItems.some(item => item.description && item.amount)} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded transition-colors disabled:opacity-30">
                {loading ? '🤖 AI is writing your quote...' : '✨ Generate Quote with AI'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && generatedQuote && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Your Quote is Ready!</h2>
            <p className="text-gray-400 mb-8">Review the AI-generated quote below.</p>

            {saved && (
              <div className="bg-emerald-900 border border-emerald-700 rounded-lg p-4 mb-6 text-emerald-300 text-sm">
                ✅ Quote saved! Now send it to your customer or go to your dashboard.
              </div>
            )}

            <div className="bg-white text-gray-900 rounded-lg p-8 mb-6">
              <div className="border-b pb-4 mb-6">
                <h3 className="text-2xl font-bold">{form.businessName}</h3>
                <p className="text-gray-500 capitalize">{form.tradeType}</p>
              </div>
              <div className="mb-6">
                <p className="text-gray-500 text-sm">Quote for:</p>
                <p className="font-semibold text-lg">{form.customerName}</p>
              </div>
              <p className="mb-6 text-gray-700">{generatedQuote.greeting}</p>
              <div className="mb-6">
                <h4 className="font-bold mb-2">Scope of Work</h4>
                <p className="text-gray-700">{generatedQuote.scopeOfWork}</p>
              </div>
              <div className="mb-6">
                <h4 className="font-bold mb-2">What's Included</h4>
                <ul className="list-disc list-inside text-gray-700">
                  {generatedQuote.inclusions?.map((item: string, i: number) => (<li key={i}>{item}</li>))}
                </ul>
              </div>
              <div className="mb-6">
                <h4 className="font-bold mb-2">Exclusions</h4>
                <ul className="list-disc list-inside text-gray-700">
                  {generatedQuote.exclusions?.map((item: string, i: number) => (<li key={i}>{item}</li>))}
                </ul>
              </div>
              <div className="bg-gray-50 rounded p-4 mb-6">
                {lineItems.filter(i => i.description && i.amount).map((item, index) => (
                  <div key={index} className="flex justify-between py-1">
                    <span>{item.description}</span>
                    <span className="font-semibold">${parseFloat(item.amount).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t mt-2 pt-2 flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm text-gray-500"><span>GST (10%)</span><span>${gst.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-lg mt-1"><span>Total (inc. GST)</span><span>${total.toFixed(2)}</span></div>
              </div>
              <div className="mb-4">
                <h4 className="font-bold mb-1">Terms & Conditions</h4>
                <p className="text-gray-700 text-sm">{generatedQuote.terms}</p>
              </div>
              <p className="text-gray-600 text-sm italic">Quote valid for {generatedQuote.validityPeriod}</p>
              <p className="mt-4 text-gray-700">{generatedQuote.closingMessage}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setGeneratedQuote(null); setSaved(false); setSavedQuoteId(null); setStep(2) }} className="px-6 py-3 border border-gray-700 text-gray-400 hover:text-white rounded transition-colors">← Edit</button>
              <button onClick={generateQuote} disabled={loading} className="px-6 py-3 border border-emerald-700 text-emerald-400 hover:bg-emerald-900 rounded transition-colors">
                {loading ? 'Regenerating...' : '🔄 Regenerate'}
              </button>
              {!saved ? (
                <button onClick={saveQuote} disabled={saving} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : '💾 Save Quote'}
                </button>
              ) : (
                <div className="flex-1 flex gap-3">
                  <button onClick={sendQuoteEmail} disabled={saving || !form.customerEmail} className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded transition-colors disabled:opacity-50">
                    {saving ? 'Sending...' : '📧 Email to Customer'}
                  </button>
                  <a href="/dashboard" className="py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded transition-colors text-center">
                    Dashboard
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}