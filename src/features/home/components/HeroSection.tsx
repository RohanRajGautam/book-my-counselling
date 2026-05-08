'use client'

import { useFilters } from '@/features/filters/context/filter-context'
import { MentorSearchBar } from '@/features/mentors/components/MentorSearchBar'

export function HeroSection() {
  const { filters, updateFilter } = useFilters()

  const handleSearchSubmit = () => {
    const resultsSection = document.getElementById('mentor-discovery')
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-8 py-16 text-center">
      <h1 className="mb-6 font-[family-name:var(--font-headline)] text-5xl font-extrabold tracking-tight text-[#121c2a]">
        Your Career Journey, <span className="text-[#004ac6]">Curated.</span>
      </h1>
      <p className="mx-auto mb-12 max-w-2xl text-lg text-[#434655]">
        Connect with world-class mentors from industry giants and top universities to navigate your
        professional growth with precision.
      </p>

      {/* Search Bar */}
      <MentorSearchBar
        value={filters.jobTitle ?? ''}
        onChange={(value) => updateFilter('jobTitle', value)}
        onSubmit={handleSearchSubmit}
      />
    </section>
  )
}
