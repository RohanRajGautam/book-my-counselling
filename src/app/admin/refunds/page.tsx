import { Suspense } from 'react'
import { AdminRefundsPage } from '@/features/admin/refunds/AdminRefundsPage'

export default function AdminRefundsRoutePage() {
  return (
    <Suspense fallback={null}>
      <AdminRefundsPage />
    </Suspense>
  )
}
