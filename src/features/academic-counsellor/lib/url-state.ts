import type { AcademicFilters, SortBy } from '../types/filters.types'

export type AcademicCounsellorSearchParams = Record<string, string | string[] | undefined>

type ParsedState = {
  filters: Partial<AcademicFilters>
  page: number
}

const SORT_VALUES: readonly SortBy[] = ['rating', 'reviews', 'price-low', 'price-high', 'newest']

function getParamValue(params: AcademicCounsellorSearchParams, key: string) {
  const value = params[key]
  return Array.isArray(value) ? value[0] : value
}

function getParamValues(params: AcademicCounsellorSearchParams, key: string) {
  const value = params[key]
  if (!value) return []

  const values = Array.isArray(value) ? value : [value]

  return values
    .flatMap((item) => item.split(','))
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseSort(value: string | undefined): SortBy | undefined {
  return (SORT_VALUES as readonly string[]).includes(value ?? '') ? (value as SortBy) : undefined
}

export function parseAcademicCounsellorSearchParams(
  params: AcademicCounsellorSearchParams
): ParsedState {
  const search = (getParamValue(params, 'q') ?? getParamValue(params, 'search') ?? '').trim()
  const page = Number(getParamValue(params, 'page') ?? 1)
  const sortBy = parseSort(getParamValue(params, 'sort'))

  const academicCategory = getParamValues(params, 'category')
  const academicSubcategory =
    academicCategory.length > 0 ? getParamValues(params, 'subcategory') : []

  const filters: Partial<AcademicFilters> = {
    jobTitle: search,
    academicCategory,
    academicSubcategory,
    availableThisWeek: getParamValue(params, 'available') === 'this-week',
  }

  if (sortBy) filters.sortBy = sortBy

  return {
    filters,
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
  }
}

export function buildAcademicCounsellorSearchParams(filters: AcademicFilters, page: number) {
  const params = new URLSearchParams()

  filters.academicCategory.forEach((category) => params.append('category', category))
  filters.academicSubcategory.forEach((subcategory) => params.append('subcategory', subcategory))
  if (filters.availableThisWeek) params.set('available', 'this-week')
  if (filters.sortBy && filters.sortBy !== 'rating') params.set('sort', filters.sortBy)
  if (page > 1) params.set('page', String(page))

  return params
}

export async function loadAcademicCounsellorState(
  searchParams: Promise<AcademicCounsellorSearchParams>
): Promise<ParsedState> {
  return parseAcademicCounsellorSearchParams(await searchParams)
}
