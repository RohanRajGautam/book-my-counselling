'use client'

import { useMemo, useState } from 'react'
import { X } from 'lucide-react'

import { StudyAbroadConsultantModal } from '@/features/study-abroad/components/StudyAbroadConsultantModal'
import { StudyAbroadGrid } from '@/features/study-abroad/components/StudyAbroadGrid'
import { StudyAbroadHeader } from '@/features/study-abroad/components/StudyAbroadHeader'
import { StudyAbroadSidebar } from '@/features/study-abroad/components/StudyAbroadSidebar'
import { STUDY_ABROAD_CONSULTANTS } from '@/features/study-abroad/lib/study-abroad.constants'
import type {
  StudyAbroadConsultant,
  StudyAbroadCountry,
  StudyAbroadSort,
} from '@/features/study-abroad/types/study-abroad.types'

function getLowestPackagePrice(consultant: StudyAbroadConsultant) {
  return Math.min(...consultant.packages.map((item) => item.price))
}

function getSearchText(consultant: StudyAbroadConsultant) {
  const profileText =
    consultant.profileType === 'student'
      ? `${consultant.universityName} ${consultant.program}`
      : `${consultant.position} ${consultant.companyName} ${consultant.universityName} ${consultant.program}`

  return [
    consultant.name,
    consultant.country,
    consultant.city,
    profileText,
    consultant.services.join(' '),
  ]
    .join(' ')
    .toLowerCase()
}

function sortConsultants(consultants: StudyAbroadConsultant[], sortBy: StudyAbroadSort) {
  return [...consultants].sort((first, second) => {
    if (sortBy === 'rating') {
      return second.rating - first.rating
    }

    if (sortBy === 'price-low') {
      return getLowestPackagePrice(first) - getLowestPackagePrice(second)
    }

    if (sortBy === 'price-high') {
      return getLowestPackagePrice(second) - getLowestPackagePrice(first)
    }

    if (sortBy === 'newest') {
      return second.id.localeCompare(first.id)
    }

    return second.totalSessions - first.totalSessions
  })
}

export function StudyAbroadPageContent() {
  const [selectedCountries, setSelectedCountries] = useState<StudyAbroadCountry[]>([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<StudyAbroadSort>('recommended')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [selectedConsultant, setSelectedConsultant] = useState<StudyAbroadConsultant | null>(null)

  const consultants = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    const filteredConsultants = STUDY_ABROAD_CONSULTANTS.filter((consultant) => {
      const matchesCountry =
        selectedCountries.length === 0 || selectedCountries.includes(consultant.country)
      const matchesSearch =
        normalizedSearch.length === 0 || getSearchText(consultant).includes(normalizedSearch)

      return matchesCountry && matchesSearch
    })

    return sortConsultants(filteredConsultants, sortBy)
  }, [search, selectedCountries, sortBy])

  const toggleCountry = (country: StudyAbroadCountry) => {
    setSelectedCountries((currentCountries) =>
      currentCountries.includes(country)
        ? currentCountries.filter((item) => item !== country)
        : [...currentCountries, country]
    )
  }

  return (
    <div
      id="study-abroad-discovery"
      className="mx-auto grid min-h-screen max-w-[1350px] grid-cols-1 bg-[#f8f9ff] lg:grid-cols-[280px_minmax(0,1fr)]"
    >
      <div className="hidden lg:block">
        <StudyAbroadSidebar
          selectedCountries={selectedCountries}
          onCountryToggle={toggleCountry}
          onClear={() => setSelectedCountries([])}
        />
      </div>

      <div>
        <StudyAbroadHeader />
        <StudyAbroadGrid
          consultants={consultants}
          search={search}
          sortBy={sortBy}
          onSearchChange={setSearch}
          onSortChange={setSortBy}
          onOpenMobileFilters={() => setShowMobileFilters(true)}
          onBookConsultant={setSelectedConsultant}
        />
      </div>

      <StudyAbroadConsultantModal
        consultant={selectedConsultant}
        onClose={() => setSelectedConsultant(null)}
      />

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
            <StudyAbroadSidebar
              selectedCountries={selectedCountries}
              onCountryToggle={toggleCountry}
              onClear={() => setSelectedCountries([])}
            />
          </div>
        </div>
      )}
    </div>
  )
}
