'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Building2 } from 'lucide-react'

import { getFeaturedMentors, type FeaturedMentor } from '@/features/mentors/api/featuredMentors.api'
import { getMentorProfileSlug } from '@/features/mentors/utils/mentors.utils'

import { FeaturedMentorCardSkeleton } from './FeaturedMentorCardSkeleton'

const FEATURED_LIMIT = 8
const SLIDER_THRESHOLD = 4
const AUTO_SCROLL_PX_PER_SEC = 28
const CARD_GAP_PX = 24

function AvatarSquare({ mentor }: { mentor: FeaturedMentor }) {
  const url = mentor.user.avatar_url
  const initials = mentor.user.full_name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')

  if (url) {
    return (
      <Image
        src={url}
        alt={mentor.user.full_name}
        fill
        sizes="(min-width: 1024px) 280px, (min-width: 640px) 44vw, 100vw"
        className="object-cover object-top transition duration-500 group-hover:scale-[1.04]"
      />
    )
  }

  return (
    <div className="flex size-full items-center justify-center bg-gradient-to-br from-[var(--brand-blue-surface)] to-[var(--brand-blue-soft)] text-5xl font-extrabold text-[var(--brand-blue)]">
      {initials || 'M'}
    </div>
  )
}

function FeaturedMentorCard({ mentor, onOpen }: { mentor: FeaturedMentor; onOpen: () => void }) {
  const companyLogo = mentor.company_logo_url
  const visibleTags = mentor.tags.slice(0, 2)
  const sessionPrice = Math.round(Number(mentor.hourly_rate) / 2).toLocaleString('en-US')

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(18,28,42,0.16)]">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View ${mentor.user.full_name}'s profile`}
        className="relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-t-3xl bg-gradient-to-br from-[var(--brand-blue-surface)] to-[var(--brand-blue-soft)] text-left"
      >
        <AvatarSquare mentor={mentor} />
      </button>

      <div className="flex flex-1 flex-col px-5 pt-5 pb-5">
        <h3 className="font-[family-name:var(--font-headline)] text-xl leading-6 font-extrabold tracking-tight text-slate-950">
          {mentor.user.full_name}
        </h3>

        <p className="mt-2 text-sm leading-5 font-semibold text-[var(--brand-blue)]">
          {mentor.title}
        </p>

        {mentor.company ? (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white">
              {companyLogo ? (
                <Image
                  src={companyLogo}
                  alt={mentor.company}
                  width={24}
                  height={24}
                  className="size-full object-contain"
                  unoptimized
                />
              ) : (
                <Building2 className="size-3.5 text-slate-400" aria-hidden />
              )}
            </div>
            <span className="truncate text-sm font-semibold text-slate-700">{mentor.company}</span>
          </div>
        ) : null}

        {visibleTags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {visibleTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-full bg-[var(--brand-blue-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--brand-blue)]"
              >
                {tag.name}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto pt-6">
          <p className="text-[11px] font-extrabold tracking-[0.1em] text-[#737686] uppercase">
            Starting at
          </p>
          <p className="mt-1 font-[family-name:var(--font-headline)] text-2xl leading-none font-extrabold text-slate-950">
            NPR {sessionPrice}
            <span className="ml-1 text-sm font-medium text-slate-500">/ per session</span>
          </p>

          <button
            type="button"
            onClick={onOpen}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-[24px] bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-6 py-3 text-sm font-bold text-white transition-all hover:from-[#003fa8] hover:to-[#1d4ed8] active:scale-95"
          >
            Book Session
            <ArrowRight className="size-4" strokeWidth={2.6} />
          </button>
        </div>
      </div>
    </article>
  )
}

function MentorSlider({
  mentors,
  onOpen,
}: {
  mentors: FeaturedMentor[]
  onOpen: (m: FeaturedMentor) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const pausedRef = useRef(false)
  const [cardWidth, setCardWidth] = useState(0)

  useEffect(() => {
    const measure = () => {
      const card = trackRef.current?.querySelector<HTMLElement>('[data-mentor-card]')
      if (card) setCardWidth(card.offsetWidth + CARD_GAP_PX)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [mentors.length])

  useEffect(() => {
    if (cardWidth === 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const setWidth = cardWidth * mentors.length
    let frame = 0
    let lastTime = performance.now()

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000
      lastTime = now

      if (!pausedRef.current) {
        offsetRef.current += AUTO_SCROLL_PX_PER_SEC * dt
        if (offsetRef.current >= setWidth) offsetRef.current -= setWidth

        const track = trackRef.current
        if (track) track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [cardWidth, mentors.length])

  return (
    <div
      className="relative overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
      }}
      onMouseEnter={() => {
        pausedRef.current = true
      }}
      onMouseLeave={() => {
        pausedRef.current = false
      }}
    >
      <div ref={trackRef} className="flex w-max items-stretch gap-6">
        {[0, 1].map((groupIndex) => (
          <div key={groupIndex} aria-hidden={groupIndex === 1} className="flex shrink-0 gap-6">
            {mentors.map((mentor) => (
              <div
                key={`${mentor.id}-${groupIndex}`}
                data-mentor-card
                className="w-[280px] shrink-0 sm:w-[300px]"
              >
                <FeaturedMentorCard mentor={mentor} onOpen={() => onOpen(mentor)} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-slate-200/60">
      <p className="font-[family-name:var(--font-headline)] text-lg font-extrabold text-slate-950">
        No featured mentors yet
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Our team is curating the next round of picks. Check back soon.
      </p>
    </div>
  )
}

export function FeaturedMentorsSection() {
  const router = useRouter()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['mentors', 'featured', FEATURED_LIMIT],
    queryFn: () => getFeaturedMentors({ limit: FEATURED_LIMIT }),
    staleTime: 60 * 1000,
  })

  const mentors = data ?? []
  const showEmpty = !isLoading && !isError && mentors.length === 0

  const openProfile = (mentor: FeaturedMentor) => {
    router.push(
      `/featured-mentors/${getMentorProfileSlug({ id: mentor.id, full_name: mentor.user.full_name })}`
    )
  }

  return (
    <section
      id="featured-mentors"
      className="scroll-mt-24 px-6 pt-16 pb-20 sm:px-8 lg:pt-24 lg:pb-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl lg:mb-10">
          <h2 className="font-[family-name:var(--font-headline)] text-3xl leading-[1.05] font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Featured <span className="text-[var(--brand-blue)]">Mentors</span>
          </h2>
          <p className="mt-4 text-base leading-7 font-medium text-slate-500 sm:text-lg">
            Hand-picked mentors our team trusts to deliver standout sessions — book a slot with the
            best of the roster.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: FEATURED_LIMIT }).map((_, i) => (
              <FeaturedMentorCardSkeleton key={i} />
            ))}
          </div>
        ) : showEmpty ? (
          <EmptyState />
        ) : isError ? (
          <EmptyState />
        ) : mentors.length > SLIDER_THRESHOLD ? (
          <MentorSlider mentors={mentors} onOpen={openProfile} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mentors.map((mentor) => (
              <FeaturedMentorCard
                key={mentor.id}
                mentor={mentor}
                onOpen={() => openProfile(mentor)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
