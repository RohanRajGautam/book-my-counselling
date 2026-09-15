'use client'

import { Mail, Phone, User2 } from 'lucide-react'

import { formatRelativeTime } from '../../lib/events.utils'
import type { EventBookingResponse } from '../../types/events.types'

interface AdminEventBookingRowProps {
  booking: EventBookingResponse
}

export function AdminEventBookingRow({ booking }: AdminEventBookingRowProps) {
  const phoneHref = booking.phone ? `tel:${booking.phone.replace(/\s+/g, '')}` : null
  const initial = booking.name.trim().charAt(0).toUpperCase() || '?'

  return (
    <article className="rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-slate-200/60 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e6eeff] font-headline text-base font-extrabold text-[#004ac6] ring-1 ring-[#c9d7f4]">
            {initial}
          </span>
          <div className="min-w-0">
            <p className="font-headline text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">
              {booking.name}
            </p>
            <div className="mt-1.5 flex flex-col gap-1 text-xs font-semibold text-slate-600 sm:text-sm">
              <a
                href={`mailto:${booking.email}`}
                className="inline-flex items-center gap-1.5 text-[#004ac6] hover:underline"
              >
                <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{booking.email}</span>
              </a>
              {phoneHref ? (
                <a
                  href={phoneHref}
                  className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#004ac6] hover:underline"
                >
                  <Phone className="size-3.5 shrink-0" aria-hidden="true" />
                  {booking.phone}
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-slate-400">
                  <User2 className="size-3.5 shrink-0" aria-hidden="true" />
                  No phone on file
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1 text-right">
          <span className="text-[10px] font-extrabold tracking-wide text-slate-400 uppercase">
            Booked
          </span>
          <span className="text-xs font-bold text-slate-700 sm:text-sm">
            {formatRelativeTime(booking.created_at)}
          </span>
          <span className="font-mono text-[10px] tracking-wide text-slate-300 uppercase">
            #{booking.id.slice(0, 8)}
          </span>
        </div>
      </div>
    </article>
  )
}
