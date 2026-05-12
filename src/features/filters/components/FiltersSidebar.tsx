'use client'

import { useMemo, useState } from 'react'
import { Check, ListFilter, Search } from 'lucide-react'

import { useIndustries } from '@/features/industries/hooks/useIndustries'
import { useFilters } from '@/features/filters/context/FilterContext'

export function FiltersSidebar() {
  const { filters, updateFilter } = useFilters()
  const { data: industries = [] } = useIndustries()
  const [industrySearch, setIndustrySearch] = useState('')

  const visibleIndustries = useMemo(() => {
    const query = industrySearch.trim().toLowerCase()

    if (!query) return industries

    return industries.filter((industry) => industry.name.toLowerCase().includes(query))
  }, [industries, industrySearch])

  const toggleIndustry = (industryName: string) => {
    const nextIndustries = filters.industries.includes(industryName)
      ? filters.industries.filter((industry) => industry !== industryName)
      : [...filters.industries, industryName]

    updateFilter('industries', nextIndustries)
  }

  return (
    <aside className="h-full border-r border-gray-200 px-4 py-8 lg:sticky lg:top-[73px] lg:min-h-[calc(100vh-73px)]">
      {/* <div className="mt-5 mb-7 rounded-[18px] bg-white p-4 ring-1 ring-[#dfe7f5] ring-inset">
        <h2 className="flex items-center gap-3 font-[family-name:var(--font-headline)] text-lg font-extrabold text-[#121c2a]">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#e6eeff]">
            <ListFilter className="size-5 text-[#004ac6]" strokeWidth={3} />
          </span>
          Filters
        </h2>
      </div> */}

      <div className="space-y-7">
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-[11px] font-extrabold tracking-wider text-[#434655] uppercase">
              Field / Industry
            </h3>
            {filters.industries.length > 0 && (
              <button
                type="button"
                onClick={() => updateFilter('industries', [])}
                className="text-[11px] font-extrabold text-[#0053db] transition hover:text-[#003fa8]"
              >
                Clear
              </button>
            )}
          </div>
          <div className="mb-3 flex h-11 items-center rounded-xl bg-white px-3 shadow-sm ring-1 ring-[#dfe7f5] ring-inset">
            <Search className="mr-2 size-4 shrink-0 text-[#0053db]" />
            <input
              type="search"
              value={industrySearch}
              onChange={(event) => setIndustrySearch(event.target.value)}
              placeholder="Search industries"
              className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#121c2a] outline-none placeholder:text-[#9aa3b2]"
            />
          </div>
          <div className="custom-scrollbar max-h-[280px] space-y-2 overflow-y-auto pr-2">
            {visibleIndustries.map((industry) => {
              const isSelected = filters.industries.includes(industry.name)

              return (
                <button
                  key={industry.id}
                  type="button"
                  onClick={() => toggleIndustry(industry.name)}
                  aria-pressed={isSelected}
                  className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-bold shadow-sm ring-1 transition ring-inset ${
                    isSelected
                      ? 'bg-[#0053db] text-white shadow-[0_8px_18px_rgba(0,83,219,0.18)] ring-[#0053db]'
                      : 'bg-white text-[#121c2a] ring-[#e2e8f0] hover:bg-[#f8f9ff]'
                  }`}
                >
                  <span className="min-w-0 flex-1">{industry.name}</span>
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
                      isSelected ? 'bg-white/20' : 'bg-[#eff4ff]'
                    }`}
                  >
                    {isSelected && <Check className="size-3.5 text-white" strokeWidth={4} />}
                  </span>
                </button>
              )
            })}
            {industries.length === 0 && (
              <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#737686] shadow-sm ring-1 ring-[#dfe7f5] ring-inset">
                No industries available.
              </div>
            )}
            {industries.length > 0 && visibleIndustries.length === 0 && (
              <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#737686] shadow-sm ring-1 ring-[#dfe7f5] ring-inset">
                No matching industries.
              </div>
            )}
          </div>
          {filters.industries.length > 0 && (
            <p className="mt-3 text-xs font-bold text-[#737686]">
              {filters.industries.length} selected
            </p>
          )}
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
          <div className="rounded-[18px] bg-white p-4 shadow-sm ring-1 ring-[#dfe7f5] ring-inset">
            <input
              type="range"
              min="20"
              max="10000"
              step="100"
              value={filters.priceRange}
              onChange={(event) => updateFilter('priceRange', Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#d9e3f6] accent-[#0053db]"
            />
            <div className="mt-3 flex items-center justify-between text-sm font-semibold text-[#434655]">
              <span>NPR 20</span>
              <span className="font-extrabold text-[#121c2a]">
                NPR {filters.priceRange?.toLocaleString()}
              </span>
            </div>
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
            <label className="flex cursor-pointer items-center gap-3 rounded-[18px] bg-white p-4 text-sm font-semibold text-[#434655] shadow-sm ring-1 ring-[#dfe7f5] ring-inset">
              <input
                type="checkbox"
                checked={Boolean(filters.availableThisWeek)}
                onChange={(event) => updateFilter('availableThisWeek', event.target.checked)}
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
