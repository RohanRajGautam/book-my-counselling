import { Suspense } from 'react'

import { AdminEventDetailPage } from '@/features/events/components/admin/AdminEventDetailPage'
import { AdminEventDetailFallback } from '@/features/events/components/admin/AdminEventDetailFallback'

type AdminEventDetailRoutePageProps = {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Event detail | Admin',
}

export default async function AdminEventDetailRoutePage({
  params,
}: AdminEventDetailRoutePageProps) {
  const { id } = await params
  return (
    <Suspense fallback={<AdminEventDetailFallback />}>
      <AdminEventDetailPage eventId={id} />
    </Suspense>
  )
}
