import { Suspense } from 'react'

import { EventDetailPageContent } from '@/features/events/components/EventDetailPageContent'

interface EventDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params
  return (
    <Suspense fallback={null}>
      <EventDetailPageContent eventId={id} />
    </Suspense>
  )
}
