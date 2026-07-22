import { Suspense } from 'react'

import { RequestAvailabilityPage } from '@/features/availability-requests/components/RequestAvailabilityPage'
import { RequestAvailabilityPageClient } from './RequestAvailabilityPageClient'

export const metadata = {
  title: 'Request availability · Book Your Counselling',
  description:
    'Ask a mentor to open a session at a date and time that suits you. Free to request — only pay once the mentor confirms.',
}

export default function RequestAvailabilityRoutePage() {
  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center" />}>
      <RequestAvailabilityPageClient />
    </Suspense>
  )
}
