import { Suspense } from 'react'

import { AdminMentorSessionsPage } from '@/features/admin/mentor-sessions/AdminMentorSessionsPage'

type AdminMentorSessionsRoutePageProps = {
  params: Promise<{ mentorId: string }>
}

export default async function AdminMentorSessionsRoutePage({
  params,
}: AdminMentorSessionsRoutePageProps) {
  const { mentorId } = await params
  return (
    <Suspense fallback={null}>
      <AdminMentorSessionsPage mentorId={mentorId} />
    </Suspense>
  )
}
