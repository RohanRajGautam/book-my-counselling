'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

import { FiltersSidebar } from '@/features/filters/components/FiltersSidebar'
import { MentorGrid } from '@/features/mentors/components/MentorGrid'

export function MentorDiscovery() {
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  return (
    <div
      id="mentor-discovery"
      className="m-auto grid min-h-screen max-w-[1380] grid-cols-1 bg-[#f8f9ff] lg:grid-cols-[250px_minmax(0,1fr)]"
    >
      <div className="hidden lg:block">
        <FiltersSidebar />
      </div>

      <div>
        <div className="px-6 pt-5 lg:hidden">
          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-4 text-sm font-extrabold text-[#0053db] shadow-[0_10px_24px_rgba(18,28,42,0.06)]"
          >
            <SlidersHorizontal className="size-4" />
            Filters
          </button>
        </div>

        <MentorGrid />
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#27313f]/40 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
            aria-label="Close filters"
          />
          <div className="absolute inset-y-0 left-0 w-[min(20rem,calc(100vw-2rem))] overflow-y-auto bg-[#eff4ff] shadow-[18px_0_42px_rgba(18,28,42,0.18)]">
            <div className="flex items-center justify-end px-5 pt-4">
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="flex size-10 items-center justify-center rounded-full bg-white text-[#434655]"
                aria-label="Close filters"
              >
                <X className="size-5" />
              </button>
            </div>
            <FiltersSidebar />
          </div>
        </div>
      )}
    </div>
  )
}
