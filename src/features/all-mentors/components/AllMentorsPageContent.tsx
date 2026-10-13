'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

import { AllMentorsFiltersProvider } from '../context/AllMentorsFiltersContext'
import type { AllMentorsFilters } from '../types/filters.types'

import { AllMentorsFiltersSidebar } from './AllMentorsFiltersSidebar'
import { AllMentorsListingHeader } from './AllMentorsListingHeader'
import { AllMentorsResults } from './AllMentorsResults'
import { AllMentorsSearchControls } from './AllMentorsSearchControls'

interface AllMentorsPageContentProps {
  initialFilters?: Partial<AllMentorsFilters>
  initialPage?: number
}

export function AllMentorsPageContent({ initialFilters, initialPage = 1 }: AllMentorsPageContentProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  return (
    <AllMentorsFiltersProvider initialFilters={initialFilters} initialPage={initialPage}>
      <div
        id="all-mentors"
        className="mx-auto grid min-h-screen max-w-[1350px] grid-cols-1 bg-[#eef2fb] lg:grid-cols-[280px_minmax(0,1fr)]"
      >
        <div className="hidden lg:block">
          <AllMentorsFiltersSidebar />
        </div>

        <div className="min-h-screen bg-[#f8f9ff]">
          <AllMentorsListingHeader />

          <section id="all-mentors-results" className="bg-[#f8f9ff] px-6 sm:px-8">
            <AllMentorsSearchControls onOpenMobileFilters={() => setShowMobileFilters(true)} />

            <AllMentorsResults />
          </section>
        </div>

        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-[var(--color-inverse-surface)]/40 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
              aria-label="Close filters"
            />
            <div className="absolute inset-y-0 left-0 w-[min(20rem,calc(100vw-2rem))] overflow-y-auto bg-[var(--brand-blue-surface)] shadow-[18px_0_42px_rgba(18,28,42,0.18)]">
              <div className="flex items-center justify-end px-5 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="flex size-10 items-center justify-center rounded-full bg-white text-[var(--color-on-surface-variant)] transition hover:text-[var(--brand-blue)]"
                  aria-label="Close filters"
                >
                  <X className="size-5" />
                </button>
              </div>
              <AllMentorsFiltersSidebar />
            </div>
          </div>
        )}
      </div>
    </AllMentorsFiltersProvider>
  )
}
