import Image from 'next/image'
import Link from 'next/link'

import { DEFAULT_AUTHOR_AVATAR, DEFAULT_AUTHOR_NAME } from '../lib/constants'
import type { Post } from '../types/post'

const DEFAULT_AUTHOR = DEFAULT_AUTHOR_NAME

export function BlogCard({ post }: { post: Post }) {
  const { slug, frontmatter } = post
  const { title, date, excerpt, coverImage, author, authorAvatar } = frontmatter
  const authorName = author ?? DEFAULT_AUTHOR
  const avatarSrc = authorAvatar ?? DEFAULT_AUTHOR_AVATAR

  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#e6eeff] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#b9caf0] hover:shadow-[0_18px_36px_rgba(18,28,42,0.10)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#004ac6] via-[#2563eb] to-[#5b8def] p-6">
            <h3 className="line-clamp-3 font-[family-name:var(--font-headline)] text-xl leading-snug font-extrabold text-white">
              {title}
            </h3>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 font-[family-name:var(--font-headline)] text-lg leading-snug font-extrabold text-[#121c2a] transition-colors group-hover:text-[#004ac6]">
          {title}
        </h3>
        <p className="line-clamp-2 text-sm leading-6 text-[#434655]">{excerpt}</p>

        <div className="mt-auto flex items-center justify-between pt-2 text-xs">
          <time dateTime={date} className="text-[#737686]">
            {formatShortDate(date)}
          </time>
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#737686]">{authorName}</span>
            <Image
              src={avatarSrc}
              alt={`${authorName} avatar`}
              width={28}
              height={28}
              className="size-7 rounded-full bg-[#eff4ff] object-cover"
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

function formatShortDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
