import { getAcademicCounsellors } from '@/features/academic-counsellor/api/academic-counsellor.api'
import type { AcademicFilters } from '@/features/academic-counsellor/types/filters.types'
import { getCoachForFreshers } from '@/features/coach-for-freshers/api/coach-for-freshers.api'
import {
  COACH_FOR_FRESHERS_VARIETIES,
  type CoachForFreshersVariety,
  type CoachForFreshersVarietySlug,
} from '@/features/coach-for-freshers/types/coach-for-freshers.types'

export type SmartSearchDestination =
  | {
      kind: 'academic'
      href: string
      alsoIn?: 'cff'
      alsoInCount?: number
      alsoInVariety?: CoachForFreshersVarietySlug
    }
  | {
      kind: 'cff'
      variety: CoachForFreshersVarietySlug
      href: string
      alsoIn?: 'academic'
      alsoInCount?: number
    }
  | {
      kind: 'none'
      href: string
    }

const DEFAULT_ACADEMIC_FILTERS: AcademicFilters = {
  jobTitle: '',
  academicCategory: [],
  academicSubcategory: [],
  academicSubcategoryParents: {},
  availableThisWeek: false,
  sortBy: 'rating',
}

const DEFAULT_CFF_FILTERS = {
  jobTitle: '',
  category: null,
  availableThisWeek: false,
  sortBy: 'rating' as const,
}

function buildQueryString(query: string, extra?: Record<string, string | number>) {
  const params = new URLSearchParams({ q: query })
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      params.set(key, String(value))
    }
  }
  return params.toString()
}

export async function smartSearch(rawQuery: string): Promise<SmartSearchDestination> {
  const query = rawQuery.trim()
  if (!query) {
    return { kind: 'none', href: '/academic-counsellor' }
  }

  const varieties = Object.values(COACH_FOR_FRESHERS_VARIETIES)

  const results = await Promise.allSettled([
    getAcademicCounsellors({ ...DEFAULT_ACADEMIC_FILTERS, jobTitle: query }, 1),
    ...varieties.map((variety) =>
      getCoachForFreshers(variety, { ...DEFAULT_CFF_FILTERS, jobTitle: query }, 1)
    ),
  ])

  const academicTotal =
    results[0]?.status === 'fulfilled' ? results[0].value.total : 0

  const cffCounts = varieties.map((variety, index) => {
    const result = results[index + 1]
    return {
      variety,
      count: result?.status === 'fulfilled' ? result.value.total : 0,
    }
  })

  const bestCff = cffCounts.reduce<{ variety: CoachForFreshersVariety; count: number } | null>(
    (best, current) => (best === null || current.count > best.count ? current : best),
    null
  )
  const cffTotal = cffCounts.reduce((sum, item) => sum + item.count, 0)

  if (academicTotal > 0 && (bestCff === null || bestCff.count === 0)) {
    return {
      kind: 'academic',
      href: `/academic-counsellor?${buildQueryString(query)}`,
    }
  }

  if (academicTotal === 0 && bestCff !== null && bestCff.count > 0) {
    const bestSlug = bestCff.variety.slug as CoachForFreshersVarietySlug
    return {
      kind: 'cff',
      variety: bestSlug,
      href: `/coach-for-freshers/${bestSlug}?${buildQueryString(query)}`,
    }
  }

  if (academicTotal > 0 && bestCff !== null && bestCff.count > 0) {
    const bestSlug = bestCff.variety.slug as CoachForFreshersVarietySlug
    if (academicTotal >= cffTotal) {
      return {
        kind: 'academic',
        href: `/academic-counsellor?${buildQueryString(query, { alsoIn: 'cff', alsoInCount: cffTotal, alsoInVariety: bestSlug })}`,
        alsoIn: 'cff',
        alsoInCount: cffTotal,
        alsoInVariety: bestSlug,
      }
    }
    return {
      kind: 'cff',
      variety: bestSlug,
      href: `/coach-for-freshers/${bestSlug}?${buildQueryString(query, { alsoIn: 'academic', alsoInCount: academicTotal })}`,
      alsoIn: 'academic',
      alsoInCount: academicTotal,
    }
  }

  return {
    kind: 'none',
    href: `/academic-counsellor?${buildQueryString(query)}`,
  }
}
