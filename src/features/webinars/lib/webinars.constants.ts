import type { WebinarDetails } from '@/features/webinars/types/webinars.types'

export const webinars: WebinarDetails[] = [
  {
    slug: 'free-graphic-design-training',
    guestName: 'Sabin Marasini',
    guestDesc: 'Graphic Designer at Uptech',
    imageUrl: '/webinars/sabin-marasini.png',
    topic: 'Free Graphic and Motion Design with AI',
    date: 'June 12, Sunday',
    duration: '1 month',
    seats: 60,
    highlights: ['Free training cohort', 'One month practical learning', 'Book your seat early'],
  },
  {
    slug: 'free-ai-training',
    guestName: 'Bhupin Baral',
    guestDesc: 'AI Engineer at Fusemachines',
    imageUrl: '/webinars/bhupin-baral.png',
    topic: 'Free AI Training',
    duration: '2 weeks',
    seats: 60,
    highlights: ['Free AI training cohort', 'Two weeks focused learning', 'Led by an AI engineer'],
  },
]

export function getWebinarBySlug(slug: string | null): WebinarDetails | undefined {
  if (!slug) return undefined
  return webinars.find((webinar) => webinar.slug === slug)
}
