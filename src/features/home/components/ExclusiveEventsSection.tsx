'use client'

import { useState } from 'react'
import Image from 'next/image'
import { WebinarRequestModal } from './WebinarRequestModal'

export interface ExclusiveEvent {
  name: string
  role: string
  company?: string
  companyLogo?: string
  tags: string[]
  image: string
  description: string
  cta: string
}

const exclusiveEvents: ExclusiveEvent[] = [
  {
    name: 'Dr. Kamala Shrestha',
    role: 'Women Entrepreneur Leader',
    company: 'Siam',
    companyLogo: '/home/exclusive-events/siam.svg',
    tags: ['Beauty Industry', 'Women Leadership'],
    image: '/home/exclusive-events/kamala.jpeg',
    description:
      "Founder of Siam Beauty Salon and Siam Institute, Dr. Kamala Shrestha has helped shape Nepal's beauty industry while empowering women through entrepreneurship and professional education.",
    cta: 'Request Webinar',
  },
  {
    name: 'Nirmal Thapa',
    role: 'Director of Client Relations',
    tags: ['Client Relations', 'Customer Success'],
    image: '/home/exclusive-events/nirmal_thapa.png',
    description:
      'With over 12 years of experience working with US clients, Nirmal Thapa equips professionals with practical skills to thrive in global client-facing environments.',
    cta: 'Request Webinar',
  },
  {
    name: 'Prayash Poudel',
    role: 'Principal AI Engineer',
    company: 'Leapfrog',
    companyLogo: '/home/exclusive-events/leapfrog.png',
    tags: ['Software Engineering', 'SAP'],
    image: '/home/exclusive-events/prayash_poudel.png',
    description:
      'A software engineer since 2013, Prayash Poudel has built enterprise solutions across healthcare, finance, and SAP, delivering software used by organizations worldwide.',
    cta: 'Request Webinar',
  },
  {
    name: 'Biplab Subedi',
    role: 'Agile Master',
    company: 'Snappet',
    companyLogo: '/home/exclusive-events/snappet.png',
    tags: ['Lean-Agile Coaching', 'Self-Managing Teams'],
    image: '/home/exclusive-events/biplab_subedi.png',
    description:
      'With over 16 years of experience, Biplab Subedi helps organizations build self-managing teams and foster continuous improvement through modern agile practices.',
    cta: 'Request Webinar',
  },
] as const

function CompanyLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="inline-flex h-5 w-16 items-center overflow-hidden">
      <Image src={src} alt={alt} width={64} height={20} className="size-full object-contain" />
    </span>
  )
}

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
          <div className="mx-auto mb-16 max-w-2xl text-center lg:mb-20">
            <h2 className="font-[family-name:var(--font-headline)] text-3xl leading-[1.05] font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Exclusive <span className="text-[var(--brand-blue)]">Events</span>
            </h2>
            <p className="mt-4 text-base leading-7 font-medium text-slate-500 sm:text-lg">
              Live sessions with industry leaders — reserve your seat, get the recording, and learn
              directly from practitioners.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {exclusiveEvents.map((event) => (
              <article
                key={event.name}
                className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_18px_50px_rgba(18,28,42,0.08)] ring-1 ring-slate-200/70 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(18,28,42,0.14)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-t-3xl bg-gradient-to-br from-[var(--brand-blue-surface)] to-[var(--brand-blue-soft)]">
                  <Image
                    src={event.image}
                    alt={event.name}
                    fill
                    sizes="(min-width: 1024px) 280px, (min-width: 640px) 44vw, 100vw"
                    className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                    priority
                  />
                </div>

                <div className="flex flex-1 flex-col px-5 pt-5 pb-5">
                  <h3 className="font-[family-name:var(--font-headline)] text-xl leading-6 font-extrabold tracking-tight text-slate-950">
                    {event.name}
                  </h3>

                  {event.companyLogo && (
                    <div className="mt-2">
                      <CompanyLogo src={event.companyLogo} alt={event.company ?? event.name} />
                    </div>
                  )}

                  <p className="mt-3 text-sm leading-5 font-semibold text-[var(--brand-blue)]">
                    {event.role}
                    {event.company && (
                      <>
                        {' @ '}
                        <span className="text-slate-700">{event.company}</span>
                      </>
                    )}
                  </p>

                  {event.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {event.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="mt-3 line-clamp-2 text-sm leading-6 font-medium text-slate-500">
                    {event.description}
                  </p>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => openModal(event.name)}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-6 py-3 text-sm font-bold text-white transition-all hover:from-[#003fa8] hover:to-[#1d4ed8] active:scale-95"
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