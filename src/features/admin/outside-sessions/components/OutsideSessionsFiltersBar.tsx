'use client'

import { Search, X } from 'lucide-react'

import { MentorPickerCombobox } from '../../mentors/_shared/MentorPickerCombobox'
import { OUTSIDE_SESSION_STATUS_OPTIONS } from '../lib/outsideSessionBadges'
import { AdminMentorPickerOption, OutsideSessionStatus } from '../../types/admin.types'

export interface OutsideSessionsFiltersBarProps {
  q: string
  setQ: (next: string) => void
  status: OutsideSessionStatus | 'all'
  setStatus: (next: OutsideSessionStatus | 'all') => void
  mentorId: string
  setMentorId: (next: string) => void
  mentor: AdminMentorPickerOption | null
  setMentor: (next: AdminMentorPickerOption | null) => void
}

export function OutsideSessionsFiltersBar({
  q,
  setQ,
  status,
  setStatus,
  mentorId,
  setMentorId,
  mentor,
  setMentor,
}: OutsideSessionsFiltersBarProps) {
  return (
    <div className="grid items-start gap-3 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto_auto]">
      <div>
        <span className="mb-1 block text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
          Search
        </span>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by mentee email/name, mentor name…"
            className="h-11 w-full rounded-xl bg-slate-50 pr-10 pl-10 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-200"
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
          inputId="admin-outside-sessions-mentor"
          placeholder="Any mentor…"
        />
      </div>

      <div>
        <span className="mb-1 block text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
          Status
        </span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OutsideSessionStatus | 'all')}
          className="h-11 rounded-xl bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200"
          aria-label="Status"
        >
          {OUTSIDE_SESSION_STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
