'use client'

import { ArrowRight, Banknote, CalendarDays, Mail, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { formatShortDate } from '../../lib/format'
import type { OwedPerMentorSummary } from '../types/payouts.types'

export interface AdminPayoutOwedSummaryProps {
  mentor: OwedPerMentorSummary
  onCreate: (mentor: OwedPerMentorSummary) => void
  onPreview: (mentor: OwedPerMentorSummary) => void
}

/**
 * One row in the "what we owe" per-mentor list. Sortable by `total_owed`
 * descending on the server, so this just renders in the order it comes
 * back. The right-hand action surfaces the two flows for this mentor:
 * preview the eligible bookings, or jump straight to creating a payout.
 */
export function AdminPayoutOwedSummaryRow({
  mentor,
  onCreate,
  onPreview,
}: AdminPayoutOwedSummaryProps) {
  const displayName = mentor.mentor_name || mentor.mentor_email || '—'
  const totalOwed = mentor.total_owed
  const sessionWindow =
    mentor.earliest_session && mentor.latest_session
      ? `${formatShortDate(mentor.earliest_session)} → ${formatShortDate(mentor.latest_session)}`
      : '—'

  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <User className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-headline text-base font-extrabold text-slate-950">
                {displayName}
              </p>
              {mentor.mentor_email ? (
                <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-slate-500">
                  <Mail className="size-3" />
                  {mentor.mentor_email}
                </p>
              ) : null}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-3.5" />
              {sessionWindow}
            </span>
            <span className="inline-flex items-center gap-1">
              <Banknote className="size-3.5" />
              {mentor.booking_count} eligible booking{mentor.booking_count === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
          <div className="text-right">
            <p className="font-headline text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
              NPR {totalOwed}
            </p>
            <p className="text-[10px] font-extrabold tracking-[0.14em] text-slate-500 uppercase">
              Owed
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 rounded-xl"
              onClick={() => onPreview(mentor)}
            >
              Preview
              <ArrowRight className="size-3.5" />
            </Button>
            <Button
              size="sm"
              className="gap-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => onCreate(mentor)}
            >
              Create payout
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}