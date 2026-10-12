import { Suspense } from 'react'

import { AdminAvailabilityFallback } from '@/features/admin/mentors/availability/AdminAvailabilityFallback'
import { AdminAvailabilityPage } from '@/features/admin/mentors/availability/AdminAvailabilityPage'

type AdminAvailabilityRoutePageProps = {
  params: Promise<{ mentorId: string }>
}

export default async function AdminAvailabilityRoutePage({
  params,
}: AdminAvailabilityRoutePageProps) {
  const { mentorId } = await params
  return (
    <Suspense fallback={<AdminAvailabilityFallback />}>
      <AdminAvailabilityPage mentorId={mentorId} />
    </Suspense>
  )
}
