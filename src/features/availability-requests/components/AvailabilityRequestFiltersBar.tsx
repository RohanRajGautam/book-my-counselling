'use client'

import { cn } from '@/lib/utils'
import { REQUEST_STATUS_OPTIONS } from '../lib/requestBadges'
import type { AvailabilityRequestStatus } from '../types/availability-requests.types'

interface AvailabilityRequestFiltersBarProps {
  status: AvailabilityRequestStatus | 'all'
  onStatusChange: (next: AvailabilityRequestStatus | 'all') => void
}

/**
 * Inline status filter pill row used by both the mentor and admin lists.
 * Mirrors the rounded-full pill style of `AdminMentorFilterTabs` so the two
 * dashboards feel consistent.
 */
export function AvailabilityRequestFiltersBar({
  status,
  onStatusChange,
}: AvailabilityRequestFiltersBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter by status"
      className="inline-flex flex-wrap rounded-full bg-slate-100 p-1"
    >
      {REQUEST_STATUS_OPTIONS.map((opt) => {
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
              active
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-800',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
