import { MentorSessionSort } from '../../types/admin.types'

export interface MentorSessionSortOption {
  value: MentorSessionSort
  label: string
}

/**
 * Sort orders the mentor-scoped sessions endpoint accepts. The backend
 * validates the value against exactly these three — sending anything else
 * is a 422. The global bookings list has no `sort` param, so this control
 * only ever appears on the mentor's own page.
 */
export const MENTOR_SESSION_SORT_OPTIONS: MentorSessionSortOption[] = [
  { value: 'session', label: 'Newest session first' },
  { value: 'session_asc', label: 'Oldest session first' },
  { value: 'created', label: 'Newest booking first' },
]

/**
 * Start-of-day bound for the `date_from` filter.
 *
 * The backend filters on `session_start` (stored in UTC) and reads a
 * date without an offset as UTC, so the day is anchored to UTC.
 */
export function dateFromBound(date: string): string {
  return `${date}T00:00:00Z`
}

/**
 * End-of-day bound for the `date_to` filter.
 *
 * The bound is inclusive, but `session_start` carries sub-second precision —
 * `T23:59:59Z` would drop a session starting at `23:59:59.500`. `T00:00:00Z`
 * would be far worse: it would match only sessions starting at exactly
 * midnight and silently lose the whole day.
 */
export function dateToBound(date: string): string {
  return `${date}T23:59:59.999Z`
}
