'use client'

import { AlertCircle, CalendarRange } from 'lucide-react'

export interface AdminCustomRangeFormProps {
  /** `YYYY-MM-DD`. Empty string = not set yet. */
  startDate: string
  /** `YYYY-MM-DD`. Empty string = not set yet. */
  endDate: string
  onStartChange: (next: string) => void
  onEndChange: (next: string) => void
}

/**
 * Two-native-date-input range picker used by the Revenue Trends card when
 * the admin picks the `Custom` period. Native inputs keep the bundle lean
 * and inherit the OS date UX.
 *
 * Layout — stacked vertically on phones (each input full width), inline at
 * `sm` and up. `min-w-0` lets the inputs shrink inside their flex parents
 * so the form never overflows the chart card.
 *
 * Validation mirrors what the server accepts (per the API doc):
 *   - Start and end are both required (gated upstream by `enabled`).
 *   - Start must be on or before end.
 */
export function AdminCustomRangeForm({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: AdminCustomRangeFormProps) {
  const bothSet = !!startDate && !!endDate
  const ordered = bothSet && startDate <= endDate
  const showError = bothSet && !ordered

  return (
    <div
      className="flex w-full min-w-0 flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
      aria-label="Custom date range"
    >
      <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-[0.12em] text-slate-500 uppercase">
        <CalendarRange size={14} strokeWidth={2.4} />
        Custom range
      </span>

      <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
        <DateInput
          label="From"
          value={startDate}
          max={endDate || undefined}
          onChange={onStartChange}
        />
        <span aria-hidden className="hidden text-slate-300 sm:inline">→</span>
        <DateInput
          label="To"
          value={endDate}
          min={startDate || undefined}
          onChange={onEndChange}
        />
      </div>

      {showError ? (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600">
          <AlertCircle size={12} strokeWidth={2.4} />
          Start must be on or before end
        </span>
      ) : null}
    </div>
  )
}

function DateInput({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: string
  min?: string
  max?: string
  onChange: (next: string) => void
}) {
  return (
    <label className="flex min-w-0 flex-1 items-center gap-2 sm:flex-initial">
      <span className="shrink-0 text-[11px] font-bold text-slate-500">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-bold text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200/60 sm:flex-initial"
      />
    </label>
  )
}
