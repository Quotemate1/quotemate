import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — SmokoHQ',
  description: 'How SmokoHQ collects, uses, and protects your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">SmokoHQ</Link>
        <div className="flex gap-6 text-sm items-center">
          <a href="/blog" className="text-gray-400 hover:text-white">Blog</a>
          <a href="/pricing" className="text-gray-400 hover:text-white">Pricing</a>
          <a href="/login" className="text-emerald-400 hover:text-emerald-300">Login</a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-gray-500 hover:text-emerald-400 mb-8 inline-block">← Back to home</Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-500 mb-12">Last updated: 13 May 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Who we are</h2>
            <p>SmokoHQ ("we", "us", "our") is an Australian software service that helps tradies create, send, and manage quotes for their customers. This Privacy Policy explains how we handle personal information we collect through our website and service.</p>
            <p>If you have questions about this policy, contact us at <strong className="text-white">support@smokohq.au</strong>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. What information we collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong className="text-white">Account information:</strong> your email address, business name, ABN, phone, and physical address (if provided).</li>
              <li><strong className="text-white">Customer data:</strong> details about your customers that you enter into the service (names, emails, phone numbers, addresses, job descriptions).</li>
              <li><strong className="text-white">Quote data:</strong> the content of quotes you generate, send, and track through our service.</li>
              <li><strong className="text-white">Payment information:</strong> we use Stripe to process payments. We do not store your full credit card details on our servers — Stripe handles this securely.</li>
              <li><strong className="text-white">Usage data:</strong> we use PostHog analytics to track how you use the service (which pages you visit, what features you use). This helps us improve the product.</li>
              <li><strong className="text-white">Technical data:</strong> IP address, browser type, device information, and similar technical details automatically logged when you use our service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. How we use your information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Provide the SmokoHQ service to you (generate quotes, send emails, track responses).</li>
              <li>Process payments and manage your subscription.</li>
              <li>Send you transactional emails (welcome, quote confirmations, follow-ups, billing).</li>
              <li>Improve our product based on how you use it.</li>
              <li>Respond to your support requests and feedback.</li>
              <li>Comply with our legal obligations.</li>
            </ul>
            <p className="mt-3">We do <strong className="text-white">not</strong> sell your data to third parties. We do not use your customer data for any purpose other than providing you with the service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. AI and your data</h2>
            <p>SmokoHQ uses AI (specifically, Anthropic's Claude API) to generate quote content. When you create a quote, the job description and other details you provide are sent to Anthropic for processing. Anthropic does not train its models on this data and does not retain it after processing.</p>
            <p className="mt-3">We do not share your customer data with the AI beyond what's needed to write that specific quote.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">5. Third parties we share data with</h2>
            <p>We share data with the following service providers, only as needed to run SmokoHQ:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong className="text-white">Supabase:</strong> hosts our database. Servers located in Sydney, Australia.</li>
              <li><strong className="text-white">Vercel:</strong> hosts our application. Global edge network.</li>
              <li><strong className="text-white">Stripe:</strong> processes subscription payments.</li>
              <li><strong className="text-white">Resend:</strong> sends transactional emails.</li>
              <li><strong className="text-white">Anthropic:</strong> AI quote generation.</li>
              <li><strong className="text-white">PostHog:</strong> usage analytics.</li>
            </ul>
            <p className="mt-3">Each of these providers has their own privacy practices. We choose providers that maintain industry-standard security practices.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">6. How long we keep your data</h2>
            <p>We keep your account data for as long as your account is active. If you delete your account, we delete your data within 30 days, except where we're required to keep it for legal reasons (e.g. tax records).</p>
            <p className="mt-3">Customer data you enter remains your responsibility. You can delete individual quotes or customer records at any time from your dashboard.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">7. Your rights</h2>
            <p>Under the Australian Privacy Act and other applicable laws, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Access the personal information we hold about you.</li>
              <li>Correct any inaccurate information.</li>
              <li>Request deletion of your account and associated data.</li>
              <li>Withdraw consent for marketing communications (we currently don't send marketing emails, only transactional ones).</li>
              <li>Complain to the Office of the Australian Information Commissioner (<a href="https://www.oaic.gov.au" className="text-emerald-400 hover:underline">oaic.gov.au</a>) if you believe we've mishandled your data.</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, email us at <strong className="text-white">support@smokohq.au</strong>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">8. Security</h2>
            <p>We use industry-standard security measures including encryption in transit (HTTPS), encryption at rest (Supabase), and access controls. However, no system is 100% secure. If we ever experience a data breach that affects your information, we'll notify you within 72 hours as required by Australian law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">9. Children</h2>
            <p>SmokoHQ is intended for use by Australian tradies and business owners. We do not knowingly collect data from anyone under 18. If you believe we have, contact us to delete it.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">10. Changes to this policy</h2>
            <p>We may update this Privacy Policy from time to time. We'll notify you of significant changes via email or through the service. Continued use after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">11. Contact us</h2>
            <p>Questions, concerns, or requests? Email <strong className="text-white">support@smokohq.au</strong>.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex gap-6 text-sm">
          <Link href="/terms" className="text-emerald-400 hover:text-emerald-300">Terms of Service →</Link>
          <Link href="/" className="text-gray-500 hover:text-emerald-400">Back to home</Link>
        </div>
      </main>

      <footer className="border-t border-gray-800 py-10 px-8 mt-20">
        <div className="max-w-3xl mx-auto text-center text-sm text-gray-600">
          © 2026 SmokoHQ. Built in Australia for Australian tradies.
        </div>
      </footer>
    </div>
  )
}