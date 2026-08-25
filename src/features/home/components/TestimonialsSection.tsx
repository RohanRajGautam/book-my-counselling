'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { HOME_TESTIMONIALS } from '../lib/home.constants'

const AUTO_SCROLL_PX_PER_SEC = 28
const CARD_GAP_PX = 16
const MANUAL_ANIM_MS = 450

function TagPill({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#6cf8bb]/35 px-2.5 py-1 text-[11px] font-extrabold tracking-[0.04em] text-[#003ea8] uppercase">
      {tag}
    </span>
  )
}

function TestimonialCard({ testimonial }: { testimonial: (typeof HOME_TESTIMONIALS)[number] }) {
  return (
    <article
      data-card
      className="flex w-[88%] shrink-0 snap-start flex-col rounded-3xl border border-slate-100 bg-white p-8 transition-all duration-300 hover:border-slate-200 hover:shadow-[0_24px_60px_-18px_rgba(15,23,42,0.18)] sm:w-[460px] sm:p-10"
    >
      <blockquote className="font-[family-name:var(--font-body)] text-lg leading-[1.65] font-medium text-slate-800">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <div className="mt-auto flex items-center gap-4 pt-10">
        <div className="size-12 shrink-0 overflow-hidden rounded-full shadow-[0_8px_18px_rgba(15,23,42,0.14)] ring-1 ring-slate-100">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            width={96}
            height={96}
            className="size-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-[family-name:var(--font-headline)] text-base font-extrabold text-slate-950">
              {testimonial.name}
            </p>
            <TagPill tag={testimonial.tag} />
          </div>
          <p className="mt-1 truncate text-sm text-slate-500">{testimonial.role}</p>
        </div>
      </div>
    </article>
  )
}

export function TestimonialsSection() {
  const mobileTrackRef = useRef<HTMLDivElement>(null)
  const desktopTrackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const pausedRef = useRef(false)
  const animFrameRef = useRef<number | null>(null)
  const reducedMotionRef = useRef(false)
  const modeRef = useRef<'auto' | 'manual'>('auto')
  const manualAnimRef = useRef({ startTime: 0, from: 0, to: 0, targetIndex: 0 })

  const [cardWidth, setCardWidth] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonialCount = HOME_TESTIMONIALS.length

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const measure = () => {
      const track = desktopTrackRef.current
      if (!track) return
      const card = track.querySelector<HTMLElement>('[data-card]')
      if (card && card.offsetWidth > 0) setCardWidth(card.offsetWidth + CARD_GAP_PX)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    if (reducedMotionRef.current) return
    if (cardWidth === 0) return

    let lastTime = performance.now()
    const setWidth = cardWidth * testimonialCount

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
        if (track) {
          track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`
        }

        const idx = Math.floor(offsetRef.current / cardWidth) % testimonialCount
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
  }, [cardWidth, testimonialCount, activeIndex])

  useEffect(() => {
    const track = mobileTrackRef.current
    if (!track) return

    const onScroll = () => {
      const card = track.querySelector<HTMLElement>('[data-card]')
      if (!card) return
      const cardW = card.offsetWidth + CARD_GAP_PX
      if (cardW === 0) return
      const raw = Math.round(track.scrollLeft / cardW)
      const idx = ((raw % testimonialCount) + testimonialCount) % testimonialCount
      setActiveIndex(idx)
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [testimonialCount])

  const scrollMobileTo = (index: number) => {
    const track = mobileTrackRef.current
    const card = track?.querySelector<HTMLElement>('[data-card]')
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

  const handleDotClick = (index: number) => {
    scrollMobileTo(index)
    jumpDesktopTo(index)
  }

  const handlePrev = () => {
    handleDotClick((activeIndex - 1 + testimonialCount) % testimonialCount)
  }

  const handleNext = () => {
    handleDotClick((activeIndex + 1) % testimonialCount)
  }

  const handleMouseEnter = () => {
    pausedRef.current = true
  }
  const handleMouseLeave = () => {
    pausedRef.current = false
  }

  return (
    <section className="relative isolate bg-[#f8fafc] px-6 pt-0 pb-4 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <h2 className="mt-4 font-[family-name:var(--font-headline)] text-3xl leading-[1.05] font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Stories from the people we mentor.
          </h2>
        </div>

        <div
          ref={mobileTrackRef}
          className="mt-12 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] sm:hidden [&::-webkit-scrollbar]:hidden"
        >
          {HOME_TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>

        <div
          className="relative mt-12 hidden overflow-hidden sm:block"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div ref={desktopTrackRef} className="flex w-max items-stretch gap-4">
            {[0, 1].map((groupIndex) => (
              <div
                key={groupIndex}
                aria-hidden={groupIndex === 1}
                className="flex shrink-0 items-stretch gap-4"
              >
                {HOME_TESTIMONIALS.map((testimonial) => (
                  <TestimonialCard
                    key={`${testimonial.name}-${groupIndex}`}
                    testimonial={testimonial}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-5">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={handlePrev}
            className="grid size-10 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004ac6]/30"
          >
            <ChevronLeft className="size-5" strokeWidth={2.2} />
          </button>

          <div
            className="flex items-center gap-2"
            aria-label="Choose testimonial"
          >
            {HOME_TESTIMONIALS.map((testimonial, index) => (
              <button
                key={testimonial.name}
                type="button"
                aria-label={`Show testimonial from ${testimonial.name}`}
                aria-current={activeIndex === index}
                onClick={() => handleDotClick(index)}
                className="h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004ac6]/30 aria-current:w-7 aria-current:bg-[#004ac6] aria-[current=false]:w-1.5 aria-[current=false]:bg-slate-300"
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next testimonial"
            onClick={handleNext}
            className="grid size-10 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004ac6]/30"
          >
            <ChevronRight className="size-5" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </section>
  )
}
