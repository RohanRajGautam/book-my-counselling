'use client'

import { cn } from '@/lib/utils'

import {
  PAYOUT_REQUEST_STATUS_OPTIONS,
  type PayoutRequestStatusFilter,
} from '../lib/payoutRequestBadges'

interface PayoutRequestFiltersBarProps {
  status: PayoutRequestStatusFilter
  onStatusChange: (next: PayoutRequestStatusFilter) => void
}

/**
 * Inline status filter pill row used by both the mentor and admin
 * payout-request lists. Mirrors the rounded-full pill style of
 * `AvailabilityRequestFiltersBar` so the two surfaces feel consistent.
 */
export function PayoutRequestFiltersBar({ status, onStatusChange }: PayoutRequestFiltersBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter by status"
      className="inline-flex flex-wrap rounded-full bg-slate-100 p-1"
    >
      {PAYOUT_REQUEST_STATUS_OPTIONS.map((opt) => {
        const active = status === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onStatusChange(opt.value)}
            className={cn(
              'rounded-full px-4 py-1.5 text-xs font-extrabold transition',
              active ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
