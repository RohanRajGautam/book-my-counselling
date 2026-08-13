'use client'

import { useRouter } from 'next/navigation'

import { CoachForFreshersProfileModal } from '@/features/coach-for-freshers/components/CoachForFreshersProfileModal'

interface FeaturedMentorProfileProps {
  mentorSlugOrId: string
}

export function FeaturedMentorProfile({ mentorSlugOrId }: FeaturedMentorProfileProps) {
  const router = useRouter()

  const handleClose = () => {
    router.push('/#featured-mentors')
  }

  return (
    <main className="min-h-screen bg-[#f8f9ff]">
      <CoachForFreshersProfileModal
        mentorId={mentorSlugOrId}
        onClose={handleClose}
        source="featured-mentors"
      />
    </main>
  )
}