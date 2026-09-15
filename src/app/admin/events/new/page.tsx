import { Suspense } from 'react'

import { AdminCreateEventPage } from '@/features/events/components/admin/AdminCreateEventPage'

export const metadata = {
  title: 'Create event | Admin',
}

export default function AdminCreateEventRoutePage() {
  return (
    <Suspense fallback={null}>
      <AdminCreateEventPage />
    </Suspense>
  )
}
