'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { WebinarRequestModal } from './WebinarRequestModal'

export interface ExclusiveEvent {
  name: string
  role: string
  expertise: string
  logoLabel?: string
  image: string
  description: string
  cta: string
  date: string
}

const exclusiveEvents: ExclusiveEvent[] = [
  {
    name: 'Dr. Kamala Shrestha',
    role: 'Women Entrepreneur Leader',
    expertise: 'Expertise: Beauty Industry Advocacy, Women Entrepreneurship & Leadership',
    logoLabel: '/home/exclusive-events/siam.svg',
    image: '/home/exclusive-events/kamala.jpeg',
    description:
      'Founder of Siam Beauty Salon and Siam Institute, Dr. Kamala Shrestha has helped shape Nepal’s beauty industry while empowering women through entrepreneurship and professional education.',
    cta: 'Request for Webinar',
    date: 'Jun 08',
  },
  {
    name: 'Nirmal Thapa',
    role: 'Director of Client Relations',
    expertise: 'Expertise: Client Relations, Customer Success, Sales, Marketing, Leadership',
    image: '/home/exclusive-events/nirmal_thapa.png',
    description:
      'With over 12 years of experience working with US clients, Nirmal Thapa equips professionals with practical skills to thrive in global client-facing environments.',
    cta: 'Request for Webinar',
    date: 'Jun 15',
  },
  {
    name: 'Prayash Poudel',
    role: 'Principal AI Engineer',
    expertise: 'Expertise: Software Engineering, Enterprise Systems, SAP',
    logoLabel: '/home/exclusive-events/leapfrog.png',
    image: '/home/exclusive-events/prayash_poudel.png',
    description:
      'A software engineer since 2013, Prayash Poudel has built enterprise solutions across healthcare, finance, and SAP, delivering software used by organizations worldwide.',
    cta: 'Request for Webinar',
    date: 'Jun 22',
  },
  {
    name: 'Biplab Subedi',
    role: 'Agile Master at Snappet',
    expertise: 'Expertise: Lean-Agile Coaching, Radical Transparency, Self-Managing Teams',
    logoLabel: '/home/exclusive-events/snappet.png',
    image: '/home/exclusive-events/biplab_subedi.png',
    description:
      'With over 16 years of experience, Biplab Subedi helps organizations build self-managing teams and foster continuous improvement through modern agile practices.',
    cta: 'Request for Webinar',
    date: 'Jun 29',
  },
] as const

export function ExclusiveEventsSection() {
  const railRef = useRef<HTMLDivElement>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState('')

  const scrollEvents = (direction: 'previous' | 'next') => {
    const rail = railRef.current

    if (!rail) return

    rail.scrollBy({
      left: direction === 'next' ? rail.clientWidth * 0.86 : -rail.clientWidth * 0.86,
      behavior: 'smooth',
    })
  }

  function openModal(eventName: string) {
    setSelectedEvent(eventName)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  return (
    <>
      <section className="px-4 pb-20 sm:px-8 lg:pb-28">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="mt-4 font-[family-name:var(--font-headline)] text-4xl leading-[1.05] font-extrabold text-[#121c2a] sm:text-5xl">
                Exclusive <span className="text-blue-600">Events</span>
              </h2>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                aria-label="Show previous events"
                onClick={() => scrollEvents('previous')}
                className="flex size-12 items-center justify-center rounded-full bg-[#e6eeff] text-[#121c2a] transition hover:bg-[#dbe6ff] hover:text-[#004ac6]"
              >
                <ChevronLeft className="size-6" />
              </button>

              <button
                type="button"
                aria-label="Show next events"
                onClick={() => scrollEvents('next')}
                className="flex size-12 items-center justify-center rounded-full bg-[#e6eeff] text-[#121c2a] transition hover:bg-[#dbe6ff] hover:text-[#004ac6]"
              >
                <ChevronRight className="size-6" />
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
                className="flex min-h-[560px] w-[82vw] max-w-[360px] shrink-0 snap-start flex-col rounded-xl bg-white px-2 pt-2 pb-4 shadow-[0_18px_50px_rgba(18,28,42,0.08)] ring-1 ring-[#d9e3f6]/55 sm:w-[44vw] lg:w-auto lg:max-w-none"
              >
                <div className="relative aspect-[5/5] overflow-hidden rounded-xl bg-[#eff4ff]">
                  <Image
                    src={event.image}
                    alt={event.name}
                    fill
                    sizes="(min-width: 1024px) 280px, (min-width: 640px) 44vw, 82vw"
                    className="object-cover object-top"
                    priority
                  />

                  {event.logoLabel ? (
                    <div className="absolute bottom-4 left-4 flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-md bg-white/92 px-3 py-2 text-xs font-extrabold text-[#121c2a] shadow-[0_10px_24px_rgba(18,28,42,0.16)] backdrop-blur">
                      <div className="relative h-6 w-28">
                        <Image
                          src={event.logoLabel}
                          alt={event.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>

                <div className="flex flex-1 flex-col px-2 pt-7">
                  <div>
                    <h3 className="font-[family-name:var(--font-headline)] text-xl leading-tight font-extrabold text-[#121c2a]">
                      {event.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 font-bold text-[#004ac6]">{event.role}</p>

                    <p className="mt-2 text-sm leading-6 font-bold">{event.expertise}</p>
                  </div>

                  <p className="mt-2 mb-4 text-sm leading-7 text-[#434655]">{event.description}</p>

                  <button
                    type="button"
                    onClick={() => openModal(event.name)}
                    className="mt-auto w-full rounded-full bg-[#004ac6] px-5 py-4 text-base font-extrabold text-white shadow-[0_14px_28px_rgba(0,74,198,0.26)] transition hover:bg-[#003fa8]"
                  >
                    {event.cta}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <WebinarRequestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedEvent={selectedEvent}
      />
    </>
  )
}
