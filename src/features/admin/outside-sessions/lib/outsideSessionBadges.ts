import { OutsideSessionStatus } from '../../types/admin.types'

// Tailwind badge classes keyed by `OutsideSessionStatus`. Soft pastels
// matching the existing `bookings/lib/bookingBadges.ts` palette so they
// don't visually clash on the admin pages.
export const OUTSIDE_SESSION_STATUS_BADGE: Record<OutsideSessionStatus, string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
}

export interface OutsideSessionFilterOption<V> {
  value: V
  label: string
}

export const OUTSIDE_SESSION_STATUS_OPTIONS: OutsideSessionFilterOption<
  OutsideSessionStatus | 'all'
>[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
]

/** Format a 2-decimal NPR amount for the preview block. */
export function formatNprDecimal(n: number): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}