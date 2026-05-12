import Link from 'next/link'
import { notFound } from 'next/navigation'
import { POSTS } from '../../lib/posts'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS.find(p => p.slug === slug)
  if (!post) return {}
  return {
    title: `${post.title} — SmokoHQ`,
    description: post.description,
  }
}

export function generateStaticParams() {
  return POSTS.map(post => ({ slug: post.slug }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS.find(p => p.slug === slug)
  if (!post) notFound()

  // Simple markdown-ish renderer for ## headings, ### subheadings, **bold**, and paragraphs
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n')
    const elements: React.ReactNode[] = []
    let listItems: string[] = []
    let inList = false

    const flushList = (key: string) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={key} className="list-disc pl-6 space-y-2 my-4 text-gray-300">
            {listItems.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
            ))}
          </ul>
        )
        listItems = []
        inList = false
      }
    }

    const renderInline = (text: string) => {
      return text
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-emerald-400 hover:underline">$1</a>')
    }

    lines.forEach((line, i) => {
      const trimmed = line.trim()

      if (trimmed.startsWith('## ')) {
        flushList(`list-${i}`)
        elements.push(<h2 key={i} className="text-2xl font-bold text-white mt-12 mb-4">{trimmed.slice(3)}</h2>)
      } else if (trimmed.startsWith('### ')) {
        flushList(`list-${i}`)
        elements.push(<h3 key={i} className="text-lg font-bold text-white mt-8 mb-3">{trimmed.slice(4)}</h3>)
      } else if (trimmed.startsWith('> ')) {
        flushList(`list-${i}`)
        elements.push(
          <blockquote key={i} className="border-l-4 border-emerald-500 pl-4 italic text-gray-400 my-4">
            {trimmed.slice(2)}
          </blockquote>
        )
      } else if (trimmed.startsWith('- ')) {
        listItems.push(trimmed.slice(2))
        inList = true
      } else if (trimmed === '') {
        flushList(`list-${i}`)
      } else {
        flushList(`list-${i}`)
        elements.push(
          <p key={i} className="text-gray-300 leading-relaxed my-4" dangerouslySetInnerHTML={{ __html: renderInline(trimmed) }} />
        )
      }
    })
    flushList('list-end')
    return elements
  }

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

      <main className="max-w-2xl mx-auto px-6 py-16">
        <Link href="/blog" className="text-sm text-gray-500 hover:text-emerald-400 mb-8 inline-block">← All articles</Link>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4 mt-4">
          <span>{new Date(post.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{post.title}</h1>
        <p className="text-lg text-gray-400 mb-12 leading-relaxed">{post.description}</p>

        <article className="prose prose-invert max-w-none">
          {renderContent(post.content)}
        </article>

        <div className="mt-16 p-8 bg-emerald-950 border border-emerald-800 rounded-lg text-center">
          <h2 className="text-xl font-bold text-white mb-2">Quoting taking too long?</h2>
          <p className="text-gray-300 mb-6">SmokoHQ writes professional quotes in 60 seconds using AI. Plus auto follow-ups so you never miss a job.</p>
          <a href="/login" className="inline-block px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded transition-colors">
            Try SmokoHQ Free →
          </a>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800">
          <Link href="/blog" className="text-sm text-emerald-400 hover:text-emerald-300">← Back to all articles</Link>
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