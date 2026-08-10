'use client'

import { Check, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import {
  COACH_FOR_FRESHERS_GROUP_TAG,
  COACH_FOR_FRESHERS_SERVICE_SLUGS,
} from '@/features/coach-for-freshers/types/coach-for-freshers.types'
import { displayTagName } from '@/features/mentors/utils/mentors.utils'
import { useTags } from '@/features/tags/hooks/useTags'
import { TagResponse } from '@/features/tags/types/tags.types'

type AcademicTagPickerProps = {
  /** Selected tag slugs. */
  value: string[]
  /** Called whenever the selection changes. */
  onChange: (next: string[]) => void
}

// Default visible count when nothing is searched and the user hasn't expanded.
// Bigger catalogs (30+ tags) get overwhelming in a grid; collapse by default
// and let users search or expand.
const COLLAPSED_LIMIT = 8

// The Coach for Freshers service slugs + the group tag belong to the
// professional coaching flow — never offer them in the academic tag picker.
const EXCLUDED_TAG_SLUGS = new Set<string>([
  ...COACH_FOR_FRESHERS_SERVICE_SLUGS,
  COACH_FOR_FRESHERS_GROUP_TAG,
])

/**
 * Multi-select chip group for academic-relevant catalog tags.
 *
 * Pulls every row from `/catalog/tags` and lets the mentor pick which apply.
 * The Coach for Freshers service slugs and group tag are filtered out —
 * they belong to the professional coaching flow, not academic expertise.
 * Selections are tracked as slugs and resolved to backend UUIDs on submit.
 *
 * The full catalog is collapsed by default (8 chips shown); users can either
 * type in the search box to filter or hit "Show more" to expand. Selected
 * chips are always pinned to the top of the visible list so existing
 * selections stay obvious even when the rest is collapsed.
 *
 * Backend data is inconsistent on the `#` prefix (some tags arrive already
 * prefixed, some don't); all visible labels are normalized through
 * `displayTagName` so the rendered chips always carry exactly one `#`.
 */
export function AcademicTagPicker({ value, onChange }: AcademicTagPickerProps) {
  const { data: tags = [], isLoading } = useTags()
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(false)

  const toggle = (slug: string) => {
    onChange(value.includes(slug) ? value.filter((v) => v !== slug) : [...value, slug])
  }

  const availableTags = useMemo(
    () => tags.filter((tag) => !EXCLUDED_TAG_SLUGS.has(tag.slug)),
    [tags]
  )

  const trimmed = query.trim().toLowerCase()
  const isSearching = trimmed.length > 0

  // Filter by query when searching; otherwise show the full catalog (then
  // collapse visually below).
  const matchingTags = useMemo(() => {
    if (!isSearching) return availableTags
    return availableTags.filter((tag) => tag.name.toLowerCase().includes(trimmed))
  }, [availableTags, isSearching, trimmed])

  // When collapsed, pin selected chips first so an existing selection isn't
  // hidden behind the fold.
  const selectedSet = useMemo(() => new Set(value), [value])
  const orderedTags = useMemo(() => {
    if (!isSearching && !expanded) {
      const selected: TagResponse[] = []
      const rest: TagResponse[] = []
      for (const tag of matchingTags) {
        if (selectedSet.has(tag.slug)) selected.push(tag)
        else rest.push(tag)
      }
      return [...selected, ...rest].slice(0, COLLAPSED_LIMIT)
    }
    return matchingTags
  }, [matchingTags, isSearching, expanded, selectedSet])

  const hiddenCount =
    !isSearching && !expanded ? matchingTags.length - orderedTags.length : 0
  const showExpandButton = !isSearching && !expanded && matchingTags.length > COLLAPSED_LIMIT

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-full rounded-full bg-slate-100" />
        ))}
      </div>
    )
  }

  if (availableTags.length === 0) {
    return (
      <p className="rounded-2xl bg-[#f0f4ff] px-4 py-3 text-xs font-medium text-slate-500">
        No tags are available right now.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <PickerSearch value={query} onChange={setQuery} placeholder="Search tags…" />

      <div className="flex items-center justify-between gap-3 px-1">
        <p className="text-xs font-medium text-slate-500">
          {value.length === 0 ? (
            'No tags selected'
          ) : (
            <>
              <span className="font-extrabold text-blue-600">{value.length}</span>{' '}
              {value.length === 1 ? 'tag' : 'tags'} selected
            </>
          )}
        </p>
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-xs font-bold text-blue-600 underline-offset-2 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {orderedTags.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center">
          <p className="text-sm font-bold text-slate-700">No matches</p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            No tags match “{query}”. Try a different search.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {orderedTags.map((tag) => (
              <AcademicTagChip
                key={tag.id}
                tag={tag}
                active={value.includes(tag.slug)}
                onClick={() => toggle(tag.slug)}
              />
            ))}
          </div>

          {/* Inline "more" affordance — visible only when the catalog is
              collapsed and there's something to reveal. */}
          {!isSearching && (expanded || hiddenCount > 0) && (
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="text-xs font-bold text-blue-700 underline-offset-4 hover:underline"
              >
                {expanded ? 'Show less' : `Show ${hiddenCount} more tags`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function PickerSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="size-3.5" strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}

function AcademicTagChip({
  tag,
  active,
  onClick,
}: {
  tag: TagResponse
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm font-bold transition ${
        active
          ? 'border-blue-600 bg-blue-50 text-blue-700'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
      }`}
    >
      <span
        className={`flex size-4 shrink-0 items-center justify-center rounded transition ${
          active ? 'bg-blue-600 text-white' : 'bg-slate-200 text-transparent'
        }`}
      >
        <Check className="size-3" strokeWidth={3.5} />
      </span>
      <span>{displayTagName(tag.name)}</span>
    </button>
  )
}
