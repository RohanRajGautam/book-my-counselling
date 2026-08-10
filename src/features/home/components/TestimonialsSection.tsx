'use client'

import type { TransitionEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { HOME_TESTIMONIALS } from '../lib/home.constants'

function CarouselDot({
  isActive,
  isAnimating,
  onSelect,
  name,
}: {
  isActive: boolean
  isAnimating: boolean
  onSelect: () => void
  name: string
}) {
  return (
    <button
      type="button"
      aria-label={`Show testimonial from ${name}`}
      aria-current={isActive}
      disabled={isAnimating}
      onClick={onSelect}
      className="h-2.5 w-2.5 rounded-full bg-[#b4c5ff] transition-all focus-visible:ring-3 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none aria-current:w-8 aria-current:bg-[#004ac6]"
    />
  )
}

function CarouselArrow({
  direction,
  onClick,
  isAnimating,
  size,
  className,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  isAnimating: boolean
  size: 11 | 12
  className?: string
}) {
  const isLarge = size === 12
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
  const hoverTranslate = isLarge
    ? direction === 'prev'
      ? 'hover:-translate-x-0.5'
      : 'hover:translate-x-0.5'
    : ''

  return (
    <button
      type="button"
      aria-label={direction === 'prev' ? 'Show previous testimonial' : 'Show next testimonial'}
      disabled={isAnimating}
      onClick={onClick}
      className={`flex ${
        isLarge ? 'size-12 backdrop-blur' : 'size-11'
      } items-center justify-center rounded-full border border-[#d9e3f6] bg-white text-[#434655] shadow-[0_10px_24px_rgba(18,28,42,0.09)] transition ${hoverTranslate} hover:text-[#004ac6] focus-visible:ring-3 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ''}`}
    >
      <Icon className={isLarge ? 'size-6' : 'size-5'} />
    </button>
  )
}

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [slideIndex, setSlideIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const activeTestimonial = HOME_TESTIMONIALS[activeIndex]
  const testimonialCount = HOME_TESTIMONIALS.length
  const firstTestimonial = HOME_TESTIMONIALS[0]
  const lastTestimonial = HOME_TESTIMONIALS[testimonialCount - 1]
  const carouselTestimonials =
    firstTestimonial && lastTestimonial
      ? [lastTestimonial, ...HOME_TESTIMONIALS, firstTestimonial]
      : HOME_TESTIMONIALS

  const showPrevious = useCallback(() => {
    if (isAnimating) {
      return
    }

    setIsAnimating(true)
    setIsTransitioning(true)
    setSlideIndex((currentIndex) => currentIndex - 1)
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? HOME_TESTIMONIALS.length - 1 : currentIndex - 1
    )
  }, [isAnimating])

  const showNext = useCallback(() => {
    if (isAnimating) {
      return
    }

    setIsAnimating(true)
    setIsTransitioning(true)
    setSlideIndex((currentIndex) => currentIndex + 1)
    setActiveIndex((currentIndex) =>
      currentIndex === HOME_TESTIMONIALS.length - 1 ? 0 : currentIndex + 1
    )
  }, [isAnimating])

  useEffect(() => {
    const intervalId = window.setInterval(showNext, 5500)

    return () => window.clearInterval(intervalId)
  }, [showNext])

  useEffect(() => {
    if (!isTransitioning) {
      const animationFrameId = window.requestAnimationFrame(() => setIsTransitioning(true))

      return () => window.cancelAnimationFrame(animationFrameId)
    }

    return undefined
  }, [isTransitioning])

  if (!activeTestimonial) {
    return null
  }

  const showTestimonial = (index: number) => {
    if (isAnimating || index === activeIndex) {
      return
    }

    setIsAnimating(true)
    setIsTransitioning(true)
    setActiveIndex(index)
    setSlideIndex(index + 1)
  }

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform') {
      return
    }

    setIsAnimating(false)

    if (slideIndex === 0) {
      setIsTransitioning(false)
      setSlideIndex(testimonialCount)
      return
    }

    if (slideIndex === testimonialCount + 1) {
      setIsTransitioning(false)
      setSlideIndex(1)
    }
  }

  return (
    <section className="relative isolate overflow-hidden px-6 py-14 sm:px-8 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.92),transparent_34%),linear-gradient(180deg,#eef4ff_0%,#f8f9ff_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-[linear-gradient(90deg,transparent,#b4c5ff,transparent)]" />

      <div className="mx-auto max-w-6xl">
        <div className="relative rounded-3xl px-5 py-8 sm:px-8 sm:py-10 lg:px-16 lg:py-14">
          <div className="pointer-events-none absolute top-6 right-6 hidden size-16 items-center justify-center text-[#d9e3f6] sm:flex">
            <Quote className="size-16 fill-current stroke-0" aria-hidden="true" />
          </div>

          <div className="overflow-hidden">
            <div
              className={
                isTransitioning
                  ? 'flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
                  : 'flex'
              }
              style={{ transform: `translateX(-${slideIndex * 100}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {carouselTestimonials.map((testimonial, index) => (
                <article
                  key={`${testimonial.name}-${index}`}
                  className="w-full shrink-0 px-1 text-center"
                  aria-hidden={testimonial.name !== activeTestimonial.name}
                >
                  <div className="mx-auto flex max-w-3xl flex-col items-center">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={160}
                      height={160}
                      sizes="(min-width: 640px) 128px, 104px"
                      className="size-26 rounded-full border-4 border-white object-cover shadow-[0_18px_38px_rgba(18,28,42,0.18)] ring-1 ring-[#d9e3f6] sm:size-32"
                    />
                    <p className="mt-5 font-[family-name:var(--font-headline)] text-2xl font-extrabold text-[#121c2a] sm:text-3xl">
                      {testimonial.name}
                    </p>
                    <p className="mt-2 max-w-sm text-sm leading-6 font-semibold text-[#434655] sm:text-base">
                      {testimonial.role}
                    </p>
                  </div>

                  <blockquote className="mx-auto mt-8 max-w-4xl font-[family-name:var(--font-headline)] text-[1.65rem] leading-[1.18] font-semibold text-[#19222e] sm:mt-10 sm:text-4xl">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                </article>
              ))}
            </div>
          </div>

          <div
            className="mt-8 flex items-center justify-center gap-3"
            aria-label="Choose testimonial"
          >
            {HOME_TESTIMONIALS.map((testimonial, index) => (
              <CarouselDot
                key={testimonial.name}
                name={testimonial.name}
                isActive={activeIndex === index}
                isAnimating={isAnimating}
                onSelect={() => showTestimonial(index)}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-3 lg:hidden">
            <CarouselArrow direction="prev" onClick={showPrevious} isAnimating={isAnimating} size={11} />
            <CarouselArrow direction="next" onClick={showNext} isAnimating={isAnimating} size={11} />
          </div>
        </div>

        <CarouselArrow
          direction="prev"
          onClick={showPrevious}
          isAnimating={isAnimating}
          size={12}
          className="absolute top-1/2 left-6 hidden -translate-y-1/2 lg:flex"
        />
        <CarouselArrow
          direction="next"
          onClick={showNext}
          isAnimating={isAnimating}
          size={12}
          className="absolute top-1/2 right-6 hidden -translate-y-1/2 lg:flex"
        />
      </div>
    </section>
  )
}
