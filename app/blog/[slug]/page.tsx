import Link from 'next/link'
import { notFound } from 'next/navigation'
import { POSTS } from '../../lib/posts'

export async function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS.find((p) => p.slug === slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.title + ' | SmokoHQ Blog',
    description: post.description,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS.find((p) => p.slug === slug)
  if (!post) notFound()

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

      <article className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/blog" className="text-emerald-400 hover:text-emerald-300 text-sm mb-6 inline-block">← Back to blog</Link>

        <div className="flex items-center gap-3 text-xs text-stone-500 mb-4">
          <span>{new Date(post.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
        <p className="text-xl text-stone-400 mb-10 leading-relaxed">{post.description}</p>

        <div
          className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-stone-300 prose-p:leading-relaxed prose-strong:text-white prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-ul:text-stone-300 prose-ol:text-stone-300 prose-li:my-2"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-16 p-8 bg-emerald-500/5 border border-emerald-500/30 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Stop typing quotes. Start winning jobs.</h2>
          <p className="text-stone-300 mb-6">SmokoHQ writes your quotes in 60 seconds and follows up automatically. Try it free.</p>
          <a href="/login" className="inline-block px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-colors shadow-lg shadow-emerald-500/20">
            Start Free
          </a>
        </div>
      </article>

      <footer className="border-t border-stone-800 py-10 px-8 bg-stone-900 mt-20">
        <div className="max-w-3xl mx-auto text-center text-sm text-stone-600">
          <p>SmokoHQ - AI quotes for Aussie tradies</p>
        </div>
      </footer>
    </div>
  )
}