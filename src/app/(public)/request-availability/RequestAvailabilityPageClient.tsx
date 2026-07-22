'use client'

import { useSearchParams } from 'next/navigation'

import { RequestAvailabilityPage } from '@/features/availability-requests/components/RequestAvailabilityPage'

export function RequestAvailabilityPageClient() {
  const searchParams = useSearchParams()
  const mentorId = searchParams?.get('mentorId') ?? null
  return <RequestAvailabilityPage mentorId={mentorId} />
}
