'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpDown, ChevronDown, Search, SlidersHorizontal } from 'lucide-react'

import { useFilters } from '@/features/filters/context/FilterContext'

const SEARCH_DEBOUNCE_MS = 300

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top rated' },
  { value: 'reviews', label: 'Most reviewed' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
] as const

interface AcademicCounsellorSearchControlsProps {
  onOpenMobileFilters?: () => void
}

export function AcademicCounsellorSearchControls({
  onOpenMobileFilters,
}: AcademicCounsellorSearchControlsProps) {
  const { filters, updateFilter } = useFilters()
  const [searchInputValue, setSearchInputValue] = useState(filters.jobTitle ?? '')
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isUserTypingRef = useRef(false)

  useEffect(() => {
    if (!isUserTypingRef.current) {
      setSearchInputValue(filters.jobTitle ?? '')
    }
  }, [filters.jobTitle])

  const handleSearchChange = (value: string) => {
    isUserTypingRef.current = true
    setSearchInputValue(value)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      isUserTypingRef.current = false
      updateFilter('jobTitle', value)
    }, SEARCH_DEBOUNCE_MS)
  }

  return (
    <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center">
      <div className="flex h-16 min-w-0 flex-1 items-center rounded-2xl border border-gray-100 bg-white px-4 ring-1 ring-[#eff4ff] ring-inset">
        <Search className="mr-3 size-6 text-[#0053db]" />
        <input
          type="search"
          value={searchInputValue}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="Search by name, role, or company..."
          aria-label="Search mentors by name, role, or company"
          className="h-full min-w-0 flex-1 bg-transparent text-base font-semibold text-[#121c2a] outline-none placeholder:text-[#b5bbc8]"
        />
        <button
          type="button"
          onClick={() => {
            if (debounceTimerRef.current) {
              clearTimeout(debounceTimerRef.current)
            }
            updateFilter('jobTitle', searchInputValue)
          }}
          className="ml-2 h-10 rounded-xl bg-[#0053db] px-7 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(0,83,219,0.22)] transition hover:bg-[#003fa8]"
        >
          Search
        </button>
      </div>

      <div className="flex items-center gap-3">
        <label className="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 ring-1 ring-[#eff4ff] ring-inset xl:flex-none">
          <ArrowUpDown className="size-5 shrink-0 text-[#0053db]" />
          <span className="text-sm font-extrabold text-[#434655]">Sort</span>
          <span className="relative min-w-0 flex-1 xl:flex-none">
            <select
              value={filters.sortBy}
              onChange={(event) =>
                updateFilter(
                  'sortBy',
                  event.target.value as (typeof SORT_OPTIONS)[number]['value']
                )
              }
              className="h-10 w-full min-w-0 appearance-none rounded-xl bg-[#f8f9ff] px-3 pr-9 text-sm font-extrabold text-[#121c2a] ring-1 ring-[#eff4ff] transition outline-none ring-inset focus:ring-2 focus:ring-[#0053db]/30 xl:min-w-[180px]"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#0053db]" />
          </span>
        </label>

        {onOpenMobileFilters && (
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="inline-flex h-14 shrink-0 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-extrabold text-[#0053db] shadow-[0_12px_30px_rgba(18,28,42,0.04)] ring-1 ring-[#eff4ff] ring-inset lg:hidden"
          >
            <SlidersHorizontal className="size-4" />
            Filters
          </button>
        )}
      </div>
    </div>
  )
}