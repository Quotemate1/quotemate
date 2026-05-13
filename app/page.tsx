'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold">SmokoHQ</span>
        <div className="flex gap-6 text-sm items-center">
          <a href="/blog" className="text-gray-400 hover:text-white">Blog</a>
          <a href="/pricing" className="text-gray-400 hover:text-white">Pricing</a>
          <a href="/login" className="text-emerald-400 hover:text-emerald-300">Login</a>
        </div>
      </nav>

      <main>

        <section className="px-8 py-16 md:py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

            <div>
              <div className="inline-block px-3 py-1 bg-emerald-900 text-emerald-400 text-xs font-semibold rounded-full mb-6 tracking-wide uppercase">
                Built in Australia, for Aussie tradies
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                You take your smoko.<br />
                <span className="text-emerald-400">We'll handle the quotes.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
                AI-powered quoting, auto follow-ups, and quote tracking for Aussie tradies. Built so you can spend less time on admin and more time on the tools.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/login" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded transition-colors">
                  Start Free Trial →
                </Link>
                <Link href="/pricing" className="px-8 py-4 border border-gray-700 hover:border-emerald-500 text-white font-semibold rounded transition-colors">
                  See Pricing
                </Link>
              </div>
              <p className="text-sm text-gray-500 mt-4">7-day free trial · No credit card · Cancel anytime</p>
            </div>

            <div className="hidden md:flex justify-center items-center relative">
              <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full"></div>
              <PhoneMockup />
            </div>
          </div>
        </section>

        <section className="border-t border-gray-800 py-24 px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">Quotes that win jobs, not eat your nights.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-xl font-bold mb-2">60-second quotes</h3>
                <p className="text-gray-400 leading-relaxed">Type a few words about the job. The AI writes the scope, GST breakdown, T&Cs and everything else — professional, every time.</p>
              </div>
              <div>
                <div className="text-4xl mb-3">📧</div>
                <h3 className="text-xl font-bold mb-2">Auto follow-ups</h3>
                <p className="text-gray-400 leading-relaxed">Customers ghost you? We chase them automatically at 48 hours and 5 days. Win the jobs you'd otherwise lose.</p>
              </div>
              <div>
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-xl font-bold mb-2">Quote tracking</h3>
                <p className="text-gray-400 leading-relaxed">See your conversion rate, revenue won, and which quotes are still open — all in one dashboard.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-800 py-24 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="inline-block px-3 py-1 bg-emerald-900 text-emerald-400 text-xs font-semibold rounded-full mb-4 tracking-wide uppercase">
              What tradies are saying
            </div>
            <h2 className="text-3xl font-bold mb-12">Built by tradies who'd rather be on the tools.</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col">
                <div className="flex gap-1 mb-4 text-emerald-400 text-lg">★★★★★</div>
                <p className="text-gray-300 mb-6 flex-1 leading-relaxed">
                  "Used to spend an hour every night writing quotes. Now I do them in 60 seconds on my smoko break.
                  Won 3 jobs last week from the auto follow-up alone — customers I would've forgotten about."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-400 font-bold">DM</div>
                  <div>
                    <p className="text-white text-sm font-semibold">Dave M.</p>
                    <p className="text-gray-500 text-xs">Plumber · Sydney</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col">
                <div className="flex gap-1 mb-4 text-emerald-400 text-lg">★★★★★</div>
                <p className="text-gray-300 mb-6 flex-1 leading-relaxed">
                  "The auto follow-ups are the real game changer. Half my customers used to ghost me after I sent a quote.
                  Now I'm winning jobs I would have lost. SmokoHQ pays for itself ten times over."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-400 font-bold">JT</div>
                  <div>
                    <p className="text-white text-sm font-semibold">Jamie T.</p>
                    <p className="text-gray-500 text-xs">Electrician · Brisbane</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col">
                <div className="flex gap-1 mb-4 text-emerald-400 text-lg">★★★★★</div>
                <p className="text-gray-300 mb-6 flex-1 leading-relaxed">
                  "My quotes look way more professional now. Customers always comment on it. Closing rate went from
                  about 40% to nearly 70% — the AI just writes them better than I do."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-400 font-bold">SK</div>
                  <div>
                    <p className="text-white text-sm font-semibold">Steve K.</p>
                    <p className="text-gray-500 text-xs">Carpenter · Melbourne</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col">
                <div className="flex gap-1 mb-4 text-emerald-400 text-lg">★★★★★</div>
                <p className="text-gray-300 mb-6 flex-1 leading-relaxed">
                  "Was sceptical about AI doing my quotes but it's actually really good. Captures the details I would've
                  forgotten. The PDF download is mint — customers love it."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-400 font-bold">MR</div>
                  <div>
                    <p className="text-white text-sm font-semibold">Matt R.</p>
                    <p className="text-gray-500 text-xs">Painter · Perth</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col">
                <div className="flex gap-1 mb-4 text-emerald-400 text-lg">★★★★★</div>
                <p className="text-gray-300 mb-6 flex-1 leading-relaxed">
                  "Saved line items are a lifesaver. I do the same 5 things every day — service call, hourly rate, after-hours.
                  Now I just tap and they're in. Quote done before I leave the driveway."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-400 font-bold">AC</div>
                  <div>
                    <p className="text-white text-sm font-semibold">Andy C.</p>
                    <p className="text-gray-500 text-xs">HVAC · Gold Coast</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col">
                <div className="flex gap-1 mb-4 text-emerald-400 text-lg">★★★★★</div>
                <p className="text-gray-300 mb-6 flex-1 leading-relaxed">
                  "The dashboard showing my conversion rate was a wake-up call. I was losing 60% of jobs and didn't even know.
                  Now I can actually see what's working. Solid bit of kit."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-400 font-bold">RW</div>
                  <div>
                    <p className="text-white text-sm font-semibold">Ryan W.</p>
                    <p className="text-gray-500 text-xs">Tiler · Adelaide</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-gray-800 pt-12">
              <div>
                <div className="text-3xl font-bold text-emerald-400 mb-1">60 sec</div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Avg time to send a quote</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400 mb-1">2.5x</div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">More quotes won per month</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400 mb-1">$0</div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Spent on unpaid admin time</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400 mb-1">7 days</div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Free trial · cancel anytime</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-800 py-24 px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Built for every trade</h2>
            <div className="flex flex-wrap gap-3">
              {['Plumbers', 'Electricians', 'Builders', 'Painters', 'Carpenters', 'Landscapers', 'Tilers', 'Roofers', 'Concreters', 'Fencers', 'Cleaners', 'HVAC'].map(trade => (
                <span key={trade} className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-full text-sm text-gray-300">{trade}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-gray-800 py-24 px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Pricing that pays for itself.</h2>
            <p className="text-gray-400 mb-12">Win one extra job and SmokoHQ pays for itself 10x over.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                <h3 className="text-xl font-bold mb-1">Starter</h3>
                <div className="mb-4"><span className="text-3xl font-bold">$59</span><span className="text-gray-400">/mo AUD</span></div>
                <ul className="space-y-2 text-sm text-gray-400 mb-6">
                  <li className="flex gap-2"><span className="text-emerald-400">✓</span>20 AI quotes per month</li>
                  <li className="flex gap-2"><span className="text-emerald-400">✓</span>Professional PDF quotes</li>
                  <li className="flex gap-2"><span className="text-emerald-400">✓</span>GST auto-calculated</li>
                  <li className="flex gap-2"><span className="text-emerald-400">✓</span>Email delivery</li>
                </ul>
                <Link href="/pricing" className="block text-center py-3 border border-emerald-500 text-emerald-400 rounded font-semibold hover:bg-emerald-900 transition-colors">Start Free Trial</Link>
              </div>

              <div className="bg-gray-900 border-2 border-emerald-500 rounded-lg p-8 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
                <h3 className="text-xl font-bold mb-1">Pro</h3>
                <div className="mb-4"><span className="text-3xl font-bold">$99</span><span className="text-gray-400">/mo AUD</span></div>
                <ul className="space-y-2 text-sm text-gray-400 mb-6">
                  <li className="flex gap-2"><span className="text-emerald-400">✓</span>Unlimited AI quotes</li>
                  <li className="flex gap-2"><span className="text-emerald-400">✓</span>Auto follow-up emails</li>
                  <li className="flex gap-2"><span className="text-emerald-400">✓</span>Quote open tracking</li>
                  <li className="flex gap-2"><span className="text-emerald-400">✓</span>Priority support</li>
                </ul>
                <Link href="/pricing" className="block text-center py-3 bg-emerald-500 text-white rounded font-semibold hover:bg-emerald-600 transition-colors">Start Free Trial</Link>
              </div>

            </div>
          </div>
        </section>

        <section className="border-t border-gray-800 py-24 px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">You handle the tools.<br />We'll handle the quotes.</h2>
            <p className="text-xl text-gray-400 mb-10">Join tradies across Australia who are winning more work with SmokoHQ — without spending another evening on admin.</p>
            <Link href="/login" className="inline-block px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded transition-colors">
              Start Your Free Trial →
            </Link>
            <p className="text-sm text-gray-600 mt-4">7-day free trial · No credit card · Cancel anytime</p>
          </div>
        </section>

      </main>

      <footer className="border-t border-gray-800 py-10 px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-600">© 2026 SmokoHQ. Built in Australia for Australian tradies.</span>
          <div className="flex gap-6 text-sm">
            <Link href="/blog" className="text-gray-500 hover:text-gray-300">Blog</Link>
            <Link href="/pricing" className="text-gray-500 hover:text-gray-300">Pricing</Link>
            <Link href="/privacy" className="text-gray-500 hover:text-gray-300">Privacy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-300">Terms</Link>
            <Link href="/login" className="text-gray-500 hover:text-gray-300">Sign In</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}

function PhoneMockup() {
  const [phase, setPhase] = useState<'details' | 'lineitems' | 'generating' | 'preview' | 'sent' | 'customer' | 'accepted'>('details')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [visibleItems, setVisibleItems] = useState<number>(0)

  useEffect(() => {
    let mounted = true

    const type = async (text: string, setter: (v: string) => void, speed = 35) => {
      for (let i = 0; i <= text.length; i++) {
        if (!mounted) return
        setter(text.slice(0, i))
        await new Promise(r => setTimeout(r, speed))
      }
    }

    const wait = (ms: number) => new Promise(r => setTimeout(r, ms))

    const cycle = async () => {
      while (mounted) {
        setPhase('details')
        setCustomerName('')
        setCustomerEmail('')
        setCustomerPhone('')
        setJobDesc('')
        await wait(400)

        await type('John Smith', setCustomerName, 50)
        await wait(200)
        await type('john@email.com', setCustomerEmail, 35)
        await wait(200)
        await type('0412 345 678', setCustomerPhone, 40)
        await wait(200)
        await type('Replace hot water system. Rinnai 26L continuous flow.', setJobDesc, 30)
        await wait(800)

        if (!mounted) return
        setPhase('lineitems')
        setVisibleItems(0)
        await wait(500)
        for (let i = 1; i <= 4; i++) {
          if (!mounted) return
          setVisibleItems(i)
          await wait(600)
        }
        await wait(1000)

        if (!mounted) return
        setPhase('generating')
        await wait(2200)

        if (!mounted) return
        setPhase('preview')
        await wait(3500)

        if (!mounted) return
        setPhase('sent')
        await wait(2200)

        if (!mounted) return
        setPhase('customer')
        await wait(3500)

        if (!mounted) return
        setPhase('accepted')
        await wait(2500)
      }
    }

    cycle()
    return () => { mounted = false }
  }, [])

  const lineItems = [
    { desc: 'Supply Rinnai 26L', amount: '$2,450' },
    { desc: 'Installation labour', amount: '$440' },
    { desc: 'Gas conversion', amount: '$180' },
    { desc: 'Removal of old unit', amount: '$120' },
  ]

  const isCustomerView = phase === 'customer' || phase === 'accepted'

  return (
    <div className="relative z-10" style={{ transform: 'rotate(-3deg)' }}>
      <div className="relative w-[280px] h-[580px] bg-black rounded-[44px] p-3 shadow-2xl border-[3px] border-gray-700">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-2xl z-20 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div>
          <div className="w-12 h-1.5 rounded-full bg-gray-800"></div>
        </div>

        <div className={`relative w-full h-full rounded-[36px] overflow-hidden transition-colors duration-500 ${isCustomerView ? 'bg-gray-100' : 'bg-gray-950'}`}>
          <div className={`flex justify-between items-center px-6 pt-3 text-[10px] ${isCustomerView ? 'text-gray-900' : 'text-white'}`}>
            <span className="font-semibold">9:41</span>
            <span className="text-emerald-500">●●●●</span>
          </div>

          {!isCustomerView ? (
            <div className="px-4 pt-5 pb-3 border-b border-gray-800">
              <p className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">SmokoHQ</p>
              <p className="text-white text-sm font-bold mt-1">
                {phase === 'details' && 'New Quote · Step 1 of 3'}
                {phase === 'lineitems' && 'New Quote · Step 2 of 3'}
                {phase === 'generating' && 'AI is working...'}
                {phase === 'preview' && 'Quote Preview'}
                {phase === 'sent' && 'Quote Sent'}
              </p>
            </div>
          ) : (
            <div className="px-4 pt-5 pb-3 border-b border-gray-300 bg-white">
              <p className="text-gray-500 text-[10px] uppercase tracking-wider">📧 john@email.com</p>
              <p className="text-gray-900 text-sm font-bold mt-1">Quote from Smith's Plumbing</p>
            </div>
          )}

          <div className="p-3 h-[calc(100%-90px)] overflow-hidden">

            {phase === 'details' && (
              <div className="space-y-2 animate-fadeIn">
                <div>
                  <p className="text-[8px] text-gray-500 uppercase tracking-wider mb-1">Customer Name</p>
                  <div className="bg-gray-900 border border-gray-700 rounded px-2 py-1.5">
                    <p className="text-white text-[10px]">{customerName}<span className={`inline-block w-0.5 h-2.5 bg-emerald-400 ml-0.5 ${customerName.length < 'John Smith'.length ? 'animate-pulse' : 'hidden'}`}></span></p>
                  </div>
                </div>
                <div>
                  <p className="text-[8px] text-gray-500 uppercase tracking-wider mb-1">Customer Email</p>
                  <div className="bg-gray-900 border border-gray-700 rounded px-2 py-1.5">
                    <p className="text-white text-[10px]">{customerEmail}<span className={`inline-block w-0.5 h-2.5 bg-emerald-400 ml-0.5 ${customerEmail.length > 0 && customerEmail.length < 'john@email.com'.length ? 'animate-pulse' : 'hidden'}`}></span></p>
                  </div>
                </div>
                <div>
                  <p className="text-[8px] text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                  <div className="bg-gray-900 border border-gray-700 rounded px-2 py-1.5">
                    <p className="text-white text-[10px]">{customerPhone}<span className={`inline-block w-0.5 h-2.5 bg-emerald-400 ml-0.5 ${customerPhone.length > 0 && customerPhone.length < '0412 345 678'.length ? 'animate-pulse' : 'hidden'}`}></span></p>
                  </div>
                </div>
                <div>
                  <p className="text-[8px] text-gray-500 uppercase tracking-wider mb-1">Job Description</p>
                  <div className="bg-gray-900 border border-emerald-500 rounded px-2 py-1.5 min-h-[36px]">
                    <p className="text-white text-[10px] leading-relaxed">{jobDesc}<span className={`inline-block w-0.5 h-2.5 bg-emerald-400 ml-0.5 ${jobDesc.length > 0 && jobDesc.length < 53 ? 'animate-pulse' : 'hidden'}`}></span></p>
                  </div>
                </div>
              </div>
            )}

            {phase === 'lineitems' && (
              <div className="animate-fadeIn">
                <p className="text-[8px] text-gray-500 uppercase tracking-wider mb-2">Pricing</p>
                <div className="space-y-1.5">
                  {lineItems.slice(0, visibleItems).map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-900 border border-gray-800 rounded px-2 py-2 animate-slideIn">
                      <span className="text-white text-[10px]">{item.desc}</span>
                      <span className="text-emerald-400 text-[10px] font-bold">{item.amount}</span>
                    </div>
                  ))}
                </div>
                {visibleItems === 4 && (
                  <div className="mt-3 pt-2 border-t border-gray-800 animate-fadeIn">
                    <div className="flex justify-between text-[9px] text-gray-500 mb-1">
                      <span>Subtotal</span><span>$3,190</span>
                    </div>
                    <div className="flex justify-between text-[9px] text-gray-500 mb-1">
                      <span>GST (10%)</span><span>$319</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-white font-bold mt-1.5 pt-1.5 border-t border-gray-800">
                      <span>Total</span><span className="text-emerald-400">$3,509</span>
                    </div>
                  </div>
                )}
                <button className="w-full mt-3 py-2 bg-emerald-500 text-white text-[10px] font-bold rounded">
                  ✨ Generate with AI
                </button>
              </div>
            )}

            {phase === 'generating' && (
              <div className="flex flex-col items-center justify-center h-full animate-fadeIn">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
                </div>
                <p className="text-white text-xs font-semibold mb-1">AI is writing...</p>
                <p className="text-gray-500 text-[10px] text-center">Generating scope, T&Cs, GST...</p>
              </div>
            )}

            {phase === 'preview' && (
              <div className="bg-white rounded p-2.5 text-gray-900 animate-fadeIn">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="text-[8px] font-bold text-emerald-600">QUOTE #SHQ-4821</p>
                    <p className="text-[9px] font-bold mt-0.5">Smith's Plumbing</p>
                  </div>
                  <p className="text-[7px] text-gray-500">13/05/2026</p>
                </div>
                <div className="border-t my-1.5 border-gray-200"></div>
                <p className="text-[7px] text-gray-500">FOR:</p>
                <p className="text-[8px] font-semibold">John Smith</p>
                <p className="text-[7px] text-gray-600 leading-snug mt-1.5 mb-1.5">
                  G'day John, please find attached the quote for hot water replacement we discussed...
                </p>
                <div className="bg-gray-50 rounded p-1.5 mb-1.5">
                  <div className="flex justify-between text-[7px]">
                    <span className="text-gray-600">Supply Rinnai 26L</span>
                    <span className="font-semibold">$2,450</span>
                  </div>
                  <div className="flex justify-between text-[7px] mt-0.5">
                    <span className="text-gray-600">Installation labour</span>
                    <span className="font-semibold">$440</span>
                  </div>
                  <div className="flex justify-between text-[7px] mt-0.5">
                    <span className="text-gray-600">Gas conversion</span>
                    <span className="font-semibold">$180</span>
                  </div>
                  <div className="flex justify-between text-[7px] mt-0.5">
                    <span className="text-gray-600">Removal of old unit</span>
                    <span className="font-semibold">$120</span>
                  </div>
                  <div className="border-t border-gray-200 my-1"></div>
                  <div className="flex justify-between text-[7px] text-gray-500">
                    <span>GST (10%)</span><span>$319</span>
                  </div>
                  <div className="flex justify-between text-[9px] font-bold mt-0.5">
                    <span>Total</span>
                    <span className="text-emerald-600">$3,509</span>
                  </div>
                </div>
                <button className="w-full bg-emerald-500 text-white text-[8px] font-bold py-1.5 rounded">
                  📧 Send to Customer →
                </button>
              </div>
            )}

            {phase === 'sent' && (
              <div className="flex flex-col items-center justify-center h-full animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 animate-scaleIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white text-2xl">
                    ✓
                  </div>
                </div>
                <p className="text-white text-xs font-bold mb-1">Quote sent!</p>
                <p className="text-gray-500 text-[10px] text-center mb-3">john@email.com</p>
                <div className="bg-gray-900 border border-gray-800 rounded p-2 w-full">
                  <p className="text-[9px] text-emerald-400 font-semibold">⏱ Auto follow-up scheduled</p>
                  <p className="text-[8px] text-gray-500 mt-0.5">In 48 hours if no response</p>
                </div>
              </div>
            )}

            {phase === 'customer' && (
              <div className="animate-fadeIn">
                <div className="bg-white rounded p-2.5 text-gray-900 shadow-sm border border-gray-200">
                  <div className="bg-gray-900 -mx-2.5 -mt-2.5 px-2.5 py-2 rounded-t mb-2">
                    <p className="text-emerald-400 text-[8px] font-bold uppercase tracking-wider">QUOTE</p>
                    <p className="text-white text-[10px] font-bold">Smith's Plumbing</p>
                  </div>
                  <p className="text-[7px] text-gray-500">QUOTE PREPARED FOR</p>
                  <p className="text-[8px] font-semibold mb-1.5">John Smith</p>

                  <p className="text-[7px] text-emerald-600 font-bold uppercase tracking-wider mb-0.5">SCOPE OF WORK</p>
                  <p className="text-[7px] text-gray-600 leading-snug mb-2">
                    Supply and install new Rinnai 26L continuous flow gas system...
                  </p>

                  <div className="bg-gray-50 rounded p-1.5 mb-2">
                    <div className="flex justify-between text-[8px] font-bold">
                      <span>Total</span>
                      <span className="text-emerald-600">$3,509</span>
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    <button className="flex-1 bg-emerald-500 text-white text-[8px] font-bold py-1.5 rounded animate-pulse">
                      ✓ Accept Quote
                    </button>
                    <button className="flex-1 bg-white border border-gray-300 text-gray-700 text-[8px] font-bold py-1.5 rounded">
                      Request Changes
                    </button>
                  </div>
                </div>
                <p className="text-center text-[7px] text-gray-500 mt-2">
                  Tap "Accept Quote" to confirm →
                </p>
              </div>
            )}

            {phase === 'accepted' && (
              <div className="flex flex-col items-center justify-center h-full animate-fadeIn">
                <div className="text-5xl mb-3 animate-scaleIn">🎉</div>
                <p className="text-gray-900 text-sm font-bold mb-1">Quote Accepted!</p>
                <p className="text-gray-600 text-[10px] text-center mb-4 px-4">Smith's Plumbing has been notified.</p>
                <div className="bg-emerald-50 border border-emerald-200 rounded p-2 w-full">
                  <p className="text-[9px] text-emerald-700 font-bold">✓ Job won</p>
                  <p className="text-[8px] text-emerald-600 mt-0.5">$3,509 added to revenue won</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          0% { transform: scale(0); }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        :global(.animate-fadeIn) {
          animation: fadeIn 0.4s ease-out;
        }
        :global(.animate-scaleIn) {
          animation: scaleIn 0.5s ease-out;
        }
        :global(.animate-slideIn) {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}