'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

const exclusiveEvents = [
  {
    name: 'Dr. Kamala Shrestha',
    role: 'Women Entrepreneur Leader',
    logoLabel: '/home/exclusive-events/fuse.png',
    image: '/home/exclusive-events/kamala.jpeg',
    description:
      'Dr. Kamala Shrestha is a pioneering Nepalese beautician, entrepreneur, educator, and social leader who founded Siam Beauty Salon and Siam Institute of Hair Design and Beauty Care, played a major role in professionalizing Nepal’s beauty industry, and held leadership positions in organizations like FNCCI and Beautician Professional Association Nepal. She has received numerous national and international recognitions, trained countless beauticians, represented Nepal globally through entrepreneurship and women empowerment initiatives, and was honored with awards including Nepal Government’s Prabal Jana Padh and the NEWBIZ Lifetime Achievement Award.',
    cta: 'Request for Webinar',
    date: 'Jun 08',
  },
  {
    name: 'Nirmal Thapa',
    role: 'Director of Client Relations',
    company: 'Book My Counselling',
    logoLabel: '/home/exclusive-events/fuse.png',
    image: '/home/exclusive-events/nirmal_thapa.png',
    description:
      'Synthesizing human-centric design with data-driven growth to redefine the global travel experience.',
    cta: 'Request for Webinar',
    date: 'Jun 15',
  },
  {
    name: 'Prayash Poudel',
    role: 'Principal AI Scientist',
    company: 'Andreessen Horowitz',
    logoLabel: '/home/exclusive-events/leapfrog.png',
    image: '/home/exclusive-events/prayash_poudel.png',
    description:
      'Leading breakthroughs in neural linguistic programming and ethical AI deployment for billions of users.',
    cta: 'Request for Webinar',
    date: 'Jun 22',
  },
  {
    name: 'Biplab Subedi',
    role: 'Managing Director',
    company: 'OpenAI',
    logoLabel: '/home/exclusive-events/gold.png',
    image: '/home/exclusive-events/biplab_subedi.png',
    description:
      'Expert in venture capital cycles and strategic mergers within the burgeoning global technology sector.',
    cta: 'Request for Webinar',
    date: 'Jun 29',
  },
] as const

export function ExclusiveEventsSection() {
  const railRef = useRef<HTMLDivElement>(null)

  const scrollEvents = (direction: 'previous' | 'next') => {
    const rail = railRef.current

    if (!rail) {
      return
    }

    rail.scrollBy({
      left: direction === 'next' ? rail.clientWidth * 0.86 : -rail.clientWidth * 0.86,
      behavior: 'smooth',
    })
  }

  return (
    <section className="px-4 pb-20 sm:px-8 lg:pb-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-extrabold tracking-[0.18em] text-[#004ac6] uppercase">
              Mentorship redefined
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-headline)] text-4xl leading-[1.05] font-extrabold text-[#121c2a] sm:text-5xl lg:text-6xl">
              Exclusive Events
            </h2>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              aria-label="Show previous events"
              onClick={() => scrollEvents('previous')}
              className="flex size-12 items-center justify-center rounded-full bg-[#e6eeff] text-[#121c2a] transition hover:bg-[#dbe6ff] hover:text-[#004ac6] focus-visible:ring-3 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none"
            >
              <ChevronLeft className="size-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Show next events"
              onClick={() => scrollEvents('next')}
              className="flex size-12 items-center justify-center rounded-full bg-[#e6eeff] text-[#121c2a] transition hover:bg-[#dbe6ff] hover:text-[#004ac6] focus-visible:ring-3 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none"
            >
              <ChevronRight className="size-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={railRef}
          className="-mx-4 mt-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-5 [scrollbar-width:none] sm:-mx-8 sm:mt-6 sm:gap-6 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {exclusiveEvents.map((event) => (
            <article
              key={event.name}
              className="flex min-h-[560px] w-[82vw] max-w-[360px] shrink-0 snap-start flex-col rounded-xl bg-white p-3 shadow-[0_18px_50px_rgba(18,28,42,0.08)] ring-1 ring-[#d9e3f6]/55 sm:w-[44vw] lg:w-auto lg:max-w-none"
            >
              <div className="relative aspect-[3/5] overflow-hidden rounded-xl bg-[#eff4ff]">
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  sizes="(min-width: 1024px) 280px, (min-width: 640px) 44vw, 82vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute bottom-4 left-4 flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-md bg-white/92 px-3 py-2 text-xs font-extrabold text-[#121c2a] shadow-[0_10px_24px_rgba(18,28,42,0.16)] backdrop-blur">
                  <div className="relative h-6 w-28">
                    <Image src={event.logoLabel} alt={event.name} fill className="object-contain" />
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col px-2 pt-7">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-[family-name:var(--font-headline)] text-2xl leading-tight font-extrabold text-[#121c2a]">
                      {event.name}
                    </h3>
                    <p className="mt-2 text-base leading-6 font-bold text-[#004ac6]">
                      {event.role}
                    </p>
                  </div>
                </div>

                <p className="mt-2 mb-4 line-clamp-4 text-base leading-7 text-[#434655]">
                  {event.description}
                </p>

                <button
                  type="button"
                  className="mt-auto w-full rounded-full bg-[#004ac6] px-5 py-4 text-center text-base font-extrabold text-white shadow-[0_14px_28px_rgba(0,74,198,0.26)] transition hover:-translate-y-0.5 hover:bg-[#003fa8] focus-visible:ring-3 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none"
                >
                  {event.cta}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
