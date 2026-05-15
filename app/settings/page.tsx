'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { TRADE_TEMPLATES } from '../lib/templates'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newDesc, setNewDesc] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [adding, setAdding] = useState(false)
  const [loadingTemplate, setLoadingTemplate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDesc, setEditDesc] = useState('')
  const [editAmount, setEditAmount] = useState('')

  useEffect(() => { init() }, [])

  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    setUser(user)
    const { data: biz } = await supabase.from('businesses').select('*').eq('user_id', user.id).single()
    if (!biz) { window.location.href = '/onboarding'; return }
    setBusiness(biz)
    await loadItems(biz.id)
    setLoading(false)
  }

  const loadItems = async (businessId: string) => {
    const { data } = await supabase.from('saved_line_items').select('*').eq('business_id', businessId).order('description', { ascending: true })
    if (data) setItems(data)
  }

  const addItem = async () => {
    if (!newDesc.trim() || !newAmount || !business) return
    setAdding(true)
    await supabase.from('saved_line_items').insert({
      business_id: business.id, description: newDesc.trim(), amount: parseFloat(newAmount),
    })
    setNewDesc('')
    setNewAmount('')
    await loadItems(business.id)
    setAdding(false)
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this saved line item?')) return
    await supabase.from('saved_line_items').delete().eq('id', id)
    await loadItems(business.id)
  }

  const startEdit = (item: any) => {
    setEditingId(item.id)
    setEditDesc(item.description)
    setEditAmount(item.amount.toString())
  }
  const cancelEdit = () => { setEditingId(null); setEditDesc(''); setEditAmount('') }
  const saveEdit = async (id: string) => {
    if (!editDesc.trim() || !editAmount) return
    await supabase.from('saved_line_items').update({ description: editDesc.trim(), amount: parseFloat(editAmount) }).eq('id', id)
    setEditingId(null)
    setEditDesc('')
    setEditAmount('')
    await loadItems(business.id)
  }

  const loadTemplate = async () => {
    if (!business) return
    const tradeKey = business.trade_type || 'plumber'
    const template = TRADE_TEMPLATES[tradeKey]
    if (!template) { alert('No template available for your trade type. Add items manually below.'); return }
    const confirmed = confirm('Load ' + template.length + ' pre-built items for ' + tradeKey + '?\n\nThese are common Australian rates - you can edit or delete any after they are loaded.')
    if (!confirmed) return
    setLoadingTemplate(true)
    const itemsToInsert = template.map(item => ({ business_id: business.id, description: item.description, amount: item.amount }))
    await supabase.from('saved_line_items').insert(itemsToInsert)
    await loadItems(business.id)
    setLoadingTemplate(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <p className="text-stone-400">Loading...</p>
      </div>
    )
  }

  const hasTemplate = business?.trade_type && TRADE_TEMPLATES[business.trade_type]

  return (
    <div className="min-h-screen bg-stone-950">
      <nav className="border-b border-stone-800 bg-stone-900 px-6 py-4 flex items-center justify-between">
        <a href="/dashboard" className="text-xl font-bold text-white">SmokoHQ</a>
        <a href="/dashboard" className="text-sm text-stone-400 hover:text-white">Back to Dashboard</a>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-stone-400 mb-10">Manage your saved line items - common things you charge for that auto-load on quotes.</p>

        {items.length === 0 && hasTemplate && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⚡</div>
              <div className="flex-1">
                <h3 className="text-white font-bold mb-1">Get started fast with a template</h3>
                <p className="text-stone-400 text-sm mb-4">
                  Load {TRADE_TEMPLATES[business.trade_type].length} common line items for <strong className="text-emerald-400 capitalize">{business.trade_type}s</strong>.
                  These are typical Australian rates - edit or delete any after loading.
                </p>
                <button onClick={loadTemplate} disabled={loadingTemplate} className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20">
                  {loadingTemplate ? 'Loading...' : 'Load ' + business.trade_type + ' template'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Add a new saved item</h2>
          <div className="flex gap-3 flex-wrap">
            <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="flex-1 min-w-[200px] px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500" placeholder="e.g. Service call (first hour)" />
            <input type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} className="w-32 px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500" placeholder="$ Amount" />
            <button onClick={addItem} disabled={adding || !newDesc.trim() || !newAmount} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-colors disabled:opacity-30 shadow-lg shadow-emerald-500/20">
              {adding ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>

        <h2 className="text-lg font-bold text-white mb-4">Your saved items ({items.length})</h2>

        {items.length === 0 ? (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center">
            <p className="text-stone-400 mb-2">No saved items yet.</p>
            <p className="text-stone-500 text-sm">{hasTemplate ? 'Load a template above or add items manually.' : 'Add items above to speed up your quotes.'}</p>
          </div>
        ) : (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
            {items.map((item: any) => (
              <div key={item.id} className="border-b border-stone-800 last:border-b-0">
                {editingId === item.id ? (
                  <div className="p-4 bg-stone-800">
                    <div className="flex gap-3 flex-wrap mb-3">
                      <input type="text" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="flex-1 min-w-[200px] px-3 py-2 bg-stone-900 border border-emerald-500 rounded-xl text-white focus:outline-none" placeholder="Description" autoFocus />
                      <input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="w-32 px-3 py-2 bg-stone-900 border border-emerald-500 rounded-xl text-white focus:outline-none" placeholder="$ Amount" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(item.id)} disabled={!editDesc.trim() || !editAmount} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-full transition-colors disabled:opacity-30">Save</button>
                      <button onClick={cancelEdit} className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white text-sm rounded-full transition-colors">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => startEdit(item)} className="flex items-center justify-between px-6 py-4 hover:bg-stone-800 cursor-pointer transition-colors group">
                    <div className="flex-1">
                      <p className="text-white">{item.description}</p>
                      <p className="text-xs text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity">Click to edit</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-emerald-400 font-semibold">${parseFloat(item.amount).toFixed(2)}</span>
                      <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id) }} className="text-stone-500 hover:text-red-400 transition-colors">x</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && hasTemplate && (
          <div className="mt-8 text-center">
            <button onClick={loadTemplate} disabled={loadingTemplate} className="text-sm text-emerald-400 hover:text-emerald-300 underline">
              {loadingTemplate ? 'Loading...' : '+ Add ' + business.trade_type + ' template items (will add duplicates)'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}