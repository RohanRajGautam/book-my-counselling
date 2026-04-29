'use client'

import { X, Check, Globe, Calendar, Coffee, Pencil, Compass, Star, Link } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'

interface Service {
  icon: 'coffee' | 'pencil' | 'compass'
  title: string
  duration: string
  price: number
  popular?: boolean
}

interface Review {
  rating: number
  count: number
  text: string
  author: string
  authorInitial: string
}

interface AvailabilitySlot {
  date: string
  label: string
  slots: number
  isHighlighted?: boolean
}

interface MentorProfileModalProps {
  isOpen: boolean
  onClose: () => void
  mentor: {
    name: string
    title: string
    imageUrl: string
    verified?: boolean
    about: string[]
    services: Service[]
    availability: AvailabilitySlot[]
    reviews: Review
    responseTime: string
    linkedIn?: string
    portfolio?: string
  }
}

const iconMap = {
  coffee: Coffee,
  pencil: Pencil,
  compass: Compass,
}

export function MentorProfileModal({ isOpen, onClose, mentor }: MentorProfileModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
    }
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#27313f]/40 p-4 backdrop-blur-[12px] md:p-8"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative grid w-full max-h-[90vh] max-w-6xl grid-cols-1 gap-6 overflow-y-auto rounded-[32px] bg-[#f8f9ff] p-6 shadow-[0_16px_48px_rgba(18,28,42,0.12)] lg:grid-cols-12 lg:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-10 flex items-center justify-center rounded-full p-3 text-[#434655] transition-colors hover:bg-[#dee9fc]"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        {/* LEFT COLUMN: Identity & Quick Actions */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          {/* Profile Header Card */}
          <div className="relative flex flex-col items-center overflow-hidden rounded-[24px] bg-white p-8 text-center shadow-[0_8px_24px_rgba(18,28,42,0.04)]">
            {/* Background decoration */}
            <div className="absolute left-0 top-0 -z-0 h-32 w-full rounded-t-[24px] bg-[#eff4ff]"></div>

            <div className="relative z-10">
              <div className="mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full ring-4 ring-white ring-offset-4 ring-offset-[#0053db]/10">
                <Image
                  src={mentor.imageUrl}
                  alt={`${mentor.name} profile`}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>

              <h2 className="mb-2 font-[family-name:var(--font-headline)] text-3xl font-extrabold tracking-tight text-[#121c2a]">
                {mentor.name}
              </h2>
              <p className="mb-4 text-lg text-[#434655]">{mentor.title}</p>

              {/* Verified Badge */}
              {mentor.verified && (
                <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-[#6cf8bb]/30 px-3 py-1.5 text-sm font-bold text-[#00714d]">
                  <Check className="h-[18px] w-[18px]" strokeWidth={3} />
                  Verified Mentor
                </div>
              )}
            </div>
          </div>

          {/* Connect Links */}
          <div className="flex justify-center gap-4 rounded-[24px] bg-white p-6 shadow-[0_8px_24px_rgba(18,28,42,0.04)]">
            {mentor.linkedIn && (
              <button className="flex items-center gap-2 rounded-[16px] bg-[#eff4ff] px-5 py-3 text-sm font-bold text-[#434655] transition-colors hover:bg-[#dee9fc]">
                <Link className="h-5 w-5" />
                LinkedIn
              </button>
            )}
            {mentor.portfolio && (
              <button className="flex items-center gap-2 rounded-[16px] bg-[#eff4ff] px-5 py-3 text-sm font-bold text-[#434655] transition-colors hover:bg-[#dee9fc]">
                <Globe className="h-5 w-5" />
                Portfolio
              </button>
            )}
          </div>

          {/* Primary CTA */}
          <div className="mt-auto">
            <button className="w-full rounded-[24px] bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-8 py-5 font-[family-name:var(--font-headline)] text-xl font-bold text-white shadow-lg shadow-[#004ac6]/20 transition-transform duration-300 hover:scale-[1.02]">
              Book a Session
            </button>
            <p className="mt-4 text-center text-sm text-[#434655]">{mentor.responseTime}</p>
          </div>
        </div>

        {/* RIGHT COLUMN: Details Bento */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          {/* About Section */}
          <div className="rounded-[24px] bg-white p-8 shadow-[0_8px_24px_rgba(18,28,42,0.04)] lg:p-10">
            <h3 className="mb-4 font-[family-name:var(--font-headline)] text-2xl font-bold text-[#121c2a]">
              About {mentor.name.split(' ')[0]}
            </h3>
            {mentor.about.map((paragraph, index) => (
              <p
                key={index}
                className={`text-lg leading-relaxed text-[#434655] ${index < mentor.about.length - 1 ? 'mb-6' : ''}`}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Services & Pricing */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {mentor.services.map((service, index) => {
              const IconComponent = iconMap[service.icon]
              return (
                <div
                  key={index}
                  className="group relative cursor-pointer overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_8px_24px_rgba(18,28,42,0.04)] transition-colors hover:bg-[#eff4ff]/50"
                >
                  {service.popular && (
                    <div className="absolute right-0 top-0 rounded-bl-[12px] rounded-tr-[24px] bg-[#6cf8bb] px-3 py-1 text-xs font-bold text-[#00714d]">
                      Popular
                    </div>
                  )}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#004ac6]/10 text-[#004ac6] transition-transform group-hover:scale-110">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h4 className="mb-1 font-[family-name:var(--font-headline)] text-lg font-bold">
                    {service.title}
                  </h4>
                  <p className="mb-4 text-sm text-[#434655]">{service.duration}</p>
                  <div className="font-[family-name:var(--font-headline)] text-2xl font-extrabold text-[#004ac6]">
                    ${service.price}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Availability & Reviews */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Availability Preview */}
            <div className="rounded-[24px] bg-white p-8 shadow-[0_8px_24px_rgba(18,28,42,0.04)]">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-[family-name:var(--font-headline)] text-xl font-bold text-[#121c2a]">
                  Upcoming Availability
                </h3>
                <button className="text-sm font-bold text-[#004ac6] hover:underline">
                  View Calendar
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {mentor.availability.map((slot, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between rounded-[16px] p-4 ${
                      slot.isHighlighted ? 'bg-[#eff4ff]' : 'bg-[#f8f9ff]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar
                        className={`h-5 w-5 ${slot.isHighlighted ? 'text-[#434655]' : 'text-[#737686]'}`}
                      />
                      <span
                        className={`${slot.isHighlighted ? 'font-bold text-[#121c2a]' : 'font-medium text-[#434655]'}`}
                      >
                        {slot.label}
                      </span>
                    </div>
                    {slot.isHighlighted ? (
                      <span className="rounded-full bg-[#004ac6]/10 px-3 py-1 text-sm font-bold text-[#004ac6]">
                        {slot.slots} Slots
                      </span>
                    ) : (
                      <span className="text-sm text-[#434655]">{slot.slots} Slots</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Preview */}
            <div className="flex flex-col justify-center rounded-[24px] bg-white p-8 shadow-[0_8px_24px_rgba(18,28,42,0.04)]">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex text-[#f9bd22]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-lg font-bold">{mentor.reviews.rating}</span>
                <span className="text-sm text-[#434655]">({mentor.reviews.count} reviews)</span>
              </div>
              <blockquote className="mb-4 text-lg italic text-[#434655]">
                "{mentor.reviews.text}"
              </blockquote>
              <div className="mt-auto flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dee9fc] text-sm font-bold text-[#004ac6]">
                  {mentor.reviews.authorInitial}
                </div>
                <span className="text-sm font-bold text-[#121c2a]">{mentor.reviews.author}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
