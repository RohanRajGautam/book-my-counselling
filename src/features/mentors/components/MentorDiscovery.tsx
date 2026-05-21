'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

import { ExploreMentorsHeader } from '@/features/explore-mentors/components/ExploreMentorsHeader'
import { FiltersSidebar } from '@/features/filters/components/FiltersSidebar'
import { MentorGrid } from '@/features/mentors/components/MentorGrid'

export function MentorDiscovery() {
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  return (
    <div
      id="mentor-discovery"
      className="mx-auto grid min-h-screen max-w-[1350px] grid-cols-1 bg-[#f8f9ff] lg:grid-cols-[280px_minmax(0,1fr)]"
    >
      <div className="hidden lg:block">
        <FiltersSidebar />
      </div>

      <div>
        <ExploreMentorsHeader />

        <MentorGrid onOpenMobileFilters={() => setShowMobileFilters(true)} />
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
