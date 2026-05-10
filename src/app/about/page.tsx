import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AboutHero } from '@/features/about/components/AboutHero'
import { AboutMissionValues } from '@/features/about/components/AboutMissionValues'
import { AboutStory } from '@/features/about/components/AboutStory'
import { AboutTeam } from '@/features/about/components/AboutTeam'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn how Book Your Counselling is redefining access to expert mentorship and career guidance.',
}

export default function AboutUsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-hidden bg-[#f7f8ff] pt-20">
        <AboutHero />
        <AboutStory />
        <AboutMissionValues />
        <AboutTeam />
      </main>
    </>
  )
}
