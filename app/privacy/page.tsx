export const metadata = {
  title: 'Privacy Policy | SmokoHQ',
  description: 'How SmokoHQ handles your data. Plain English, no nonsense.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-white">
      <nav className="border-b border-stone-800 bg-stone-900 px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-xl font-bold">SmokoHQ</a>
        <div className="flex gap-3 text-sm items-center">
          <a href="/blog" className="px-4 py-2 text-stone-400 hover:text-white rounded-full transition-colors">Blog</a>
          <a href="/pricing" className="px-4 py-2 text-stone-400 hover:text-white rounded-full transition-colors">Pricing</a>
          <a href="/login" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-colors">Login</a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="inline-block px-4 py-1.5 bg-stone-800 border border-stone-700 text-stone-400 text-xs font-bold rounded-full mb-4 tracking-wide uppercase">
          Legal
        </div>
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-stone-500 mb-12">Last updated: May 2026</p>

        <div className="space-y-10 text-stone-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">The short version</h2>
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-2 text-stone-300">
              <p>• Your data is yours. Full stop.</p>
              <p>• We store it in Sydney, encrypted.</p>
              <p>• We never sell your data or your customers&apos; data.</p>
              <p>• You can delete your account and everything goes with it.</p>
              <p>• Questions? Email <a href="mailto:support@smokohq.app" className="text-emerald-400 hover:underline">support@smokohq.app</a>.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Who we are</h2>
            <p>SmokoHQ is an Australian software product that helps tradies write professional quotes using AI. This privacy policy explains how we handle your information when you use smokohq.app.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">What we collect</h2>
            <p className="mb-3"><strong className="text-white">Account info:</strong> Your email address and a hashed password when you sign up.</p>
            <p className="mb-3"><strong className="text-white">Business info:</strong> Your business name, trade type, ABN (optional), phone, address — all the stuff you fill in during onboarding so we can put it on your quotes.</p>
            <p className="mb-3"><strong className="text-white">Customer info you add:</strong> Names, emails, phone numbers and addresses of customers you create quotes for. This is your customer data — we&apos;re just storing it for you.</p>
            <p className="mb-3"><strong className="text-white">Quote content:</strong> The job descriptions you write and the AI-generated quotes that come out of them.</p>
            <p><strong className="text-white">Usage data:</strong> Basic analytics (pages visited, features used) to help us improve the product. Anonymous where possible.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">What we do with it</h2>
            <p className="mb-3">We use your data to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Run the actual product (generate quotes, send emails, manage your account)</li>
              <li>Send service emails (welcome, quote notifications, follow-up reminders)</li>
              <li>Process payments through Stripe (we never see or store your card details)</li>
              <li>Improve SmokoHQ based on aggregate usage patterns</li>
              <li>Respond to your support requests</li>
            </ul>
            <p className="mt-4">We <strong className="text-white">never</strong> sell your data, share it with advertisers, or train AI models on your customer data.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Where it lives</h2>
            <p>Your data is stored with Supabase (in Sydney, Australia) and encrypted in transit and at rest. Emails are sent via Resend. Payments are handled by Stripe. Each of these companies has their own strong privacy and security standards.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Your rights</h2>
            <p className="mb-3">You can at any time:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>See all the data we hold on you (it&apos;s mostly visible inside your dashboard)</li>
              <li>Update or correct your details</li>
              <li>Delete your account, which removes your data within 30 days</li>
              <li>Ask us a question or raise a concern</li>
            </ul>
            <p className="mt-4">Just email <a href="mailto:support@smokohq.app" className="text-emerald-400 hover:underline">support@smokohq.app</a> and we&apos;ll sort it out.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Cookies</h2>
            <p>We use essential cookies to keep you logged in and remember your settings, plus PostHog analytics cookies to understand how people use SmokoHQ. No tracking cookies for advertising. No third-party ads on SmokoHQ ever.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Children</h2>
            <p>SmokoHQ is for tradies and small business owners. We don&apos;t knowingly collect data from anyone under 16.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Changes</h2>
            <p>If we update this policy, we&apos;ll change the &quot;Last updated&quot; date at the top. For major changes, we&apos;ll send you an email.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
            <p>Questions, complaints, requests, or just a chat about privacy: <a href="mailto:support@smokohq.app" className="text-emerald-400 hover:underline">support@smokohq.app</a></p>
          </section>

        </div>
      </main>

      <footer className="border-t border-stone-800 py-10 px-8 bg-stone-900 mt-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-stone-600">© 2026 SmokoHQ. Built in Australia for Australian tradies.</span>
          <div className="flex gap-6 text-sm">
            <a href="/blog" className="text-stone-500 hover:text-stone-300">Blog</a>
            <a href="/pricing" className="text-stone-500 hover:text-stone-300">Pricing</a>
            <a href="/privacy" className="text-stone-500 hover:text-stone-300">Privacy</a>
            <a href="/terms" className="text-stone-500 hover:text-stone-300">Terms</a>
            <a href="/login" className="text-stone-500 hover:text-stone-300">Sign In</a>
          </div>
        </div>
      </footer>
    </div>
  )
}