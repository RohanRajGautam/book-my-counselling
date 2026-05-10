import type { Metadata } from 'next'
import { AboutHero } from '@/features/about/components/AboutHero'
import { AboutMissionValues } from '@/features/about/components/AboutMissionValues'
import { AboutStory } from '@/features/about/components/AboutStory'
import { AboutTeam } from '@/features/about/components/AboutTeam'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn how Book My Counselling is redefining access to expert mentorship and career guidance.',
}

export default function AboutUsPage() {
  return (
    <>
      <main className="min-h-screen overflow-hidden bg-[#f7f8ff] pt-20">
        <AboutHero />
        <AboutStory />
        <AboutMissionValues />
        <AboutTeam />
      </main>
    </>
  )
}
