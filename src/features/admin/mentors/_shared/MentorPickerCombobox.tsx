'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, Loader2, Search, X } from 'lucide-react'

import { useAdminMentors } from '@/features/admin/mentors/hooks/useAdminMentors'
import {
  AdminMentorPickerOption,
  AdminMentorProfile,
} from '../../types/admin.types'

import { cn } from '@/lib/utils'

export interface MentorPickerComboboxProps {
  value: string
  onChange: (next: { id: string; mentor: AdminMentorPickerOption }) => void
  /** Render an inline error under the input. */
  error?: string
  /** Disable interaction (during submit). */
  disabled?: boolean
  /**
   * Initial mentor to seed the picker with — used when the modal opens from
   * the mentor detail page with a pre-filled mentor. When set, the picker
   * renders the chosen mentor without needing a search.
   */
  initialMentor?: AdminMentorPickerOption
}

function projectMentor(m: AdminMentorProfile): AdminMentorPickerOption {
  return {
    id: m.id,
    full_name: m.user.full_name,
    email: m.user.email,
    title: m.title,
    mentor_share_pct: m.mentor_share_pct,
    hourly_rate: m.hourly_rate ?? null,
  }
}

function searchIdentity(m: AdminMentorPickerOption, q: string): boolean {
  const needle = q.toLowerCase()
  return (
    m.full_name.toLowerCase().includes(needle) ||
    (m.email?.toLowerCase().includes(needle) ?? false) ||
    (m.title?.toLowerCase().includes(needle) ?? false)
  )
}

/**
 * Searchable mentor dropdown for the admin record-session modal.
 *
 * Uses `useAdminMentors` with a small `pageSize` for fast typeahead. The
 * caller controls selection — we only emit `{id, mentor}` via `onChange`. The
 * "selected" state is rendered by the caller from `initialMentor` so the
 * picker stays in sync when the modal opens pre-filled from another page.
 */
export function MentorPickerCombobox({
  value,
  onChange,
  error,
  disabled,
  initialMentor,
}: MentorPickerComboboxProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()

  // Debounce the search query (350ms) so we don't slam `/admin/mentors` on
  // every keystroke. Server-side filter is `q`, so the debounce is correct —
  // we wait for the user to stop typing before fetching.
  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(query.trim()), 350)
    return () => window.clearTimeout(t)
  }, [query])

  const { data, isFetching } = useAdminMentors({}, 1, debouncedQuery || undefined)

  const serverItems = data?.items ?? []
  const hasExactSelection = !!value
  const selectedMentor =
    serverItems.find((m) => m.id === value) ?? null
  const visibleSelected = initialMentor && initialMentor.id === value ? initialMentor : null
  const isSelectedFromList = selectedMentor !== null

  // Show the chosen mentor as the first row even if the current search
  // wouldn't return them, so the admin can see what's selected after typing.
  const items: AdminMentorPickerOption[] = (() => {
    if (!hasExactSelection) return serverItems.map(projectMentor)
    if (visibleSelected) {
      const rest = serverItems
        .map(projectMentor)
        .filter((m) => m.id !== visibleSelected.id)
      return [visibleSelected, ...rest]
    }
    if (isSelectedFromList && selectedMentor) {
      const chosen = projectMentor(selectedMentor)
      const rest = serverItems
        .map(projectMentor)
        .filter((m) => m.id !== chosen.id)
      return [chosen, ...rest]
    }
    return serverItems.map(projectMentor)
  })()

  const filteredItems = query
    ? items.filter((m) => searchIdentity(m, query))
    : items

  const showNoResults =
    !isFetching && debouncedQuery.length > 0 && filteredItems.length === 0

  const handleSelect = (mentor: AdminMentorPickerOption) => {
    onChange({ id: mentor.id, mentor })
    setQuery('')
    setOpen(false)
  }

  const handleClear = () => {
    onChange({ id: '', mentor: { id: '', full_name: '', email: null, title: null, mentor_share_pct: '50', hourly_rate: null } })
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <div className="relative">
      <label
        htmlFor="record-session-mentor"
        className="mb-1 block text-[11px] font-extrabold tracking-wide text-slate-500 uppercase"
      >
        Mentor <span className="text-red-600">*</span>
      </label>

      {hasExactSelection ? (
        <div
          className={cn(
            'flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5',
            error && 'border-red-300 bg-red-50/40',
          )}
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">
              {visibleSelected?.full_name ??
                selectedMentor?.user.full_name ??
                'Selected mentor'}
            </p>
            {(visibleSelected?.title || selectedMentor?.title) && (
              <p className="truncate text-xs text-slate-500">
                {visibleSelected?.title ?? selectedMentor?.title}
              </p>
            )}
            {(visibleSelected?.email || selectedMentor?.user.email) && (
              <p className="truncate text-[11px] text-slate-400">
                {visibleSelected?.email ?? selectedMentor?.user.email}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Change mentor"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            ref={inputRef}
            id="record-session-mentor"
            type="text"
            autoComplete="off"
            spellCheck={false}
            disabled={disabled}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => window.setTimeout(() => setOpen(false), 120)}
            placeholder="Search by name, email, or title…"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            className={cn(
              'h-11 w-full rounded-xl bg-slate-50 pr-10 pl-10 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-200 disabled:opacity-50',
              error && 'ring-2 ring-red-200',
            )}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400">
            {isFetching ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </span>
        </div>
      )}

      {open && !hasExactSelection ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute top-full right-0 left-0 z-30 mt-1 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl"
        >
          {filteredItems.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-400">
              {showNoResults
                ? `No mentors match “${debouncedQuery}”.`
                : 'Start typing to search mentors.'}
            </p>
          ) : (
            filteredItems.map((m) => (
              <button
                key={m.id}
                type="button"
                role="option"
                aria-selected={false}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(m)}
                className="flex w-full flex-col gap-0.5 border-b border-slate-100 px-4 py-2.5 text-left transition last:border-b-0 hover:bg-blue-50"
              >
                <span className="truncate text-sm font-bold text-slate-900">
                  {m.full_name}
                </span>
                <span className="truncate text-[11px] text-slate-500">
                  {m.email ? `${m.email} · ` : ''}
                  {m.title ?? '—'}
                </span>
              </button>
            ))
          )}
        </div>
      ) : null}

      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}