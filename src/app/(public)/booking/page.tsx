import { Suspense } from 'react'
import { BookingPageContent } from '@/features/booking/components/BookingPageContent'

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center" />}>
      <BookingPageContent />
    </Suspense>
  )
}
