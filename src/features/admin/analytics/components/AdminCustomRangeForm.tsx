'use client'

import { useMemo } from 'react'
import { AlertCircle, CalendarDays, X } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface AdminCustomRangeFormProps {
  /** `YYYY-MM-DD`. Empty string = not set yet. */
  startDate: string
  /** `YYYY-MM-DD`. Empty string = not set yet. */
  endDate: string
  onStartChange: (next: string) => void
  onEndChange: (next: string) => void
}

type Preset = {
  id: string
  label: string
  hint: string
  from: Date
  to: Date
}

function toIsoDay(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function buildPresets(): Preset[] {
  const now = new Date()
  const today = startOfDay(now)
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const last7 = new Date(today)
  last7.setDate(today.getDate() - 6)
  const last30 = new Date(today)
  last30.setDate(today.getDate() - 29)
  const last90 = new Date(today)
  last90.setDate(today.getDate() - 89)
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

  return [
    { id: 'last7', label: '7 days', hint: 'last week', from: last7, to: today },
    { id: 'last30', label: '30 days', hint: 'last month', from: last30, to: today },
    { id: 'last90', label: '90 days', hint: 'last quarter', from: last90, to: today },
    {
      id: 'mtd',
      label: 'This month',
      hint: `${toIsoDay(monthStart)} → today`,
      from: monthStart,
      to: today,
    },
  ]
}

function presetMatches(p: Preset, startDate: string, endDate: string): boolean {
  if (!startDate || !endDate) return false
  return toIsoDay(p.from) === startDate && toIsoDay(p.to) === endDate
}

function diffDays(from: string, to: string): number {
  if (!from || !to) return 0
  const f = new Date(`${from}T00:00:00`).getTime()
  const t = new Date(`${to}T00:00:00`).getTime()
  return Math.max(0, Math.round((t - f) / (24 * 60 * 60 * 1000)) + 1)
}

const PRESETS = buildPresets()

/**
 * Custom range picker. The presets row gives one-tap "last N days" / "this
 * month" shortcuts (handy since the Weekly / Monthly / Yearly tabs already
 * cover rolling windows, this is for *exact* dates). The two native date
 * inputs below let the admin pick any range.
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
  const activePreset = useMemo(
    () => PRESETS.find((p) => presetMatches(p, startDate, endDate))?.id,
    [startDate, endDate],
  )
  const dayCount = useMemo(() => diffDays(startDate, endDate), [startDate, endDate])
  const canClear = !!startDate || !!endDate

  function applyPreset(p: Preset) {
    onStartChange(toIsoDay(p.from))
    onEndChange(toIsoDay(p.to))
  }

  function clearAll() {
    onStartChange('')
    onEndChange('')
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-blue-50/40 p-4 shadow-sm sm:p-5"
      aria-label="Custom date range"
    >
      <div className="absolute -top-12 -right-12 size-32 rounded-full bg-blue-100/40 blur-2xl" aria-hidden />
      <div className="relative flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 text-[11px] font-extrabold tracking-[0.14em] text-slate-500 uppercase">
            <span className="flex size-6 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <CalendarDays size={13} strokeWidth={2.4} />
            </span>
            Custom range
          </span>
          {canClear ? (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <X size={12} strokeWidth={2.6} />
              Clear
            </button>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-extrabold tracking-[0.12em] text-slate-400 uppercase">
            Quick presets
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => {
              const active = p.id === activePreset
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p)}
                  aria-pressed={active}
                  className={cn(
                    'group inline-flex flex-col items-start gap-0.5 rounded-xl border px-3 py-2 text-left transition',
                    active
                      ? 'border-blue-300 bg-blue-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/50',
                  )}
                >
                  <span
                    className={cn(
                      'text-xs font-extrabold transition',
                      active ? 'text-blue-700' : 'text-slate-800 group-hover:text-blue-700',
                    )}
                  >
                    {p.label}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] font-semibold transition',
                      active ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500',
                    )}
                  >
                    {p.hint}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-extrabold tracking-[0.12em] text-slate-400 uppercase">
            Or pick exact dates
          </span>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <DateInput
              label="From"
              value={startDate}
              max={endDate || undefined}
              onChange={onStartChange}
            />
            <span aria-hidden className="hidden text-lg font-bold text-slate-300 sm:inline">
              →
            </span>
            <DateInput
              label="To"
              value={endDate}
              min={startDate || undefined}
              onChange={onEndChange}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          {bothSet && ordered ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
              <span className="size-1.5 rounded-full bg-blue-500" />
              {dayCount} {dayCount === 1 ? 'day' : 'days'} selected
            </span>
          ) : null}
          {showError ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-rose-700">
              <AlertCircle size={11} strokeWidth={2.6} />
              Start must be on or before end
            </span>
          ) : null}
        </div>
      </div>
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
    <label className="group flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 sm:flex-initial">
      <span className="shrink-0 text-[10px] font-extrabold tracking-[0.1em] text-slate-400 uppercase">
        {label}
      </span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className="min-w-0 flex-1 bg-transparent text-xs font-bold text-slate-800 outline-none placeholder:font-medium placeholder:text-slate-400 sm:flex-initial"
      />
    </label>
  )
}
