import type { Metadata } from 'next'
import { PrivacyContent } from '@/features/privacy/components/PrivacyContent'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Review how Book Your Counselling collects, protects, and manages personal information.',
}

export default function PrivacyPage() {
  return (
    <>
      <main className="min-h-screen overflow-hidden bg-[#f7f8ff] pt-20">
        <PrivacyContent />
      </main>
    </>
  )
}
