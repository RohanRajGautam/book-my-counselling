import {
  RevenueBreakdownItem,
  RevenuePeriod,
} from '../../types/admin.types'

const DAY_MS = 24 * 60 * 60 * 1000

export interface FilledRevenuePoint {
  /** First day of the bucket in `YYYY-MM-DD` (same shape as `period_start`). */
  bucketStart: string
  revenue: number
  booking_count: number
  /** Pre-formatted short axis label — e.g. `Jul 14` / `Aug` / `2026`. */
  chartLabel: string
}

/**
 * Fill empty buckets for the chosen granularity within `[startDate, endDate]`
 * (using the response's echoed window, which is inclusive on both ends):
 *
 * - `weekly` / `custom` → iterate day-by-day.
 * - `monthly`            → iterate month-by-month.
 * - `yearly`             → iterate year-by-year.
 *
 * Buckets present in `breakdown` overwrite the zero defaults. Missing
 * buckets (the response omits them — see the API doc) appear as zero rows.
 */
export function fillBreakdownGaps(
  breakdown: RevenueBreakdownItem[],
  period: RevenuePeriod,
  startDate: string,
  endDate: string,
): FilledRevenuePoint[] {
  if (period === 'monthly') return fillMonthly(breakdown, startDate, endDate)
  if (period === 'yearly') return fillYearly(breakdown, startDate, endDate)
  return fillDaily(breakdown, startDate, endDate)
}

// ── Coverage label ───────────────────────────────────────────────────────

/**
 * Human-readable coverage window for the chart subtitle, e.g.
 * `Jul 11 – Jul 18`, `Jul 2025 – Jul 2026`, or `2021 – 2026`.
 */
export function formatCoverageWindow(
  startDate: string,
  endDate: string,
  period: RevenuePeriod,
): string {
  if (period === 'yearly') {
    const sy = new Date(startDate).getUTCFullYear()
    const ey = new Date(endDate).getUTCFullYear()
    return `${sy} – ${ey}`
  }
  const startYear = new Date(startDate).getUTCFullYear()
  const endYear = new Date(endDate).getUTCFullYear()
  if (startYear === endYear) {
    return `${formatMonthDay(startDate)} – ${formatMonthDay(endDate)}`
  }
  return `${formatMonthDayYear(startDate)} – ${formatMonthDayYear(endDate)}`
}

// ── Helpers ──────────────────────────────────────────────────────────────

function fillDaily(
  breakdown: RevenueBreakdownItem[],
  startDate: string,
  endDate: string,
): FilledRevenuePoint[] {
  const start = startOfUtcDay(new Date(startDate))
  const end = startOfUtcDay(new Date(endDate))
  if (end.getTime() < start.getTime()) return []

  const byDate = new Map(breakdown.map((b) => [b.period_start, b]))
  const filled: FilledRevenuePoint[] = []

  for (let t = start.getTime(); t <= end.getTime(); t += DAY_MS) {
    const iso = isoDay(t)
    const existing = byDate.get(iso)
    filled.push({
      bucketStart: iso,
      revenue: existing?.revenue ?? 0,
      booking_count: existing?.booking_count ?? 0,
      chartLabel: formatMonthDay(iso),
    })
  }
  return filled
}

function fillMonthly(
  breakdown: RevenueBreakdownItem[],
  startDate: string,
  endDate: string,
): FilledRevenuePoint[] {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const cur = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1))
  const last = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1))

  const byMonth = new Map<string, RevenueBreakdownItem>(
    breakdown.map((b) => [b.period_start, b]),
  )

  const filled: FilledRevenuePoint[] = []
  while (cur.getTime() <= last.getTime()) {
    const key = `${cur.getUTCFullYear()}-${String(cur.getUTCMonth() + 1).padStart(2, '0')}-01`
    const existing = byMonth.get(key)
    filled.push({
      bucketStart: key,
      revenue: existing?.revenue ?? 0,
      booking_count: existing?.booking_count ?? 0,
      chartLabel: formatMonthLabel(key),
    })
    cur.setUTCMonth(cur.getUTCMonth() + 1)
  }
  return filled
}

function fillYearly(
  breakdown: RevenueBreakdownItem[],
  startDate: string,
  endDate: string,
): FilledRevenuePoint[] {
  const startYear = new Date(startDate).getUTCFullYear()
  const endYear = new Date(endDate).getUTCFullYear()
  const byYear = new Map<string, RevenueBreakdownItem>(
    breakdown.map((b) => [b.period_start, b]),
  )

  const filled: FilledRevenuePoint[] = []
  for (let y = startYear; y <= endYear; y++) {
    const key = `${y}-01-01`
    const existing = byYear.get(key)
    filled.push({
      bucketStart: key,
      revenue: existing?.revenue ?? 0,
      booking_count: existing?.booking_count ?? 0,
      chartLabel: String(y),
    })
  }
  return filled
}

function startOfUtcDay(d: Date): Date {
  const x = new Date(d)
  x.setUTCHours(0, 0, 0, 0)
  return x
}

function isoDay(tMs: number): string {
  return new Date(tMs).toISOString().slice(0, 10)
}

function formatMonthDay(iso: string): string {
  return new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function formatMonthDayYear(iso: string): string {
  return new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function formatMonthLabel(monthKey: string): string {
  return new Date(`${monthKey.slice(0, 7)}-01T00:00:00Z`).toLocaleDateString(
    undefined,
    { month: 'short', timeZone: 'UTC' },
  )
}
