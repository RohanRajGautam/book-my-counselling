import { Suspense } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { BookingPageContent } from '@/features/booking/components/BookingPageContent'

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center" />}>
      <Navbar />
      <BookingPageContent />
    </Suspense>
  )
}
