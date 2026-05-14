'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { HOME_TESTIMONIALS } from '../lib/home.constants'

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeTestimonial = HOME_TESTIMONIALS[activeIndex]

  const showPrevious = useCallback(
    () =>
      setActiveIndex((currentIndex) =>
        currentIndex === 0 ? HOME_TESTIMONIALS.length - 1 : currentIndex - 1
      ),
    []
  )

  const showNext = useCallback(
    () =>
      setActiveIndex((currentIndex) =>
        currentIndex === HOME_TESTIMONIALS.length - 1 ? 0 : currentIndex + 1
      ),
    []
  )

  useEffect(() => {
    const intervalId = window.setInterval(showNext, 5500)

    return () => window.clearInterval(intervalId)
  }, [showNext])

  if (!activeTestimonial) {
    return null
  }

  return (
    <section className="relative overflow-hidden bg-[#eef4ff] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="relative">
          <div className="pointer-events-none mx-auto flex size-10 items-center justify-center text-[#b4c5ff]">
            <Quote className="size-10 fill-current stroke-0" aria-hidden="true" />
          </div>

          <div className="mt-7 overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {HOME_TESTIMONIALS.map((testimonial) => (
                <article
                  key={testimonial.name}
                  className="w-full shrink-0 px-1 text-center"
                  aria-hidden={testimonial.name !== activeTestimonial.name}
                >
                  <blockquote className="mx-auto max-w-3xl font-[family-name:var(--font-headline)] text-2xl leading-[1.12] font-semibold text-[#0f0e0ef6] sm:text-4xl">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>

                  <div className="mt-8 flex flex-col items-center">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={72}
                      height={72}
                      className="size-14 rounded-full border-4 border-white object-cover shadow-[0_10px_26px_rgba(18,28,42,0.16)]"
                    />
                    <p className="mt-4 font-[family-name:var(--font-headline)] text-sm font-extrabold text-[#121c2a]">
                      {testimonial.name}
                    </p>
                    <p className="mt-1 max-w-xs text-xs leading-5 text-[#737686]">
                      {testimonial.role}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div
            className="mt-8 flex items-center justify-center gap-3"
            aria-label="Choose testimonial"
          >
            {HOME_TESTIMONIALS.map((testimonial, index) => (
              <button
                key={testimonial.name}
                type="button"
                aria-label={`Show testimonial from ${testimonial.name}`}
                aria-current={activeIndex === index}
                onClick={() => setActiveIndex(index)}
                className="h-2.5 w-2.5 rounded-full bg-[#b4c5ff] transition-all focus-visible:ring-3 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none aria-current:w-8 aria-current:bg-[#004ac6]"
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Show previous testimonial"
          onClick={showPrevious}
          className="absolute top-1/2 left-4 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#d9e3f6] bg-white/86 text-[#434655] shadow-[0_14px_34px_rgba(18,28,42,0.1)] backdrop-blur transition hover:text-[#004ac6] focus-visible:ring-3 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none lg:flex"
        >
          <ChevronLeft className="size-6" />
        </button>

        <button
          type="button"
          aria-label="Show next testimonial"
          onClick={showNext}
          className="absolute top-1/2 right-4 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#d9e3f6] bg-white/86 text-[#434655] shadow-[0_14px_34px_rgba(18,28,42,0.1)] backdrop-blur transition hover:text-[#004ac6] focus-visible:ring-3 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none lg:flex"
        >
          <ChevronRight className="size-6" />
        </button>
      </div>

      <div className="mt-8 flex justify-center gap-3 lg:hidden">
        <button
          type="button"
          aria-label="Show previous testimonial"
          onClick={showPrevious}
          className="flex size-11 items-center justify-center rounded-full border border-[#d9e3f6] bg-white text-[#434655] shadow-[0_10px_24px_rgba(18,28,42,0.09)] transition hover:text-[#004ac6] focus-visible:ring-3 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Show next testimonial"
          onClick={showNext}
          className="flex size-11 items-center justify-center rounded-full border border-[#d9e3f6] bg-white text-[#434655] shadow-[0_10px_24px_rgba(18,28,42,0.09)] transition hover:text-[#004ac6] focus-visible:ring-3 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </section>
  )
}
