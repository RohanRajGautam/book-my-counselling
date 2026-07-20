import { Suspense } from 'react'
import { AdminCreateMentorPage } from '@/features/admin/mentors/create/AdminCreateMentorPage'

export default function AdminCreateMentorRoutePage() {
  return (
    <Suspense fallback={null}>
      <AdminCreateMentorPage />
    </Suspense>
  )
}
