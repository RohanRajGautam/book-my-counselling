'use client'

import { CalendarRange, X } from 'lucide-react'

import type { PayoutStatus } from '../types/payouts.types'

export interface AdminPayoutHistoryFiltersBarProps {
  startDate: string
  endDate: string
  onStartDateChange: (next: string) => void
  onEndDateChange: (next: string) => void
  /** True when the status tab passed an active status filter. */
  status?: PayoutStatus | undefined
}

export function AdminPayoutHistoryFiltersBar({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  status,
}: AdminPayoutHistoryFiltersBarProps) {
  const hasDateFilter = !!startDate || !!endDate
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-extrabold tracking-[0.14em] text-slate-500 uppercase">
        <CalendarRange className="size-3.5" />
        Created between
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          aria-label="Filter by start date"
          className="h-11 rounded-xl bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200"
        />
        <span className="text-xs font-bold text-slate-400">→</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          aria-label="Filter by end date"
          className="h-11 rounded-xl bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200"
        />
        {hasDateFilter ? (
          <button
            type="button"
            onClick={() => {
              onStartDateChange('')
              onEndDateChange('')
            }}
            className="flex h-11 items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-extrabold tracking-[0.14em] text-slate-500 uppercase hover:bg-slate-100"
          >
            <X className="size-3.5" />
            Clear
          </button>
        ) : null}
      </div>

      {status ? (
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-extrabold tracking-[0.14em] text-blue-700 uppercase">
          Status: {status}
        </span>
      ) : null}
    </div>
  )
}