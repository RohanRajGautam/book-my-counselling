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

import { buildAllMentorsSearchParams } from '../lib/url-state'
import type { AllMentorsFilters, SortBy, Vendor } from '../types/filters.types'

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

export function AllMentorsFiltersProvider({
  children,
  initialFilters,
  initialPage = 1,
}: {
  children: ReactNode
  initialFilters?: Partial<AllMentorsFilters>
  initialPage?: number
}) {
  const router = useRouter()
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
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isCurrent = localState.urlStateKey === initialState.urlStateKey
  const filters = isCurrent ? localState.filters : baseFilters
  const currentPage = isCurrent ? localState.page : initialPage

  const updateFilter = <K extends keyof AllMentorsFilters>(key: K, value: AllMentorsFilters[K]) => {
    setLocalState((prev) => ({
      urlStateKey: initialState.urlStateKey,
      filters: { ...prev.filters, [key]: value },
      page: 1,
    }))
  }

  const updateFilters = (nextFilters: Partial<AllMentorsFilters>, resetPage = true) => {
    setLocalState((prev) => ({
      urlStateKey: initialState.urlStateKey,
      filters: { ...prev.filters, ...nextFilters },
      page: resetPage ? 1 : prev.page,
    }))
  }

  const selectVendor = (next: Vendor | null) => {
    setLocalState((prev) => {
      if (prev.filters.vendor === next) return prev
      return {
        urlStateKey: initialState.urlStateKey,
        filters: { ...prev.filters, vendor: next },
        page: 1,
      }
    })
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
      const params = buildAllMentorsSearchParams(filters, currentPage)
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
