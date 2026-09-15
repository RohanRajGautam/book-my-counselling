import type { Metadata } from 'next'
import { EventsListingPageContent } from '@/features/events/components/EventsListingPageContent'

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Browse upcoming and past BYC events — fireside chats, intimate gatherings, and meetups across Kathmandu.',
}

export default function EventsPage() {
  return <EventsListingPageContent />
}
