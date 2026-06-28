import { AcademicCounsellorPageContent } from '@/features/academic-counsellor/components/AcademicCounsellorPageContent'
import {
  loadAcademicCounsellorState,
  type AcademicCounsellorSearchParams,
} from '@/features/academic-counsellor/lib/url-state'

type AcademicCounsellorPageProps = {
  searchParams: Promise<AcademicCounsellorSearchParams>
}

export default async function AcademicCounsellorPage({
  searchParams,
}: AcademicCounsellorPageProps) {
  const { filters, page } = await loadAcademicCounsellorState(searchParams)

  return (
    <main className="min-h-screen bg-[#f8f9ff] pt-[73px]">
      <AcademicCounsellorPageContent initialFilters={filters} initialPage={page} />
    </main>
  )
}
