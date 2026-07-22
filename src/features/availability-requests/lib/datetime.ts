/**
 * Formatting helpers for ISO datetimes returned by the availability-request
 * endpoints. Always rendered in the visitor's local timezone.
 */

/**
 * "Mon, Aug 1, 2026 · 3:00 PM" — long form for list rows.
 */
export function formatRequestDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/**
 * "Today, 3:00 PM" / "Tomorrow, 11:30 AM" / "Mon, Aug 1, 3:00 PM".
 * Adds niceness on the first two days; falls back to a compact date.
 */
export function formatRequestDateTimeRelative(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  const timeStr = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })

  if (target.getTime() === today.getTime()) return `Today, ${timeStr}`
  if (target.getTime() === tomorrow.getTime()) return `Tomorrow, ${timeStr}`

  return `${date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })}, ${timeStr}`
}

/** Just the time: "3:00 PM – 4:00 PM". */
export function formatTimeRange(startIso: string, endIso: string): string {
  const start = new Date(startIso)
  const end = new Date(endIso)
  const fmt = (d: Date) =>
    d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  return `${fmt(start)} – ${fmt(end)}`
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
