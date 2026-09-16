'use client'

import { ArrowRight, Banknote, CalendarClock } from 'lucide-react'

import { formatDateTime } from '../../lib/format'
import { PAYOUT_PAYMENT_METHOD_LABEL } from '../lib/payoutBadges'
import type { PayoutResponse } from '../types/payouts.types'

import { AdminPayoutStatusBadge } from './AdminPayoutStatusBadge'

export interface AdminPayoutHistoryCardProps {
  payout: PayoutResponse
  onOpen: (payout: PayoutResponse) => void
}

/**
 * Compact row for the history list. Clicking anywhere on the card
 * opens the detail modal — the action button is a redundant affordance
 * for clarity.
 */
export function AdminPayoutHistoryCard({ payout, onOpen }: AdminPayoutHistoryCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen(payout)
    }
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(payout)}
      onKeyDown={handleKeyDown}
      className="group/card cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-[0_8px_24px_rgba(7,85,216,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-headline text-lg font-extrabold text-slate-950">
              NPR {payout.total_amount}
            </span>
            <AdminPayoutStatusBadge status={payout.status} />
            {payout.period_start && payout.period_end ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-extrabold text-blue-700">
                <CalendarClock className="size-3" />
                Window
              </span>
            ) : null}
          </div>

          <p className="mt-1 text-xs font-medium text-slate-500">
            Created {formatDateTime(payout.created_at)} · {payout.booking_count} booking
            {payout.booking_count === 1 ? '' : 's'}
          </p>

          {payout.status === 'paid' && payout.payment_method ? (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <Banknote className="size-3.5" />
              {PAYOUT_PAYMENT_METHOD_LABEL[payout.payment_method]} ·{' '}
              <span className="font-extrabold">{payout.payment_reference}</span>
              {payout.paid_at ? (
                <span className="font-medium text-emerald-600/80">
                  · {formatDateTime(payout.paid_at)}
                </span>
              ) : null}
            </p>
          ) : null}

          {payout.status === 'cancelled' && payout.cancellation_reason ? (
            <p className="mt-2 text-xs font-medium text-slate-500">
              <span className="font-bold text-slate-700">Reason:</span>{' '}
              {payout.cancellation_reason}
            </p>
          ) : null}

          {payout.notes ? (
            <p className="mt-2 line-clamp-2 text-xs text-slate-500">
              <span className="font-bold text-slate-700">Notes:</span> {payout.notes}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2 self-end text-xs font-extrabold tracking-[0.14em] text-slate-500 uppercase transition group-hover/card:text-blue-700 sm:self-center">
          Details
          <ArrowRight className="size-3.5" />
        </div>
      </div>
    </article>
  )
}