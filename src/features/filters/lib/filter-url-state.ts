import { type FilterState, type CounselingType } from '@/features/filters/types/filter.types'

export type ExploreMentorsSearchParams = Record<string, string | string[] | undefined>

type ParsedFilterUrlState = {
  filters: Partial<FilterState>
  page: number
}

const COUNSELING_TYPES: CounselingType[] = ['academic', 'professional']

function getParamValue(params: ExploreMentorsSearchParams, key: string) {
  const value = params[key]
  return Array.isArray(value) ? value[0] : value
}

function getParamValues(params: ExploreMentorsSearchParams, key: string) {
  const value = params[key]
  if (!value) return []

  const values = Array.isArray(value) ? value : [value]

  return values
    .flatMap((item) => item.split(','))
    .map((item) => item.trim())
    .filter(Boolean)
}

function getCounselingType(params: ExploreMentorsSearchParams): CounselingType {
  const type = getParamValue(params, 'type')
  if (type === 'professional') return 'professional'
  if (type === 'academic') return 'academic'

  if (params.professional !== undefined) return 'professional'
  if (params.academic !== undefined) return 'academic'

  return 'academic'
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

export function parseExploreMentorsSearchParams(
  params: ExploreMentorsSearchParams
): ParsedFilterUrlState {
  const counselingType = getCounselingType(params)
  const categories = getParamValues(params, 'category')
  const subcategories = getParamValues(params, 'subcategory')
  const search = (getParamValue(params, 'q') ?? getParamValue(params, 'search') ?? '').trim()
  const page = Number(getParamValue(params, 'page') ?? 1)
  const sortBy = getSortBy(getParamValue(params, 'sort'))

  const filters: Partial<FilterState> = {
    counselingType,
    jobTitle: search,
    availableThisWeek: getParamValue(params, 'available') === 'this-week',
  }

  if (sortBy) filters.sortBy = sortBy

  if (counselingType === 'academic') {
    filters.academicCategory = categories
    filters.academicSubcategory = subcategories
  } else {
    filters.professionalCategory = categories
    filters.professionalSubcategory = subcategories
  }

  return {
    filters,
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
  }
}

export function buildExploreMentorsSearchParams(filters: FilterState, page: number) {
  const params = new URLSearchParams()
  const activeType = COUNSELING_TYPES.includes(filters.counselingType)
    ? filters.counselingType
    : 'academic'
  const categories =
    activeType === 'academic' ? filters.academicCategory : filters.professionalCategory
  const subcategories =
    activeType === 'academic' ? filters.academicSubcategory : filters.professionalSubcategory
  const search = filters.jobTitle?.trim()

  params.set('type', activeType)

  if (search) params.set('q', search)
  categories.forEach((category) => params.append('category', category))
  subcategories.forEach((subcategory) => params.append('subcategory', subcategory))
  if (filters.availableThisWeek) params.set('available', 'this-week')
  if (filters.sortBy && filters.sortBy !== 'rating') params.set('sort', filters.sortBy)
  if (page > 1) params.set('page', String(page))

  return params
}
