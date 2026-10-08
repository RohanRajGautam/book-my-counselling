'use client'

import { Search, X } from 'lucide-react'

import { BookingStatus } from '@/features/mentor-dashboard/types/booking-status'
import {
  BOOKING_STATUS_OPTIONS,
} from '../../bookings/lib/bookingBadges'

export interface AdminMeetingsFiltersBarProps {
  q: string
  setQ: (next: string) => void
  hasLink: 'all' | 'true' | 'false'
  setHasLink: (next: 'all' | 'true' | 'false') => void
  status: BookingStatus | 'all'
  setStatus: (next: BookingStatus | 'all') => void
}

export function AdminMeetingsFiltersBar({
  q,
  setQ,
  hasLink,
  setHasLink,
  status,
  setStatus,
}: AdminMeetingsFiltersBarProps) {
  return (
    <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto_auto_auto]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search mentee email/name, mentor name, or booking ID prefix…"
          className="h-11 w-full rounded-xl bg-slate-50 pl-10 pr-10 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-200"
        />
        {q ? (
          <button
            type="button"
            onClick={() => setQ('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      <select
        value={hasLink}
        onChange={(e) => setHasLink(e.target.value as 'all' | 'true' | 'false')}
        className="h-11 rounded-xl bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200"
      >
        <option value="all">All links</option>
        <option value="true">Has link</option>
        <option value="false">Missing link</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as BookingStatus | 'all')}
        className="h-11 rounded-xl bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200"
      >
        {BOOKING_STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}