'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { buildExploreMentorsSearchParams } from '@/features/filters/lib/filter-url-state'
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

type LocalFilterState = {
  urlStateKey: string
  filters: FilterState
  page: number
}

function createFilterState(initialFilters?: Partial<FilterState>): FilterState {
  return {
    ...defaultFilters,
    ...initialFilters,
  }
}

function getExploreMentorsStateKey(filters: FilterState, page: number) {
  return buildExploreMentorsSearchParams(filters, page).toString()
}

export function FilterProvider({
  children,
  initialFilters,
  initialPage = 1,
  syncUrl = false,
}: {
  children: ReactNode
  initialFilters?: Partial<FilterState>
  initialPage?: number
  syncUrl?: boolean
}) {
  const router = useRouter()
  const pathname = usePathname()
  const initialFilterState = useMemo(() => createFilterState(initialFilters), [initialFilters])
  const initialStateKey = getExploreMentorsStateKey(initialFilterState, initialPage)
  const [localState, setLocalState] = useState<LocalFilterState>(() => ({
    urlStateKey: initialStateKey,
    filters: initialFilterState,
    page: initialPage,
  }))

  const hasCurrentUrlState = localState.urlStateKey === initialStateKey
  const filters = hasCurrentUrlState ? localState.filters : initialFilterState
  const currentPage = hasCurrentUrlState ? localState.page : initialPage

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setLocalState({
      urlStateKey: initialStateKey,
      filters: { ...filters, [key]: value },
      page: 1,
    })
  }

  const updateFilters = (nextFilters: Partial<FilterState>) => {
    setLocalState({
      urlStateKey: initialStateKey,
      filters: { ...filters, ...nextFilters },
      page: 1,
    })
  }

  const clearFilters = () => {
    setLocalState({
      urlStateKey: initialStateKey,
      filters: { ...defaultFilters, counselingType: filters.counselingType },
      page: 1,
    })
  }

  const setCurrentPage = (page: number) => {
    setLocalState({
      urlStateKey: initialStateKey,
      filters,
      page,
    })
  }

  useEffect(() => {
    if (!syncUrl) return

    const params = buildExploreMentorsSearchParams(filters, currentPage)
    const queryString = params.toString()
    const currentQueryString = window.location.search.replace(/^\?/, '')

    if (queryString === currentQueryString) return

    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    })
  }, [currentPage, filters, pathname, router, syncUrl])

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
