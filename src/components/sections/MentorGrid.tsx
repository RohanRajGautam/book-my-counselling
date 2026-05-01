'use client'

import { useState, useMemo } from 'react'
import { MentorCard } from '@/components/cards/MentorCard'
import { MentorProfileModal } from '@/components/modals/MentorProfileModal'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useFilters } from '@/contexts/FilterContext'
import { mentorsDatabase, MentorData } from '@/lib/mockData'

const MENTORS_PER_PAGE = 6

export function MentorGrid() {
  const [selectedMentor, setSelectedMentor] = useState<MentorData | null>(null)
  const { filters, updateFilter, currentPage, setCurrentPage } = useFilters()

  // Filter and sort mentors
  const filteredMentors = useMemo(() => {
    let result = mentorsDatabase.filter((mentor) => {
      // Industry filter
      if (filters.industry !== 'All Industries' && mentor.industry !== filters.industry) {
        return false
      }

      // Job title filter
      if (filters.jobTitle && !mentor.role.toLowerCase().includes(filters.jobTitle.toLowerCase())) {
        return false
      }

      // Price range filter
      if (mentor.price > filters.priceRange) {
        return false
      }

      // Availability filters
      if (filters.availableThisWeek && !mentor.availableThisWeek) {
        return false
      }

      if (filters.instantBooking && !mentor.instantBooking) {
        return false
      }

      if (filters.eveningsWeekends && !mentor.eveningsWeekends) {
        return false
      }

      return true
    })

    // Sort mentors
    switch (filters.sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'reviews':
        result.sort((a, b) => b.reviews - a.reviews)
        break
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
    }

    return result
  }, [filters])

  // Pagination
  const totalPages = Math.ceil(filteredMentors.length / MENTORS_PER_PAGE)
  const startIndex = (currentPage - 1) * MENTORS_PER_PAGE
  const endIndex = startIndex + MENTORS_PER_PAGE
  const currentMentors = filteredMentors.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('...')
      }
      
      // Show pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...')
      }
      
      // Always show last page
      pages.push(totalPages)
    }
    
    return pages
  }

  return (
    <>
      <section>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {filteredMentors.length} Mentor{filteredMentors.length !== 1 ? 's' : ''} available
          </h2>
          <div className="flex items-center gap-2 text-[#434655]">
            <span>Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as any)}
              className="cursor-pointer border-none bg-transparent py-0 font-bold text-[#121c2a] focus:ring-0"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {currentMentors.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {currentMentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                name={mentor.name}
                role={mentor.role}
                company={mentor.company}
                tags={mentor.tags}
                rating={mentor.rating}
                reviews={mentor.reviews}
                description={mentor.description}
                price={mentor.price}
                imageUrl={mentor.imageUrl}
                onClick={() => setSelectedMentor(mentor)}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl bg-[#eff4ff] p-12">
            <div className="text-center">
              <p className="mb-2 text-xl font-bold text-[#121c2a]">No mentors found</p>
              <p className="text-[#434655]">Try adjusting your filters to see more results</p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c3c6d7] text-[#434655] transition-colors hover:bg-[#e6eeff] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...'}
                className={`flex h-12 w-12 items-center justify-center rounded-full font-bold transition-colors ${
                  page === currentPage
                    ? 'bg-[#004ac6] text-white shadow-md'
                    : page === '...'
                      ? 'cursor-default text-[#434655]'
                      : 'text-[#434655] hover:bg-[#e6eeff]'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c3c6d7] text-[#434655] transition-colors hover:bg-[#e6eeff] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}
      </section>

      {/* Mentor Profile Modal */}
      {selectedMentor && (
        <MentorProfileModal
          isOpen={!!selectedMentor}
          onClose={() => setSelectedMentor(null)}
          mentor={{
            name: selectedMentor.name,
            title: selectedMentor.title,
            imageUrl: selectedMentor.imageUrl,
            verified: true,
            about: selectedMentor.about,
            services: selectedMentor.services,
            availability: selectedMentor.availability,
            reviews: selectedMentor.reviewsDetail,
            responseTime: selectedMentor.responseTime,
            linkedIn: selectedMentor.linkedIn,
            portfolio: selectedMentor.portfolio,
          }}
        />
      )}
    </>
  )
}
