'use client'

import { useFilters } from '@/features/filters/context/filter-context'
import { MentorSearchBar } from '@/features/mentors/components/MentorSearchBar'

export function ExploreMentorsSearch() {
  const { filters, updateFilter } = useFilters()

  const handleSearchSubmit = () => {
    const resultsSection = document.getElementById('mentor-discovery')
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="mx-auto px-8 py-16 text-center">
      {/* Search Bar */}
      <MentorSearchBar
        value={filters.jobTitle ?? ''}
        onChange={(value) => updateFilter('jobTitle', value)}
        onSubmit={handleSearchSubmit}
      />
    </section>
  )
}
