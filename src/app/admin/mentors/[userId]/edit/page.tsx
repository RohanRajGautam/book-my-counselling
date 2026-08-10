import { Suspense } from 'react'

import { AdminEditMentorFallback } from '@/features/admin/mentors/edit/components/AdminEditMentorFallback'
import { AdminEditMentorPage } from '@/features/admin/mentors/edit/AdminEditMentorPage'

type AdminEditMentorRoutePageProps = {
  params: Promise<{ userId: string }>
}

export default async function AdminEditMentorRoutePage({ params }: AdminEditMentorRoutePageProps) {
  const { userId } = await params

  return (
    <Suspense fallback={<AdminEditMentorFallback />}>
      <AdminEditMentorPage userId={userId} />
    </Suspense>
  )
}
