import type { AllMentorsFilters } from '../types/filters.types'

export type AllMentorsScope = 'academic' | 'coach-for-freshers' | 'mixed'

type ScopeFilters = Pick<
  AllMentorsFilters,
  'vendor' | 'academicCategory' | 'academicSubcategory' | 'cffCategory'
>

// The sidebar keeps the two vendor scopes mutually exclusive, so a single
// vendor is always in play once anything narrows the listing. "mixed" means
// nothing is applied yet and the listing shows every mentor.
export function getAllMentorsScope(filters: ScopeFilters): AllMentorsScope {
  if (filters.vendor === 'academic') return 'academic'
  if (filters.vendor === 'coach-for-freshers') return 'coach-for-freshers'
  if (filters.cffCategory) return 'coach-for-freshers'
  if (filters.academicCategory.length > 0 || filters.academicSubcategory.length > 0) {
    return 'academic'
  }
  return 'mixed'
}
