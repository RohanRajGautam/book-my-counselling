'use client'

import { useRef, useState } from 'react'
import { useFilters } from '@/features/filters/context/FilterContext'
import { MentorSearchBar } from '@/features/mentors/components/MentorSearchBar'

const SEARCH_DEBOUNCE_MS = 300

export function ExploreMentorsSearch() {
  const { filters, updateFilter } = useFilters()
  const [searchValue, setSearchValue] = useState(filters.jobTitle ?? '')
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearchSubmit = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    updateFilter('jobTitle', searchValue)

    const resultsSection = document.getElementById('mentor-discovery')
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="mx-auto px-8 py-16 text-center">
      <MentorSearchBar
        value={searchValue}
        onChange={(value) => {
          setSearchValue(value)
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
          }
          debounceTimerRef.current = setTimeout(() => {
            updateFilter('jobTitle', value)
          }, SEARCH_DEBOUNCE_MS)
        }}
        onSubmit={handleSearchSubmit}
      />
    </section>
  )
}
