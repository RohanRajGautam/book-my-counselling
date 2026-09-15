'use client'

import Link from 'next/link'
import Image from 'next/image'
import { CalendarDays, Inbox, MapPin, Pencil, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { formatEventDate } from '../../lib/events.utils'
import type { EventSummaryResponse } from '../../types/events.types'

interface AdminEventRowProps {
  event: EventSummaryResponse
}

export function AdminEventRow({ event }: AdminEventRowProps) {
  return (
    <article className="overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-slate-200/60">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-6">
        <Link
          href={`/admin/events/${event.id}`}
          aria-label={`Edit ${event.title}`}
          className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#eef4ff] via-[#dbe6ff] to-white ring-1 ring-[#c9d7f4] sm:size-28 sm:aspect-square"
        >
          {event.cover_image_url ? (
            <Image
              src={event.cover_image_url}
              alt={event.title}
              fill
              sizes="(min-width: 640px) 112px, 90vw"
              className="object-cover"
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center font-headline text-3xl font-extrabold text-[#004ac6]/40">
              {event.title.charAt(0).toUpperCase()}
            </span>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/admin/events/${event.id}`}
              className="font-headline text-base font-extrabold text-slate-950 hover:text-[#004ac6] sm:text-lg"
            >
              {event.title}
            </Link>
            <StatusPill completed={event.is_completed} />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-600 sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5 text-[#004ac6]" aria-hidden="true" />
              {formatEventDate(event.event_date)}
              {event.event_time ? ` · ${event.event_time}` : ''}
            </span>
            {event.location ? (
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                <MapPin className="size-3.5 text-slate-400" aria-hidden="true" />
                <span className="truncate">{event.location}</span>
              </span>
            ) : null}
            {event.partner ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6eeff] px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-[#004ac6] uppercase">
                <Sparkles className="size-3" aria-hidden="true" />
                {event.partner}
              </span>
            ) : null}
          </div>

          {event.speaker_name ? (
            <p className="mt-2 text-xs font-semibold text-slate-700 sm:text-sm">
              Speaker: <span className="text-slate-900">{event.speaker_name}</span>
            </p>
          ) : null}

          {event.description ? (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
              {event.description}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-stretch sm:gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 rounded-[22px] border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            nativeButton={false}
            render={<Link href={`/admin/events/${event.id}/bookings`} />}
            aria-label={`View bookings for ${event.title}`}
          >
            <Inbox className="size-3.5" strokeWidth={2.4} />
            Bookings
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 rounded-[22px] border-[#004ac6]/30 bg-[#e6eeff] text-[#004ac6] hover:bg-[#dbe6ff]"
            nativeButton={false}
            render={<Link href={`/admin/events/${event.id}`} />}
            aria-label={`Edit ${event.title}`}
          >
            <Pencil className="size-3.5" strokeWidth={2.4} />
            Edit
          </Button>
        </div>
      </div>
    </article>
  )
}

function StatusPill({ completed }: { completed: boolean }) {
  if (completed) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide text-slate-700 uppercase ring-1 ring-slate-200/60">
        Past
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide text-emerald-700 uppercase ring-1 ring-emerald-100">
      Upcoming
    </span>
  )
}
