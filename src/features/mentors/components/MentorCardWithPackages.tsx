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
  verified?: boolean
  onClick?: () => void
}

export function MentorCardWithPackages({
  mentorId,
  fallbackPrice,
  ...cardProps
}: MentorCardWithPackagesProps) {
  const { data: packages = [] } = useMentorPackages(mentorId)

  const minPrice =
    packages.length > 0
      ? Math.min(...packages.map((p) => Number(p.price)))
      : fallbackPrice

  const packageTiers =
    packages.length > 0
      ? packages.map((p) => ({
          duration_minutes: p.duration_minutes,
          price: Number(p.price),
        }))
      : undefined

  return <MentorCard {...cardProps} price={minPrice} packageTiers={packageTiers} />
}
