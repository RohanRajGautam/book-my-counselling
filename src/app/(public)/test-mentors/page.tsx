import { AllMentorsPageContent } from '@/features/all-mentors/components/AllMentorsPageContent'
import {
  loadAllMentorsState,
  type AllMentorsSearchParams,
} from '@/features/all-mentors/lib/url-state'

type TestMentorsPageProps = {
  searchParams: Promise<AllMentorsSearchParams>
}

export default async function TestMentorsPage({ searchParams }: TestMentorsPageProps) {
  const { filters, page } = await loadAllMentorsState(searchParams)

  return (
    <main className="min-h-screen bg-[linear-gradient(to_right,#eff4ff_0%,#eff4ff_50%,#f8f9ff_50%,#f8f9ff_100%)] pt-15">
      <AllMentorsPageContent initialFilters={filters} initialPage={page} />
    </main>
  )
}
