import { parseAcademicCounsellorSearchParams, type AcademicCounsellorSearchParams } from './filter-url-state'

export async function loadAcademicCounsellorState(
  searchParams: Promise<AcademicCounsellorSearchParams>
) {
  const { filters, page } = parseAcademicCounsellorSearchParams(await searchParams)
  return { filters, page }
}