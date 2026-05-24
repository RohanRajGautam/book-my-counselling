'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { type FilterState } from '../types/filter.types'

interface FilterContextType {
  filters: FilterState
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  updateFilters: (nextFilters: Partial<FilterState>) => void
  clearFilters: () => void
  currentPage: number
  setCurrentPage: (page: number) => void
}

const defaultFilters: FilterState = {
  industries: [],
  academicCategory: [],
  academicSubcategory: [],
  academicSubcategoryParents: {},
  professionalCategory: [],
  professionalSubcategory: [],
  professionalSubcategoryParents: {},
  jobTitle: '',
  priceRange: 10000,
  availableToday: false,
  availableThisWeek: false,
  instantBooking: false,
  eveningsWeekends: false,
  experienceLevel: '3-5 Years',
  counselingType: 'academic',
  sortBy: 'rating',
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({
  children,
  initialFilters,
}: {
  children: ReactNode
  initialFilters?: Partial<FilterState>
}) {
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...defaultFilters,
    ...initialFilters,
  }))
  const [currentPage, setCurrentPage] = useState(1)

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const updateFilters = (nextFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...nextFilters }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters(defaultFilters)
    setCurrentPage(1)
  }

  return (
    <FilterContext.Provider
      value={{
        filters,
        updateFilter,
        updateFilters,
        clearFilters,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider')
  }
  return context
}
