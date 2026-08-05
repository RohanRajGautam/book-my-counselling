'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { X, Check, Link, Globe, ChevronRight, CalendarPlus, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { useMentorProfile } from '@/features/mentors/hooks/useMentorProfile'
import { useMentorAvailability } from '@/features/availability/hooks/useMentorAvailability'
import { useMentorPackages } from '@/features/service-packages/hooks/useMentorPackages'
import { MentorReviewsSection } from '@/features/reviews/components/MentorReviewsSection'
import { getInitials } from '@/features/mentors/components/MentorCard'
import { displayTagName } from '@/features/mentors/utils/mentors.utils'
import { AvailabilityPicker } from '@/features/availability/components/AvailabilityPicker'
import { COACH_FOR_FRESHERS_SERVICE_SLUGS } from '@/features/coach-for-freshers/types/coach-for-freshers.types'

interface Props {
  isOpen: boolean
  onClose: () => void
  mentorId: string
}

export function AcademicCounsellorProfileModal({ isOpen, onClose, mentorId }: Props) {
  const router = useRouter()
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

  const { data: mentor, isPending: isMentorLoading } = useMentorProfile(isOpen ? mentorId : null, {
    isAcademicCounselor: true,
  })
  const resolvedMentorId = mentor?.id ?? null
  const { data: fetchedPackages = [], isPending: isPackagesLoading } = useMentorPackages(
    isOpen ? resolvedMentorId : null
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
              mentor_id: resolvedMentorId ?? '',
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
              mentor_id: resolvedMentorId ?? '',
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
              mentor_id: resolvedMentorId ?? '',
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
    isOpen ? resolvedMentorId : null
  )

  const initials = getInitials(mentor?.user?.full_name || '')
  const avatarUrl = mentor?.user?.avatar_url ?? null
  const companyLogoUrl = mentor?.company_logo_url ?? null
  const companyName = mentor?.company ?? null
  const hasCompany = Boolean(companyLogoUrl || companyName)

  // Coach for Freshers service tags (Career Clarity Roadmap, First-Job CV
  // Builder, Mock Interview Lab) belong to the CFF page only — hide them
  // here so the academic modal doesn't show a tag the mentor never opted
  // into for academic counselling.
  const services = (mentor?.tags ?? []).filter(
    (tag) => !COACH_FOR_FRESHERS_SERVICE_SLUGS.includes(tag.slug)
  )
  const selectedSlotId = selection.mentorId === resolvedMentorId ? selection.slicedSlotId : null
  const selectedParentSlotId =
    selection.mentorId === resolvedMentorId ? selection.parentSlotId : null
  const selectedSessionStart =
    selection.mentorId === resolvedMentorId ? selection.sessionStart : null
  const selectedSessionEnd = selection.mentorId === resolvedMentorId ? selection.sessionEnd : null
  const selectedPackageId = selection.mentorId === resolvedMentorId ? selection.packageId : null
  const linkedinHref = mentor?.linkedin_url || '#'
  const portfolioHref = mentor?.website_url || '#'
  const hasAvailability = availability.length > 0
  const ctaLabel = !selectedPackageId
    ? 'Choose a Package'
    : !selectedSlotId
      ? 'Choose a Time Slot'
      : 'Book a Session'
  const canBook = Boolean(
    resolvedMentorId && selectedSlotId && selectedPackageId && hasAvailability
  )
  const bioText = (mentor?.bio ?? '').replace(/\n+/g, '\n')
  const bioFallback = `${mentor?.user?.full_name ?? 'This mentor'} is an experienced ${mentor?.title ?? 'mentor'} passionate about mentoring professionals.`

  const isInitialLoading = isMentorLoading || isPackagesLoading || isAvailabilityLoading

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (!isOpen) return
    window.addEventListener('keydown', handleEsc)
    const previousOverflow = document.body.style.overflow
    const previousTouchAction = document.body.style.touchAction
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = previousOverflow
      document.body.style.touchAction = previousTouchAction
    }
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#27313f]/40 p-3 backdrop-blur-[12px] sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative grid max-h-[calc(100dvh-1.5rem)] w-full max-w-7xl grid-cols-1 gap-4 overflow-y-auto overscroll-contain rounded-[24px] bg-[#f8f9ff] p-4 shadow-[0_16px_48px_rgba(18,28,42,0.12)] sm:max-h-[calc(100dvh-2rem)] sm:gap-5 sm:rounded-[32px] sm:p-6 lg:grid-cols-12 lg:gap-6 lg:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="fixed top-3 right-3 z-[60] flex size-11 items-center justify-center rounded-full bg-white/95 text-[#434655] shadow-[0_8px_20px_rgba(18,28,42,0.14)] transition-colors hover:bg-[#dee9fc] sm:top-5 sm:right-5"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        {/* LEFT COLUMN: Identity & Quick Actions */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:col-span-4">
          <div className="relative flex flex-col items-center overflow-hidden rounded-[24px] bg-white p-5 text-center shadow-[0_8px_24px_rgba(18,28,42,0.04)] sm:p-6 lg:p-7">
            <div className="absolute top-0 left-0 -z-0 h-28 w-full rounded-t-[24px] bg-[#eff4ff]"></div>
            <div className="relative z-10">
              <div className="relative mx-auto mb-5 h-28 w-28 rounded-full ring-4 ring-white ring-offset-4 ring-offset-[#0053db]/10">
                <div className="h-full w-full overflow-hidden rounded-full">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={`${mentor.user.full_name} profile`}
                      width={112}
                      height={112}
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
                {mentor.is_verified && (
                  <div
                    className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border-[3px] border-white bg-green-700 shadow-[0_8px_18px_rgba(0,83,219,0.24)]"
                    aria-label="Verified profile"
                    title="Verified profile"
                  >
                    <Check className="size-4 text-white" strokeWidth={4} aria-hidden="true" />
                  </div>
                )}
              </div>
              <h2 className="mb-2 font-[family-name:var(--font-headline)] text-2xl font-extrabold tracking-tight text-[#121c2a] sm:text-3xl">
                {mentor.user?.full_name}
              </h2>
              <p className="mx-auto mb-4 max-w-[320px] text-base leading-7 font-medium text-[#434655]">
                {mentor.title} {mentor.company && `at ${mentor.company}`}
              </p>

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

          {hasCompany ? (
            <div
              className="flex items-center gap-4 rounded-[24px] bg-white p-5 shadow-[0_8px_24px_rgba(18,28,42,0.04)] sm:p-6"
              data-testid="mentor-company-block"
            >
              <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-[3px] border-[#0053db]/15 bg-[#f8f9ff]">
                {companyLogoUrl ? (
                  <Image
                    src={companyLogoUrl}
                    alt={companyName ? `${companyName} logo` : 'Company logo'}
                    width={64}
                    height={64}
                    className="size-full object-contain"
                    unoptimized
                  />
                ) : (
                  <Building2 className="size-7 text-[#737686]" aria-hidden />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold tracking-[0.14em] text-[#737686] uppercase">
                  Company
                </p>
                <p className="mt-1 truncate font-[family-name:var(--font-headline)] text-base font-bold text-[#121c2a] sm:text-lg">
                  {companyName || '—'}
                </p>
              </div>
            </div>
          ) : null}

          <div className="flex h-[220px] flex-col rounded-[24px] bg-white p-5 shadow-[0_8px_24px_rgba(18,28,42,0.04)] sm:h-[250px] sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
              <h3 className="font-[family-name:var(--font-headline)] text-base font-bold text-[#121c2a] sm:text-lg">
                Services offered
              </h3>
              <span className="text-xs font-bold text-[#737686]">{services.length} total</span>
            </div>
            <div className="custom-scrollbar flex min-h-0 flex-1 flex-wrap content-start gap-2 overflow-y-auto pr-2 sm:gap-3">
              {services.length > 0 ? (
                services.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-[#e6eeff] px-4 py-2 text-[12px] font-extrabold text-[#004ac6]"
                  >
                    {displayTagName(tag.name)}
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

          {hasAvailability ? (
            <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-7xl bg-[#f8f9ff]/95 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_32px_rgba(18,28,42,0.12)] backdrop-blur-[8px] sm:inset-x-4 sm:rounded-b-[32px] lg:sticky lg:inset-auto lg:right-auto lg:bottom-4 lg:left-auto lg:z-30 lg:mx-0 lg:max-w-none lg:rounded-[24px] lg:bg-[#f8f9ff]/90 lg:p-3 lg:pt-3 lg:shadow-none lg:backdrop-blur-md">
              <button
                disabled={!canBook}
                onClick={() => {
                  if (
                    selectedPackageId &&
                    selectedParentSlotId &&
                    selectedSessionStart &&
                    selectedSessionEnd
                  ) {
                    router.push(
                      `/booking?mentorId=${resolvedMentorId}&packageId=${selectedPackageId}&slotId=${selectedParentSlotId}&sessionStart=${selectedSessionStart}&sessionEnd=${selectedSessionEnd}`
                    )
                  }
                }}
                className="block w-full rounded-[20px] bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-6 py-3.5 text-center font-[family-name:var(--font-headline)] text-base font-bold text-white shadow-lg shadow-[#004ac6]/20 transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:hover:scale-100 sm:px-8 sm:py-4 sm:text-lg"
              >
                {ctaLabel}
              </button>
            </div>
          ) : null}
        </div>

        {/* RIGHT COLUMN: Details Bento */}
        <div className="flex flex-col gap-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:gap-5 sm:pb-[calc(6rem+env(safe-area-inset-bottom))] lg:col-span-8 lg:gap-6 lg:pb-0">
          <div className="rounded-[24px] bg-white p-5 shadow-[0_8px_24px_rgba(18,28,42,0.04)] sm:p-6 lg:p-8">
            <h3 className="mb-3 font-[family-name:var(--font-headline)] text-xl font-bold text-[#121c2a] sm:text-2xl">
              About {mentor.user?.full_name?.split(' ')[0]}
            </h3>
            <p className="text-base leading-7 font-medium whitespace-pre-line text-[#434655] sm:leading-8">
              {bioText || bioFallback}
            </p>
          </div>

          <div className="rounded-[24px] bg-white p-5 shadow-[0_8px_24px_rgba(18,28,42,0.04)] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
              <div>
                <h3 className="font-[family-name:var(--font-headline)] text-lg font-bold text-[#121c2a] sm:text-xl">
                  Packages
                </h3>
                <p className="mt-1 text-sm font-medium text-[#737686]">
                  Select a package before choosing a time.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#e6eeff] px-3 py-1.5 text-xs font-extrabold text-[#004ac6]">
                Choose one
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
              {packages.length > 0 ? (
                packages.map((service, index) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() =>
                      setSelection({
                        mentorId: resolvedMentorId,
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

          <div className="rounded-[24px] bg-white p-5 shadow-[0_8px_24px_rgba(18,28,42,0.04)] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6 sm:gap-4">
              <div>
                <h3 className="font-[family-name:var(--font-headline)] text-lg font-bold text-[#121c2a] sm:text-xl">
                  Upcoming Availability
                </h3>
                <p className="mt-1 text-sm font-medium text-[#737686]">
                  Times are shown in your local timezone.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#e6eeff] px-3 py-1.5 text-xs font-extrabold text-[#004ac6]">
                {!hasAvailability
                  ? 'Unavailable'
                  : selectedPackageId
                    ? 'Choose a time'
                    : 'Choose a package first'}
              </span>
            </div>

            <div className="relative">
              <AvailabilityPicker
                slots={availability}
                disabled={!selectedPackageId}
                selectedSlotId={selectedSlotId}
                packageDurationMinutes={
                  packages.find((p) => p.id === selectedPackageId)?.duration_minutes
                }
                onSelect={(slicedSlotId, parentSlotId, startTime, endTime) =>
                  setSelection({
                    mentorId: resolvedMentorId,
                    slicedSlotId: selectedSlotId === slicedSlotId ? null : slicedSlotId,
                    parentSlotId: selectedSlotId === slicedSlotId ? null : parentSlotId,
                    sessionStart: selectedSlotId === slicedSlotId ? null : startTime,
                    sessionEnd: selectedSlotId === slicedSlotId ? null : endTime,
                    packageId: selectedPackageId,
                  })
                }
              />
              {!selectedPackageId && (
                <button
                  type="button"
                  aria-label="Choose a package before selecting availability"
                  onClick={() => toast.info('Please choose a package first.')}
                  className="absolute inset-0 z-10 cursor-not-allowed rounded-[16px] bg-transparent"
                />
              )}
            </div>

            {resolvedMentorId ? (
              <button
                type="button"
                onClick={() => {
                  // Close the profile modal first, then push the dedicated
                  // request page so the user lands on a clean full-screen
                  // form instead of a nested popup-on-popup stack.
                  onClose()
                  router.push(`/request-availability?mentorId=${resolvedMentorId}`)
                }}
                className="animated-border-card group mt-4 flex h-[144px] w-full items-center justify-between gap-3 rounded-lg px-4 text-left shadow-[0_8px_24px_rgba(0,74,198,0.28)] sm:px-6 lg:px-8"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm">
                    <CalendarPlus className="size-5" strokeWidth={2.4} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-md font-[family-name:var(--font-headline)] font-extrabold text-white">
                      No slots available? or don&apos;t see a time that fits you?
                    </p>
                    <p className="mt-1 text-xs font-medium text-white/80">
                      Don&apos;t worry, now you can request your booking too.
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className="size-4 shrink-0 text-white transition group-hover:translate-x-0.5"
                  strokeWidth={2.4}
                />
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
            <MentorReviewsSection mentorId={resolvedMentorId} />
          </div>
        </div>
      </div>
    </div>
  )
}
