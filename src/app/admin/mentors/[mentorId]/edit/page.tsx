import { Suspense } from 'react'

import { AdminEditMentorFallback } from '@/features/admin/mentors/edit/components/AdminEditMentorFallback'
import { AdminEditMentorPage } from '@/features/admin/mentors/edit/AdminEditMentorPage'

type AdminEditMentorRoutePageProps = {
  params: Promise<{ mentorId: string }>
}

export default async function AdminEditMentorRoutePage({ params }: AdminEditMentorRoutePageProps) {
  const { mentorId } = await params

  return (
    <Suspense fallback={<AdminEditMentorFallback />}>
      <AdminEditMentorPage mentorId={mentorId} />
    </Suspense>
  )
}
