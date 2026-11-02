'use client'

import { Search, X } from 'lucide-react'

import { MentorPickerCombobox } from '../../mentors/_shared/MentorPickerCombobox'
import { BOOKING_PAYMENT_OPTIONS, BOOKING_STATUS_OPTIONS } from '../lib/bookingBadges'
import {
  AdminBookingStatus,
  AdminMentorPickerOption,
  AdminPaymentStatus,
} from '../../types/admin.types'

export interface AdminBookingFiltersBarProps {
  q: string
  setQ: (next: string) => void
  status: AdminBookingStatus | 'all'
  setStatus: (next: AdminBookingStatus | 'all') => void
  paymentStatus: AdminPaymentStatus | 'all'
  setPaymentStatus: (next: AdminPaymentStatus | 'all') => void
  mentorId: string
  setMentorId: (next: string) => void
  mentor: AdminMentorPickerOption | null
  setMentor: (next: AdminMentorPickerOption | null) => void
}

export function AdminBookingFiltersBar({
  q,
  setQ,
  status,
  setStatus,
  paymentStatus,
  setPaymentStatus,
  mentorId,
  setMentorId,
  mentor,
  setMentor,
}: AdminBookingFiltersBarProps) {
  return (
    <div className="grid items-start gap-3 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto_auto_auto]">
      <div>
        <span className="mb-1 block text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
          Search
        </span>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by mentee name, email, or phone, mentor name, or booking ID prefix…"
            className="h-11 w-full rounded-xl bg-slate-50 pr-10 pl-10 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-200"
          />
          {q ? (
            <button
              type="button"
              onClick={() => setQ('')}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="min-w-[220px]">
        <MentorPickerCombobox
          value={mentorId}
          onChange={({ id, mentor: picked }) => {
            setMentorId(id)
            setMentor(picked.id ? picked : null)
          }}
          initialMentor={mentor ?? undefined}
          label="Mentor"
          required={false}
          inputId="admin-bookings-mentor"
          placeholder="Any mentor…"
        />
      </div>

      <div>
        <span className="mb-1 block text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
          Status
        </span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as AdminBookingStatus | 'all')}
          className="h-11 rounded-xl bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200"
          aria-label="Status"
        >
          {BOOKING_STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span className="mb-1 block text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
          Payment
        </span>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value as AdminPaymentStatus | 'all')}
          className="h-11 rounded-xl bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200"
          aria-label="Payment"
        >
          {BOOKING_PAYMENT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
