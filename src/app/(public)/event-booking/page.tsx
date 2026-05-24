import { Suspense } from 'react'
import { EventBookingPageContent } from '@/features/events/components/EventBookingPageContent'

export default function EventBookingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center" />}>
      <EventBookingPageContent />
    </Suspense>
  )
}
