'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (isSignUp) {
      if (!agreedToTerms) {
        setMessage('You must agree to the Terms of Service and Privacy Policy to sign up.')
        setLoading(false)
        return
      }
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Check your email to confirm your account!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else window.location.href = '/onboarding'
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-white mb-2">SmokoHQ</h1>
          </a>
          <p className="text-stone-400">We chase the money for you.</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8">
          <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full mb-4 tracking-wide uppercase">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </div>
          <h2 className="text-xl font-bold text-white mb-6">
            {isSignUp ? 'Start your free trial' : 'Sign in to your account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-stone-400 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500" placeholder="you@example.com" required />
            </div>

            <div>
              <label className="block text-sm text-stone-400 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500" placeholder="••••••••" required minLength={6} />
            </div>

            {isSignUp && (
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 w-4 h-4 rounded border-stone-700 bg-stone-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-stone-900 cursor-pointer" />
                  <span className="text-sm text-stone-400 leading-relaxed group-hover:text-stone-300">
                    I agree to the{' '}
                    <a href="/terms" target="_blank" className="text-emerald-400 hover:text-emerald-300 underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" target="_blank" className="text-emerald-400 hover:text-emerald-300 underline">Privacy Policy</a>.
                  </span>
                </label>
              </div>
            )}

            <button type="submit" disabled={loading || (isSignUp && !agreedToTerms)} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20">
              {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-center text-amber-400">{message}</p>
          )}

          <p className="mt-6 text-center text-sm text-stone-500">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => { setIsSignUp(!isSignUp); setMessage(''); setAgreedToTerms(false) }} className="text-emerald-400 hover:text-emerald-300 font-semibold">
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-stone-600 mt-6">
          <a href="/" className="hover:text-stone-400">Back to home</a>
        </p>
      </div>
    </div>
  )
}