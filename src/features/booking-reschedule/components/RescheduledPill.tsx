import { CalendarClock } from 'lucide-react'

import { wasLikelyRescheduled } from '../lib/eligibility'

interface RescheduledPillProps {
  created_at: string
  updated_at: string
  status: string
  className?: string
}

/**
 * Optional "Rescheduled" indicator — a pure UI pill derived from
 * `updated_at` vs `created_at`. The data model has no `was_rescheduled`
 * flag today; this is the closest we can get without a migration.
 *
 * Token recipe (per platform design tokens):
 *   bg-amber-50 / text-amber-700 / ring-1 ring-amber-200
 *   CalendarClock (lucide) leading
 *   inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium
 *
 * Hidden when:
 *   - The booking is in COMPLETED / CANCELLED — a long gap on those doesn't
 *     read as "rescheduled", it reads as lifecycle churn.
 *   - `updated_at` - `created_at` < 1 minute — filters out the normal
 *     "row was created and immediately touched" pattern.
 */
export function RescheduledPill({
  created_at,
  updated_at,
  status,
  className,
}: RescheduledPillProps) {
  if (!wasLikelyRescheduled({ created_at, updated_at, status })) return null
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200 ${className ?? ''}`}
      title="This session was rescheduled from a previous time."
    >
      <CalendarClock className="size-3" aria-hidden="true" />
      Rescheduled
    </span>
  )
}
