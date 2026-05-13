import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service — SmokoHQ',
  description: 'The terms and conditions of using SmokoHQ.',
}

export default function TermsPage() {
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

        <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
        <p className="text-gray-500 mb-12">Last updated: 13 May 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. About these terms</h2>
            <p>These Terms of Service ("Terms") govern your use of SmokoHQ ("the Service"), provided by SmokoHQ ("we", "us", "our"). By signing up or using the Service, you agree to these Terms. If you don't agree, don't use the Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. Who can use SmokoHQ</h2>
            <p>To use SmokoHQ you must be at least 18 years old and have the legal capacity to enter into a binding agreement. The Service is intended for use by tradespeople and small business owners operating a trade business in Australia.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. Your account</h2>
            <p>You're responsible for maintaining the security of your account credentials. You agree to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Provide accurate information when signing up.</li>
              <li>Keep your password confidential.</li>
              <li>Notify us immediately of any unauthorized access.</li>
              <li>Be responsible for all activity that occurs under your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. Subscription and payments</h2>
            <p>SmokoHQ is offered on a subscription basis with monthly billing. By subscribing, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Pay the recurring subscription fee on the billing date until you cancel.</li>
              <li>Provide accurate, current payment information.</li>
              <li>Be charged in Australian Dollars (AUD), GST-inclusive.</li>
            </ul>
            <p className="mt-3"><strong className="text-white">Free trial:</strong> We offer a 7-day free trial. You can cancel anytime during the trial without being charged. If you don't cancel before the trial ends, your subscription begins and your payment method will be charged.</p>
            <p className="mt-3"><strong className="text-white">Cancellation:</strong> You can cancel your subscription anytime from your account settings. Cancellation takes effect at the end of your current billing period — you'll keep access until then. We don't offer refunds for partial months.</p>
            <p className="mt-3"><strong className="text-white">Price changes:</strong> We may change subscription prices with at least 30 days' notice. If you don't agree, you can cancel before the change takes effect.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">5. Acceptable use</h2>
            <p>You agree NOT to use SmokoHQ to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Send spam, phishing, or unsolicited bulk email.</li>
              <li>Generate quotes for fraudulent or illegal purposes.</li>
              <li>Violate any Australian law or regulation.</li>
              <li>Reverse engineer, copy, or resell the Service.</li>
              <li>Use the Service to harass, threaten, or harm anyone.</li>
              <li>Bypass usage limits or attempt to gain unauthorized access.</li>
            </ul>
            <p className="mt-3">We reserve the right to suspend or terminate accounts that violate these rules.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">6. Your content</h2>
            <p>You retain ownership of all content you create through SmokoHQ (quotes, customer data, business information). You grant us a limited license to host, store, process, and display this content solely to provide the Service to you.</p>
            <p className="mt-3">You're responsible for ensuring you have the right to use any customer information you enter, and that you comply with the Australian Privacy Act in your handling of customer data.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">7. AI-generated content</h2>
            <p>SmokoHQ uses AI to generate quote content based on your input. While we work hard to ensure quality, AI output:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>May contain errors or inaccuracies.</li>
              <li>Should be reviewed before sending to customers.</li>
              <li>Is generated based on your input — garbage in, garbage out.</li>
            </ul>
            <p className="mt-3">You are responsible for reviewing all AI-generated quotes before sending them. We're not liable for errors, omissions, or pricing mistakes in quotes you send to customers.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">8. Service availability</h2>
            <p>We aim to keep SmokoHQ available 24/7, but we don't guarantee uninterrupted service. We may need to take the Service offline for maintenance, updates, or due to factors outside our control (e.g. third-party service outages). We're not liable for any losses caused by Service downtime.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">9. Disclaimers</h2>
            <p>SmokoHQ is provided "as is" and "as available". To the maximum extent permitted by law, we make no warranties of any kind, whether express or implied, including but not limited to fitness for a particular purpose.</p>
            <p className="mt-3">Nothing in these Terms excludes any rights you have under the Australian Consumer Law that cannot be excluded.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">10. Limitation of liability</h2>
            <p>To the maximum extent permitted by law:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>We're not liable for indirect, consequential, special, or punitive damages.</li>
              <li>Our total liability for any claim related to the Service is limited to the amount you paid us in the 12 months before the claim.</li>
              <li>We're not responsible for the actions, omissions, or content of your customers or any third parties.</li>
              <li>We're not responsible for lost business, lost profits, or missed opportunities arising from your use of the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">11. Indemnity</h2>
            <p>You agree to indemnify and hold us harmless from any claims, losses, or damages (including legal fees) arising from your use of the Service, your violation of these Terms, or your violation of any third party's rights.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">12. Termination</h2>
            <p>You can stop using SmokoHQ anytime by cancelling your subscription. We can suspend or terminate your account if you violate these Terms.</p>
            <p className="mt-3">On termination, your right to use the Service ends immediately. You can export your data before termination — contact us if you need help.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">13. Changes to these terms</h2>
            <p>We may update these Terms from time to time. We'll notify you of significant changes via email or through the Service. Continued use after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">14. Governing law</h2>
            <p>These Terms are governed by the laws of New South Wales, Australia. Any disputes will be handled in the courts of New South Wales.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">15. Contact us</h2>
            <p>Questions about these Terms? Email <strong className="text-white">support@smokohq.au</strong>.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex gap-6 text-sm">
          <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300">Privacy Policy →</Link>
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