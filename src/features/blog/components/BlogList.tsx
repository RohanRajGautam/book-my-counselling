'use client'

import { useMemo, useState } from 'react'

import { Search } from 'lucide-react'

import type { Post } from '../types/post'
import { BlogCard } from './BlogCard'

export function BlogList({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return posts
    return posts.filter(
      (p) =>
        p.frontmatter.title.toLowerCase().includes(q) ||
        p.frontmatter.excerpt.toLowerCase().includes(q)
    )
  }, [posts, query])

  return (
    <div className="mx-auto">
      <header className="my-2">
        <h1 className="font-[family-name:var(--font-headline)] text-4xl leading-tight font-extrabold tracking-tight text-[#121c2a] sm:text-5xl">
          Learn, Grow, and Make Confident Choices
        </h1>
        <p className="mt-4 mb-8 max-w-5xl text-base leading-7 text-[#434655]">
          Get advice on applications, scholarships, study destinations, and student life. Your guide
          to making the most of your study abroad journey. Browse expert-written articles, career
          insights, and practical guidance designed to support your academic, professional, and
          personal goals.
        </p>
      </header>

      {/* <div className="mb-10 flex items-center">
        <div className="relative w-full">
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#737686]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by blogs"
            className="w-full rounded-full border border-[#dbe4f7] bg-white py-3 pr-4 pl-11 text-sm text-[#121c2a] transition-all placeholder:text-[#737686] focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/15 focus:outline-none"
          />
        </div>
      </div> */}

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-[#737686]">
          No posts match &ldquo;{query}&rdquo;.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
