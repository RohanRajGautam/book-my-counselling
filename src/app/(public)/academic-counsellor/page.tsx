import { AcademicCounsellorPageContent } from '@/features/academic-counsellor/components/AcademicCounsellorPageContent'
import {
  loadAcademicCounsellorState,
  type AcademicCounsellorSearchParams,
} from '@/features/academic-counsellor/lib/url-state'
import { parseCrossLink } from '@/features/search/lib/parse-cross-link'

type AcademicCounsellorPageProps = {
  searchParams: Promise<AcademicCounsellorSearchParams>
}

export default async function AcademicCounsellorPage({
  searchParams,
}: AcademicCounsellorPageProps) {
  const { filters, page } = await loadAcademicCounsellorState(searchParams)
  const crossLink = parseCrossLink(await searchParams)

  return (
    <main className="min-h-screen bg-[#eff4ff] pt-15">
      <AcademicCounsellorPageContent
        initialFilters={filters}
        initialPage={page}
        crossLink={crossLink ?? undefined}
      />
    </main>
  )
}
