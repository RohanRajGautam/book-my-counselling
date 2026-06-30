'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { buildAcademicCounsellorSearchParams } from '../lib/url-state'
import type { AcademicFilters, SortBy } from '../types/filters.types'

const DEFAULT_FILTERS: AcademicFilters = {
  jobTitle: '',
  academicCategory: [],
  academicSubcategory: [],
  academicSubcategoryParents: {},
  availableThisWeek: false,
  sortBy: 'rating',
}

interface AcademicFiltersContextValue {
  filters: AcademicFilters
  updateFilter: <K extends keyof AcademicFilters>(key: K, value: AcademicFilters[K]) => void
  updateFilters: (nextFilters: Partial<AcademicFilters>, resetPage?: boolean) => void
  clearFilters: () => void
  currentPage: number
  setCurrentPage: (page: number) => void
}

const AcademicFiltersContext = createContext<AcademicFiltersContextValue | undefined>(undefined)

type LocalState = {
  urlStateKey: string
  filters: AcademicFilters
  page: number
}

function makeStateKey(filters: AcademicFilters, page: number) {
  return buildAcademicCounsellorSearchParams(filters, page).toString()
}

export function AcademicFiltersProvider({
  children,
  initialFilters,
  initialPage = 1,
}: {
  children: ReactNode
  initialFilters?: Partial<AcademicFilters>
  initialPage?: number
}) {
  const router = useRouter()
  const pathname = usePathname()

  const baseFilters = useMemo<AcademicFilters>(
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
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isCurrent = localState.urlStateKey === initialState.urlStateKey
  const filters = isCurrent ? localState.filters : baseFilters
  const currentPage = isCurrent ? localState.page : initialPage

  const updateFilter = <K extends keyof AcademicFilters>(key: K, value: AcademicFilters[K]) => {
    setLocalState((prev) => ({
      urlStateKey: initialState.urlStateKey,
      filters: { ...prev.filters, [key]: value },
      page: 1,
    }))
  }

  const updateFilters = (nextFilters: Partial<AcademicFilters>, resetPage = true) => {
    setLocalState((prev) => ({
      urlStateKey: initialState.urlStateKey,
      filters: { ...prev.filters, ...nextFilters },
      page: resetPage ? 1 : prev.page,
    }))
  }

  const clearFilters = () => {
    setLocalState({
      urlStateKey: initialState.urlStateKey,
      filters: DEFAULT_FILTERS,
      page: 1,
    })
  }

  const setCurrentPage = (page: number) => {
    setLocalState({
      urlStateKey: initialState.urlStateKey,
      filters,
      page,
    })
  }

  useEffect(() => {
    if (syncTimer.current) clearTimeout(syncTimer.current)
    syncTimer.current = setTimeout(() => {
      const params = buildAcademicCounsellorSearchParams(filters, currentPage)
      const queryString = params.toString()
      const currentQueryString = window.location.search.replace(/^\?/, '')

      if (queryString === currentQueryString) return

      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    }, 300)

    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current)
    }
  }, [filters, currentPage, pathname, router])

  return (
    <AcademicFiltersContext.Provider
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
    </AcademicFiltersContext.Provider>
  )
}

export function useAcademicFilters() {
  const context = useContext(AcademicFiltersContext)
  if (context === undefined) {
    throw new Error('useAcademicFilters must be used within an AcademicFiltersProvider')
  }
  return context
}

export type { AcademicFilters, SortBy }
