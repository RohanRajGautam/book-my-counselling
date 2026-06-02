import type { Metadata } from 'next'
import { WebinarsPageContent } from '@/features/webinars/components/WebinarsPageContent'

export const metadata: Metadata = {
  title: 'Webinars',
  description: 'Explore free Book Your Counselling webinars and training sessions.',
}

export default function WebinarsPage() {
  return <WebinarsPageContent />
}
