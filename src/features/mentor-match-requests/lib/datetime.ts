/**
 * Datetime formatting helpers for mentor-match-request rows. Always rendered
 * in the visitor's local timezone.
 */

/**
 * Compact relative timestamp for the admin inbox. Falls back to a short
 * absolute date for anything older than a week.
 *
 *   now          → "just now"
 *   45s          → "45s ago"
 *   12m          → "12m ago"
 *   3h           → "3h ago"
 *   2d           → "2d ago"
 *   > 7d         → "Aug 12"
 */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso

  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.round(diffMs / 1000)

  if (diffSec < 5) return 'just now'
  if (diffSec < 60) return `${diffSec}s ago`

  const diffMin = Math.round(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`

  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`

  const diffDay = Math.round(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d ago`

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

/** Long-form absolute timestamp for the detail panel footer. */
export function formatAbsoluteTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** Initial-capped first letter of the first name (or email if no name). */
export function getRequesterInitials(name: string | null, email: string): string {
  const source = (name || email).trim()
  if (!source) return '?'
  const parts = source.split(/[\s@.]/).filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const second = parts[1]?.[0] ?? ''
  return `${first}${second}`.toUpperCase() || '?'
}
