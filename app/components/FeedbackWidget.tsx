'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('general')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  if (!user) return null

  const handleSubmit = async () => {
    if (!message.trim()) return
    setSending(true)

    const { error } = await supabase.from('feedback').insert({
      user_id: user.id,
      user_email: user.email,
      type: type,
      message: message,
      page_url: window.location.pathname,
    })

    if (!error) {
      setSent(true)
      setTimeout(() => {
        setMessage('')
        setOpen(false)
        setSent(false)
      }, 2000)
    }
    setSending(false)
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg z-40 text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          💬 Feedback
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-5 w-80 z-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Send Feedback</h3>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
          </div>

          {sent ? (
            <div className="text-center py-4">
              <p className="text-emerald-400 font-semibold">✓ Thanks for your feedback!</p>
              <p className="text-gray-500 text-xs mt-1">We read every message.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-400 mb-3">Bug? Feature request? Just want to say g'day? Hit us up.</p>

              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setType('bug')}
                  className={`flex-1 text-xs py-2 rounded transition-colors ${type === 'bug' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >
                  🐛 Bug
                </button>
                <button
                  onClick={() => setType('feature')}
                  className={`flex-1 text-xs py-2 rounded transition-colors ${type === 'feature' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >
                  💡 Idea
                </button>
                <button
                  onClick={() => setType('general')}
                  className={`flex-1 text-xs py-2 rounded transition-colors ${type === 'general' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >
                  💬 Other
                </button>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="What's on your mind?"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-sm resize-none mb-3"
              />

              <button
                onClick={handleSubmit}
                disabled={sending || !message.trim()}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded transition-colors disabled:opacity-50 text-sm"
              >
                {sending ? 'Sending...' : 'Send Feedback'}
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}