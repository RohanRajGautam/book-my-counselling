'use client'

import { useState } from 'react'
import Image from 'next/image'
import { WebinarRequestModal } from './WebinarRequestModal'

export interface ExclusiveEvent {
  name: string
  role: string
  expertise: string
  logoLabel?: string
  image: string
  description: string
  cta: string
}

const exclusiveEvents: ExclusiveEvent[] = [
  {
    name: 'Dr. Kamala Shrestha',
    role: 'Women Entrepreneur Leader',
    expertise: 'Beauty Industry Advocacy, Women Entrepreneurship & Leadership',
    logoLabel: '/home/exclusive-events/siam.svg',
    image: '/home/exclusive-events/kamala.jpeg',
    description:
      "Founder of Siam Beauty Salon and Siam Institute, Dr. Kamala Shrestha has helped shape Nepal's beauty industry while empowering women through entrepreneurship and professional education.",
    cta: 'Request Webinar',
  },
  {
    name: 'Nirmal Thapa',
    role: 'Director of Client Relations',
    expertise: 'Client Relations, Customer Success, Sales, Marketing, Leadership',
    image: '/home/exclusive-events/nirmal_thapa.png',
    description:
      'With over 12 years of experience working with US clients, Nirmal Thapa equips professionals with practical skills to thrive in global client-facing environments.',
    cta: 'Request Webinar',
  },
  {
    name: 'Prayash Poudel',
    role: 'Principal AI Engineer',
    expertise: 'Software Engineering, Enterprise Systems, SAP',
    logoLabel: '/home/exclusive-events/leapfrog.png',
    image: '/home/exclusive-events/prayash_poudel.png',
    description:
      'A software engineer since 2013, Prayash Poudel has built enterprise solutions across healthcare, finance, and SAP, delivering software used by organizations worldwide.',
    cta: 'Request Webinar',
  },
  {
    name: 'Biplab Subedi',
    role: 'Agile Master at Snappet',
    expertise: 'Lean-Agile Coaching, Radical Transparency, Self-Managing Teams',
    logoLabel: '/home/exclusive-events/snappet.png',
    image: '/home/exclusive-events/biplab_subedi.png',
    description:
      'With over 16 years of experience, Biplab Subedi helps organizations build self-managing teams and foster continuous improvement through modern agile practices.',
    cta: 'Request Webinar',
  },
] as const

export function ExclusiveEventsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState('')

  function openModal(eventName: string) {
    setSelectedEvent(eventName)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  return (
    <>
      <section className="px-6 pt-16 pb-20 sm:px-8 lg:pt-24 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-headline)] text-3xl leading-[1.05] font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl">
                Exclusive <span className="text-[var(--brand-blue)]">Events</span>
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 font-medium text-[var(--color-on-surface-variant)] sm:text-base">
                Live sessions with industry leaders — reserve your seat, get the recording, and
                learn directly from practitioners.
              </p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {exclusiveEvents.map((event) => (
              <article
                key={event.name}
                className="group flex h-full min-h-[440px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_18px_50px_rgba(18,28,42,0.08)] ring-1 ring-[var(--color-surface-container-high)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(18,28,42,0.14)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-[var(--brand-blue-surface)] to-[var(--brand-blue-soft)]">
                  <Image
                    src={event.image}
                    alt={event.name}
                    fill
                    sizes="(min-width: 1024px) 280px, (min-width: 640px) 44vw, 100vw"
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                    priority
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />

                  {event.logoLabel && (
                    <div className="absolute right-4 bottom-4 flex h-9 items-center rounded-md bg-white/95 px-3 shadow-[0_6px_18px_rgba(18,28,42,0.18)] backdrop-blur">
                      <div className="relative h-5 w-24">
                        <Image
                          src={event.logoLabel}
                          alt={event.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col px-5 pt-5 pb-5">
                  <h3 className="line-clamp-2 font-[family-name:var(--font-headline)] text-xl leading-6 font-extrabold tracking-tight text-[var(--foreground)]">
                    {event.name}
                  </h3>

                  <p className="mt-1.5 text-sm leading-5 font-bold text-[var(--brand-blue)]">
                    {event.role}
                  </p>

                  <p className="mt-3 line-clamp-2 text-[11px] leading-5 font-extrabold tracking-wider text-[var(--color-outline)] uppercase">
                    {event.expertise}
                  </p>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 font-medium text-[var(--color-on-surface-variant)]">
                    {event.description}
                  </p>

                  <div className="mt-auto pt-6">
                    <button
                      type="button"
                      onClick={() => openModal(event.name)}
                      className="flex w-full items-center justify-center rounded-full bg-[var(--brand-blue)] px-5 py-3 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(0,83,219,0.22)] transition hover:bg-[var(--brand-blue-hover)]"
                    >
                      {event.cta}
                    </button>
                  </div>
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
