'use client'

import { Check, GraduationCap } from 'lucide-react'

import { COACH_FOR_FRESHERS_CATEGORIES } from '../types/coach-for-freshers.types'
import { useCoachForFreshersFilters } from '../context/CoachForFreshersFiltersContext'

export function CoachForFreshersFiltersSidebar() {
  const { filters, updateFilters } = useCoachForFreshersFilters()

  return (
    <aside className="h-full border-r border-gray-200 px-4 py-8 lg:sticky lg:top-[73px] lg:min-h-[calc(100vh-73px)]">
      <section className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b border-[#eef2f7] px-5 py-4">
          <div className="flex min-w-0 items-center gap-2">
            <GraduationCap className="shrink-0 text-blue-700" />
            <h3 className="text-sm leading-tight font-extrabold text-[#111827]">
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
                className={`mx-2 my-1.5 flex min-h-[52px] w-[calc(100%-1rem)] items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-extrabold transition ${
                  isSelected
                    ? 'bg-[#4b63e9] text-white ring-1 ring-[#cfe0ff] ring-inset'
                    : 'text-[#4b5563] hover:bg-[#f8fbff] hover:text-[#111827]'
                }`}
              >
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-md ring-1 ring-inset ${
                    isSelected ? 'bg-[#0053db] text-white ring-[#0053db]' : 'bg-white ring-[#cfd9ea]'
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
        <h3 className="my-4 text-[11px] font-extrabold tracking-wider text-[#434655] uppercase">
          Availability
        </h3>
        <label className="flex cursor-pointer items-center gap-3 rounded-[18px] bg-white p-4 text-sm font-semibold text-[#434655] shadow-sm ring-1 ring-[#dfe7f5] ring-inset">
          <input
            type="checkbox"
            checked={filters.availableThisWeek}
            onChange={(event) => updateFilters({ availableThisWeek: event.target.checked })}
            className="size-4 border-0 bg-white text-[#0053db] shadow-sm ring-1 ring-[#e2e8f0] ring-inset focus:ring-2 focus:ring-[#0053db]/20"
          />
          <span>This Week</span>
        </label>
      </section>
    </aside>
  )
}
