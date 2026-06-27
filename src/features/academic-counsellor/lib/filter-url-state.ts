import { type FilterState } from '@/features/filters/types/filter.types'

export type AcademicCounsellorSearchParams = Record<string, string | string[] | undefined>

type ParsedFilterUrlState = {
  filters: Partial<FilterState>
  page: number
}

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

function getSortBy(value: string | undefined): FilterState['sortBy'] | undefined {
  if (
    value === 'rating' ||
    value === 'reviews' ||
    value === 'price-low' ||
    value === 'price-high' ||
    value === 'newest'
  ) {
    return value
  }

  return undefined
}

export function parseAcademicCounsellorSearchParams(
  params: AcademicCounsellorSearchParams
): ParsedFilterUrlState {
  const search = (getParamValue(params, 'q') ?? getParamValue(params, 'search') ?? '').trim()
  const page = Number(getParamValue(params, 'page') ?? 1)
  const sortBy = getSortBy(getParamValue(params, 'sort'))

  const academicCategory = getParamValues(params, 'category')
  const academicSubcategory =
    academicCategory.length > 0 ? getParamValues(params, 'subcategory') : []

  const filters: Partial<FilterState> = {
    counselingType: 'academic',
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

export function buildAcademicCounsellorSearchParams(filters: FilterState, page: number) {
  const params = new URLSearchParams()

  filters.academicCategory.forEach((category) => params.append('category', category))
  filters.academicSubcategory.forEach((subcategory) => params.append('subcategory', subcategory))
  if (filters.availableThisWeek) params.set('available', 'this-week')
  if (filters.sortBy && filters.sortBy !== 'rating') params.set('sort', filters.sortBy)
  if (page > 1) params.set('page', String(page))

  return params
}