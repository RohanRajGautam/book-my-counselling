'use client'

import Image from 'next/image'
import { Clock, TimerIcon, Video } from 'lucide-react'
import type { WebinarDetails } from '@/features/webinars/types/webinars.types'

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

interface WebinarOrderSummaryProps {
  webinar: WebinarDetails
}

export function WebinarOrderSummary({ webinar }: WebinarOrderSummaryProps) {
  return (
    <div className="rounded-[24px] bg-white p-8 shadow-[0_8px_24px_rgba(18,28,42,0.06)]">
      <h3 className="mb-6 font-[family-name:var(--font-headline)] text-xl font-bold text-[#121c2a]">
        Booking Summary
      </h3>

      <div className="mb-6 flex items-center gap-4 border-b border-[#c3c6d7]/15 pb-6">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-[#0053db]/20">
          {webinar.imageUrl ? (
            <Image
              src={webinar.imageUrl}
              alt={webinar.guestName}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              aria-label={`${webinar.guestName} profile initials`}
              className="flex h-full w-full items-center justify-center rounded-full bg-[#e6eeff] text-xl font-extrabold text-[#004ac6]"
            >
              {getInitials(webinar.guestName)}
            </div>
          )}
        </div>
        <div>
          <p className="font-[family-name:var(--font-headline)] font-bold text-[#121c2a]">
            {webinar.guestName}
          </p>
          <p className="text-sm text-[#006c49]">{webinar.guestDesc ?? webinar.topic}</p>
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col items-start justify-between gap-2">
          <span className="flex items-center gap-2 text-[#434655]">
            <Video className="h-5 w-5" />
            {webinar.topic}
          </span>
          <span className="flex items-center justify-start gap-2 text-[#434655]">
            <TimerIcon className="h-5 w-5" />
            <span className="font-semibold text-[#121c2a]">{webinar.duration}</span>
          </span>
        </div>

        <div className="space-y-3 rounded-2xl bg-[#f8f9ff] p-4 text-sm">
          <div className="flex items-center gap-3 text-[#434655]">
            <Clock className="h-4 w-4 text-[#004ac6]" />
            <span className="font-medium text-[#121c2a]">Free seat booking</span>
          </div>
        </div>
      </div>
    </div>
  )
}
