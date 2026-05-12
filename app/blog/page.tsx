import Link from 'next/link'
import { POSTS } from '../lib/posts'

export const metadata = {
  title: 'SmokoHQ Blog — Practical guides for Aussie tradies',
  description: 'Real-world tips on quoting, pricing, GST, and growing a tradie business in Australia. Written for Aussie sparkies, plumbers, builders and chippies.',
}

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-white">SmokoHQ</a>
        <div className="flex gap-6 text-sm">
          <a href="/" className="text-gray-400 hover:text-white">Home</a>
          <a href="/blog" className="text-emerald-400">Blog</a>
          <a href="/pricing" className="text-gray-400 hover:text-white">Pricing</a>
          <a href="/login" className="text-emerald-400 hover:text-emerald-300">Login</a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="inline-block px-3 py-1 bg-emerald-900 text-emerald-400 text-xs font-semibold rounded-full mb-4 tracking-wide uppercase">
          The SmokoHQ Blog
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Tradie business, sorted.</h1>
        <p className="text-lg text-gray-400 mb-16">Practical guides on quoting, pricing, GST, and growing your tradie business. Written for Aussie sparkies, plumbers, builders, and chippies.</p>

        <div className="space-y-8">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-gray-900 border border-gray-800 hover:border-emerald-700 rounded-lg p-8 transition-all hover:bg-gray-900/80"
            >
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span>{new Date(post.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 hover:text-emerald-400 transition-colors">{post.title}</h2>
              <p className="text-gray-400 leading-relaxed">{post.description}</p>
              <p className="text-emerald-400 text-sm mt-4 font-semibold">Read article →</p>
            </Link>
          ))}
        </div>

        <div className="mt-20 p-8 bg-emerald-950 border border-emerald-800 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Stop typing quotes. Start winning jobs.</h2>
          <p className="text-gray-300 mb-6">SmokoHQ writes your quotes in 60 seconds and follows up automatically. Try it free.</p>
          <a href="/login" className="inline-block px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded transition-colors">
            Start Free →
          </a>
        </div>
      </main>

      <footer className="border-t border-gray-800 py-8 mt-20">
        <div className="max-w-3xl mx-auto px-6 text-center text-sm text-gray-500">
          <p>SmokoHQ — AI quotes for Aussie tradies</p>
        </div>
      </footer>
    </div>
  )
}