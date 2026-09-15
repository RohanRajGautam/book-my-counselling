import { Suspense } from 'react'

import { EventDetailPageContent } from '@/features/events/components/EventDetailPageContent'

interface EventDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params
  return (
    <Suspense fallback={null}>
      <EventDetailPageContent slug={slug} />
    </Suspense>
  )
}
