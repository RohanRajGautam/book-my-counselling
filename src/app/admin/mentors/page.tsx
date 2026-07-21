import { Suspense } from 'react'
import { AdminMentorsPage } from '@/features/admin/mentors/AdminMentorsPage'

export default function AdminMentorsRoutePage() {
  return (
    <Suspense fallback={null}>
      <AdminMentorsPage />
    </Suspense>
  )
}
