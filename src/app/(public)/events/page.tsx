import type { Metadata } from 'next'
import { EventsPageContent } from '@/features/events/components/EventsPageContent'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Explore upcoming Book Your Counselling events and mentor-led live sessions.',
}

export default function EventsPage() {
  return <EventsPageContent />
}
