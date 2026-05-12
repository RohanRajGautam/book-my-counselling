'use client'

import { useFilters } from '@/features/filters/context/FilterContext'
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
    <section className="mx-auto max-w-[1380px] px-8 py-16 text-center">
      <h1 className="mb-6font-[family-name:var(--font-headline)] text-4xl leading-[0.98] font-extrabold tracking-tight text-[#121c2a] sm:text-6xl md:text-[62px]">
        Your Career Journey, <span className="text-[#004ac6]">Curated.</span>
      </h1>
      <p className="mx-auto mt-6 mb-12 max-w-2xl text-lg text-[#434655]">
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
