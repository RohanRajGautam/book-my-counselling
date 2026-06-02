import { Suspense } from 'react'
import { WebinarBookingPageContent } from '@/features/webinars/components/WebinarBookingPageContent'

export default function WebinarBookingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center" />}>
      <WebinarBookingPageContent />
    </Suspense>
  )
}
