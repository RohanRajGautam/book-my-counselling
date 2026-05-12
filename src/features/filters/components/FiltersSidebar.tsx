'use client'

import { ChevronDown, ListFilter } from 'lucide-react'

import { useIndustries } from '@/features/industries/hooks/useIndustries'
import { useFilters } from '@/features/filters/context/FilterContext'

const experienceLevels = ['0-2 Years', '3-5 Years', '5-10 Years', '10+ Years']

export function FiltersSidebar() {
  const { filters, updateFilter } = useFilters()
  const { data: industries = [] } = useIndustries()

  return (
    <aside className="h-full bg-[#eff4ff] px-6 py-10 lg:sticky lg:top-[73px] lg:min-h-[calc(100vh-73px)]">
      <h2 className="mb-8 flex items-center gap-3 font-[family-name:var(--font-headline)] text-lg font-extrabold text-[#121c2a]">
        <ListFilter className="size-5 text-[#004ac6]" strokeWidth={3} />
        Advanced Filters
      </h2>

      <div className="space-y-9">
        <section>
          <h3 className="mb-4 text-[11px] font-extrabold tracking-wider text-[#434655] uppercase">
            Field / Industry
          </h3>
          <div className="relative">
            <select
              value={filters.industries[0] ?? ''}
              onChange={(event) =>
                updateFilter('industries', event.target.value ? [event.target.value] : [])
              }
              className="h-11 w-full appearance-none rounded-lg border-0 bg-white px-4 pr-10 text-sm font-bold text-[#121c2a] shadow-sm ring-1 ring-[#e2e8f0] transition outline-none ring-inset focus:ring-2 focus:ring-[#0053db]/30"
            >
              <option value="">All Industry</option>
              {industries.map((industry) => (
                <option key={industry.id} value={industry.name}>
                  {industry.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#0053db]" />
          </div>
        </section>

        {/* <section>
          <h3 className="mb-4 text-[11px] font-extrabold tracking-wider text-[#434655] uppercase">
            Experience Level
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {experienceLevels.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => updateFilter('experienceLevel', level)}
                className={`h-9 rounded-lg text-xs font-extrabold transition ${
                  filters.experienceLevel === level
                    ? 'bg-[#0053db] text-white shadow-[0_8px_18px_rgba(0,83,219,0.22)]'
                    : 'bg-white text-[#0053db]'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </section> */}

        <section>
          <h3 className="mb-4 text-[11px] font-extrabold tracking-wider text-[#434655] uppercase">
            Hourly Rate
          </h3>
          <input
            type="range"
            min="20"
            max="10000"
            step="100"
            value={filters.priceRange}
            onChange={(event) => updateFilter('priceRange', Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#d9e3f6] accent-[#0053db]"
          />
          <div className="mt-2 flex items-center justify-between text-sm font-semibold text-[#434655]">
            <span>NPR 20</span>
            <span>NPR {filters.priceRange?.toLocaleString()}</span>
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-[11px] font-extrabold tracking-wider text-[#434655] uppercase">
            Availability
          </h3>
          <div className="space-y-4">
            {/* <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#434655]">
              <input
                type="radio"
                name="availability"
                checked={Boolean(filters.availableToday)}
                onChange={() => {
                  updateFilter('availableToday', true)
                  updateFilter('availableThisWeek', false)
                }}
                className="size-4 border-0 bg-white text-[#0053db] shadow-sm ring-1 ring-[#e2e8f0] ring-inset focus:ring-2 focus:ring-[#0053db]/20"
              />
              <span>Available Today</span>
            </label> */}
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#434655]">
              <input
                type="radio"
                name="availability"
                checked={Boolean(filters.availableThisWeek)}
                onChange={() => {
                  updateFilter('availableToday', false)
                  updateFilter('availableThisWeek', true)
                }}
                className="size-4 border-0 bg-white text-[#0053db] shadow-sm ring-1 ring-[#e2e8f0] ring-inset focus:ring-2 focus:ring-[#0053db]/20"
              />
              <span>This Week</span>
            </label>
          </div>
        </section>
      </div>
    </aside>
  )
}
