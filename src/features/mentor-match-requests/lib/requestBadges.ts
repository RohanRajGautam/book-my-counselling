import { cn } from '@/lib/utils'
import type { MentorMatchRequestStatus } from '../types/mentor-match-requests.types'

/** Tailwind class set for each request status badge. */
export const STATUS_BADGE: Record<MentorMatchRequestStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 ring-amber-200',
  contacted: 'bg-blue-100 text-blue-700 ring-blue-200',
  fulfilled: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  closed: 'bg-slate-100 text-slate-600 ring-slate-200',
}

/** Human-readable label for each status. */
export const STATUS_LABEL: Record<MentorMatchRequestStatus, string> = {
  pending: 'Pending',
  contacted: 'Contacted',
  fulfilled: 'Fulfilled',
  closed: 'Closed',
}

export interface RequestFilterOption<V> {
  value: V
  label: string
}

export const REQUEST_STATUS_OPTIONS: RequestFilterOption<
  MentorMatchRequestStatus | 'all'
>[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'closed', label: 'Closed' },
]

/** Whether the status is terminal — no further transitions allowed. */
export function isTerminalStatus(status: MentorMatchRequestStatus): boolean {
  return status === 'fulfilled' || status === 'closed'
}

/** Helper for inline merging with `cn`. */
export function badgeClasses(status: MentorMatchRequestStatus): string {
  return cn(
    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide uppercase ring-1 ring-inset',
    STATUS_BADGE[status],
  )
}
