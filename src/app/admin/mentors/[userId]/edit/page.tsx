import { Suspense } from 'react'

import { AdminEditMentorPage } from '@/features/admin/mentors/edit/AdminEditMentorPage'

type AdminEditMentorRoutePageProps = {
  params: Promise<{ userId: string }>
}

export default async function AdminEditMentorRoutePage({ params }: AdminEditMentorRoutePageProps) {
  const { userId } = await params

  return (
    <Suspense fallback={null}>
      <AdminEditMentorPage userId={userId} />
    </Suspense>
  )
}
