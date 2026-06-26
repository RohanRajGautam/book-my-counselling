import { CoachServicesPageContent } from '@/features/coach-services/components/CoachServicesPageContent'
import { isFreshersServiceTag } from '@/features/coach-services/lib/coach-services.constants'

type CoachForFreshersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getServiceTag(searchParams: Record<string, string | string[] | undefined>) {
  const value = searchParams.service
  const serviceTag = Array.isArray(value) ? value[0] : value

  return isFreshersServiceTag(serviceTag) ? serviceTag : undefined
}

export default async function CoachForFreshersPage({ searchParams }: CoachForFreshersPageProps) {
  const serviceTag = getServiceTag(await searchParams)

  return (
    <main className="min-h-screen bg-[#f8f9ff] pt-[73px]">
      <CoachServicesPageContent audience="freshers" serviceTag={serviceTag} />
    </main>
  )
}
