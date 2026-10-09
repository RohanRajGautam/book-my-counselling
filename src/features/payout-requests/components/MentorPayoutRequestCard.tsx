'use client'

import { cn } from '@/lib/utils'

import type { PayoutRequestMentorRow } from '../types/payout-requests.types'
import {
  PAYOUT_REQUEST_STATUS_BADGE,
  PAYOUT_REQUEST_STATUS_LABEL,
} from '../lib/payoutRequestBadges'
import {
  formatPayoutRequestAmount,
  formatPayoutRequestDateTime,
  formatPayoutRequestDateTimeRelative,
} from '../lib/payoutRequestsFormat'

interface MentorPayoutRequestCardProps {
  request: PayoutRequestMentorRow
}

/**
 * Mentor view of a single payout request. Shows the snapshot balance, the
 * eligible-booking count, the mentor's own note, and (if acknowledged)
 * the admin's reply + acker's name.
 */
export function MentorPayoutRequestCard({ request }: MentorPayoutRequestCardProps) {
  const status = request.status
  const isOpen = status === 'open'
  const bookingCount = request.eligible_booking_count
  const bookingLabel =
    bookingCount === 1 ? '1 eligible booking' : `${bookingCount} eligible bookings`

  return (
    <article
      className={cn(
        'rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 transition sm:p-6',
        !isOpen && 'opacity-95'
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-[family-name:var(--font-headline)] text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">
              {formatPayoutRequestAmount(request.balance_snapshot)}
            </h3>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase ring-1 ring-inset',
                PAYOUT_REQUEST_STATUS_BADGE[status]
              )}
            >
              {PAYOUT_REQUEST_STATUS_LABEL[status]}
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-600 ring-1 ring-slate-200 ring-inset">
              {bookingLabel}
            </span>
          </div>

          <p className="mt-1.5 text-xs font-semibold text-slate-500 sm:text-sm">
            <span className="font-bold text-slate-700">Filed</span>{' '}
            {formatPayoutRequestDateTimeRelative(request.created_at)}
            {' · '}
            {formatPayoutRequestDateTime(request.created_at)}
          </p>

          {request.mentor_message ? (
            <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700 sm:p-4">
              <p className="mb-1.5 text-[10px] font-extrabold tracking-[0.16em] text-slate-500 uppercase">
                Your note
              </p>
              <p className="text-sm leading-6 font-medium break-words whitespace-pre-wrap text-slate-700">
                {request.mentor_message}
              </p>
            </div>
          ) : null}

          {!isOpen && request.acknowledged_at ? (
            <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-3 text-sm text-blue-800 sm:p-4">
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-extrabold tracking-[0.16em] text-blue-700 uppercase">
                Acknowledged
                {request.acknowledged_by_admin_name ? (
                  <span className="text-blue-700/80">by {request.acknowledged_by_admin_name}</span>
                ) : null}
                <span className="text-blue-700/70">
                  · {formatPayoutRequestDateTimeRelative(request.acknowledged_at)}
                </span>
              </div>
              {request.admin_note ? (
                <p className="mt-1.5 text-sm leading-6 font-medium break-words whitespace-pre-wrap text-blue-900">
                  {request.admin_note}
                </p>
              ) : (
                <p className="mt-1 text-xs font-medium text-blue-700/80">
                  No reply note — pay the requested balance whenever you&apos;re ready.
                </p>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          {isOpen ? (
            <span className="rounded-xl bg-amber-50 px-3 py-2 text-center text-xs font-extrabold text-amber-700 ring-1 ring-amber-200 ring-inset">
              Awaiting acknowledgement
            </span>
          ) : (
            <span className="rounded-xl bg-blue-50 px-3 py-2 text-center text-xs font-extrabold text-blue-700 ring-1 ring-blue-200 ring-inset">
              Acknowledged
            </span>
          )}
        </div>
      </div>

      <p className="mt-4 font-mono text-[10px] tracking-wider text-slate-300 uppercase">
        Request {request.id.slice(0, 8)} · Filed{' '}
        {new Date(request.created_at).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        })}
      </p>
    </article>
  )
}
