import Link from 'next/link'
import { POSTS } from '../lib/posts'

export const metadata = {
  title: 'SmokoHQ Blog - Practical guides for Aussie tradies',
  description: 'Real-world tips on quoting, pricing, GST, and growing a tradie business in Australia. Written for Aussie sparkies, plumbers, builders and chippies.',
}

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-white">
      <nav className="border-b border-stone-800 bg-stone-900 px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-xl font-bold">SmokoHQ</a>
        <div className="flex gap-3 text-sm items-center">
          <a href="/blog" className="px-4 py-2 text-emerald-400">Blog</a>
          <a href="/pricing" className="px-4 py-2 text-stone-400 hover:text-white rounded-full transition-colors">Pricing</a>
          <a href="/login" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-colors">Login</a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="inline-block px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-full mb-4 tracking-wide uppercase">
          The SmokoHQ Blog
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Tradie business, sorted.</h1>
        <p className="text-lg text-stone-400 mb-16">Practical guides on quoting, pricing, GST, and growing your tradie business. Written for Aussie sparkies, plumbers, builders, and chippies.</p>

        <div className="space-y-6">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={'/blog/' + post.slug}
              className="block bg-stone-900 border border-stone-800 hover:border-emerald-500/50 rounded-2xl p-8 transition-all hover:bg-stone-900/80 group"
            >
              <div className="flex items-center gap-3 text-xs text-stone-500 mb-3">
                <span>{new Date(post.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">{post.title}</h2>
              <p className="text-stone-400 leading-relaxed">{post.description}</p>
              <p className="text-emerald-400 text-sm mt-4 font-bold">Read article →</p>
            </Link>
          ))}
        </div>

        <div className="mt-20 p-8 bg-emerald-500/5 border border-emerald-500/30 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Stop typing quotes. Start winning jobs.</h2>
          <p className="text-stone-300 mb-6">SmokoHQ writes your quotes in 60 seconds and follows up automatically. Try it free.</p>
          <a href="/login" className="inline-block px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-colors shadow-lg shadow-emerald-500/20">
            Start Free
          </a>
        </div>
      </main>

      <footer className="border-t border-stone-800 py-10 px-8 bg-stone-900 mt-20">
        <div className="max-w-3xl mx-auto text-center text-sm text-stone-600">
          <p>SmokoHQ - AI quotes for Aussie tradies</p>
        </div>
      </footer>
    </div>
  )
}