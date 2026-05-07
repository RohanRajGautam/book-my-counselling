'use client'

import { FilterState } from '@/types/filter.types'
import { createContext, useContext, useState, ReactNode } from 'react'

interface FilterContextType {
  filters: FilterState
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  clearFilters: () => void
  currentPage: number
  setCurrentPage: (page: number) => void
}

const defaultFilters: FilterState = {
  industry: 'All Industries',
  jobTitle: '',
  priceRange: 250,
  availableThisWeek: false,
  instantBooking: false,
  eveningsWeekends: false,
  sortBy: 'rating',
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filters change
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
