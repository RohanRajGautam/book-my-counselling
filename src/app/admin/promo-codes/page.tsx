import { Suspense } from 'react'
import { AdminPromoCodesPage } from '@/features/admin/promo-codes/AdminPromoCodesPage'

export default function AdminPromoCodesRoutePage() {
  return (
    <Suspense fallback={null}>
      <AdminPromoCodesPage />
    </Suspense>
  )
}