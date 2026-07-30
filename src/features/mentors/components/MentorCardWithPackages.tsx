'use client'

import { useMentorPackages } from '@/features/service-packages/hooks/useMentorPackages'
import { MentorCard } from './MentorCard'

interface MentorCardWithPackagesProps {
  mentorId: string
  name: string
  role: string
  company: string
  tags: string[]
  rating: number
  reviews: number
  description: string
  fallbackPrice: number
  imageUrl?: string | null
  companyLogoUrl?: string | null
  verified?: boolean
  onClick?: () => void
  context?: 'academic' | 'coach-for-freshers'
}

export function MentorCardWithPackages({
  mentorId,
  fallbackPrice,
  ...cardProps
}: MentorCardWithPackagesProps) {
  const { data: packages = [] } = useMentorPackages(mentorId)

  // Always show 3 tiers — use real packages if they exist, otherwise derive from hourly rate
  const packageTiers =
    packages.length > 0
      ? packages.map((p) => ({
          duration_minutes: p.duration_minutes,
          price: Number(p.price),
        }))
      : [
          { duration_minutes: 30, price: Math.round(fallbackPrice * 0.5) },
          { duration_minutes: 60, price: Math.round(fallbackPrice) },
          { duration_minutes: 90, price: Math.round(fallbackPrice * 1.5) },
        ]

  const minPrice = Math.min(...packageTiers.map((t) => t.price))

  return <MentorCard {...cardProps} price={minPrice} packageTiers={packageTiers} />
}
