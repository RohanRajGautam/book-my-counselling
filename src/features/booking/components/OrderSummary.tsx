'use client'

import Image from 'next/image'
import { Video } from 'lucide-react'
import { getInitials } from '@/features/mentors/components/MentorCard'

interface OrderSummaryProps {
  mentor: {
    name: string
    title: string
    imageUrl?: string | null
  }
  session: {
    type: string
    duration: string
  }
  price: number
}

export function OrderSummary({ mentor, session, price }: OrderSummaryProps) {
  const initials = getInitials(mentor.name)
  const imageSrc = mentor.imageUrl?.trim() || null

  return (
    <div className="rounded-[24px] bg-white p-8 shadow-[0_8px_24px_rgba(18,28,42,0.06)]">
      <h3 className="mb-6 font-[family-name:var(--font-headline)] text-xl font-bold text-[#121c2a]">
        Order Summary
      </h3>

      {/* Mentor Info */}
      <div className="mb-6 flex items-center gap-4 border-b border-[#c3c6d7]/15 pb-6">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-[#0053db]/20">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={mentor.name}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              aria-label={`${mentor.name} profile initials`}
              className="flex h-full w-full items-center justify-center rounded-full bg-[#e6eeff] text-xl font-extrabold text-[#004ac6]"
            >
              {initials}
            </div>
          )}
        </div>
        <div>
          <p className="font-[family-name:var(--font-headline)] font-bold text-[#121c2a]">
            {mentor.name}
          </p>
          <p className="text-sm text-[#006c49]">{mentor.title}</p>
        </div>
      </div>

      {/* Session Details */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[#434655]">
            <Video className="h-4 w-4" />
            {session.type}
          </span>
          <span className="font-semibold text-[#121c2a]">{session.duration}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between border-t border-[#c3c6d7]/15 pt-6">
        <span className="font-[family-name:var(--font-headline)] text-lg font-bold text-[#121c2a]">
          Total
        </span>
        <span className="font-[family-name:var(--font-headline)] text-2xl font-bold text-[#004ac6]">
          NPR {price.toLocaleString()}
        </span>
      </div>
    </div>
  )
}
