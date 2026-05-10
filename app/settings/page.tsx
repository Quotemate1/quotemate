'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [savedItems, setSavedItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newItem, setNewItem] = useState({ description: '', amount: '' })
  const [adding, setAdding] = useState(false)

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

    await loadSavedItems(biz.id)
    setLoading(false)
  }

  const loadSavedItems = async (businessId: string) => {
    const { data } = await supabase
      .from('saved_line_items')
      .select('*')
      .eq('business_id', businessId)
      .order('description', { ascending: true })
    if (data) setSavedItems(data)
  }

  const addItem = async () => {
    if (!newItem.description.trim() || !newItem.amount) return
    setAdding(true)
    const { error } = await supabase
      .from('saved_line_items')
      .insert({
        business_id: business.id,
        description: newItem.description.trim(),
        amount: parseFloat(newItem.amount),
      })
    if (error) {
      alert('Error: ' + error.message)
    } else {
      setNewItem({ description: '', amount: '' })
      await loadSavedItems(business.id)
    }
    setAdding(false)
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this saved item?')) return
    const { error } = await supabase
      .from('saved_line_items')
      .delete()
      .eq('id', id)
    if (error) {
      alert('Error: ' + error.message)
    } else {
      await loadSavedItems(business.id)
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
        <a href="/dashboard" className="text-xl font-bold text-white">SmokoHQ</a>
        <a href="/dashboard" className="text-sm text-gray-400 hover:text-white">← Dashboard</a>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Saved Line Items</h1>
        <p className="text-gray-400 mb-8">Save your common items once, then tap to add them to any quote. No more retyping "Service call $150" or "Hourly rate $120".</p>

        {/* Add new item */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-sm text-gray-400 uppercase tracking-wider mb-4">Add Saved Item</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Hourly rate"
            />
            <input
              type="number"
              value={newItem.amount}
              onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
              className="w-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              placeholder="$ Amount"
            />
            <button
              onClick={addItem}
              disabled={adding || !newItem.description.trim() || !newItem.amount}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {adding ? 'Adding...' : '+ Add'}
            </button>
          </div>
        </div>

        {/* List of saved items */}
        <div>
          <h2 className="text-sm text-gray-400 uppercase tracking-wider mb-4">Your Saved Items ({savedItems.length})</h2>

          {savedItems.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
              <p className="text-gray-400 mb-2">No saved items yet.</p>
              <p className="text-gray-500 text-sm">Add common items above to speed up your quoting.</p>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              {savedItems.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between px-6 py-4 border-b border-gray-800 last:border-b-0">
                  <div className="flex-1">
                    <p className="text-white">{item.description}</p>
                  </div>
                  <p className="text-white font-semibold mr-6">${parseFloat(item.amount).toFixed(2)}</p>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-gray-900 border border-gray-800 rounded-lg">
          <p className="text-sm text-gray-400">💡 <strong className="text-white">Tip:</strong> Add items like "Service call", "Hourly rate", "Travel fee", or common parts you charge for. They'll show up as 1-tap buttons on the quote creation page.</p>
        </div>
      </main>
    </div>
  )
}