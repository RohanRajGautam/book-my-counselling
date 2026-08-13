'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { HOME_TESTIMONIALS } from '../lib/home.constants'

const AUTO_SCROLL_PX_PER_SEC = 28
const CARD_GAP_PX = 16

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
      className="flex w-[88%] shrink-0 flex-col rounded-3xl border border-slate-100 bg-white p-8 transition-all duration-300 hover:border-slate-200 hover:shadow-[0_24px_60px_-18px_rgba(15,23,42,0.18)] sm:w-[460px] sm:p-10"
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
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const pausedRef = useRef(false)
  const animFrameRef = useRef<number | null>(null)
  const reducedMotionRef = useRef(false)

  const [cardWidth, setCardWidth] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonialCount = HOME_TESTIMONIALS.length

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const measure = () => {
      const track = trackRef.current
      if (!track) return
      const card = track.querySelector<HTMLElement>('[data-card]')
      if (card) setCardWidth(card.offsetWidth + CARD_GAP_PX)
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
      const dt = (now - lastTime) / 1000
      lastTime = now

      if (!pausedRef.current) {
        offsetRef.current += AUTO_SCROLL_PX_PER_SEC * dt

        if (offsetRef.current >= setWidth) {
          offsetRef.current -= setWidth
        }

        const track = trackRef.current
        if (track) {
          track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`
        }

        const idx = Math.floor(offsetRef.current / cardWidth) % testimonialCount
        if (idx !== activeIndex) setActiveIndex(idx)
      }

      animFrameRef.current = requestAnimationFrame(tick)
    }

    animFrameRef.current = requestAnimationFrame(tick)
    return () => {
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current)
    }
  }, [cardWidth, testimonialCount, activeIndex])

  const handleDotClick = (index: number) => {
    if (cardWidth === 0) return
    offsetRef.current = index * cardWidth
    const track = trackRef.current
    if (track) {
      track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`
    }
    setActiveIndex(index)
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
          {/* <p className="text-xs font-extrabold tracking-[0.18em] text-[#004ac6] uppercase">
            In their words
          </p> */}
          <h2 className="mt-4 font-[family-name:var(--font-headline)] text-3xl leading-[1.05] font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Stories from the people we mentor.
          </h2>
        </div>

        <div
          className="relative mt-12 overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div ref={trackRef} className="flex w-max items-stretch gap-4">
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

        <div
          className="mt-10 flex items-center justify-center gap-2.5"
          aria-label="Choose testimonial"
        >
          {HOME_TESTIMONIALS.map((testimonial, index) => (
            <button
              key={testimonial.name}
              type="button"
              aria-label={`Show testimonial from ${testimonial.name}`}
              aria-current={activeIndex === index}
              onClick={() => handleDotClick(index)}
              className="h-2 rounded-full transition-all focus-visible:ring-3 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none aria-current:w-8 aria-current:bg-[#004ac6] aria-[current=false]:w-2 aria-[current=false]:bg-slate-300"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
