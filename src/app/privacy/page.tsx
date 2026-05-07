import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PrivacyContent } from '@/components/sections/privacy/PrivacyContent'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Review how Book My Counselling collects, protects, and manages personal information.',
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-hidden bg-[#f7f8ff] pt-20">
        <PrivacyContent />
      </main>
      <Footer />
    </>
  )
}
