'use client'

import Image from 'next/image'
import { Check, Star } from 'lucide-react'

interface MentorCardProps {
  name: string
  role: string
  company: string
  tags: string[]
  rating: number
  reviews: number
  description?: string
  totalSessions?: number
  price: number
  imageUrl?: string | null
  verified?: boolean
  onClick?: () => void
}

export function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return initials || 'M'
}

function formatDisplayName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\b\p{L}/gu, (letter) => letter.toUpperCase())
}

export function MentorCard({
  name,
  role,
  company,
  tags,
  rating,
  reviews,
  totalSessions,
  price,
  imageUrl,
  verified = true,
  onClick,
}: MentorCardProps) {
  const imageSrc = imageUrl?.trim() || null
  const displayName = formatDisplayName(name)
  const initials = getInitials(name)
  const services = tags.slice(0, 4).map((tag) => tag.replace(/^#/, ''))

  return (
    <article
      className="group flex min-h-[320px] cursor-pointer flex-col rounded-[18px] bg-white p-5 shadow-[0_16px_40px_rgba(18,28,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_46px_rgba(18,28,42,0.08)]"
      onClick={onClick}
    >
      <div className="mb-5 flex items-center gap-4">
        <div className="relative">
          <div className="size-[78px] rounded-full border-[3px] border-[#0053db] bg-white p-1 shadow-[0_0_0_6px_#f3f7ff]">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={`${displayName} profile`}
                width={78}
                height={78}
                className="size-full rounded-full object-cover"
              />
            ) : (
              <div
                aria-label={`${displayName} profile initials`}
                className="flex size-full items-center justify-center rounded-full bg-[#e6eeff] text-xl font-extrabold text-[#004ac6]"
              >
                {initials}
              </div>
            )}
          </div>
          {verified && (
            <div className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#00714d]">
              <Check className="size-4 text-white" strokeWidth={4} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-[family-name:var(--font-headline)] text-lg font-extrabold tracking-tight text-[#121c2a] transition group-hover:text-[#004ac6]">
            {displayName}
          </h3>
          {verified && <p className="mt-1 text-sm font-bold text-[#00714d]">Verified Mentor</p>}
          <p className="mt-1 line-clamp-2 text-base leading-6 font-medium text-[#434655]">
            {role}
            {company ? `, ${company}` : ''}
          </p>
        </div>
      </div>

      <div className="mb-5">
        <p className="mb-2 text-[11px] font-extrabold tracking-wider text-[#737686] uppercase">
          Services offered
        </p>
        <div className="flex min-h-[30px] flex-wrap gap-2">
          {services.length > 0 ? (
            <>
              {services.slice(0, 3).map((service) => (
                <span
                  key={service}
                  className="max-w-full truncate rounded-full bg-[#e6eeff] px-3 py-1.5 text-xs font-extrabold text-[#004ac6]"
                >
                  {service}
                </span>
              ))}

              {services.length > 3 && (
                <span className="rounded-full bg-[#e6eeff] px-3 py-1.5 text-xs font-extrabold text-[#004ac6]">
                  +{services.length - 3} more
                </span>
              )}
            </>
          ) : (
            <span className="rounded-full bg-[#e6eeff] px-3 py-1.5 text-xs font-extrabold text-[#004ac6]">
              Mentorship
            </span>
          )}
        </div>
      </div>

      <div className="mt-auto mb-5 flex items-center gap-2">
        <Star className="size-5 fill-[#f2b200] text-[#f2b200]" />
        <span className="font-[family-name:var(--font-headline)] font-extrabold text-[#121c2a]">
          {Number(rating || 0)
            .toFixed(1)
            .replace('.0', '')}
        </span>
        <span className="flex w-full items-center justify-between">
          <span className="text-sm font-medium text-[#737686]">({reviews} reviews)</span>

          {typeof totalSessions === 'number' && (
            <span className="ml-2 text-sm font-medium text-[#737686]">
              {totalSessions} total sessions
            </span>
          )}
        </span>
      </div>

      {/* <p className="mb-5 line-clamp-2 text-base leading-6 font-medium text-[#434655]">
        {description}
      </p> */}

      <div className="flex items-center justify-between gap-4 border-t border-[#dfe7f5] pt-5">
        <div>
          <p className="text-xs font-extrabold tracking-widest text-[#737686] uppercase">
            Starting at
          </p>
          <p className="font-[family-name:var(--font-headline)] text-xl font-extrabold text-[#121c2a]">
            NPR {Math.round(price).toLocaleString()}
          </p>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onClick?.()
          }}
          className="h-11 shrink-0 rounded-xl bg-[#1f5bdc] px-5 text-sm font-extrabold text-white shadow-[0_10px_20px_rgba(0,83,219,0.22)] transition hover:bg-[#003fa8]"
        >
          Book Session
        </button>
      </div>
    </article>
  )
}
