// Small, pure helpers used across the events feature. No React here.

const LOCALE = 'en-US'

const DATE_FORMATTER = new Intl.DateTimeFormat(LOCALE, {
  weekday: 'short',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat(LOCALE, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const TIME_FORMATTER = new Intl.DateTimeFormat(LOCALE, {
  hour: 'numeric',
  minute: '2-digit',
})

const RELATIVE_FORMATTER = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' })

/** Parse "YYYY-MM-DD" as a local date (not UTC) so display matches what the user typed. */
export function parseLocalDate(iso: string): Date | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m || !m[1] || !m[2] || !m[3]) return null
  const year = Number(m[1])
  const month = Number(m[2])
  const day = Number(m[3])
  const d = new Date(year, month - 1, day)
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month - 1 ||
    d.getDate() !== day
  ) {
    return null
  }
  return d
}

export function formatLongDate(iso: string): string {
  const d = parseLocalDate(iso)
  if (!d) return iso
  return DATE_FORMATTER.format(d)
}

export function formatShortDate(iso: string): string {
  const d = parseLocalDate(iso)
  if (!d) return iso
  return SHORT_DATE_FORMATTER.format(d)
}

export function formatTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return TIME_FORMATTER.format(d)
}

/** "2 hours ago", "in 3 days", etc. Falls back to short date for distant points. */
export function formatRelativeTime(iso: string, now = new Date()): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const diffMs = d.getTime() - now.getTime()
  const absSec = Math.abs(diffMs) / 1000

  if (absSec < 60) return RELATIVE_FORMATTER.format(Math.round(diffMs / 1000), 'second')
  if (absSec < 3600) return RELATIVE_FORMATTER.format(Math.round(diffMs / 60_000), 'minute')
  if (absSec < 86_400) return RELATIVE_FORMATTER.format(Math.round(diffMs / 3_600_000), 'hour')
  if (absSec < 86_400 * 7)
    return RELATIVE_FORMATTER.format(Math.round(diffMs / 86_400_000), 'day')
  return SHORT_DATE_FORMATTER.format(d)
}

/** "2026-10-15" → "October 15, 2026". Safe fallback to input string on bad input. */
export function formatEventDate(iso: string): string {
  const d = parseLocalDate(iso)
  if (!d) return iso
  return d.toLocaleDateString(LOCALE, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Truncate a description for card display. Adds ellipsis when shortened. */
export function truncate(value: string, max: number): string {
  const trimmed = value.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max - 1).trimEnd()}…`
}

/** Convert any YouTube URL (watch, share, embed) into the embed form. Returns null if not YouTube. */
export function youtubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null
  let parsed: URL | null = null
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  const host = parsed.hostname.replace(/^www\./, '')
  let videoId: string | null = null
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (parsed.pathname === '/watch') {
      videoId = parsed.searchParams.get('v')
    } else if (parsed.pathname.startsWith('/embed/')) {
      videoId = parsed.pathname.replace('/embed/', '').split('/')[0] ?? null
    } else if (parsed.pathname.startsWith('/shorts/')) {
      videoId = parsed.pathname.replace('/shorts/', '').split('/')[0] ?? null
    }
  } else if (host === 'youtu.be') {
    videoId = parsed.pathname.replace(/^\//, '').split('/')[0] ?? null
  }
  if (!videoId) return null
  return `https://www.youtube.com/embed/${videoId}`
}

/** Stable id used as React key when the API doesn't give us one (e.g. unsaved timeline rows). */
let localIdCounter = 0
export function nextLocalId(prefix = 'local'): string {
  localIdCounter += 1
  return `${prefix}-${localIdCounter}`
}

/** Renumber an ordered list so indices are 0..n-1 with no gaps. */
export function renumber<T extends { order_index: number }>(items: T[]): T[] {
  return items.map((item, idx) => ({ ...item, order_index: idx }))
}
