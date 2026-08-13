import type { Metadata } from 'next'
import { AboutHero } from '@/features/about/components/AboutHero'
import { AboutMissionValues } from '@/features/about/components/AboutMissionValues'
import { AboutStory } from '@/features/about/components/AboutStory'
import { AboutTeam } from '@/features/about/components/AboutTeam'
import { AboutVetting } from '@/features/about/components/AboutVetting'
import { AboutByNumbers } from '@/features/about/components/AboutByNumbers'
import { AboutDualCta } from '@/features/about/components/AboutDualCta'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn how Book Your Counselling is redefining access to expert mentorship and career guidance.',
}

export default function AboutUsPage() {
  return (
    <main className="min-h-screen pt-18">
      <AboutHero />
      <AboutStory />
      <AboutMissionValues />
      <AboutTeam />
      <AboutVetting />
      <AboutByNumbers />
      <AboutDualCta />
    </main>
  )
}
