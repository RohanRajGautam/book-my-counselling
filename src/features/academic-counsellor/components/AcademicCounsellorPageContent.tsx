'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

import { SearchCrossLinkBanner } from '@/features/search/components/SearchCrossLinkBanner'
import type { CrossLinkInfo } from '@/features/search/lib/parse-cross-link'
import { AcademicFiltersProvider } from '../context/AcademicFiltersContext'
import type { AcademicFilters } from '../types/filters.types'

import { AcademicCounsellorFiltersSidebar } from './AcademicCounsellorFiltersSidebar'
import { AcademicCounsellorListingHeader } from './AcademicCounsellorListingHeader'
import { AcademicCounsellorResults } from './AcademicCounsellorResults'
import { AcademicCounsellorSearchControls } from './AcademicCounsellorSearchControls'

interface AcademicCounsellorPageContentProps {
  initialFilters?: Partial<AcademicFilters>
  initialPage?: number
  crossLink?: CrossLinkInfo
}

export function AcademicCounsellorPageContent({
  initialFilters,
  initialPage = 1,
  crossLink,
}: AcademicCounsellorPageContentProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const showCffBanner = crossLink?.category === 'cff'
  const currentQuery = initialFilters?.jobTitle ?? ''

  return (
    <AcademicFiltersProvider initialFilters={initialFilters} initialPage={initialPage}>
      <div
        id="mentor-discovery"
        className="mx-auto grid min-h-screen max-w-[1350px] grid-cols-1 bg-[#eff4ff] lg:grid-cols-[280px_minmax(0,1fr)]"
      >
        <div className="hidden lg:block">
          <AcademicCounsellorFiltersSidebar />
        </div>

        <div className="min-h-screen bg-[#f8f9ff]">
          <AcademicCounsellorListingHeader />

          <section id="mentor-results" className="bg-[#f8f9ff] px-6 sm:px-8">
            {showCffBanner && crossLink && (
              <div className="pt-4 pb-1 sm:pt-0">
                <SearchCrossLinkBanner
                  targetCategory="cff"
                  count={crossLink.count}
                  query={currentQuery}
                  cffVariety={crossLink.variety}
                />
              </div>
            )}

            <AcademicCounsellorSearchControls
              onOpenMobileFilters={() => setShowMobileFilters(true)}
            />

            <AcademicCounsellorResults />
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
              <AcademicCounsellorFiltersSidebar />
            </div>
          </div>
        )}
      </div>
    </AcademicFiltersProvider>
  )
}
