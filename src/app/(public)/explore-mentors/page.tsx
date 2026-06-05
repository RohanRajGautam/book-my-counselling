import { MentorDiscovery } from '@/features/mentors/components/MentorDiscovery'
import { FilterProvider } from '@/features/filters/context/FilterContext'
import {
  parseExploreMentorsSearchParams,
  type ExploreMentorsSearchParams,
} from '@/features/filters/lib/filter-url-state'

type ExploreMentorsPageProps = {
  searchParams: Promise<ExploreMentorsSearchParams>
}

export default async function ExploreMentorsPage({ searchParams }: ExploreMentorsPageProps) {
  const { filters, page } = parseExploreMentorsSearchParams(await searchParams)

  return (
    <main className="min-h-screen bg-[#f8f9ff] pt-[73px]">
      <FilterProvider initialFilters={filters} initialPage={page} syncUrl>
        <MentorDiscovery />
      </FilterProvider>
    </main>
  )
}
