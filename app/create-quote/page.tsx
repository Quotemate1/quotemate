'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function CreateQuotePage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generatedQuote, setGeneratedQuote] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [saved, setSaved] = useState(false)
  const [savedQuoteId, setSavedQuoteId] = useState<string | null>(null)
  const [businessLoaded, setBusinessLoaded] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [editingField, setEditingField] = useState<string | null>(null)
  const [savedItems, setSavedItems] = useState<any[]>([])
  const [showPicker, setShowPicker] = useState(false)
  const [planInfo, setPlanInfo] = useState<{ plan: string, used: number, limit: number, canCreate: boolean }>({
    plan: 'trial', used: 0, limit: 20, canCreate: true
  })
  const [marketCheck, setMarketCheck] = useState<{ [key: number]: any }>({})
  const [checkingMarket, setCheckingMarket] = useState<number | null>(null)

  const [form, setForm] = useState({
    businessName: '',
    tradeType: 'plumber',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    jobAddress: '',
    jobDescription: '',
  })

  const [lineItems, setLineItems] = useState([
    { description: '', amount: '' }
  ])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)

      const { data: business } = await supabase
        .from('businesses')
        .select('id, business_name, trade_type, subscription_status, subscription_plan, quote_count_this_month, quote_count_reset_at')
        .eq('user_id', user.id)
        .single()

      if (business) {
        setForm(f => ({
          ...f,
          businessName: business.business_name || '',
          tradeType: business.trade_type || 'plumber',
        }))

        const resetDate = business.quote_count_reset_at ? new Date(business.quote_count_reset_at) : new Date()
        const now = new Date()
        const daysSinceReset = (now.getTime() - resetDate.getTime()) / (1000 * 60 * 60 * 24)

        let usedCount = business.quote_count_this_month || 0

        if (daysSinceReset >= 30) {
          await supabase
            .from('businesses')
            .update({ quote_count_this_month: 0, quote_count_reset_at: new Date().toISOString() })
            .eq('id', business.id)
          usedCount = 0
        }

        const plan = business.subscription_plan || 'trial'
        const isActive = business.subscription_status === 'active' || business.subscription_status === 'trialing'

        let limit = 2
        if (plan === 'pro' && isActive) limit = 999999
        else if (plan === 'starter' && isActive) limit = 20
        else if (business.subscription_status === 'trialing') limit = 20

        setPlanInfo({
          plan: isActive ? plan : 'trial',
          used: usedCount,
          limit: limit,
          canCreate: usedCount < limit,
        })

        const { data: items } = await supabase
          .from('saved_line_items')
          .select('*')
          .eq('business_id', business.id)
          .order('description', { ascending: true })
        if (items) setSavedItems(items)
      } else {
        window.location.href = '/onboarding'
        return
      }
      setBusinessLoaded(true)
    }
    init()
  }, [])

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', amount: '' }])
  }

  const addSavedItem = (item: any) => {
    if (lineItems.length === 1 && !lineItems[0].description && !lineItems[0].amount) {
      setLineItems([{ description: item.description, amount: item.amount.toString() }])
    } else {
      setLineItems([...lineItems, { description: item.description, amount: item.amount.toString() }])
    }
    setShowPicker(false)
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

  const checkMarketPrice = async (index: number) => {
    const item = lineItems[index]
    if (!item.description.trim()) {
      alert('Add a description first so we know what to check.')
      return
    }
    setCheckingMarket(index)
    try {
      const res = await fetch('/api/market-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: item.description,
          tradeType: form.tradeType,
        })
      })
      const data = await res.json()
      if (data.success) {
        setMarketCheck({ ...marketCheck, [index]: data.result })
      } else {
        alert('Market check failed: ' + (data.error || 'Try again'))
      }
    } catch (error) {
      alert('Error checking market price')
    }
    setCheckingMarket(null)
  }

  const closeMarketCheck = (index: number) => {
    const updated = { ...marketCheck }
    delete updated[index]
    setMarketCheck(updated)
  }

  const subtotal = lineItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
  const gst = subtotal * 0.1
  const total = subtotal + gst

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {}
    if (!form.customerName.trim()) newErrors.customerName = 'Customer name is required'
    if (!form.customerEmail.trim()) newErrors.customerEmail = 'Customer email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) newErrors.customerEmail = 'Please enter a valid email'
    if (!form.jobDescription.trim()) newErrors.jobDescription = 'Job description is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {}
    const hasLineItems = lineItems.some(item => item.description.trim() && item.amount && parseFloat(item.amount) > 0)
    if (!hasLineItems) newErrors.lineItems = 'Add at least one line item with a description and amount'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const goToStep2 = () => {
    if (validateStep1()) setStep(2)
  }

  const generateQuote = async () => {
    if (!validateStep2()) return
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

  const updateQuoteField = (field: string, value: any) => {
    setGeneratedQuote((prev: any) => ({ ...prev, [field]: value }))
  }

  const updateInclusion = (index: number, value: string) => {
    const updated = [...generatedQuote.inclusions]
    updated[index] = value
    updateQuoteField('inclusions', updated)
  }

  const updateExclusion = (index: number, value: string) => {
    const updated = [...generatedQuote.exclusions]
    updated[index] = value
    updateQuoteField('exclusions', updated)
  }

  const removeInclusion = (index: number) => {
    updateQuoteField('inclusions', generatedQuote.inclusions.filter((_: any, i: number) => i !== index))
  }

  const removeExclusion = (index: number) => {
    updateQuoteField('exclusions', generatedQuote.exclusions.filter((_: any, i: number) => i !== index))
  }

  const addInclusion = () => {
    updateQuoteField('inclusions', [...(generatedQuote.inclusions || []), 'New inclusion'])
  }

  const addExclusion = () => {
    updateQuoteField('exclusions', [...(generatedQuote.exclusions || []), 'New exclusion'])
  }

  const saveQuote = async () => {
    if (!user) return
    setSaving(true)
    try {
      const { data: business } = await supabase
        .from('businesses')
        .select('id, quote_count_this_month')
        .eq('user_id', user.id)
        .single()

      if (!business) { alert('Please complete onboarding first'); setSaving(false); return }

      const { data: customer } = await supabase
        .from('customers')
        .insert({
          business_id: business.id,
          name: form.customerName,
          email: form.customerEmail,
          phone: form.customerPhone || null,
          address: form.jobAddress || null,
        })
        .select('id')
        .single()

      const quoteNumber = 'SHQ-' + Date.now().toString().slice(-6)
      const publicToken = crypto.randomUUID().replace(/-/g, '').slice(0, 16)

      const { data: newQuote } = await supabase.from('quotes').insert({
        business_id: business.id,
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
        public_token: publicToken,
      }).select('id, public_token').single()

      await supabase
        .from('businesses')
        .update({ quote_count_this_month: (business.quote_count_this_month || 0) + 1 })
        .eq('id', business.id)

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
          jobAddress: form.jobAddress,
          quote: generatedQuote,
          lineItems: lineItems.filter(i => i.description && i.amount),
          subtotal,
          gst,
          total,
          quoteId: savedQuoteId,
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

  const downloadPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let y = 20

    doc.setFillColor(26, 26, 46)
    doc.rect(0, 0, pageWidth, 35, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text(form.businessName, 15, 18)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(form.tradeType.charAt(0).toUpperCase() + form.tradeType.slice(1), 15, 27)

    y = 50
    doc.setTextColor(60, 60, 60)
    doc.setFontSize(10)
    doc.text(`Quote for: ${form.customerName}`, 15, y)
    doc.text(`Date: ${new Date().toLocaleDateString('en-AU')}`, pageWidth - 60, y)
    y += 6
    if (form.jobAddress) {
      doc.text(`Job address: ${form.jobAddress}`, 15, y)
      y += 4
    }
    y += 6

    doc.setTextColor(40, 40, 40)
    doc.setFontSize(10)
    const greetingLines = doc.splitTextToSize(generatedQuote.greeting, pageWidth - 30)
    doc.text(greetingLines, 15, y)
    y += greetingLines.length * 5 + 5

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Scope of Work', 15, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    const scopeLines = doc.splitTextToSize(generatedQuote.scopeOfWork, pageWidth - 30)
    doc.text(scopeLines, 15, y)
    y += scopeLines.length * 5 + 5

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text("What's Included", 15, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    generatedQuote.inclusions?.forEach((item: string) => {
      const lines = doc.splitTextToSize('• ' + item, pageWidth - 30)
      doc.text(lines, 15, y)
      y += lines.length * 5
    })
    y += 5

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Exclusions', 15, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    generatedQuote.exclusions?.forEach((item: string) => {
      const lines = doc.splitTextToSize('• ' + item, pageWidth - 30)
      doc.text(lines, 15, y)
      y += lines.length * 5
    })
    y += 5

    const tableData = lineItems.filter(i => i.description && i.amount).map(item => [
      item.description,
      `$${parseFloat(item.amount).toFixed(2)}`
    ])
    tableData.push(['Subtotal', `$${subtotal.toFixed(2)}`])
    tableData.push(['GST (10%)', `$${gst.toFixed(2)}`])
    tableData.push(['Total (inc. GST)', `$${total.toFixed(2)}`])

    autoTable(doc, {
      startY: y,
      head: [['Description', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [26, 26, 46], textColor: 255 },
      didParseCell: (data: any) => {
        if (data.row.index === tableData.length - 1) {
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.fontSize = 11
        }
      }
    })

    y = (doc as any).lastAutoTable.finalY + 10

    if (y > 250) {
      doc.addPage()
      y = 20
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Terms & Conditions', 15, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    const termsLines = doc.splitTextToSize(generatedQuote.terms, pageWidth - 30)
    doc.text(termsLines, 15, y)
    y += termsLines.length * 4 + 5

    doc.setFont('helvetica', 'italic')
    doc.text(`Quote valid for ${generatedQuote.validityPeriod}`, 15, y)
    y += 8

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    const closingLines = doc.splitTextToSize(generatedQuote.closingMessage, pageWidth - 30)
    doc.text(closingLines, 15, y)

    doc.setTextColor(150, 150, 150)
    doc.setFontSize(8)
    doc.text('Generated by SmokoHQ — AI quotes for Aussie tradies', pageWidth / 2, 285, { align: 'center' })

    const fileName = `Quote-${form.customerName.replace(/\s+/g, '-')}-${Date.now()}.pdf`
    doc.save(fileName)
  }

  if (!businessLoaded) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!planInfo.canCreate) {
    return (
      <div className="min-h-screen bg-gray-950">
        <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <a href="/dashboard" className="text-xl font-bold text-white">SmokoHQ</a>
          <a href="/dashboard" className="text-sm text-gray-400 hover:text-white">← Dashboard</a>
        </nav>
        <main className="max-w-xl mx-auto px-6 py-20 text-center">
          <div className="inline-block px-3 py-1 bg-amber-900 text-amber-400 text-xs font-semibold rounded-full mb-6 tracking-wide uppercase">
            Quote Limit Reached
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">You've used all {planInfo.limit} quotes</h1>
          <p className="text-gray-400 mb-8">
            {planInfo.plan === 'trial'
              ? "You've used your 2 free quotes. Subscribe to keep winning more jobs with SmokoHQ."
              : "You've hit your Starter plan limit. Upgrade to Pro for unlimited quotes and auto follow-ups."
            }
          </p>
          <a href="/pricing" className="inline-block px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded transition-colors">
            View Plans →
          </a>
          <p className="text-gray-600 text-sm mt-6">Start your 7-day free trial. Cancel anytime.</p>
        </main>
      </div>
    )
  }

  const Stepper = () => (
    <div className="flex items-center gap-2 max-w-2xl mx-auto px-6 mt-8 mb-2">
      {[1, 2, 3].map((s, i) => (
        <div key={s} className="flex-1 flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            step > s ? 'bg-emerald-500 text-white' : step === s ? 'bg-emerald-500 text-white ring-4 ring-emerald-500 ring-opacity-20' : 'bg-gray-800 text-gray-500'
          }`}>
            {step > s ? '✓' : s}
          </div>
          {i < 2 && <div className={`flex-1 h-0.5 transition-all ${step > s ? 'bg-emerald-500' : 'bg-gray-800'}`}></div>}
        </div>
      ))}
    </div>
  )

  const StepLabels = () => (
    <div className="flex items-center max-w-2xl mx-auto px-6 mb-8">
      <span className={`flex-1 text-xs ${step >= 1 ? 'text-emerald-400' : 'text-gray-500'}`}>Customer</span>
      <span className={`flex-1 text-xs text-center ${step >= 2 ? 'text-emerald-400' : 'text-gray-500'}`}>Line Items</span>
      <span className={`flex-1 text-xs text-right ${step >= 3 ? 'text-emerald-400' : 'text-gray-500'}`}>Preview & Send</span>
    </div>
  )

  const remaining = planInfo.limit - planInfo.used
  const showWarning = planInfo.limit < 999 && remaining <= 2

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <a href="/dashboard" className="text-xl font-bold text-white">SmokoHQ</a>
        <a href="/dashboard" className="text-sm text-gray-400 hover:text-white">← Dashboard</a>
      </nav>

      {showWarning && (
        <div className="bg-amber-900 border-b border-amber-800 px-6 py-3 text-center">
          <p className="text-sm text-amber-200">
            ⚠️ You have <strong>{remaining}</strong> quote{remaining !== 1 ? 's' : ''} remaining.{' '}
            <a href="/pricing" className="underline hover:text-white">Upgrade for unlimited quotes →</a>
          </p>
        </div>
      )}

      <Stepper />
      <StepLabels />

      <main className="max-w-2xl mx-auto px-6 pb-12">

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Customer & Job Details</h2>
            <p className="text-gray-400 mb-2">Quoting as <span className="text-emerald-400 font-semibold">{form.businessName}</span> ({form.tradeType})</p>
            <p className="text-gray-500 text-sm mb-8">Just fill in the customer and job details — we've got the rest covered.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Customer Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) => { setForm({...form, customerName: e.target.value}); setErrors({...errors, customerName: ''}) }}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 ${errors.customerName ? 'border-red-500' : 'border-gray-700'}`}
                  placeholder="e.g. John Smith"
                />
                {errors.customerName && <p className="text-red-400 text-xs mt-1">{errors.customerName}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Customer Email <span className="text-red-400">*</span></label>
                <input
                  type="email"
                  value={form.customerEmail}
                  onChange={(e) => { setForm({...form, customerEmail: e.target.value}); setErrors({...errors, customerEmail: ''}) }}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 ${errors.customerEmail ? 'border-red-500' : 'border-gray-700'}`}
                  placeholder="e.g. john@email.com"
                />
                {errors.customerEmail && <p className="text-red-400 text-xs mt-1">{errors.customerEmail}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Customer Phone <span className="text-gray-600">(optional)</span></label>
                <input
                  type="tel"
                  value={form.customerPhone}
                  onChange={(e) => setForm({...form, customerPhone: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. 0412 345 678"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Job Address <span className="text-gray-600">(optional)</span></label>
                <input
                  type="text"
                  value={form.jobAddress}
                  onChange={(e) => setForm({...form, jobAddress: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. 42 Smith St, Parramatta NSW 2150"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Job Description <span className="text-red-400">*</span></label>
                <textarea
                  value={form.jobDescription}
                  onChange={(e) => { setForm({...form, jobDescription: e.target.value}); setErrors({...errors, jobDescription: ''}) }}
                  rows={4}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 ${errors.jobDescription ? 'border-red-500' : 'border-gray-700'}`}
                  placeholder="Describe the job in your own words. The more detail, the better the AI quote."
                />
                {errors.jobDescription && <p className="text-red-400 text-xs mt-1">{errors.jobDescription}</p>}
              </div>
              <button onClick={goToStep2} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded transition-colors">
                Next → Add Line Items
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Line Items & Pricing</h2>
            <p className="text-gray-400 mb-8">Add what you're charging for. Hit 🔍 Check market price for an AI estimate of typical Aussie rates.</p>

            <div className="space-y-3 mb-3">
              {lineItems.map((item, index) => (
                <div key={index}>
                  <div className="flex gap-3">
                    <input type="text" value={item.description} onChange={(e) => { updateLineItem(index, 'description', e.target.value); setErrors({...errors, lineItems: ''}) }} className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" placeholder="e.g. Supply & install Rinnai 26L" />
                    <input type="number" value={item.amount} onChange={(e) => { updateLineItem(index, 'amount', e.target.value); setErrors({...errors, lineItems: ''}) }} className="w-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" placeholder="$ Amount" />
                    <button onClick={() => removeLineItem(index)} className="px-3 text-gray-500 hover:text-red-400 transition-colors">✕</button>
                  </div>

                  <div className="mt-1 ml-1">
                    {!marketCheck[index] && (
                      <button
                        onClick={() => checkMarketPrice(index)}
                        disabled={checkingMarket === index || !item.description.trim()}
                        className="text-xs text-emerald-400 hover:text-emerald-300 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {checkingMarket === index ? '🔍 Checking market...' : '🔍 Check market price'}
                      </button>
                    )}

                    {marketCheck[index] && (() => {
                      const mc = marketCheck[index]
                      const userAmount = parseFloat(item.amount) || 0
                      const isBelow = userAmount > 0 && userAmount < mc.lowPrice
                      const isAbove = userAmount > 0 && userAmount > mc.highPrice
                      const isInRange = userAmount >= mc.lowPrice && userAmount <= mc.highPrice
                      return (
                        <div className="mt-2 p-3 bg-gray-900 border border-emerald-800 rounded text-xs">
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-emerald-400 font-semibold">📊 Market price check</p>
                            <button onClick={() => closeMarketCheck(index)} className="text-gray-500 hover:text-white">✕</button>
                          </div>
                          <p className="text-white mb-1">
                            Typical Aussie range: <span className="font-bold text-emerald-400">${mc.lowPrice.toLocaleString('en-AU')} – ${mc.highPrice.toLocaleString('en-AU')}</span>
                            {mc.unit && <span className="text-gray-500"> ({mc.unit})</span>}
                          </p>
                          {mc.tradeRate && (
                            <p className="text-gray-400 mb-1 text-[11px]">Trade rate: ~${mc.tradeRate}</p>
                          )}
                          {mc.notes && <p className="text-gray-500 text-[11px] leading-relaxed mb-2">{mc.notes}</p>}
                          {userAmount > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-800">
                              {isInRange && <p className="text-emerald-400 text-[11px]">✓ You're priced in the market range. Solid quote.</p>}
                              {isBelow && <p className="text-amber-400 text-[11px]">⚠️ You're below the typical range — could be undercharging.</p>}
                              {isAbove && <p className="text-blue-400 text-[11px]">ℹ️ Above typical range. Make sure the customer sees the value.</p>}
                            </div>
                          )}
                          <p className="text-gray-600 text-[10px] mt-2 italic">AI estimate · {mc.confidence} confidence · verify with your suppliers</p>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              ))}
            </div>

            {errors.lineItems && <p className="text-red-400 text-xs mb-3">{errors.lineItems}</p>}

            <div className="flex flex-wrap gap-3 mb-8">
              <button onClick={addLineItem} className="text-sm text-emerald-400 hover:text-emerald-300">+ Add another line item</button>
              {savedItems.length > 0 ? (
                <>
                  <span className="text-gray-700">·</span>
                  <button onClick={() => setShowPicker(!showPicker)} className="text-sm text-emerald-400 hover:text-emerald-300">
                    ⚡ Add saved item ({savedItems.length})
                  </button>
                </>
              ) : (
                <>
                  <span className="text-gray-700">·</span>
                  <a href="/settings" className="text-sm text-gray-500 hover:text-emerald-400">+ Set up saved items in Settings</a>
                </>
              )}
            </div>

            {showPicker && savedItems.length > 0 && (
              <div className="bg-gray-900 border border-emerald-800 rounded-lg p-4 mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-400">Tap to add to your quote:</p>
                  <button onClick={() => setShowPicker(false)} className="text-gray-500 hover:text-white text-sm">✕ Close</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {savedItems.map((item: any) => (
                    <button
                      key={item.id}
                      onClick={() => addSavedItem(item)}
                      className="flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-emerald-900 hover:border-emerald-500 border border-gray-700 rounded transition-colors text-left"
                    >
                      <span className="text-white text-sm">{item.description}</span>
                      <span className="text-emerald-400 font-semibold text-sm">${parseFloat(item.amount).toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
              <div className="flex justify-between text-gray-400 mb-2"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-400 mb-2"><span>GST (10%)</span><span>${gst.toFixed(2)}</span></div>
              <div className="flex justify-between text-white font-bold text-lg border-t border-gray-700 pt-2"><span>Total (inc. GST)</span><span>${total.toFixed(2)}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 py-3 border border-gray-700 text-gray-400 hover:text-white rounded transition-colors">← Back</button>
              <button onClick={generateQuote} disabled={loading} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded transition-colors disabled:opacity-30">
                {loading ? '🤖 AI is writing your quote...' : '✨ Generate Quote with AI'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && generatedQuote && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Your Quote is Ready!</h2>
            <p className="text-gray-400 mb-2">Click any text below to edit it before sending.</p>
            <p className="text-gray-500 text-sm mb-8">The AI is good but not perfect — make it your own.</p>

            {saved && (
              <div className="bg-emerald-900 border border-emerald-700 rounded-lg p-4 mb-6 text-emerald-300 text-sm">
                ✅ Quote saved! Now send it to your customer or download a PDF.
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
                {form.jobAddress && <p className="text-gray-500 text-sm">{form.jobAddress}</p>}
              </div>

              {editingField === 'greeting' ? (
                <textarea
                  autoFocus
                  value={generatedQuote.greeting}
                  onChange={(e) => updateQuoteField('greeting', e.target.value)}
                  onBlur={() => setEditingField(null)}
                  rows={3}
                  className="w-full mb-6 p-2 border border-emerald-500 rounded text-gray-700"
                />
              ) : (
                <p onClick={() => setEditingField('greeting')} className="mb-6 text-gray-700 hover:bg-gray-50 cursor-pointer p-2 -m-2 rounded">{generatedQuote.greeting}</p>
              )}

              <div className="mb-6">
                <h4 className="font-bold mb-2">Scope of Work</h4>
                {editingField === 'scopeOfWork' ? (
                  <textarea
                    autoFocus
                    value={generatedQuote.scopeOfWork}
                    onChange={(e) => updateQuoteField('scopeOfWork', e.target.value)}
                    onBlur={() => setEditingField(null)}
                    rows={4}
                    className="w-full p-2 border border-emerald-500 rounded text-gray-700"
                  />
                ) : (
                  <p onClick={() => setEditingField('scopeOfWork')} className="text-gray-700 hover:bg-gray-50 cursor-pointer p-2 -m-2 rounded">{generatedQuote.scopeOfWork}</p>
                )}
              </div>

              <div className="mb-6">
                <h4 className="font-bold mb-2">What's Included</h4>
                <ul className="space-y-1">
                  {generatedQuote.inclusions?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 group">
                      <span className="text-gray-500 mt-1">•</span>
                      <input
                        value={item}
                        onChange={(e) => updateInclusion(i, e.target.value)}
                        className="flex-1 text-gray-700 bg-transparent hover:bg-gray-50 rounded p-1 -m-1 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <button onClick={() => removeInclusion(i)} className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    </li>
                  ))}
                </ul>
                <button onClick={addInclusion} className="text-xs text-emerald-600 hover:text-emerald-700 mt-2">+ Add inclusion</button>
              </div>

              <div className="mb-6">
                <h4 className="font-bold mb-2">Exclusions</h4>
                <ul className="space-y-1">
                  {generatedQuote.exclusions?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 group">
                      <span className="text-gray-500 mt-1">•</span>
                      <input
                        value={item}
                        onChange={(e) => updateExclusion(i, e.target.value)}
                        className="flex-1 text-gray-700 bg-transparent hover:bg-gray-50 rounded p-1 -m-1 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <button onClick={() => removeExclusion(i)} className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    </li>
                  ))}
                </ul>
                <button onClick={addExclusion} className="text-xs text-emerald-600 hover:text-emerald-700 mt-2">+ Add exclusion</button>
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
                {editingField === 'terms' ? (
                  <textarea
                    autoFocus
                    value={generatedQuote.terms}
                    onChange={(e) => updateQuoteField('terms', e.target.value)}
                    onBlur={() => setEditingField(null)}
                    rows={4}
                    className="w-full p-2 border border-emerald-500 rounded text-gray-700 text-sm"
                  />
                ) : (
                  <p onClick={() => setEditingField('terms')} className="text-gray-700 text-sm hover:bg-gray-50 cursor-pointer p-2 -m-2 rounded">{generatedQuote.terms}</p>
                )}
              </div>

              <p className="text-gray-600 text-sm italic">Quote valid for {generatedQuote.validityPeriod}</p>

              {editingField === 'closingMessage' ? (
                <textarea
                  autoFocus
                  value={generatedQuote.closingMessage}
                  onChange={(e) => updateQuoteField('closingMessage', e.target.value)}
                  onBlur={() => setEditingField(null)}
                  rows={3}
                  className="w-full mt-4 p-2 border border-emerald-500 rounded text-gray-700"
                />
              ) : (
                <p onClick={() => setEditingField('closingMessage')} className="mt-4 text-gray-700 hover:bg-gray-50 cursor-pointer p-2 -m-2 rounded">{generatedQuote.closingMessage}</p>
              )}
            </div>

            <div className="flex gap-3 flex-wrap">
              <button onClick={() => { setGeneratedQuote(null); setSaved(false); setSavedQuoteId(null); setStep(2) }} className="px-6 py-3 border border-gray-700 text-gray-400 hover:text-white rounded transition-colors">← Edit</button>
              <button onClick={generateQuote} disabled={loading} className="px-6 py-3 border border-emerald-700 text-emerald-400 hover:bg-emerald-900 rounded transition-colors">
                {loading ? 'Regenerating...' : '🔄 Regenerate'}
              </button>
              <button onClick={downloadPDF} className="px-6 py-3 border border-gray-700 text-white hover:bg-gray-800 rounded transition-colors">
                📄 Download PDF
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