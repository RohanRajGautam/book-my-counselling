import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, MapPin } from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'

import { formatEventDate } from '../lib/events.utils'
import type { EventSummaryResponse } from '../types/events.types'

interface EventCardProps {
  event: EventSummaryResponse
}

export function EventCard({ event }: EventCardProps) {
  const date = formatEventDate(event.event_date)
  const hasSpeaker = Boolean(event.speaker_name)
  const hasLinkedin = Boolean(event.speaker_linkedin_url)

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group relative block h-full rounded-[22px] border border-[#d9e3f6]/70 bg-white p-2 shadow-[0_18px_50px_rgba(18,28,42,0.08)] ring-1 ring-[#004ac6]/5 transition hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(0,74,198,0.16)]"
    >
      <div className="relative h-44 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#eef4ff] via-[#dbe6ff] to-white sm:h-56">
        {event.cover_image_url ? (
          <Image
            src={event.cover_image_url}
            alt={event.title}
            fill
            sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="font-headline text-3xl font-extrabold tracking-tight text-[#004ac6]/40">
              {event.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="flex h-full flex-col px-4 pt-3.5 pb-4 sm:px-5 sm:pt-5">
        <div className="flex items-start gap-1.5">
          <CalendarDays className="mt-0.5 size-3.5 shrink-0 text-[#004ac6] sm:size-4" aria-hidden="true" />
          <p className="text-[11px] font-extrabold tracking-wide text-[#004ac6] uppercase sm:text-xs">
            {date}
            {event.event_time ? ` · ${event.event_time}` : ''}
          </p>
        </div>

        <h3 className="font-headline mt-2 text-lg leading-snug font-extrabold tracking-tight text-balance text-slate-900 sm:text-xl sm:leading-tight">
          {event.title}
        </h3>

        {event.location ? (
          <p className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-slate-600">
            <MapPin className="mt-0.5 size-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span className="line-clamp-2 break-words">{event.location}</span>
          </p>
        ) : null}

        {hasSpeaker ? (
          <div className="mt-3 flex items-center gap-2">
            <div className="relative size-6 overflow-hidden rounded-[22px] bg-[#e6eeff] ring-1 ring-[#c9d7f4]">
              {event.speaker_image_url ? (
                <Image
                  src={event.speaker_image_url}
                  alt={event.speaker_name ?? ''}
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center text-[10px] font-extrabold text-[#004ac6]">
                  {(event.speaker_name ?? '?').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-slate-700">
              Featuring {event.speaker_name}
            </span>
            {hasLinkedin && event.speaker_linkedin_url ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.open(
                    event.speaker_linkedin_url ?? '',
                    '_blank',
                    'noopener,noreferrer'
                  )
                }}
                aria-label={`View ${event.speaker_name ?? 'speaker'} on LinkedIn`}
                className="ml-auto inline-flex size-6 cursor-pointer items-center justify-center rounded-full bg-[#e6eeff] text-[#0a66c2] transition hover:bg-[#0a66c2] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004ac6]/30"
              >
                <FaLinkedin className="size-3" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        ) : null}

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{event.description}</p>
      </div>
    </Link>
  )
}
