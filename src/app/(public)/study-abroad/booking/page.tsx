import { Suspense } from 'react'

import { StudyAbroadBookingPageContent } from '@/features/study-abroad/components/StudyAbroadBookingPageContent'

export default function StudyAbroadBookingPage() {
  return (
    <main className="min-h-screen bg-[#f8f9ff] pt-[73px]">
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center" />}>
        <StudyAbroadBookingPageContent />
      </Suspense>
    </main>
  )
}
