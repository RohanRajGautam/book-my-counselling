'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'

import { buildAllMentorsSearchParams } from '../lib/url-state'
import type { AllMentorsFilters, Vendor } from '../types/filters.types'

const DEFAULT_FILTERS: AllMentorsFilters = {
  jobTitle: '',
  vendor: null,
  academicCategory: [],
  academicSubcategory: [],
  academicSubcategoryParents: {},
  cffCategory: null,
  availableThisWeek: false,
  sortBy: 'rating',
}

interface AllMentorsFiltersContextValue {
  filters: AllMentorsFilters
  updateFilter: <K extends keyof AllMentorsFilters>(key: K, value: AllMentorsFilters[K]) => void
  updateFilters: (nextFilters: Partial<AllMentorsFilters>, resetPage?: boolean) => void
  selectVendor: (next: Vendor | null) => void
  clearFilters: () => void
  currentPage: number
  setCurrentPage: (page: number) => void
}

const AllMentorsFiltersContext = createContext<AllMentorsFiltersContextValue | undefined>(undefined)

type LocalState = {
  urlStateKey: string
  filters: AllMentorsFilters
  page: number
}

function makeStateKey(filters: AllMentorsFilters, page: number) {
  return buildAllMentorsSearchParams(filters, page).toString()
}

function withoutAcademicFilters(filters: AllMentorsFilters): AllMentorsFilters {
  return {
    ...filters,
    academicCategory: [],
    academicSubcategory: [],
    academicSubcategoryParents: {},
  }
}

export function AllMentorsFiltersProvider({
  children,
  initialFilters,
  initialPage = 1,
}: {
  children: ReactNode
  initialFilters?: Partial<AllMentorsFilters>
  initialPage?: number
}) {
  const pathname = usePathname()

  const baseFilters = useMemo<AllMentorsFilters>(
    () => ({ ...DEFAULT_FILTERS, ...initialFilters }),
    [initialFilters]
  )

  const initialState = useMemo<LocalState>(
    () => ({
      urlStateKey: makeStateKey(baseFilters, initialPage),
      filters: baseFilters,
      page: initialPage,
    }),
    [baseFilters, initialPage]
  )

  const [localState, setLocalState] = useState<LocalState>(initialState)
  const [serverStateKey, setServerStateKey] = useState(initialState.urlStateKey)

  // Filter changes are written to the URL with the native history API, so the
  // server never re-renders this page for them. A new server state therefore
  // means the URL changed somewhere else (a link to /mentors, the back
  // button) and that state wins.
  if (initialState.urlStateKey !== serverStateKey) {
    setServerStateKey(initialState.urlStateKey)
    setLocalState(initialState)
  }

  const filters = localState.filters
  const currentPage = localState.page

  const updateFilter = <K extends keyof AllMentorsFilters>(key: K, value: AllMentorsFilters[K]) => {
    setLocalState((prev) => {
      const nextFilters = { ...prev.filters, [key]: value }
      return { urlStateKey: makeStateKey(nextFilters, 1), filters: nextFilters, page: 1 }
    })
  }

  const updateFilters = (nextFilters: Partial<AllMentorsFilters>, resetPage = true) => {
    setLocalState((prev) => {
      const mergedFilters = { ...prev.filters, ...nextFilters }
      const nextPage = resetPage ? 1 : prev.page
      return {
        urlStateKey: makeStateKey(mergedFilters, nextPage),
        filters: mergedFilters,
        page: nextPage,
      }
    })
  }

  const selectVendor = (next: Vendor | null) => {
    setLocalState((prev) => {
      if (prev.filters.vendor === next) return prev

      // Vendor scopes are mutually exclusive. Keeping the other vendor's
      // filters would ask the API for both at once, which matches nobody.
      let nextFilters: AllMentorsFilters = { ...prev.filters, vendor: next }
      if (next === 'academic') nextFilters = { ...nextFilters, cffCategory: null }
      if (next === 'coach-for-freshers') nextFilters = withoutAcademicFilters(nextFilters)

      return { urlStateKey: makeStateKey(nextFilters, 1), filters: nextFilters, page: 1 }
    })
  }

  const clearFilters = () => {
    setLocalState({
      urlStateKey: makeStateKey(DEFAULT_FILTERS, 1),
      filters: DEFAULT_FILTERS,
      page: 1,
    })
  }

  const setCurrentPage = (page: number) => {
    setLocalState((prev) => ({
      urlStateKey: makeStateKey(prev.filters, page),
      filters: prev.filters,
      page,
    }))
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = buildAllMentorsSearchParams(filters, currentPage)
      const queryString = params.toString()
      const currentQueryString = window.location.search.replace(/^\?/, '')

      if (queryString === currentQueryString) return

      window.history.replaceState(null, '', queryString ? `${pathname}?${queryString}` : pathname)
    }, 300)

    return () => clearTimeout(timer)
  }, [filters, currentPage, pathname])

  return (
    <AllMentorsFiltersContext.Provider
      value={{
        filters,
        updateFilter,
        updateFilters,
        selectVendor,
        clearFilters,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </AllMentorsFiltersContext.Provider>
  )
}

export function useAllMentorsFilters() {
  const context = useContext(AllMentorsFiltersContext)
  if (context === undefined) {
    throw new Error('useAllMentorsFilters must be used within an AllMentorsFiltersProvider')
  }
  return context
}
