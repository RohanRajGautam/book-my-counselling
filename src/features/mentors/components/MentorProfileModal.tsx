'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { X, Check, Link, Globe, Star, ChevronRight, ChevronLeft } from 'lucide-react'
import { useMentor } from '../hooks/useMentor'
import { useMentorAvailability } from '@/features/availability/hooks/useMentorAvailability'
import { useMentorPackages } from '@/features/service-packages/hooks/useMentorPackages'
import { useMentorReviews } from '@/features/reviews/hooks/useMentorReviews'
import { getInitials } from './MentorCard'
import { AvailabilityPicker } from '@/features/availability/components/AvailabilityPicker'

interface Props {
  isOpen: boolean
  onClose: () => void
  mentorId: string
}

export function MentorProfileModal({ isOpen, onClose, mentorId }: Props) {
  const router = useRouter()
  const [reviewPage, setReviewPage] = useState(1)
  const [selection, setSelection] = useState<{
    mentorId: string | null
    slicedSlotId: string | null
    parentSlotId: string | null
    sessionStart: string | null
    sessionEnd: string | null
    packageId: string | null
  }>({
    mentorId: null,
    slicedSlotId: null,
    parentSlotId: null,
    sessionStart: null,
    sessionEnd: null,
    packageId: null,
  })

  const { data: mentor, isPending: isMentorLoading } = useMentor(isOpen ? mentorId : null)
  const { data: fetchedPackages = [], isPending: isPackagesLoading } = useMentorPackages(
    isOpen ? mentorId : null
  )

  // If the mentor has no saved packages, derive the 3 standard tiers from their hourly rate
  const hourlyRate = Number(mentor?.hourly_rate ?? 0)
  const packages =
    fetchedPackages.length > 0
      ? fetchedPackages
      : hourlyRate > 0
        ? [
            {
              id: 'fallback-30',
              mentor_id: mentorId,
              title: 'Basic Counselling Package',
              description: 'A focused 30-minute session — ideal for quick guidance or follow-ups.',
              duration_minutes: 30,
              price: String(Math.round(hourlyRate * 0.5)),
              is_active: true,
              created_at: '',
              updated_at: '',
            },
            {
              id: 'fallback-60',
              mentor_id: mentorId,
              title: 'Standard Counselling Package',
              description:
                'A full 60-minute session — the most popular choice for in-depth counselling.',
              duration_minutes: 60,
              price: String(Math.round(hourlyRate)),
              is_active: true,
              created_at: '',
              updated_at: '',
            },
            {
              id: 'fallback-90',
              mentor_id: mentorId,
              title: 'Premium Counselling Package',
              description:
                'An extended 90-minute session — best for comprehensive planning and deep dives.',
              duration_minutes: 90,
              price: String(Math.round(hourlyRate * 1.5)),
              is_active: true,
              created_at: '',
              updated_at: '',
            },
          ]
        : []

  const { data: availability = [], isPending: isAvailabilityLoading } = useMentorAvailability(
    isOpen ? mentorId : null
  )

  const { data: reviewsData, isPending: isReviewsLoading } = useMentorReviews(
    isOpen ? mentorId : null,
    reviewPage
  )

  const initials = getInitials(mentor?.user?.full_name || '')

  const reviews = reviewsData?.items ?? []
  const totalReviews = reviewsData?.total ?? 0
  const totalPages = reviewsData?.total_pages ?? 1
  const hasNextPage = reviewsData?.has_next ?? false
  const services = mentor?.tags ?? []
  const selectedSlotId = selection.mentorId === mentorId ? selection.slicedSlotId : null
  const selectedParentSlotId = selection.mentorId === mentorId ? selection.parentSlotId : null
  const selectedSessionStart = selection.mentorId === mentorId ? selection.sessionStart : null
  const selectedSessionEnd = selection.mentorId === mentorId ? selection.sessionEnd : null
  const selectedPackageId = selection.mentorId === mentorId ? selection.packageId : null
  const linkedinHref = mentor?.linkedin_url || '#'
  const portfolioHref = mentor?.website_url || '#'
  const hasAvailability = availability.length > 0
  const ctaLabel = !hasAvailability
    ? 'Not Accepting Bookings'
    : !selectedPackageId
      ? 'Choose a Package'
      : !selectedSlotId
        ? 'Choose a Time Slot'
        : 'Book a Session'
  const canBook = Boolean(selectedSlotId && selectedPackageId && hasAvailability)
  const ratingLabel = Number(mentor?.average_rating || 0)
    .toFixed(1)
    .replace('.0', '')

  const isInitialLoading = isMentorLoading || isPackagesLoading || isAvailabilityLoading

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  if (isInitialLoading || !mentor) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#27313f]/40 backdrop-blur-[12px]">
        <div className="h-[90vh] w-full max-w-7xl animate-pulse rounded-[32px] bg-white" />
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#27313f]/40 p-4 pb-26 backdrop-blur-[12px] lg:pb-4"
      onClick={onClose}
    >
      <div
        className="custom-scrollbar relative grid max-h-[90vh] w-full max-w-7xl grid-cols-1 gap-5 overflow-y-auto rounded-[32px] bg-[#f8f9ff] p-4 shadow-[0_16px_48px_rgba(18,28,42,0.12)] sm:p-6 lg:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 flex size-11 items-center justify-center rounded-full bg-white/90 text-[#434655] shadow-[0_8px_20px_rgba(18,28,42,0.08)] transition-colors hover:bg-[#dee9fc]"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        {/* LEFT COLUMN: Identity & Quick Actions */}
        <div className="flex flex-col gap-5 lg:col-span-4">
          <div className="relative flex flex-col items-center overflow-hidden rounded-[24px] bg-white p-7 text-center shadow-[0_8px_24px_rgba(18,28,42,0.04)]">
            <div className="absolute top-0 left-0 -z-0 h-28 w-full rounded-t-[24px] bg-[#eff4ff]"></div>
            <div className="relative z-10">
              <div className="mx-auto mb-5 h-28 w-28 overflow-hidden rounded-full ring-4 ring-white ring-offset-4 ring-offset-[#0053db]/10">
                {/* <Image
                  src={mentor.user?.avatar_url || '/globe.svg'}
                  alt={`${mentor.user?.full_name} profile`}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                /> */}

                {mentor.user?.avatar_url ? (
                  <Image
                    src={mentor.user.avatar_url}
                    alt={`${mentor.user.full_name} profile`}
                    width={80}
                    height={80}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div
                    aria-label={`${mentor.user?.full_name} profile initials`}
                    className="flex h-full w-full items-center justify-center rounded-full bg-[#e6eeff] text-5xl font-extrabold text-[#004ac6]"
                  >
                    {initials}
                  </div>
                )}
              </div>
              <h2 className="mb-2 font-[family-name:var(--font-headline)] text-2xl font-extrabold tracking-tight text-[#121c2a] sm:text-3xl">
                {mentor.user?.full_name}
              </h2>
              <p className="mx-auto mb-4 max-w-[320px] text-base leading-7 font-medium text-[#434655]">
                {mentor.title} {mentor.company && `at ${mentor.company}`}
              </p>

              {mentor.is_verified && (
                <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-[#6cf8bb]/30 px-3 py-1.5 text-sm font-bold text-[#00714d]">
                  <Check className="h-[18px] w-[18px]" strokeWidth={3} />
                  Verified Mentor
                </div>
              )}

              <div className="mb-5 grid grid-cols-3 overflow-hidden rounded-[18px] bg-[#f8f9ff] ring-1 ring-[#eff4ff]">
                <div className="px-3 py-3">
                  <p className="font-[family-name:var(--font-headline)] text-lg font-extrabold text-[#121c2a]">
                    {ratingLabel}
                  </p>
                  <p className="text-[11px] font-bold text-[#737686]">Rating</p>
                </div>
                <div className="border-x border-[#eff4ff] px-3 py-3">
                  <p className="font-[family-name:var(--font-headline)] text-lg font-extrabold text-[#121c2a]">
                    {mentor.total_reviews}
                  </p>
                  <p className="text-[11px] font-bold text-[#737686]">Reviews</p>
                </div>
                <div className="px-3 py-3">
                  <p className="font-[family-name:var(--font-headline)] text-lg font-extrabold text-[#121c2a]">
                    {mentor.total_sessions}
                  </p>
                  <p className="text-[11px] font-bold text-[#737686]">Sessions</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={linkedinHref}
                  target={mentor.linkedin_url ? '_blank' : undefined}
                  aria-disabled={!mentor.linkedin_url}
                  onClick={(event) => {
                    if (!mentor.linkedin_url) event.preventDefault()
                  }}
                  className={`flex items-center justify-center gap-2 rounded-[16px] bg-[#eff4ff] px-4 py-3 text-sm font-bold text-[#434655] transition-colors hover:bg-[#dee9fc] ${
                    !mentor.linkedin_url ? 'cursor-not-allowed opacity-55' : ''
                  }`}
                >
                  <Link className="h-5 w-5" />
                  LinkedIn
                </a>
                <a
                  href={portfolioHref}
                  target={mentor.website_url ? '_blank' : undefined}
                  aria-disabled={!mentor.website_url}
                  onClick={(event) => {
                    if (!mentor.website_url) event.preventDefault()
                  }}
                  className={`flex items-center justify-center gap-2 rounded-[16px] bg-[#eff4ff] px-4 py-3 text-sm font-bold text-[#434655] transition-colors hover:bg-[#dee9fc] ${
                    !mentor.website_url ? 'cursor-not-allowed opacity-55' : ''
                  }`}
                >
                  <Globe className="h-5 w-5" />
                  Portfolio
                </a>
              </div>
            </div>
          </div>

          <div className="flex h-[190px] flex-col rounded-[24px] bg-white p-6 shadow-[0_8px_24px_rgba(18,28,42,0.04)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-[family-name:var(--font-headline)] text-lg font-bold text-[#121c2a]">
                Services offered
              </h3>
              <span className="text-xs font-bold text-[#737686]">{services.length} total</span>
            </div>
            <div className="custom-scrollbar flex min-h-0 flex-1 flex-wrap content-start gap-3 overflow-y-auto pr-2">
              {services.length > 0 ? (
                services.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-[#e6eeff] px-4 py-2 text-[12px] font-extrabold text-[#004ac6]"
                  >
                    {tag.name}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-[#e6eeff] px-4 py-2 text-sm font-extrabold text-[#004ac6]">
                  Mentorship
                </span>
              )}
            </div>
          </div>

          {/* <div className="flex justify-center gap-4 rounded-[24px] bg-white p-6 shadow-[0_8px_24px_rgba(18,28,42,0.04)]">
            <a
              href={linkedinHref}
              target={mentor.linkedin_url ? '_blank' : undefined}
              aria-disabled={!mentor.linkedin_url}
              onClick={(event) => {
                if (!mentor.linkedin_url) event.preventDefault()
              }}
              className={`flex items-center gap-2 rounded-[16px] bg-[#eff4ff] px-5 py-3 text-sm font-bold text-[#434655] transition-colors hover:bg-[#dee9fc] ${
                !mentor.linkedin_url ? 'cursor-not-allowed opacity-55' : ''
              }`}
            >
              <Link className="h-5 w-5" />
              LinkedIn
            </a>
            <a
              href={portfolioHref}
              target={mentor.website_url ? '_blank' : undefined}
              aria-disabled={!mentor.website_url}
              onClick={(event) => {
                if (!mentor.website_url) event.preventDefault()
              }}
              className={`flex items-center gap-2 rounded-[16px] bg-[#eff4ff] px-5 py-3 text-sm font-bold text-[#434655] transition-colors hover:bg-[#dee9fc] ${
                !mentor.website_url ? 'cursor-not-allowed opacity-55' : ''
              }`}
            >
              <Globe className="h-5 w-5" />
              Portfolio
            </a>
          </div> */}

          <div className="fixed right-4 bottom-0 left-4 z-20 mx-auto mt-auto max-w-7xl border-t border-none bg-[#f8f9ff]/95 p-3 shadow-[0_-12px_32px_rgba(18,28,42,0.12)] backdrop-blur lg:sticky lg:right-auto lg:bottom-0 lg:left-auto lg:z-auto lg:mx-0 lg:max-w-none lg:rounded-[24px] lg:border-t-0 lg:bg-[#f8f9ff]/90 lg:shadow-none">
            <div className="mt-auto rounded-[24px] p-3 shadow-[0_8px_24px_rgba(18,28,42,0.04)]">
              <button
                disabled={!canBook}
                onClick={() => {
                  if (selectedPackageId && selectedParentSlotId && selectedSessionStart && selectedSessionEnd) {
                    router.push(
                      `/booking?mentorId=${mentorId}&packageId=${selectedPackageId}&slotId=${selectedParentSlotId}&sessionStart=${selectedSessionStart}&sessionEnd=${selectedSessionEnd}`
                    )
                  }
                }}
                className="block w-full rounded-[20px] bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-8 py-4 text-center font-[family-name:var(--font-headline)] text-lg font-bold text-white shadow-lg shadow-[#004ac6]/20 transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              >
                {ctaLabel}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Details Bento */}
        <div className="flex flex-col gap-5 lg:col-span-8">
          <div className="rounded-[24px] bg-white p-6 shadow-[0_8px_24px_rgba(18,28,42,0.04)] lg:p-8">
            <h3 className="mb-3 font-[family-name:var(--font-headline)] text-2xl font-bold text-[#121c2a]">
              About {mentor.user?.full_name?.split(' ')[0]}
            </h3>
            <p className="text-base leading-8 font-medium text-[#434655]">
              {mentor.bio ||
                `${mentor.user?.full_name} is an experienced ${mentor.title} passionate about mentoring professionals.`}
            </p>
          </div>

          <div className="rounded-[24px] bg-white p-6 shadow-[0_8px_24px_rgba(18,28,42,0.04)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-[family-name:var(--font-headline)] text-xl font-bold text-[#121c2a]">
                  Packages
                </h3>
                <p className="mt-1 text-sm font-medium text-[#737686]">
                  Select a package before choosing a time.
                </p>
              </div>
              <span className="rounded-full bg-[#e6eeff] px-3 py-1.5 text-xs font-extrabold text-[#004ac6]">
                Choose one
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {packages.length > 0 ? (
                packages.map((service, index) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() =>
                      setSelection({
                        mentorId,
                        slicedSlotId: null,
                        parentSlotId: null,
                        sessionStart: null,
                        sessionEnd: null,
                        packageId: selectedPackageId === service.id ? null : service.id,
                      })
                    }
                    className={`group relative cursor-pointer overflow-hidden rounded-[24px] p-5 text-left shadow-[0_8px_24px_rgba(18,28,42,0.04)] ring-1 transition-all ring-inset ${
                      selectedPackageId === service.id
                        ? 'bg-[#004ac6] text-white ring-[#004ac6]'
                        : 'bg-[#f8f9ff] ring-[#eff4ff] hover:bg-[#eff4ff]/70'
                    }`}
                  >
                    {index === 1 && (
                      <div
                        className={`absolute top-0 right-0 rounded-tr-[24px] rounded-bl-[12px] px-3 py-1 text-[10px] font-bold ${
                          selectedPackageId === service.id
                            ? 'bg-white/20 text-white'
                            : 'bg-[#6cf8bb] text-[#00714d]'
                        }`}
                      >
                        Popular
                      </div>
                    )}
                    <h4
                      className={`mb-1 font-[family-name:var(--font-headline)] text-lg font-bold ${
                        selectedPackageId === service.id ? 'text-white' : 'text-[#121c2a]'
                      }`}
                    >
                      {service.title}
                    </h4>
                    <p
                      className={`mb-5 text-sm font-semibold ${
                        selectedPackageId === service.id ? 'text-white/80' : 'text-[#434655]'
                      }`}
                    >
                      {service.duration_minutes} minutes
                    </p>
                    <div
                      className={`font-[family-name:var(--font-headline)] text-2xl font-extrabold ${
                        selectedPackageId === service.id ? 'text-white' : 'text-[#004ac6]'
                      }`}
                    >
                      NPR {Number(service.price)}
                    </div>
                  </button>
                ))
              ) : (
                <div className="col-span-full rounded-[16px] bg-[#f8f9ff] p-6 text-center font-medium text-[#737686]">
                  No service packages available yet.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[24px] bg-white p-6 shadow-[0_8px_24px_rgba(18,28,42,0.04)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-[family-name:var(--font-headline)] text-xl font-bold text-[#121c2a]">
                  Upcoming Availability
                </h3>
                <p className="mt-1 text-sm font-medium text-[#737686]">
                  Times are shown in your local timezone.
                </p>
              </div>
              <span className="rounded-full bg-[#e6eeff] px-3 py-1.5 text-xs font-extrabold text-[#004ac6]">
                {!hasAvailability
                  ? 'Unavailable'
                  : selectedPackageId
                    ? 'Choose a time'
                    : 'Choose a package first'}
              </span>
            </div>

            <AvailabilityPicker
              slots={availability}
              disabled={!selectedPackageId || !hasAvailability}
              selectedSlotId={selectedSlotId}
              packageDurationMinutes={packages.find((p) => p.id === selectedPackageId)?.duration_minutes}
              onSelect={(slicedSlotId, parentSlotId, startTime, endTime) =>
                setSelection({
                  mentorId,
                  slicedSlotId: selectedSlotId === slicedSlotId ? null : slicedSlotId,
                  parentSlotId: selectedSlotId === slicedSlotId ? null : parentSlotId,
                  sessionStart: selectedSlotId === slicedSlotId ? null : startTime,
                  sessionEnd: selectedSlotId === slicedSlotId ? null : endTime,
                  packageId: selectedPackageId,
                })
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="rounded-[24px] bg-white p-6 shadow-[0_8px_24px_rgba(18,28,42,0.04)]">
              {totalReviews > 0 || isReviewsLoading ? (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-[family-name:var(--font-headline)] text-xl font-bold text-[#121c2a]">
                      Customer Reviews
                    </h3>
                    <div className="flex items-center gap-2">
                      {isReviewsLoading && (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#004ac6] border-t-transparent" />
                      )}
                      <span className="text-xs font-medium text-[#737686]">
                        {totalReviews} total
                      </span>
                    </div>
                  </div>

                  <div
                    className={`custom-scrollbar flex max-h-[500px] flex-col gap-4 overflow-y-auto pr-2 transition-opacity duration-200 ${isReviewsLoading ? 'opacity-50' : 'opacity-100'}`}
                  >
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-[20px] border border-[#eff4ff] bg-[#f8f9ff] p-5 transition-colors hover:border-[#dee9fc]"
                      >
                        <div className="mb-3 flex items-center gap-1 text-[#f9bd22]">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                          {[...Array(5 - review.rating)].map((_, i) => (
                            <Star key={`empty-${i}`} className="h-4 w-4 text-[#d7dce5]" />
                          ))}
                        </div>

                        <blockquote className="mb-5 text-[15px] leading-relaxed text-[#434655] italic">
                          &ldquo;{review.comment}&rdquo;
                        </blockquote>

                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dee9fc] text-sm font-bold text-[#004ac6]">
                            {review.reviewer?.full_name?.charAt(0) || 'U'}
                          </div>

                          <div className="flex flex-col">
                            <span className="font-semibold text-[#121c2a]">
                              {review.reviewer?.full_name}
                            </span>
                            <span className="text-xs text-[#737686]">
                              {new Date(review.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 flex items-center justify-between border-t border-[#eff4ff] pt-6">
                    <button
                      disabled={reviewPage === 1 || isReviewsLoading}
                      onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
                      className="flex items-center gap-2 rounded-xl border border-[#dee9fc] px-4 py-2 text-sm font-medium text-[#004ac6] transition-all hover:bg-[#f0f5ff] disabled:pointer-events-none disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#737686]">
                        Page <span className="text-[#121c2a]">{reviewPage}</span> of {totalPages}
                      </span>
                    </div>

                    <button
                      disabled={!hasNextPage || isReviewsLoading}
                      onClick={() => setReviewPage((p) => p + 1)}
                      className="flex items-center gap-2 rounded-xl border border-[#dee9fc] px-4 py-2 text-sm font-medium text-[#004ac6] transition-all hover:bg-[#f0f5ff] disabled:pointer-events-none disabled:opacity-40"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center py-12 text-center text-[#737686]">
                  No reviews yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
