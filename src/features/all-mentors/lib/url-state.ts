import {
  COACH_FOR_FRESHERS_CATEGORIES,
  isCoachForFreshersCategory,
} from '@/features/coach-for-freshers/types/coach-for-freshers.types'

import type { Vendor } from '../types/filters.types'
import type { AllMentorsFilters, SortBy } from '../types/filters.types'

export type AllMentorsSearchParams = Record<string, string | string[] | undefined>

type ParsedState = {
  filters: Partial<AllMentorsFilters>
  page: number
}

const VENDOR_VALUES: readonly Vendor[] = ['academic', 'coach-for-freshers']
const SORT_VALUES: readonly SortBy[] = ['rating', 'reviews', 'price-low', 'price-high', 'newest']

function getParamValue(params: AllMentorsSearchParams, key: string) {
  const value = params[key]
  return Array.isArray(value) ? value[0] : value
}

function getParamValues(params: AllMentorsSearchParams, key: string) {
  const value = params[key]
  if (!value) return []

  const values = Array.isArray(value) ? value : [value]

  return values
    .flatMap((item) => item.split(','))
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseVendor(value: string | undefined): Vendor | null {
  if (!value) return null
  return (VENDOR_VALUES as readonly string[]).includes(value) ? (value as Vendor) : null
}

function parseSort(value: string | undefined): SortBy | undefined {
  return (SORT_VALUES as readonly string[]).includes(value ?? '') ? (value as SortBy) : undefined
}

function parseCffCategory(value: string | undefined): AllMentorsFilters['cffCategory'] {
  if (!value) return null
  if (isCoachForFreshersCategory(value)) return value
  return null
}

export function parseAllMentorsSearchParams(params: AllMentorsSearchParams): ParsedState {
  const search = (getParamValue(params, 'q') ?? getParamValue(params, 'search') ?? '').trim()
  const page = Number(getParamValue(params, 'page') ?? 1)
  const sortBy = parseSort(getParamValue(params, 'sort'))
  const vendor = parseVendor(getParamValue(params, 'vendor'))

  const academicCategory =
    vendor === 'academic' ? getParamValues(params, 'category') : []
  const academicSubcategory =
    vendor === 'academic' && academicCategory.length > 0 ? getParamValues(params, 'subcategory') : []
  const cffCategory = vendor === 'coach-for-freshers' ? parseCffCategory(getParamValue(params, 'cff')) : null

  const filters: Partial<AllMentorsFilters> = {
    jobTitle: search,
    vendor,
    academicCategory,
    academicSubcategory,
    cffCategory,
    availableThisWeek: getParamValue(params, 'available') === 'this-week',
  }

  if (sortBy) filters.sortBy = sortBy

  return {
    filters,
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
  }
}

export function buildAllMentorsSearchParams(filters: AllMentorsFilters, page: number) {
  const params = new URLSearchParams()

  if (filters.vendor) params.set('vendor', filters.vendor)
  if (filters.vendor === 'academic') {
    filters.academicCategory.forEach((category) => params.append('category', category))
    filters.academicSubcategory.forEach((subcategory) => params.append('subcategory', subcategory))
  }
  if (filters.vendor === 'coach-for-freshers' && filters.cffCategory) {
    params.set('cff', filters.cffCategory)
  }
  if (filters.jobTitle.trim()) params.set('q', filters.jobTitle.trim())
  if (filters.availableThisWeek) params.set('available', 'this-week')
  if (filters.sortBy && filters.sortBy !== 'rating') params.set('sort', filters.sortBy)
  if (page > 1) params.set('page', String(page))

  return params
}

export async function loadAllMentorsState(
  searchParams: Promise<AllMentorsSearchParams>
): Promise<ParsedState> {
  return parseAllMentorsSearchParams(await searchParams)
}
