// ── Date / time helpers shared by the mentor and admin availability flows ──
//
// Extracted so the admin UI matches the mentor UI without the two copies
// drifting. All `YYYY-MM-DD` keys are in the user's local timezone (matching
// how `<input type="date">` reports its value).

export interface DateKey {
  /** YYYY-MM-DD in local timezone. */
  key: string
}

export const DAYS_OF_WEEK = [
  { value: 0, short: 'S', label: 'Sunday' },
  { value: 1, short: 'M', label: 'Monday' },
  { value: 2, short: 'T', label: 'Tuesday' },
  { value: 3, short: 'W', label: 'Wednesday' },
  { value: 4, short: 'T', label: 'Thursday' },
  { value: 5, short: 'F', label: 'Friday' },
  { value: 6, short: 'S', label: 'Saturday' },
] as const

// Half-hour increments from 06:00 to 22:00. The last entry caps at 22:00 to
// leave room for at least one 30-minute slot before midnight.
export const TIME_OPTIONS: { label: string; hour: number; minute: number }[] = []
for (let h = 6; h <= 22; h++) {
  for (const m of [0, 30]) {
    if (h === 22 && m === 30) break
    const ampm = h < 12 ? 'AM' : 'PM'
    const displayH = h % 12 === 0 ? 12 : h % 12
    const displayM = m === 0 ? '00' : '30'
    TIME_OPTIONS.push({ label: `${displayH}:${displayM} ${ampm}`, hour: h, minute: m })
  }
}

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function parseDateKey(key: string): Date | null {
  const [y, m, d] = key.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

export function todayKey(): string {
  return toDateKey(new Date())
}

export function addDaysKey(key: string, days: number): string {
  const d = parseDateKey(key)
  if (!d) return key
  d.setDate(d.getDate() + days)
  return toDateKey(d)
}

export function formatDateLabel(key: string): string {
  const d = parseDateKey(key)
  if (!d) return key
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export function formatShortDate(key: string): string {
  const d = parseDateKey(key)
  if (!d) return key
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function timeIndex(hour: number, minute: number): number {
  return hour * 60 + minute
}
