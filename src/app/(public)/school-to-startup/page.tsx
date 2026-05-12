import type { Metadata } from 'next'
import { SchoolToStartupForm } from '@/features/school-to-startup/components/SchoolToStartupForm'
import { SchoolToStartupHero } from '@/features/school-to-startup/components/SchoolToStartupHero'

export const metadata: Metadata = {
  title: 'School to Startup Series',
  description:
    'Submit your pitch for the School to Startup Series and turn classroom ideas into scalable ventures.',
}

export default function SchoolToStartupPage() {
  return (
    <main className="min-h-screen bg-[#f7f8ff] pt-36 pb-20">
      <SchoolToStartupHero />
      <SchoolToStartupForm />
    </main>
  )
}
