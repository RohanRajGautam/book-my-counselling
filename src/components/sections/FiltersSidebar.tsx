'use client'

import { SlidersHorizontal, ChevronDown } from 'lucide-react'
import { useFilters } from '@/contexts/FilterContext'
import { useIndustries } from '@/hooks/queries/mentors/useIndustries'

export function FiltersSidebar() {
  const { filters, updateFilter, clearFilters } = useFilters()
  const { data: industries = [] } = useIndustries()

  return (
    <aside className="space-y-10">
      <div className="sticky top-32 rounded-2xl bg-[#eff4ff] p-8">
        <h3 className="mb-8 flex items-center gap-2 text-xl font-bold">
          <SlidersHorizontal className="h-6 w-6 text-[#004ac6]" />
          Filters
        </h3>

        <div className="mb-8">
          <label className="mb-3 block text-sm font-bold tracking-wider text-[#434655] uppercase">
            Industry
          </label>
          <div className="relative">
            <select
              value={filters.industry}
              onChange={(e) => updateFilter('industry', e.target.value)}
              className="w-full appearance-none rounded-xl border-none bg-white px-4 py-3 text-[#121c2a] shadow-sm focus:ring-2 focus:ring-[#004ac6]/10"
            >
              <option>All Industries</option>
              {industries.map((industry) => (
                <option key={industry.id} value={industry.name}>
                  {industry.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-3 right-3 h-6 w-6 text-[#737686]" />
          </div>
        </div>

        <div className="mb-8">
          <label className="mb-3 block text-sm font-bold tracking-wider text-[#434655] uppercase">
            Job Title
          </label>
          <input
            type="text"
            placeholder="e.g. UX Designer"
            value={filters.jobTitle}
            onChange={(e) => updateFilter('jobTitle', e.target.value)}
            className="w-full rounded-xl border-none bg-white px-4 py-3 text-[#121c2a] shadow-sm focus:ring-2 focus:ring-[#004ac6]/10"
          />
        </div>

        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-bold tracking-wider text-[#434655] uppercase">
              Price Range
            </label>
            <span className="font-bold text-[#004ac6]">$20 - ${filters.priceRange}</span>
          </div>
          <input
            type="range"
            min="20"
            max="250"
            value={filters.priceRange}
            onChange={(e) => updateFilter('priceRange', Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#d9e3f6] accent-[#004ac6]"
          />
        </div>

        <div className="mb-8">
          <label className="mb-4 block text-sm font-bold tracking-wider text-[#434655] uppercase">
            Availability
          </label>
          <div className="space-y-4">
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={filters.availableThisWeek}
                onChange={(e) => updateFilter('availableThisWeek', e.target.checked)}
                className="h-5 w-5 rounded border-[#c3c6d7] text-[#004ac6] focus:ring-[#004ac6]/20"
              />
              <span className="text-[#434655] transition-colors group-hover:text-[#121c2a]">
                Available this week
              </span>
            </label>
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={filters.instantBooking}
                onChange={(e) => updateFilter('instantBooking', e.target.checked)}
                className="h-5 w-5 rounded border-[#c3c6d7] text-[#004ac6] focus:ring-[#004ac6]/20"
              />
              <span className="text-[#434655] transition-colors group-hover:text-[#121c2a]">
                Instant Booking
              </span>
            </label>
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={filters.eveningsWeekends}
                onChange={(e) => updateFilter('eveningsWeekends', e.target.checked)}
                className="h-5 w-5 rounded border-[#c3c6d7] text-[#004ac6] focus:ring-[#004ac6]/20"
              />
              <span className="text-[#434655] transition-colors group-hover:text-[#121c2a]">
                Evenings & Weekends
              </span>
            </label>
          </div>
        </div>

        <button
          onClick={clearFilters}
          className="w-full rounded-xl py-3 font-bold text-[#004ac6] transition-colors hover:bg-[#004ac6]/5"
        >
          Clear All Filters
        </button>
      </div>
    </aside>
  )
}
