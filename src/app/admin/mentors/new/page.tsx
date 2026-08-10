import { Suspense } from 'react'
import { AdminCreateMentorFallback } from '@/features/admin/mentors/create/components/AdminCreateMentorFallback'
import { AdminCreateMentorPage } from '@/features/admin/mentors/create/AdminCreateMentorPage'

export default function AdminCreateMentorRoutePage() {
  return (
    <Suspense fallback={<AdminCreateMentorFallback />}>
      <AdminCreateMentorPage />
    </Suspense>
  )
}
