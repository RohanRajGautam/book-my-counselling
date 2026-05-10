'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    name: 'Hannah Schmitt',
    role: 'Lead designer',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
    quote:
      'The mentoring sessions helped me turn a scattered career plan into a clear path. My counsellor understood what I needed, challenged my assumptions, and helped me take the next step with confidence.',
  },
  {
    name: 'Marcus Lee',
    role: 'Product manager',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
    quote:
      'I came in looking for practical advice and left with a stronger portfolio, better interview answers, and a mentor who made the whole process feel manageable.',
  },
  {
    name: 'Priya Adhikari',
    role: 'Graduate applicant',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
    quote:
      'Book Your Counselling matched me with someone who knew my target schools and my field. The guidance was specific, warm, and exactly what I needed before applying.',
  },
]

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeTestimonial = testimonials[activeIndex]

  const controls = useMemo(
    () => ({
      previous: () =>
        setActiveIndex((currentIndex) =>
          currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1
        ),
      next: () =>
        setActiveIndex((currentIndex) =>
          currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1
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
    <section className="relative mb-48 bg-[#f8f9ff] px-4 py-20 sm:py-12">
      <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-4 sm:gap-8">
        <button
          type="button"
          aria-label="Show previous testimonial"
          onClick={controls.previous}
          className="z-20 flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-[#434655] shadow-[0_10px_28px_rgba(18,28,42,0.12)] transition hover:text-[#004ac6] focus-visible:ring-3 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none sm:size-20"
        >
          <ChevronLeft className="size-7 sm:size-9" />
        </button>

        <div className="relative min-h-[440px] flex-1">
          <div className="absolute top-0 left-1/2 hidden h-[440px] w-[600px] -translate-x-[35%] rounded-[52%_48%_46%_54%/48%_50%_50%_52%] bg-[#0753c7] sm:block lg:h-[590px] lg:w-[760px]" />

          <div className="absolute inset-x-2 top-22 mx-auto hidden h-[320px] max-w-4xl rounded-[22px] bg-white/80 shadow-[0_10px_30px_rgba(18,28,42,0.08)] sm:block sm:translate-x-10" />
          <div className="absolute inset-x-4 top-18 mx-auto hidden h-[340px] max-w-4xl rounded-[22px] bg-white/90 shadow-[0_10px_30px_rgba(18,28,42,0.08)] sm:block sm:translate-x-5" />

          <article className="absolute inset-x-0 top-8 mx-auto max-w-4xl rounded-[22px] bg-white px-6 pt-24 pb-10 text-center shadow-[0_14px_34px_rgba(18,28,42,0.12)] sm:top-18 sm:px-12 sm:pt-24 sm:pb-14 lg:px-16">
            <Image
              src={activeTestimonial.image}
              alt={activeTestimonial.name}
              width={112}
              height={112}
              className="absolute top-0 left-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white object-cover shadow-[0_10px_24px_rgba(18,28,42,0.18)]"
            />

            <h2 className="text-3xl font-extrabold text-[#3b3d44]">{activeTestimonial.name}</h2>
            <p className="mt-3 text-xl font-medium text-[#434655]">{activeTestimonial.role}</p>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-[#3b3d44] sm:text-xl sm:leading-9">
              {activeTestimonial.quote}
            </p>

            <div className="mt-8 flex justify-center gap-3" aria-label="Choose testimonial">
              {testimonials.map((testimonial, index) => (
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
          className="z-20 flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-[#434655] shadow-[0_10px_28px_rgba(18,28,42,0.12)] transition hover:text-[#004ac6] focus-visible:ring-3 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none sm:size-20"
        >
          <ChevronRight className="size-7 sm:size-9" />
        </button>
      </div>
    </section>
  )
}
