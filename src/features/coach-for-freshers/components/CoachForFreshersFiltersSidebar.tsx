'use client'

import Image from 'next/image'
import { Check } from 'lucide-react'

import { COACH_FOR_FRESHERS_CATEGORIES } from '../types/coach-for-freshers.types'
import { useCoachForFreshersFilters } from '../context/CoachForFreshersFiltersContext'

export function CoachForFreshersFiltersSidebar() {
  const { filters, updateFilters } = useCoachForFreshersFilters()

  return (
    <aside className="bg-[#eef2fb] px-4 py-10 lg:sticky lg:top-[73px] lg:min-h-[calc(100vh-73px)]">
      <section className="overflow-hidden rounded-lg bg-white">
        <div className="border-b border-[var(--color-surface-container-high)] px-5 py-4">
          <div className="flex min-w-0 items-center gap-2">
            <Image
              src="/home/byc-logo.svg"
              alt="Book Your Counselling"
              width={88}
              height={24}
              className="h-4 w-auto shrink-0"
            />
            <h3 className="font-[family-name:var(--font-headline)] text-sm leading-tight font-extrabold text-[var(--foreground)]">
              Coach for Freshers
            </h3>
          </div>
        </div>

        <div className="py-2">
          {COACH_FOR_FRESHERS_CATEGORIES.map((category) => {
            const isSelected = filters.category === category
            return (
              <button
                key={category}
                type="button"
                onClick={() => updateFilters({ category: isSelected ? null : category })}
                aria-pressed={isSelected}
                className={`mx-2 my-1.5 flex min-h-[52px] w-[calc(100%-1rem)] items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-extrabold transition-colors focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/30 focus-visible:outline-none ${
                  isSelected
                    ? 'bg-[#4b63e9] text-white ring-1 ring-[#cfe0ff] ring-inset'
                    : 'text-[var(--color-on-surface-variant)] hover:bg-[#f8fbff] hover:text-[var(--foreground)]'
                }`}
              >
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-md text-white ring-1 transition-all ring-inset ${
                    isSelected ? 'scale-110 bg-[#0053db] ring-[#0053db]' : 'bg-white ring-[#cfd9ea]'
                  }`}
                >
                  {isSelected && <Check className="size-3.5" strokeWidth={3.5} />}
                </span>
                <span className="min-w-0 flex-1">{category}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <h3 className="my-4 font-[family-name:var(--font-headline)] text-[11px] font-extrabold tracking-wider text-[var(--color-on-surface-variant)] uppercase">
          Availability
        </h3>
        <label className="flex cursor-pointer items-center gap-3 rounded-[18px] bg-white p-4 text-sm font-semibold text-[var(--color-on-surface-variant)] shadow-sm ring-1 ring-[var(--color-surface-container-high)] transition-colors ring-inset hover:text-[var(--foreground)]">
          <input
            type="checkbox"
            checked={filters.availableThisWeek}
            onChange={(event) => updateFilters({ availableThisWeek: event.target.checked })}
            className="size-4 rounded-[4px] border-0 bg-white text-[#0053db] shadow-sm ring-1 ring-[var(--color-surface-container-high)] transition-colors ring-inset focus:ring-2 focus:ring-[var(--brand-blue)]/30"
          />
          <span>This Week</span>
        </label>
      </section>
    </aside>
  )
}
