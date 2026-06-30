import {
  COACH_FOR_FRESHERS_VARIETIES,
  type CoachForFreshersVarietySlug,
} from '@/features/coach-for-freshers/types/coach-for-freshers.types'

export type CrossLinkInfo =
  | { category: 'cff'; count: number; variety: CoachForFreshersVarietySlug }
  | { category: 'academic'; count: number }
  | null

type RawParams = Record<string, string | string[] | undefined>

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0]
  return value
}

export function parseCrossLink(params: RawParams): CrossLinkInfo {
  const value = firstParam(params.alsoIn)
  const countRaw = Number(firstParam(params.alsoInCount))
  const count = Number.isFinite(countRaw) && countRaw > 0 ? Math.floor(countRaw) : 0

  if (value === 'cff' && count > 0) {
    const varietyValue = firstParam(params.alsoInVariety)
    const variety =
      varietyValue && varietyValue in COACH_FOR_FRESHERS_VARIETIES
        ? (varietyValue as CoachForFreshersVarietySlug)
        : 'career-clarity-roadmap'
    return { category: 'cff', count, variety }
  }

  if (value === 'academic' && count > 0) {
    return { category: 'academic', count }
  }

  return null
}
