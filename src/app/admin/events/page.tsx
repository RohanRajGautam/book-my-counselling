import { Suspense } from 'react'

import { AdminEventsPage } from '@/features/events/components/admin/AdminEventsPage'

export const metadata = {
  title: 'Events | Admin',
}

export default function AdminEventsRoutePage() {
  return (
    <Suspense fallback={null}>
      <AdminEventsPage />
    </Suspense>
  )
}
