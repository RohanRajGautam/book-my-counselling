// Money fields arrive as decimal strings (e.g. "1500.00"). We render
// them with thousands separators and an NPR suffix, but never re-parse
// and round — the backend has already quantized them.

/**
 * Format a decimal-string amount as a display value. Accepts the wire
 * shape (`"1500.00"`) and the loose number shape for convenience.
 *
 * @param amount  decimal string OR number
 * @param opts.cents  when true, forces two decimal places; default
 *                    keeps whatever the input has
 */
export function formatPayoutRequestAmount(
  amount: string | number,
  opts?: { cents?: boolean }
): string {
  const value = typeof amount === 'string' ? amount : String(amount)
  const trimmed = value.trim()
  if (trimmed === '') return 'NPR 0'

  const negative = trimmed.startsWith('-')
  const unsigned = negative ? trimmed.slice(1) : trimmed
  const [whole, frac] = unsigned.split('.')
  const wholeSafe = whole ?? '0'

  // Group thousands with commas.
  const withSep = wholeSafe.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  let result = withSep
  if (opts?.cents) {
    const fracPadded = (frac ?? '').padEnd(2, '0').slice(0, 2)
    result = `${withSep}.${fracPadded}`
  } else if (frac && frac.length > 0) {
    // Preserve whatever the backend sent (e.g. ".50" or ".00")
    result = `${withSep}.${frac}`
  }

  return `${negative ? '-' : ''}NPR ${result}`
}

// ── Date helpers ───────────────────────────────────────────────────────────

/**
 * "Aug 1, 2026 · 3:00 PM" — long form for list rows. Falls back to the
 * raw input if the string isn't a valid ISO date.
 */
export function formatPayoutRequestDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/**
 * "Today, 3:00 PM" / "Tomorrow, 11:30 AM" / "Mon, Aug 1, 3:00 PM".
 * Mirrors the availability-requests helper so the UI feels consistent.
 */
export function formatPayoutRequestDateTimeRelative(iso: string): string {
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

/**
 * First letter of the first two whitespace-separated words — used for
 * the mentor/mentee avatar fallback on admin rows.
 */
export function getPayoutRequestInitials(name: string | null | undefined): string {
  const source = (name ?? '').trim()
  if (!source) return '?'
  const parts = source.split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const second = parts[1]?.[0] ?? ''
  return `${first}${second}`.toUpperCase() || '?'
}
