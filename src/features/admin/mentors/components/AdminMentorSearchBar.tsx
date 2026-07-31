'use client'

import { Search, X } from 'lucide-react'

export interface AdminMentorSearchBarProps {
  value: string
  onChange: (next: string) => void
}

export function AdminMentorSearchBar({ value, onChange }: AdminMentorSearchBarProps) {
  return (
    <div className="relative w-full">
      <Search
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
        aria-hidden
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name or email…"
        aria-label="Search mentors by name or email"
        className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pr-11 pl-11 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-200"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute top-1/2 right-3 flex size-6 -translate-y-1/2 items-center justify-center rounded text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  )
}