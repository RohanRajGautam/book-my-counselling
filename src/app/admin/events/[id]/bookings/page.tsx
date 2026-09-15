import { Suspense } from 'react'

import { AdminEventBookingsFallback } from '@/features/events/components/admin/AdminEventBookingsFallback'
import { AdminEventBookingsPage } from '@/features/events/components/admin/AdminEventBookingsPage'

type AdminEventBookingsRoutePageProps = {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Event bookings | Admin',
}

export default async function AdminEventBookingsRoutePage({
  params,
}: AdminEventBookingsRoutePageProps) {
  const { id } = await params
  return (
    <Suspense fallback={<AdminEventBookingsFallback />}>
      <AdminEventBookingsPage eventId={id} />
    </Suspense>
  )
}
