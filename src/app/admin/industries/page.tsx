import { Suspense } from 'react'
import { AdminIndustriesPage } from '@/features/admin/industries/AdminIndustriesPage'

export default function AdminIndustriesRoutePage() {
  return (
    <Suspense fallback={null}>
      <AdminIndustriesPage />
    </Suspense>
  )
}