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

import { buildCoachForFreshersSearchParams } from '../lib/url-state'
import type { CoachForFreshersFilters, SortBy } from '../types/filters.types'

const DEFAULT_FILTERS: CoachForFreshersFilters = {
  jobTitle: '',
  category: null,
  availableThisWeek: false,
  sortBy: 'rating',
}

interface CoachForFreshersFiltersContextValue {
  filters: CoachForFreshersFilters
  updateFilter: <K extends keyof CoachForFreshersFilters>(
    key: K,
    value: CoachForFreshersFilters[K]
  ) => void
  updateFilters: (nextFilters: Partial<CoachForFreshersFilters>, resetPage?: boolean) => void
  clearFilters: () => void
  currentPage: number
  setCurrentPage: (page: number) => void
}

const CoachForFreshersFiltersContext = createContext<CoachForFreshersFiltersContextValue | undefined>(
  undefined
)

type LocalState = {
  urlStateKey: string
  filters: CoachForFreshersFilters
  page: number
}

function makeStateKey(filters: CoachForFreshersFilters, page: number) {
  return buildCoachForFreshersSearchParams(filters, page).toString()
}

export function CoachForFreshersFiltersProvider({
  children,
  initialFilters,
  initialPage = 1,
}: {
  children: ReactNode
  initialFilters?: Partial<CoachForFreshersFilters>
  initialPage?: number
}) {
  const router = useRouter()
  const pathname = usePathname()

  const baseFilters = useMemo<CoachForFreshersFilters>(
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

  const updateFilter = <K extends keyof CoachForFreshersFilters>(
    key: K,
    value: CoachForFreshersFilters[K]
  ) => {
    setLocalState((prev) => ({
      urlStateKey: initialState.urlStateKey,
      filters: { ...prev.filters, [key]: value },
      page: 1,
    }))
  }

  const updateFilters = (nextFilters: Partial<CoachForFreshersFilters>, resetPage = true) => {
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
      const params = buildCoachForFreshersSearchParams(filters, currentPage)
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
    <CoachForFreshersFiltersContext.Provider
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
    </CoachForFreshersFiltersContext.Provider>
  )
}

export function useCoachForFreshersFilters() {
  const context = useContext(CoachForFreshersFiltersContext)
  if (context === undefined) {
    throw new Error(
      'useCoachForFreshersFilters must be used within a CoachForFreshersFiltersProvider'
    )
  }
  return context
}

export type { CoachForFreshersFilters, SortBy }
