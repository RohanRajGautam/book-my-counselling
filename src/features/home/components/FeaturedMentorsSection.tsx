'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Building2, ChevronLeft, ChevronRight } from 'lucide-react'

import { getFeaturedMentors, type FeaturedMentor } from '@/features/mentors/api/featuredMentors.api'
import { getMentorProfileSlug } from '@/features/mentors/utils/mentors.utils'

import { FeaturedMentorCardSkeleton } from './FeaturedMentorCardSkeleton'

const FEATURED_LIMIT = 8
const SLIDER_THRESHOLD = 4
const AUTO_SCROLL_PX_PER_SEC = 28
const CARD_GAP_PX = 24
const MANUAL_ANIM_MS = 450

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

        <p className="mt-2 truncate text-sm leading-5 font-semibold text-[var(--brand-blue)]">
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
  const mobileTrackRef = useRef<HTMLDivElement>(null)
  const desktopTrackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const pausedRef = useRef(false)
  const animFrameRef = useRef<number | null>(null)
  const modeRef = useRef<'auto' | 'manual'>('auto')
  const manualAnimRef = useRef({ startTime: 0, from: 0, to: 0, targetIndex: 0 })
  const [cardWidth, setCardWidth] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  const mentorCount = mentors.length

  useEffect(() => {
    const measure = () => {
      const card = desktopTrackRef.current?.querySelector<HTMLElement>('[data-mentor-card]')
      if (card && card.offsetWidth > 0) setCardWidth(card.offsetWidth + CARD_GAP_PX)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [mentorCount])

  useEffect(() => {
    if (cardWidth === 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const setWidth = cardWidth * mentorCount
    let lastTime = performance.now()

    const tick = (now: number) => {
      if (modeRef.current === 'manual') {
        const anim = manualAnimRef.current
        const elapsed = now - anim.startTime
        const t = Math.min(elapsed / MANUAL_ANIM_MS, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        const next = anim.from + (anim.to - anim.from) * eased
        offsetRef.current = next

        const track = desktopTrackRef.current
        if (track) track.style.transform = `translate3d(-${next}px, 0, 0)`

        if (t >= 1) {
          offsetRef.current = anim.to
          if (track) track.style.transform = `translate3d(-${anim.to}px, 0, 0)`
          modeRef.current = 'auto'
          lastTime = now
          setActiveIndex(anim.targetIndex)
        }
      } else if (!pausedRef.current) {
        const dt = (now - lastTime) / 1000
        lastTime = now

        offsetRef.current += AUTO_SCROLL_PX_PER_SEC * dt
        if (setWidth > 0 && offsetRef.current >= setWidth) offsetRef.current -= setWidth

        const track = desktopTrackRef.current
        if (track) track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`

        const idx = Math.floor(offsetRef.current / cardWidth) % mentorCount
        if (idx !== activeIndex) setActiveIndex(idx)
      } else {
        lastTime = now
      }

      animFrameRef.current = requestAnimationFrame(tick)
    }

    animFrameRef.current = requestAnimationFrame(tick)
    return () => {
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current)
    }
  }, [cardWidth, mentorCount, activeIndex])

  useEffect(() => {
    const track = mobileTrackRef.current
    if (!track) return

    const onScroll = () => {
      const card = track.querySelector<HTMLElement>('[data-mentor-card]')
      if (!card) return
      const cardW = card.offsetWidth + CARD_GAP_PX
      if (cardW === 0) return
      const raw = Math.round(track.scrollLeft / cardW)
      const idx = ((raw % mentorCount) + mentorCount) % mentorCount
      setActiveIndex(idx)
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [mentorCount])

  const scrollMobileTo = (index: number) => {
    const track = mobileTrackRef.current
    const card = track?.querySelector<HTMLElement>('[data-mentor-card]')
    if (!track || !card) return
    const cardW = card.offsetWidth + CARD_GAP_PX
    track.scrollTo({ left: index * cardW, behavior: 'smooth' })
  }

  const jumpDesktopTo = (index: number) => {
    if (cardWidth === 0) return
    const target = index * cardWidth
    if (Math.abs(target - offsetRef.current) < 1) return

    manualAnimRef.current = {
      startTime: performance.now(),
      from: offsetRef.current,
      to: target,
      targetIndex: index,
    }
    modeRef.current = 'manual'
  }

  const handlePrev = () => {
    const prev = (activeIndex - 1 + mentorCount) % mentorCount
    scrollMobileTo(prev)
    jumpDesktopTo(prev)
  }

  const handleNext = () => {
    const next = (activeIndex + 1) % mentorCount
    scrollMobileTo(next)
    jumpDesktopTo(next)
  }

  return (
    <div>
      <div
        ref={mobileTrackRef}
        className="flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] sm:hidden [&::-webkit-scrollbar]:hidden"
      >
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            data-mentor-card
            className="w-[84%] shrink-0 snap-start"
          >
            <FeaturedMentorCard mentor={mentor} onOpen={() => onOpen(mentor)} />
          </div>
        ))}
      </div>

      <div
        className="relative hidden overflow-hidden sm:block"
        onMouseEnter={() => {
          pausedRef.current = true
        }}
        onMouseLeave={() => {
          pausedRef.current = false
        }}
      >
        <div ref={desktopTrackRef} className="flex w-max items-stretch gap-6">
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

      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          type="button"
          aria-label="Previous mentor"
          onClick={handlePrev}
          className="grid size-10 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004ac6]/30"
        >
          <ChevronLeft className="size-5" strokeWidth={2.2} />
        </button>

        <div
          className="flex items-center gap-2"
          aria-label="Choose mentor"
          role="tablist"
        >
          {mentors.map((mentor, index) => (
            <button
              key={mentor.id}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-label={`Show mentor ${mentor.user.full_name}`}
              onClick={() => {
                scrollMobileTo(index)
                jumpDesktopTo(index)
              }}
              className="h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004ac6]/30 aria-[selected=true]:w-7 aria-[selected=true]:bg-[#004ac6] aria-[selected=false]:w-1.5 aria-[selected=false]:bg-slate-300"
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next mentor"
          onClick={handleNext}
          className="grid size-10 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004ac6]/30"
        >
          <ChevronRight className="size-5" strokeWidth={2.2} />
        </button>
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
