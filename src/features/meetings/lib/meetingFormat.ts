/**
 * Mentee payment-success modal helpers. Decide when to show the primary
 * "Join the meeting" CTA vs. a soft countdown chip. Both functions rely
 * on `Date.now()` — they're called once per modal mount, which is fine
 * since the modal is shown briefly post-payment and re-opens on demand.
 */

/**
 * Google Meet allows early join from 15 min before start until 60 min
 * after. The mentee modal hides the primary CTA outside this window so
 * the post-payment surface doesn't push an immediate action when the
 * session is hours away.
 */
export function isMeetingJoinable(sessionStart: string | null | undefined): boolean {
  if (!sessionStart) return true // event flow / no scheduled time → default open
  const diffMins = (new Date(sessionStart).getTime() - Date.now()) / 60000
  return diffMins <= 15 && diffMins >= -60
}

/** "Starts in 2d 5h" / "Starts in 1h 23m" / "Starts in 23m". */
export function formatJoinCountdown(sessionStart: string | null | undefined): string {
  if (!sessionStart) return ''
  const diffMs = new Date(sessionStart).getTime() - Date.now()
  if (diffMs <= 0) return ''
  const totalMinutes = Math.ceil(diffMs / 60000)
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60
  if (days > 0) {
    return hours > 0 ? `Starts in ${days}d ${hours}h` : `Starts in ${days}d`
  }
  if (hours > 0) {
    return minutes > 0 ? `Starts in ${hours}h ${minutes}m` : `Starts in ${hours}h`
  }
  return `Starts in ${minutes}m`
}