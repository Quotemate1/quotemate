import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <nav className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <span className="text-xl font-bold">SmokoHQ</span>
        <div className="flex items-center gap-6">
          <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link>
          <Link href="/login" className="text-sm px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded font-semibold transition-colors">Sign In</Link>
        </div>
      </nav>

      <main>
        <section className="px-8 pt-28 pb-24">
          <div className="max-w-4xl">
            <div className="inline-block px-3 py-1 bg-emerald-900 text-emerald-400 text-xs font-semibold rounded-full mb-6 tracking-wide uppercase">
              Built for Aussie Tradies
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              You take your<br />
              <span className="text-emerald-400">smoko.</span><br />
              We'll handle the quotes.
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
              Tell us about the job. SmokoHQ's AI writes a professional branded quote, sends it to your customer,
              and chases them up automatically — so you win more jobs while you're still on your break.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/login" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded transition-colors">
                Start Free Trial →
              </Link>
              <Link href="/pricing" className="px-8 py-4 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 font-semibold text-lg rounded transition-colors">
                View Pricing
              </Link>
            </div>
            <p className="text-sm text-gray-600 mt-4">7-day free trial · No credit card required · Cancel anytime</p>
          </div>
        </section>

        <section className="border-t border-gray-800 py-24 px-8">
          <h2 className="text-3xl font-bold mb-4">Stop losing jobs to slow quotes</h2>
          <p className="text-gray-400 mb-16 max-w-2xl">
            The average tradie spends 45 minutes writing a quote and wins less than half of them.
            SmokoHQ does it in 60 seconds and follows up for you. You just describe the job — we do the rest.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3">We Write It For You</h3>
              <p className="text-gray-400 leading-relaxed">
                Just tell us what the job is — a few dot points or a quick description. Our AI writes a
                professional, branded quote with scope of work, inclusions, exclusions, and T&Cs.
                You don't write a single word.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
              <div className="text-3xl mb-4">📧</div>
              <h3 className="text-xl font-bold mb-3">We Send & Chase It</h3>
              <p className="text-gray-400 leading-relaxed">
                We email the quote straight to your customer. If they haven't opened it after 48 hours,
                SmokoHQ sends a follow-up automatically. And again at 5 days.
                No more "did they even read it?"
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-3">You Win More Jobs</h3>
              <p className="text-gray-400 leading-relaxed">
                Professional quotes that land fast + automatic follow-ups = you're the first to respond
                and the last to be forgotten. More wins, less admin, more time on the tools.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-800 py-24 px-8">
          <h2 className="text-3xl font-bold mb-16">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="w-12 h-12 bg-emerald-900 text-emerald-400 rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
              <h3 className="font-bold mb-2">Describe the job</h3>
              <p className="text-sm text-gray-400">Punch in a few details about the job and what you're charging. That's all we need from you.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-emerald-900 text-emerald-400 rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
              <h3 className="font-bold mb-2">We write the quote</h3>
              <p className="text-sm text-gray-400">Our AI generates a professional quote — scope, inclusions, exclusions, terms, GST — all done for you in seconds.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-emerald-900 text-emerald-400 rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
              <h3 className="font-bold mb-2">We send it off</h3>
              <p className="text-sm text-gray-400">One click and we email a professional PDF quote to your customer. You don't even need to open your email.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-emerald-900 text-emerald-400 rounded-full flex items-center justify-center text-xl font-bold mb-4">4</div>
              <h3 className="font-bold mb-2">We chase the money</h3>
              <p className="text-sm text-gray-400">If they don't open it, we follow up at 48 hours and 5 days. You go back to the tools. We handle the rest.</p>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-800 py-24 px-8">
          <h2 className="text-3xl font-bold mb-12">Built for every trade</h2>
          <div className="flex flex-wrap gap-3">
            {['Plumbers', 'Electricians', 'Builders', 'Painters', 'Carpenters', 'Landscapers', 'Tilers', 'Roofers', 'Concreters', 'Fencers', 'Cleaners', 'HVAC'].map(trade => (
              <span key={trade} className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-full text-sm text-gray-300">{trade}</span>
            ))}
          </div>
        </section>

        <section className="border-t border-gray-800 py-24 px-8">
          <h2 className="text-3xl font-bold mb-4">Pricing that pays for itself</h2>
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
        </section>

        <section className="border-t border-gray-800 py-24 px-8">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold mb-6">You handle the tools.<br />We'll handle the quotes.</h2>
            <p className="text-xl text-gray-400 mb-10">Join tradies across Australia who are winning more work with SmokoHQ — without spending another evening on admin.</p>
            <Link href="/login" className="inline-block px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded transition-colors">
              Start Your Free Trial →
            </Link>
            <p className="text-sm text-gray-600 mt-4">7-day free trial · No credit card · Cancel anytime</p>
          </div>
        </section>

        <footer className="border-t border-gray-800 py-10 px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm text-gray-600">© 2026 SmokoHQ. Built in Australia for Australian tradies.</span>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="/pricing" className="hover:text-gray-400">Pricing</Link>
              <Link href="/login" className="hover:text-gray-400">Sign In</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}