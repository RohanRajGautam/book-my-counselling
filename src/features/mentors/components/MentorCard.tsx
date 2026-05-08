'use client'

import Image from 'next/image'
import { Check, Star } from 'lucide-react'

interface MentorCardProps {
  name: string
  role: string
  company: string
  tags: string[]
  rating: number
  reviews: number
  description: string
  price: number
  imageUrl?: string | null
  verified?: boolean
  onClick?: () => void
}

export function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return initials || 'M'
}

export function MentorCard({
  name,
  role,
  company,
  tags,
  rating,
  reviews,
  description,
  price,
  imageUrl,
  verified = true,
  onClick,
}: MentorCardProps) {
  const imageSrc = imageUrl?.trim() || null
  const initials = getInitials(name)

  return (
    <div
      className="group flex h-full cursor-pointer flex-col rounded-[2rem] bg-white p-8 shadow-[0_8px_24px_rgba(18,28,42,0.04)] transition-all hover:shadow-[0_12px_32px_rgba(18,28,42,0.08)]"
      onClick={onClick}
    >
      {/* Header */}
      <div className="mb-6 flex items-start gap-5">
        <div className="relative">
          <div className="flex h-20 w-20 overflow-hidden rounded-full bg-[#f8f9ff] p-1 ring-2 ring-[#0053db]">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={`${name} profile`}
                width={80}
                height={80}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div
                aria-label={`${name} profile initials`}
                className="flex h-full w-full items-center justify-center rounded-full bg-[#e6eeff] text-2xl font-extrabold text-[#004ac6]"
              >
                {initials}
              </div>
            )}
          </div>
          {verified && (
            <div className="absolute -right-1 -bottom-1 rounded-full border-2 border-white bg-[#006c49] p-1">
              <Check className="h-4 w-4 text-white" strokeWidth={3} />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold transition-colors group-hover:text-[#004ac6]">{name}</h3>
          <div className="flex items-center gap-1 text-sm font-semibold text-[#006c49]">
            Verified Mentor
          </div>
          <p className="mt-1 font-medium text-[#434655]">
            {role} at {company}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="mb-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#e6eeff] px-3 py-1 text-xs font-bold text-[#004ac6]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Rating */}
      <div className="mb-4 flex items-center gap-1">
        <Star className="h-[18px] w-[18px] fill-yellow-500 text-yellow-500" />
        <span className="font-bold">{rating}</span>
        <span className="text-sm font-medium text-[#737686]">({reviews} reviews)</span>
      </div>

      {/* Description */}
      <p className="mb-8 flex-grow text-sm leading-relaxed text-[#434655]">{description}</p>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#e6eeff] pt-6">
        <div className="flex flex-col">
          <span className="text-xs font-bold tracking-widest text-[#737686] uppercase">
            Starting at
          </span>
          <span className="text-xl font-extrabold">${price}</span>
        </div>
        <button className="rounded-lg bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-8 py-3 font-bold text-white shadow-md transition-all hover:shadow-lg active:scale-95">
          Book Session
        </button>
      </div>
    </div>
  )
}
