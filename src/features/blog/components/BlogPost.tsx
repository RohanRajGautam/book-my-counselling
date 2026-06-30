import Image from 'next/image'
import Link from 'next/link'

import { ArrowLeft, ArrowRight, CalendarDays, Clock } from 'lucide-react'

import { DEFAULT_AUTHOR_AVATAR, DEFAULT_AUTHOR_NAME } from '../lib/constants'
import type { Post } from '../types/post'

const DEFAULT_AUTHOR = DEFAULT_AUTHOR_NAME

export function BlogPost({ post }: { post: Post }) {
  const { frontmatter, bodyHtml, readMinutes } = post
  const { title, date, excerpt, coverImage, author, authorAvatar } = frontmatter
  const authorName = author ?? DEFAULT_AUTHOR
  const avatarSrc = authorAvatar ?? DEFAULT_AUTHOR_AVATAR

  return (
    <article className="relative mx-auto max-w-4xl px-6 pt-4 pb-20 sm:px-8">
      {/* Decorative background blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 -z-10 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-[#004ac6]/10 via-[#2563eb]/5 to-transparent blur-3xl"
      />

      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 rounded-full border border-[#dbe4f7] bg-white/70 px-4 py-2 text-sm font-medium text-[#434655] backdrop-blur-sm transition-all hover:-translate-x-0.5 hover:border-[#b9caf0] hover:text-[#004ac6]"
      >
        <ArrowLeft className="size-4" />
        Back to all posts
      </Link>

      {/* Header */}
      <header className="mt-5 mb-8">
        <h1 className="font-[family-name:var(--font-headline)] text-4xl leading-[1.05] font-extrabold tracking-[-0.025em] text-[#121c2a] sm:text-5xl md:text-[3.2rem]">
          {title}
        </h1>
        {excerpt && <p className="mt-4 text-xl leading-[1.6] text-[#434655]">{excerpt}</p>}

        {/* Byline */}
        <div className="mt-10 flex flex-wrap items-center gap-4 border-y border-[#e6eeff] py-5">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[#eff4ff] ring-offset-2 ring-offset-white">
            <Image
              src={avatarSrc}
              alt={`${authorName} avatar`}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="flex-1">
            <div className="font-[family-name:var(--font-headline)] text-base font-bold text-[#121c2a]">
              {authorName}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#737686]">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5" />
                <time dateTime={date}>{formatLongDate(date)}</time>
              </span>
              <span className="text-[#c3c6d7]" aria-hidden="true">
                •
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {readMinutes} min read
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Cover hero */}
      {coverImage && (
        <div className="relative mb-14 aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-[0_24px_48px_rgba(18,28,42,0.15)] ring-1 ring-black/[0.04]">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 896px"
          />
        </div>
      )}

      {/* Body prose — narrower for comfortable reading */}
      <div className="mx-auto max-w-3xl">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </div>

      {/* Footer author card */}
      <footer className="mx-auto mt-20 max-w-3xl">
        <div className="rounded-2xl border border-[#e6eeff] bg-gradient-to-br from-[#f7f8ff] via-white to-[#eff4ff] p-8 shadow-[0_18px_36px_rgba(18,28,42,0.06)]">
          <div className="flex items-start gap-5">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-full shadow-[0_8px_18px_rgba(18,28,42,0.10)] ring-2 ring-white">
              <Image
                src={avatarSrc}
                alt={`${authorName} avatar`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-[#737686]">Written by</div>
              <div className="mt-1 font-[family-name:var(--font-headline)] text-xl font-extrabold text-[#121c2a]">
                {authorName}
              </div>
              <Link
                href="/blog"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#004ac6] transition-colors hover:text-[#003fa8]"
              >
                Read more posts
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </article>
  )
}

function formatLongDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
