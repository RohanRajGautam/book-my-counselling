import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AboutHero } from '@/components/sections/about/AboutHero'
import { AboutMissionValues } from '@/components/sections/about/AboutMissionValues'
import { AboutStory } from '@/components/sections/about/AboutStory'
import { AboutTeam } from '@/components/sections/about/AboutTeam'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn how Book My Counselling is redefining access to expert mentorship and career guidance.',
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
      <Footer />
    </>
  )
}
