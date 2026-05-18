import { MentorDiscovery } from '@/features/mentors/components/MentorDiscovery'
import { FilterProvider } from '@/features/filters/context/FilterContext'

type ExploreMentorsPageProps = {
  searchParams: Promise<{
    q?: string | string[]
    search?: string | string[]
  }>
}

function getSearchValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function ExploreMentorsPage({ searchParams }: ExploreMentorsPageProps) {
  const params = await searchParams
  const initialSearch = (getSearchValue(params.q) ?? getSearchValue(params.search) ?? '').trim()

  return (
    <main className="min-h-screen bg-[#f8f9ff] pt-[73px]">
      <FilterProvider initialFilters={{ jobTitle: initialSearch }}>
        <MentorDiscovery />
      </FilterProvider>
    </main>
  )
}
