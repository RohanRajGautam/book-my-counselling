'use client'

import { SlidersHorizontal, ChevronDown } from 'lucide-react'

export function FiltersSidebar() {
  return (
    <aside className="space-y-10">
      <div className="sticky top-32 rounded-2xl bg-[#eff4ff] p-8">
        <h3 className="mb-8 flex items-center gap-2 text-xl font-bold">
          <SlidersHorizontal className="h-6 w-6 text-[#004ac6]" />
          Filters
        </h3>

        {/* Industry Dropdown */}
        <div className="mb-8">
          <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-[#434655]">
            Industry
          </label>
          <div className="relative">
            <select className="w-full appearance-none rounded-xl border-none bg-white px-4 py-3 text-[#121c2a] shadow-sm focus:ring-2 focus:ring-[#004ac6]/10">
              <option>All Industries</option>
              <option>Technology</option>
              <option>Creative Arts</option>
              <option>Business & Finance</option>
              <option>Healthcare</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-6 w-6 text-[#737686]" />
          </div>
        </div>

        {/* Job Title Input */}
        <div className="mb-8">
          <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-[#434655]">
            Job Title
          </label>
          <input
            type="text"
            placeholder="e.g. UX Designer"
            className="w-full rounded-xl border-none bg-white px-4 py-3 text-[#121c2a] shadow-sm focus:ring-2 focus:ring-[#004ac6]/10"
          />
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-bold uppercase tracking-wider text-[#434655]">
              Price Range
            </label>
            <span className="font-bold text-[#004ac6]">$20 - $250</span>
          </div>
          <input
            type="range"
            min="20"
            max="250"
            defaultValue="250"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#d9e3f6] accent-[#004ac6]"
          />
        </div>

        {/* Availability */}
        <div className="mb-8">
          <label className="mb-4 block text-sm font-bold uppercase tracking-wider text-[#434655]">
            Availability
          </label>
          <div className="space-y-4">
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-[#c3c6d7] text-[#004ac6] focus:ring-[#004ac6]/20"
              />
              <span className="text-[#434655] transition-colors group-hover:text-[#121c2a]">
                Available this week
              </span>
            </label>
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-[#c3c6d7] text-[#004ac6] focus:ring-[#004ac6]/20"
              />
              <span className="text-[#434655] transition-colors group-hover:text-[#121c2a]">
                Instant Booking
              </span>
            </label>
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-[#c3c6d7] text-[#004ac6] focus:ring-[#004ac6]/20"
              />
              <span className="text-[#434655] transition-colors group-hover:text-[#121c2a]">
                Evenings & Weekends
              </span>
            </label>
          </div>
        </div>

        <button className="w-full rounded-xl py-3 font-bold text-[#004ac6] transition-colors hover:bg-[#004ac6]/5">
          Clear All Filters
        </button>
      </div>
    </aside>
  )
}
