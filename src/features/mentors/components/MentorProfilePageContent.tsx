'use client'

import { useRouter } from 'next/navigation'

import { FilterProvider } from '@/features/filters/context/FilterContext'
import { MentorDiscovery } from '@/features/mentors/components/MentorDiscovery'
import { MentorProfileModal } from '@/features/mentors/components/MentorProfileModal'

interface MentorProfilePageContentProps {
  mentorId: string
}

export function MentorProfilePageContent({ mentorId }: MentorProfilePageContentProps) {
  const router = useRouter()

  return (
    <main className="min-h-screen pt-[73px]">
      <MentorProfileModal
        isOpen
        mentorId={mentorId}
        onClose={() => router.push('/explore-mentors')}
      />
    </main>
  )
}
