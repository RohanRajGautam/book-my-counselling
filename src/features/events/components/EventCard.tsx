import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, History, MapPin, Plus, Sparkles } from 'lucide-react'

import { formatEventDate } from '../lib/events.utils'
import type { EventSummaryResponse } from '../types/events.types'

interface EventCardProps {
  event: EventSummaryResponse
}

export function EventCard({ event }: EventCardProps) {
  const date = formatEventDate(event.event_date)
  // The list endpoint returns speakers sorted by order_index ascending — use
  // the first one as the headline. A +N badge appears if there are more.
  const headline = event.speakers[0]
  const extraCount = event.speakers.length - 1
  const isPast = event.is_completed

  return (
    <Link
      href={`/events/${event.slug}`}
      className={`group relative block h-full rounded-[22px] border bg-white p-2 shadow-[0_18px_50px_rgba(18,28,42,0.08)] ring-1 transition hover:-translate-y-0.5 ${
        isPast
          ? 'border-slate-200/80 ring-slate-200/40 hover:shadow-[0_28px_70px_rgba(18,28,42,0.12)]'
          : 'border-[#d9e3f6]/70 ring-[#004ac6]/5 hover:shadow-[0_28px_70px_rgba(0,74,198,0.16)]'
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] bg-gradient-to-br from-[#eef4ff] via-[#dbe6ff] to-white">
        {event.cover_image_url ? (
          <Image
            src={event.cover_image_url}
            alt={event.title}
            fill
            sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 90vw"
            className={`object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03] ${
              isPast ? 'saturate-[0.7] opacity-90' : ''
            }`}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="font-headline text-3xl font-extrabold tracking-tight text-[#004ac6]/40">
              {event.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span
          aria-hidden="true"
          className={`absolute inset-0 bg-gradient-to-t ${
            isPast
              ? 'from-slate-900/35 via-slate-900/5 to-transparent'
              : 'from-[#003ea8]/10 via-transparent to-transparent'
          }`}
        />
        <StatusBadge isPast={isPast} />
      </div>

      <div className="flex h-full flex-col px-4 pt-3.5 pb-4 sm:px-5 sm:pt-5">
        <div className="flex items-start gap-1.5">
          <CalendarDays
            className="mt-0.5 size-3.5 shrink-0 text-[#004ac6] sm:size-4"
            aria-hidden="true"
          />
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

        {headline ? (
          <div className="mt-3 flex items-center gap-2">
            <div className="relative size-6 overflow-hidden rounded-full bg-[#e6eeff] ring-1 ring-[#c9d7f4]">
              {headline.image_url ? (
                <Image
                  src={headline.image_url}
                  alt={headline.name}
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center text-[10px] font-extrabold text-[#004ac6]">
                  {headline.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-slate-700">
              Featuring <span className="text-slate-900">{headline.name}</span>
              {extraCount > 0 ? (
                <span className="ml-1 inline-flex items-center gap-0.5 text-[10px] font-extrabold tracking-wide text-[#004ac6] uppercase">
                  <Plus className="size-2.5" aria-hidden="true" />
                  {extraCount} more
                </span>
              ) : null}
            </span>
          </div>
        ) : null}

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{event.description}</p>
      </div>
    </Link>
  )
}

interface StatusBadgeProps {
  isPast: boolean
}

/**
 * Visual tag overlaid on the cover image so users can tell at a glance
 * whether an event is bookable or has already wrapped. Past events get a
 * muted slate treatment; upcoming events get a vibrant blue chip with a
 * sparkle to read as "live / happening soon".
 */
function StatusBadge({ isPast }: StatusBadgeProps) {
  if (isPast) {
    return (
      <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-white uppercase shadow-sm backdrop-blur">
        <History className="size-3" aria-hidden="true" />
        Past Event
      </span>
    )
  }
  return (
    <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-[#004ac6] px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-white uppercase shadow-[0_8px_22px_rgba(0,74,198,0.35)]">
      <Sparkles className="size-3" aria-hidden="true" />
      Upcoming
    </span>
  )
}
