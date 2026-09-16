import { Suspense } from 'react'

import { AdminPayoutsPage } from '@/features/admin/payouts/AdminPayoutsPage'

export default function AdminPayoutsRoutePage() {
  return (
    <Suspense fallback={null}>
      <AdminPayoutsPage />
    </Suspense>
  )
}