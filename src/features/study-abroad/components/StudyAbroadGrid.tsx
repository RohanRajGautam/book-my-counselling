'use client'

import { ArrowUpDown, ChevronDown, Search, SlidersHorizontal } from 'lucide-react'

import { StudyAbroadCard } from '@/features/study-abroad/components/StudyAbroadCard'
import type {
  StudyAbroadConsultant,
  StudyAbroadSort,
} from '@/features/study-abroad/types/study-abroad.types'

const SORT_OPTIONS: {
  value: StudyAbroadSort
  label: string
}[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'rating', label: 'Top rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
]

type StudyAbroadGridProps = {
  consultants: StudyAbroadConsultant[]
  search: string
  sortBy: StudyAbroadSort
  onSearchChange: (value: string) => void
  onSortChange: (value: StudyAbroadSort) => void
  onOpenMobileFilters: () => void
  onBookConsultant: (consultant: StudyAbroadConsultant) => void
}

export function StudyAbroadGrid({
  consultants,
  search,
  sortBy,
  onSearchChange,
  onSortChange,
  onOpenMobileFilters,
  onBookConsultant,
}: StudyAbroadGridProps) {
  return (
    <section id="study-abroad-results" className="px-5 py-4 sm:px-6 sm:py-0 lg:px-8 xl:px-10">
      <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="flex h-16 min-w-0 flex-1 items-center rounded-2xl bg-white px-4 shadow-[0_12px_30px_rgba(18,28,42,0.04)] ring-1 ring-[#eff4ff] ring-inset">
          <Search className="mr-3 size-6 text-[#0053db]" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name, country, university, or company..."
            className="h-full min-w-0 flex-1 bg-transparent text-base font-semibold text-[#121c2a] outline-none placeholder:text-[#b5bbc8]"
          />
          <button
            type="button"
            onClick={() =>
              document
                .getElementById('study-abroad-results')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
            className="ml-2 h-10 rounded-xl bg-[#0053db] px-7 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(0,83,219,0.22)] transition hover:bg-[#003fa8]"
          >
            Search
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-2xl bg-white px-4 shadow-[0_12px_30px_rgba(18,28,42,0.04)] ring-1 ring-[#eff4ff] ring-inset xl:flex-none">
            <ArrowUpDown className="size-5 shrink-0 text-[#0053db]" />
            <span className="text-sm font-extrabold text-[#434655]">Sort</span>
            <span className="relative min-w-0 flex-1 xl:flex-none">
              <select
                value={sortBy}
                onChange={(event) => onSortChange(event.target.value as StudyAbroadSort)}
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

          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="inline-flex h-14 shrink-0 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-extrabold text-[#0053db] shadow-[0_12px_30px_rgba(18,28,42,0.04)] ring-1 ring-[#eff4ff] ring-inset lg:hidden"
          >
            <SlidersHorizontal className="size-4" />
            Filters
          </button>
        </div>
      </div>

      {consultants.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {consultants.map((consultant) => (
            <StudyAbroadCard
              key={consultant.id}
              consultant={consultant}
              onBook={onBookConsultant}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[360px] items-center justify-center rounded-[24px] bg-white p-12 text-center shadow-[0_16px_40px_rgba(18,28,42,0.04)] ring-1 ring-[#eff4ff] ring-inset">
          <div>
            <p className="mb-2 text-xl font-extrabold text-[#121c2a]">No consultants found</p>
            <p className="font-medium text-[#5f6472]">
              Try another country or search for a different university, company, or city.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
