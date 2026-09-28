import type { Metadata } from 'next'
import { Suspense } from 'react'

import { EventDetailPageContent } from '@/features/events/components/EventDetailPageContent'
import { getPublicEventBySlug } from '@/features/events/api/events.api'

interface EventDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await getPublicEventBySlug(slug).catch(() => null)
  if (!event) return {}

  // Prefer `about` when it's richer than the short marketing `description`,
  // so the OG card has a meaningful blurb instead of the tagline alone.
  const ogDescription =
    event.about && event.about.length > event.description.length ? event.about : event.description

  return {
    title: event.title,
    description: ogDescription,
    openGraph: {
      title: event.title,
      description: ogDescription,
      type: 'article',
      publishedTime: event.event_date,
      ...(event.cover_image_url
        ? {
            images: [
              {
                url: event.cover_image_url,
                alt: event.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: ogDescription,
      ...(event.cover_image_url ? { images: [event.cover_image_url] } : {}),
    },
  }
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params
  return (
    <Suspense fallback={null}>
      <EventDetailPageContent slug={slug} />
    </Suspense>
  )
}
