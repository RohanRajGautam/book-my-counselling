'use client'

import { ArrowUpRight, CalendarCheck2 } from 'lucide-react'

import { formatEventDate } from '../lib/events.utils'

interface EventExternalFormCtaProps {
  /** External form URL — opens in a new tab when the user clicks the CTA. */
  href: string
  /** Event date used in the "we'll send the details before …" subtitle. */
  eventDate: string
  /** Event title — shown next to the subtitle so the CTA reads as event-specific. */
  eventTitle: string
}

/**
 * Public CTA card shown on the event detail page when the admin attached an
 * external form (Google Forms, Typeform, Jotform, …). Replaces the in-app
 * booking form so we don't double-collect registrations.
 */
export function EventExternalFormCta({ href, eventDate, eventTitle }: EventExternalFormCtaProps) {
  return (
    <div className="rounded-[22px] border border-[#d9e3f6] bg-white p-6 shadow-[0_18px_50px_rgba(18,28,42,0.08)] sm:p-7">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-[22px] bg-[#e6eeff] text-[#004ac6]">
          <CalendarCheck2 className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="font-headline text-lg font-extrabold tracking-tight text-slate-900">
            Save your seat
          </p>
          <p className="text-xs font-semibold text-slate-500">
            Free to register. We&apos;ll send the details before {formatEventDate(eventDate)}.
          </p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-600">
        We use a quick external form to confirm your spot for{' '}
        <span className="font-bold text-slate-800">{eventTitle}</span>. It opens in a new tab —
        you&apos;ll come back here when you&apos;re done.
      </p>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[22px] bg-[#004ac6] text-sm font-bold text-white shadow-[0_18px_36px_rgba(0,74,198,0.22)] transition hover:bg-[#003da8] focus-visible:ring-2 focus-visible:ring-[#004ac6]/30 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        Save your seat
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </a>

      <p className="mt-3 text-center text-[11px] font-medium text-slate-500">
        By registering you agree to receive event-related emails from BYC.
      </p>
    </div>
  )
}
