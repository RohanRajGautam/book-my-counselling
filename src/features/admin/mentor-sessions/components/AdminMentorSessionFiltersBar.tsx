'use client'

import {
  AdminBookingStatus,
  AdminPaymentStatus,
  MentorSessionSort,
} from '../../types/admin.types'
import { BOOKING_PAYMENT_OPTIONS, BOOKING_STATUS_OPTIONS } from '../../bookings/lib/bookingBadges'
import { MENTOR_SESSION_SORT_OPTIONS } from '../lib/mentorSessionFilters'

export interface AdminMentorSessionFiltersBarProps {
  status: AdminBookingStatus | 'all'
  setStatus: (next: AdminBookingStatus | 'all') => void
  paymentStatus: AdminPaymentStatus | 'all'
  setPaymentStatus: (next: AdminPaymentStatus | 'all') => void
  /** `YYYY-MM-DD` from the native date input. */
  dateFrom: string
  setDateFrom: (next: string) => void
  /** `YYYY-MM-DD` from the native date input. */
  dateTo: string
  setDateTo: (next: string) => void
  sort: MentorSessionSort
  setSort: (next: MentorSessionSort) => void
  onClear: () => void
}

const SELECT_CLASS =
  'h-11 rounded-xl bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200'

const DATE_CLASS =
  'h-11 rounded-xl bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200'

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-[11px] font-extrabold tracking-wide text-slate-500 uppercase"
    >
      {children}
    </label>
  )
}

/**
 * Filters for the platform-bookings tab.
 *
 * The two date inputs are native `<input type="date">` — they hand back a
 * `YYYY-MM-DD` string which `dateFromBound` / `dateToBound` widen to
 * inclusive UTC instants before the request goes out.
 */
export function AdminMentorSessionFiltersBar({
  status,
  setStatus,
  paymentStatus,
  setPaymentStatus,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  sort,
  setSort,
  onClear,
}: AdminMentorSessionFiltersBarProps) {
  return (
    <div className="grid items-start gap-3 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto_auto]">
      <div>
        <Label htmlFor="mentor-session-status">Status</Label>
        <select
          id="mentor-session-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as AdminBookingStatus | 'all')}
          className={`${SELECT_CLASS} w-full`}
        >
          {BOOKING_STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="mentor-session-payment">Payment</Label>
        <select
          id="mentor-session-payment"
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value as AdminPaymentStatus | 'all')}
          className={`${SELECT_CLASS} w-full`}
        >
          {BOOKING_PAYMENT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="mentor-session-date-from">Session from</Label>
        <input
          id="mentor-session-date-from"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className={`${DATE_CLASS} w-full`}
        />
      </div>

      <div>
        <Label htmlFor="mentor-session-date-to">Session to</Label>
        <input
          id="mentor-session-date-to"
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className={`${DATE_CLASS} w-full`}
        />
      </div>

      <div>
        <Label htmlFor="mentor-session-sort">Sort</Label>
        <select
          id="mentor-session-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as MentorSessionSort)}
          className={`${SELECT_CLASS} w-full lg:w-auto`}
        >
          {MENTOR_SESSION_SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="h-11 self-end rounded-xl px-4 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
      >
        Clear filters
      </button>
    </div>
  )
}
