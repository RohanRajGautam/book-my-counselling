import { AcademicCounsellorPageContent } from '@/features/academic-counsellor/components/AcademicCounsellorPageContent'
import { loadAcademicCounsellorState } from '@/features/academic-counsellor/lib/search-params'
import type { AcademicCounsellorSearchParams } from '@/features/academic-counsellor/lib/filter-url-state'

type AcademicCounsellorPageProps = {
  searchParams: Promise<AcademicCounsellorSearchParams>
}

export default async function AcademicCounsellorPage({ searchParams }: AcademicCounsellorPageProps) {
  const { filters, page } = await loadAcademicCounsellorState(searchParams)

  return (
    <main className="min-h-screen bg-[#f8f9ff] pt-[73px]">
      <AcademicCounsellorPageContent initialFilters={filters} initialPage={page} />
    </main>
  )
}