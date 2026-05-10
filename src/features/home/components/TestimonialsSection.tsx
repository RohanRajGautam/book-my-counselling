'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { HOME_TESTIMONIALS } from '../lib/home.constants'

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeTestimonial = HOME_TESTIMONIALS[activeIndex]

  const controls = useMemo(
    () => ({
      previous: () =>
        setActiveIndex((currentIndex) =>
          currentIndex === 0 ? HOME_TESTIMONIALS.length - 1 : currentIndex - 1
        ),
      next: () =>
        setActiveIndex((currentIndex) =>
          currentIndex === HOME_TESTIMONIALS.length - 1 ? 0 : currentIndex + 1
        ),
    }),
    []
  )

  useEffect(() => {
    const intervalId = window.setInterval(controls.next, 5000)

    return () => window.clearInterval(intervalId)
  }, [controls])

  if (!activeTestimonial) {
    return null
  }

  return (
    <section className="relative mb-28 px-4 py-16 sm:py-26">
      <div className="relative mx-auto flex max-w-7xl items-center justify-center sm:gap-8">
        <button
          type="button"
          aria-label="Show previous testimonial"
          onClick={controls.previous}
          className="z-20 hidden size-12 shrink-0 items-center justify-center rounded-full bg-white text-[#434655] shadow-[0_10px_28px_rgba(18,28,42,0.12)] transition hover:text-[#004ac6] focus-visible:ring-3 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none sm:flex sm:size-20"
        >
          <ChevronLeft className="size-7 sm:size-9" />
        </button>

        <div className="relative w-full sm:min-h-[440px] sm:flex-1">
          <div className="absolute top-0 left-1/2 hidden h-[440px] w-[600px] -translate-x-[35%] rounded-[52%_48%_46%_54%/48%_50%_50%_52%] bg-[#0753c7] sm:block lg:h-[590px] lg:w-[760px]" />

          <div className="absolute inset-x-2 top-22 mx-auto hidden h-[320px] max-w-4xl rounded-[22px] bg-white/80 shadow-[0_10px_30px_rgba(18,28,42,0.08)] sm:block sm:translate-x-10" />
          <div className="absolute inset-x-4 top-18 mx-auto hidden h-[340px] max-w-4xl rounded-[22px] bg-white/90 shadow-[0_10px_30px_rgba(18,28,42,0.08)] sm:block sm:translate-x-5" />

          <article className="relative mx-auto w-full rounded-[22px] bg-white px-5 pt-20 pb-8 text-center shadow-[0_14px_34px_rgba(18,28,42,0.12)] sm:absolute sm:inset-x-0 sm:top-18 sm:max-w-4xl sm:px-12 sm:pt-24 sm:pb-14 lg:px-16">
            <Image
              src={activeTestimonial.image}
              alt={activeTestimonial.name}
              width={112}
              height={112}
              className="absolute top-0 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white object-cover shadow-[0_10px_24px_rgba(18,28,42,0.18)] sm:size-28"
            />

            <h2 className="text-2xl font-extrabold text-[#3b3d44] sm:text-3xl">
              {activeTestimonial.name}
            </h2>
            <p className="mt-2 text-base font-medium text-[#434655] sm:mt-3 sm:text-xl">
              {activeTestimonial.role}
            </p>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-[#3b3d44] sm:mt-8 sm:text-xl sm:leading-9">
              {activeTestimonial.quote}
            </p>

            <div className="mt-8 flex justify-center gap-3" aria-label="Choose testimonial">
              {HOME_TESTIMONIALS.map((testimonial, index) => (
                <button
                  key={testimonial.name}
                  type="button"
                  aria-label={`Show testimonial from ${testimonial.name}`}
                  aria-current={activeIndex === index}
                  onClick={() => setActiveIndex(index)}
                  className="size-2.5 rounded-full bg-[#c3c6d7] transition aria-current:w-8 aria-current:bg-[#004ac6]"
                />
              ))}
            </div>
          </article>
        </div>

        <button
          type="button"
          aria-label="Show next testimonial"
          onClick={controls.next}
          className="z-20 hidden size-12 shrink-0 items-center justify-center rounded-full bg-white text-[#434655] shadow-[0_10px_28px_rgba(18,28,42,0.12)] transition hover:text-[#004ac6] focus-visible:ring-3 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none sm:flex sm:size-20"
        >
          <ChevronRight className="size-7 sm:size-9" />
        </button>
      </div>

      <div className="mt-6 flex justify-center gap-4 sm:hidden">
        <button
          type="button"
          aria-label="Show previous testimonial"
          onClick={controls.previous}
          className="flex size-12 items-center justify-center rounded-full bg-white text-[#434655] shadow-[0_10px_28px_rgba(18,28,42,0.12)] transition hover:text-[#004ac6] focus-visible:ring-3 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none"
        >
          <ChevronLeft className="size-7" />
        </button>
        <button
          type="button"
          aria-label="Show next testimonial"
          onClick={controls.next}
          className="flex size-12 items-center justify-center rounded-full bg-white text-[#434655] shadow-[0_10px_28px_rgba(18,28,42,0.12)] transition hover:text-[#004ac6] focus-visible:ring-3 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none"
        >
          <ChevronRight className="size-7" />
        </button>
      </div>
    </section>
  )
}
