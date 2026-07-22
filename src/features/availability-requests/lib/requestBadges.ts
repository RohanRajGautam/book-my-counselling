import type { AvailabilityRequestStatus } from '../types/availability-requests.types'

/** Tailwind class set for each request status badge. */
export const STATUS_BADGE: Record<AvailabilityRequestStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 ring-amber-200',
  confirmed: 'bg-blue-100 text-blue-700 ring-blue-200',
  rejected: 'bg-red-100 text-red-600 ring-red-200',
}

/** Human-readable label for each status. */
export const STATUS_LABEL: Record<AvailabilityRequestStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  rejected: 'Rejected',
}

export interface RequestFilterOption<V> {
  value: V
  label: string
}

export const REQUEST_STATUS_OPTIONS: RequestFilterOption<AvailabilityRequestStatus | 'all'>[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'rejected', label: 'Rejected' },
]

/** Tailwind class set for each duration pill. */
export const DURATION_BADGE: Record<'30' | '60' | '90', string> = {
  '30': 'bg-sky-50 text-sky-700 ring-sky-200',
  '60': 'bg-violet-50 text-violet-700 ring-violet-200',
  '90': 'bg-indigo-50 text-indigo-700 ring-indigo-200',
}
