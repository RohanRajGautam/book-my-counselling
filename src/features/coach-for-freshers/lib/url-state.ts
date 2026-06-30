import {
  COACH_FOR_FRESHERS_CATEGORIES,
  isCoachForFreshersCategory,
} from '../types/coach-for-freshers.types'
import type { CoachForFreshersFilters, SortBy } from '../types/filters.types'

export type CoachForFreshersSearchParams = Record<string, string | string[] | undefined>

type ParsedState = {
  filters: Partial<CoachForFreshersFilters>
  page: number
}

const SORT_VALUES: readonly SortBy[] = ['rating', 'reviews', 'price-low', 'price-high', 'newest']

function getParamValue(params: CoachForFreshersSearchParams, key: string) {
  const value = params[key]
  return Array.isArray(value) ? value[0] : value
}

function parseSort(value: string | undefined): SortBy | undefined {
  return (SORT_VALUES as readonly string[]).includes(value ?? '') ? (value as SortBy) : undefined
}

function parseCategory(value: string | undefined): CoachForFreshersFilters['category'] {
  if (!value) return null
  if (isCoachForFreshersCategory(value)) return value

  return null
}

export function parseCoachForFreshersSearchParams(
  params: CoachForFreshersSearchParams
): ParsedState {
  const search = (getParamValue(params, 'q') ?? getParamValue(params, 'search') ?? '').trim()
  const page = Number(getParamValue(params, 'page') ?? 1)
  const sortBy = parseSort(getParamValue(params, 'sort'))
  const category = parseCategory(getParamValue(params, 'category'))

  const filters: Partial<CoachForFreshersFilters> = {
    jobTitle: search,
    category,
    availableThisWeek: getParamValue(params, 'available') === 'this-week',
  }

  if (sortBy) filters.sortBy = sortBy

  return {
    filters,
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
  }
}

export function buildCoachForFreshersSearchParams(filters: CoachForFreshersFilters, page: number) {
  const params = new URLSearchParams()

  if (filters.category) params.set('category', filters.category)
  if (filters.availableThisWeek) params.set('available', 'this-week')
  if (filters.sortBy && filters.sortBy !== 'rating') params.set('sort', filters.sortBy)
  if (page > 1) params.set('page', String(page))

  return params
}

export async function loadCoachForFreshersState(
  searchParams: Promise<CoachForFreshersSearchParams>
): Promise<ParsedState> {
  return parseCoachForFreshersSearchParams(await searchParams)
}

export { COACH_FOR_FRESHERS_CATEGORIES }
