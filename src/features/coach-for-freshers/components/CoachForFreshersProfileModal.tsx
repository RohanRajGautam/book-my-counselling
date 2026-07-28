'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Check, ChevronRight, Globe, Link, X, CalendarPlus } from 'lucide-react'
import { toast } from 'sonner'

import { AvailabilityPicker } from '@/features/availability/components/AvailabilityPicker'
import { useMentorAvailability } from '@/features/availability/hooks/useMentorAvailability'
import { getInitials } from '@/features/mentors/components/MentorCard'
import { useMentor } from '@/features/mentors/hooks/useMentor'
import { displayTagName } from '@/features/mentors/utils/mentors.utils'
import { useMentorPackages } from '@/features/service-packages/hooks/useMentorPackages'

type BookingSelection = {
  packageId: string | null
  slicedSlotId: string | null
  parentSlotId: string | null
  sessionStart: string | null
  sessionEnd: string | null
}

type CoachForFreshersProfileModalProps = {
  mentorId: string | null
  onClose: () => void
}

export function CoachForFreshersProfileModal({
  mentorId,
  onClose,
}: CoachForFreshersProfileModalProps) {
  const router = useRouter()
  const [selection, setSelection] = useState<BookingSelection>({
    packageId: null,
    slicedSlotId: null,
    parentSlotId: null,
    sessionStart: null,
    sessionEnd: null,
  })

  const isOpen = Boolean(mentorId)
  const { data: mentor, isPending: isMentorLoading } = useMentor(isOpen ? mentorId : null)
  const resolvedMentorId = mentor?.id ?? mentorId
  const { data: packages = [], isPending: isPackagesLoading } = useMentorPackages(
    isOpen ? resolvedMentorId : null
  )
  const { data: availability = [], isPending: isAvailabilityLoading } = useMentorAvailability(
    isOpen ? resolvedMentorId : null
  )

  const activePackages = useMemo(
    () =>
      packages
        .filter((servicePackage) => servicePackage.is_active)
        .sort((a, b) => a.duration_minutes - b.duration_minutes),
    [packages]
  )
  const selectedPackage = activePackages.find((item) => item.id === selection.packageId) ?? null
  const hasAvailability = availability.length > 0
  const initials = getInitials(mentor?.user?.full_name ?? '')
  const firstName = mentor?.user?.full_name?.split(' ')[0] ?? 'this coach'
  const ratingLabel = Number(mentor?.average_rating || 0)
    .toFixed(1)
    .replace('.0', '')
  const hasRating = Number(mentor?.average_rating || 0) > 0
  const bioText = (mentor?.bio ?? '').replace(/\n+/g, '\n')
  const bioFallback =
    'Choose a package and time for focused guidance on CVs, interviews, and first-job readiness.'
  const linkedinHref = mentor?.linkedin_url || '#'
  const portfolioHref = mentor?.website_url || '#'
  const isLoading = isMentorLoading || isPackagesLoading || isAvailabilityLoading
  const ctaLabel = !hasAvailability
    ? 'Not Accepting Bookings'
    : !selectedPackage
      ? 'Choose a Package'
      : !selection.slicedSlotId
        ? 'Choose a Time Slot'
        : 'Book a Session'
  const canBook = Boolean(
    resolvedMentorId && selectedPackage && selection.slicedSlotId && hasAvailability
  )

  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBook = () => {
    if (!resolvedMentorId || !selectedPackage) return

    const sessionStart = selection.sessionStart
    const sessionEnd = selection.sessionEnd

    if (!sessionStart || !sessionEnd) {
      toast.info('Please choose a session time.')
      return
    }

    const params = new URLSearchParams({
      mentorId: resolvedMentorId,
      packageId: selectedPackage.id,
      sessionStart,
      sessionEnd,
      source: 'coach-for-freshers',
    })

    if (selection.parentSlotId) {
      params.set('slotId', selection.parentSlotId)
    }

    router.push(`/booking?${params.toString()}`)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#27313f]/40 backdrop-blur-[12px] sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="custom-scrollbar relative grid h-[94vh] w-full max-w-7xl touch-pan-y grid-cols-1 gap-4 overflow-y-auto overscroll-contain rounded-t-[24px] rounded-b-none bg-[#f8f9ff] p-4 pt-5 pb-32 shadow-[0_16px_48px_rgba(18,28,42,0.12)] sm:h-auto sm:max-h-[90vh] sm:gap-5 sm:rounded-[24px] sm:p-6 sm:pb-6 lg:grid-cols-12"
        style={{ WebkitOverflowScrolling: 'touch' }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="sticky top-0 right-0 z-[60] ml-auto -mb-11 flex size-11 items-center justify-center rounded-full bg-white/95 text-[#434655] shadow-[0_8px_20px_rgba(18,28,42,0.14)] transition-colors hover:bg-[#dee9fc] sm:absolute sm:top-5 sm:right-5 sm:ml-0 sm:mb-0"
          aria-label="Close booking details"
        >
          <X className="size-6" />
        </button>

        {isLoading || !mentor ? (
          <div className="h-[90vh] animate-pulse rounded-[24px] bg-white lg:col-span-12" />
        ) : (
          <>
            <div className="flex flex-col gap-4 sm:gap-5 lg:col-span-4">
              <div className="relative flex flex-col items-center overflow-hidden rounded-[20px] bg-white p-5 text-center shadow-[0_8px_24px_rgba(18,28,42,0.04)] sm:rounded-[24px] sm:p-7">
                <div className="absolute top-0 left-0 -z-0 h-24 w-full rounded-t-[20px] bg-[#eff4ff] sm:h-28 sm:rounded-t-[24px]" />
                <div className="relative z-10">
                  <div className="relative mx-auto mb-4 size-24 rounded-full ring-4 ring-white ring-offset-4 ring-offset-[#0053db]/10 sm:mb-5 sm:size-28">
                    <div className="size-full overflow-hidden rounded-full">
                      {mentor.user?.avatar_url ? (
                        <Image
                          src={mentor.user.avatar_url}
                          alt={`${mentor.user.full_name} profile`}
                          width={112}
                          height={112}
                          className="size-full rounded-full object-cover"
                        />
                      ) : (
                        <div
                          aria-label={`${mentor.user?.full_name} profile initials`}
                          className="flex size-full items-center justify-center rounded-full bg-[#e6eeff] text-4xl font-extrabold text-[#004ac6] sm:text-5xl"
                        >
                          {initials}
                        </div>
                      )}
                    </div>
                    {mentor.is_verified && (
                      <div
                        className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full border-[3px] border-white bg-green-700 shadow-[0_8px_18px_rgba(0,83,219,0.24)] sm:size-8"
                        aria-label="Verified profile"
                        title="Verified profile"
                      >
                        <Check className="size-3.5 text-white sm:size-4" strokeWidth={4} aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <h2 className="mb-1.5 font-[family-name:var(--font-headline)] text-xl font-extrabold tracking-tight text-[#121c2a] break-words sm:mb-2 sm:text-2xl lg:text-3xl">
                    {mentor.user?.full_name}
                  </h2>
                  <p className="mx-auto mb-4 max-w-[320px] text-sm leading-6 font-medium break-words text-[#434655] sm:mb-5 sm:text-base sm:leading-7">
                    {mentor.title} {mentor.company && `at ${mentor.company}`}
                  </p>

                  <div
                    className={`mb-4 grid overflow-hidden rounded-[16px] bg-[#f8f9ff] ring-1 ring-[#eff4ff] sm:mb-5 sm:rounded-[20px] ${
                      hasRating ? 'grid-cols-2' : 'grid-cols-1'
                    }`}
                  >
                    {hasRating && (
                      <div className="px-3 py-3 sm:py-3.5">
                        <p className="font-[family-name:var(--font-headline)] text-base font-extrabold text-[#121c2a] sm:text-lg">
                          {ratingLabel}
                        </p>
                        <p className="text-[11px] font-bold text-[#737686]">Rating</p>
                      </div>
                    )}
                    <div className={`${hasRating ? 'border-l border-[#eff4ff]' : ''} px-3 py-3 sm:py-3.5`}>
                      <p className="font-[family-name:var(--font-headline)] text-base font-extrabold text-[#121c2a] sm:text-lg">
                        {mentor.total_reviews}
                      </p>
                      <p className="text-[11px] font-bold text-[#737686]">Reviews</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <a
                      href={linkedinHref}
                      target={mentor.linkedin_url ? '_blank' : undefined}
                      aria-disabled={!mentor.linkedin_url}
                      onClick={(event) => {
                        if (!mentor.linkedin_url) event.preventDefault()
                      }}
                      className={`flex min-h-[48px] items-center justify-center gap-2 rounded-[14px] bg-[#eff4ff] px-3 py-3 text-sm font-bold text-[#434655] transition-colors hover:bg-[#dee9fc] sm:rounded-[16px] sm:px-4 ${
                        !mentor.linkedin_url ? 'cursor-not-allowed opacity-55' : ''
                      }`}
                    >
                      <Link className="size-5 shrink-0" />
                      LinkedIn
                    </a>
                    <a
                      href={portfolioHref}
                      target={mentor.website_url ? '_blank' : undefined}
                      aria-disabled={!mentor.website_url}
                      onClick={(event) => {
                        if (!mentor.website_url) event.preventDefault()
                      }}
                      className={`flex min-h-[48px] items-center justify-center gap-2 rounded-[14px] bg-[#eff4ff] px-3 py-3 text-sm font-bold text-[#434655] transition-colors hover:bg-[#dee9fc] sm:rounded-[16px] sm:px-4 ${
                        !mentor.website_url ? 'cursor-not-allowed opacity-55' : ''
                      }`}
                    >
                      <Globe className="size-5 shrink-0" />
                      Portfolio
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex min-h-[180px] flex-col rounded-[20px] bg-white p-5 shadow-[0_8px_24px_rgba(18,28,42,0.04)] sm:rounded-[24px] sm:p-6">
                <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
                  <h3 className="font-[family-name:var(--font-headline)] text-base font-bold text-[#121c2a] sm:text-lg">
                    Services offered
                  </h3>
                  <span className="text-xs font-bold text-[#737686]">
                    {mentor.tags.length} total
                  </span>
                </div>
                <div className="custom-scrollbar flex min-h-0 flex-1 flex-wrap content-start gap-2 overflow-y-auto pr-2 sm:gap-3">
                  {mentor.tags.length > 0 ? (
                    mentor.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded-full bg-[#e6eeff] px-3.5 py-1.5 text-[12px] font-extrabold text-[#004ac6] sm:px-4 sm:py-2"
                      >
                        {displayTagName(tag.name)}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full bg-[#e6eeff] px-3.5 py-1.5 text-sm font-extrabold text-[#004ac6] sm:px-4 sm:py-2">
                      Mentorship
                    </span>
                  )}
                </div>
              </div>

              <div
                className="fixed right-0 bottom-0 left-0 z-20 mx-auto max-w-7xl bg-[#f8f9ff]/95 px-4 pt-3 shadow-[0_-12px_32px_rgba(18,28,42,0.12)] backdrop-blur-[8px] lg:sticky lg:right-auto lg:bottom-0 lg:left-auto lg:z-auto lg:mx-0 lg:max-w-none lg:rounded-[24px] lg:px-3 lg:pt-3 lg:border-t-0 lg:bg-[#f8f9ff]/90 lg:shadow-none"
                style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
              >
                <button
                  type="button"
                  disabled={!canBook}
                  onClick={handleBook}
                  className="block w-full rounded-[18px] bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-6 py-3.5 text-center font-[family-name:var(--font-headline)] text-base font-bold text-white shadow-lg shadow-[#004ac6]/20 transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:hover:scale-100 sm:rounded-[20px] sm:px-8 sm:py-4 sm:text-lg"
                >
                  {ctaLabel}
                </button>
              </div>
            </div>

            <section className="flex flex-col gap-4 sm:gap-5 lg:col-span-8">
              <div className="rounded-[20px] bg-white p-5 shadow-[0_8px_24px_rgba(18,28,42,0.04)] sm:rounded-[24px] sm:p-6 lg:p-7">
                <h3 className="mb-2.5 font-[family-name:var(--font-headline)] text-lg font-bold text-[#121c2a] break-words sm:mb-3 sm:text-xl lg:text-2xl">
                  About {firstName}
                </h3>
                <p className="text-sm leading-7 font-medium whitespace-pre-line text-[#434655] sm:text-base sm:leading-8">
                  {bioText || bioFallback}
                </p>
              </div>

              <div className="rounded-[20px] bg-white p-5 shadow-[0_8px_24px_rgba(18,28,42,0.04)] sm:rounded-[24px] sm:p-6">
                <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-[family-name:var(--font-headline)] text-base font-bold text-[#121c2a] sm:text-xl">
                      Packages
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-[#737686] sm:mt-1 sm:text-sm">
                      Select a package before choosing a time.
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-[#e6eeff] px-3 py-1 text-[11px] font-extrabold text-[#004ac6] sm:py-1.5 sm:text-xs">
                    Choose one
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
                  {activePackages.length > 0 ? (
                    activePackages.map((servicePackage, index) => {
                      const isSelected = selection.packageId === servicePackage.id
                      return (
                        <button
                          key={servicePackage.id}
                          type="button"
                          onClick={() =>
                            setSelection({
                              packageId: isSelected ? null : servicePackage.id,
                              slicedSlotId: null,
                              parentSlotId: null,
                              sessionStart: null,
                              sessionEnd: null,
                            })
                          }
                          className={`group relative cursor-pointer overflow-hidden rounded-[18px] p-4 text-left shadow-[0_8px_24px_rgba(18,28,42,0.04)] ring-1 transition-all ring-inset sm:rounded-[24px] sm:p-5 ${
                            isSelected
                              ? 'bg-[#004ac6] text-white ring-[#004ac6]'
                              : 'bg-[#f8f9ff] ring-[#eff4ff] hover:bg-[#eff4ff]/70'
                          }`}
                        >
                          {index === 1 && (
                            <div
                              className={`absolute top-0 right-0 rounded-tr-[18px] rounded-bl-[10px] px-2.5 py-0.5 text-[10px] font-bold sm:rounded-tr-[24px] sm:rounded-bl-[12px] sm:px-3 sm:py-1 ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-[#6cf8bb] text-[#00714d]'
                              }`}
                            >
                              Popular
                            </div>
                          )}
                          <h4
                            className={`mb-1 font-[family-name:var(--font-headline)] text-base font-bold sm:text-lg ${
                              isSelected ? 'text-white' : 'text-[#121c2a]'
                            }`}
                          >
                            {servicePackage.title}
                          </h4>
                          <p
                            className={`mb-4 text-xs font-semibold sm:mb-5 sm:text-sm ${
                              isSelected ? 'text-white/80' : 'text-[#434655]'
                            }`}
                          >
                            {servicePackage.duration_minutes} minutes
                          </p>
                          <div
                            className={`font-[family-name:var(--font-headline)] text-xl font-extrabold sm:text-2xl ${
                              isSelected ? 'text-white' : 'text-[#004ac6]'
                            }`}
                          >
                            NPR {Number(servicePackage.price)}
                          </div>
                        </button>
                      )
                    })
                  ) : (
                    <div className="col-span-full rounded-[16px] bg-[#f8f9ff] p-4 text-center text-xs font-semibold text-[#737686] sm:p-5 sm:text-sm">
                      No active packages are available for this coach yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[20px] bg-white p-5 shadow-[0_8px_24px_rgba(18,28,42,0.04)] sm:rounded-[24px] sm:p-6">
                <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-[family-name:var(--font-headline)] text-base font-bold text-[#121c2a] sm:text-xl">
                      Upcoming Availability
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-[#737686] sm:mt-1 sm:text-sm">
                      Times are shown in your local timezone.
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-[#e6eeff] px-3 py-1 text-[11px] font-extrabold text-[#004ac6] sm:py-1.5 sm:text-xs">
                    {!hasAvailability
                      ? 'Unavailable'
                      : selectedPackage
                        ? 'Choose a time'
                        : 'Choose a package first'}
                  </span>
                </div>

                <div className="relative">
                  <AvailabilityPicker
                    slots={availability}
                    disabled={!selection.packageId}
                    selectedSlotId={selection.slicedSlotId}
                    packageDurationMinutes={selectedPackage?.duration_minutes}
                    onSelect={(slicedSlotId, parentSlotId, startTime, endTime) =>
                      setSelection((current) => ({
                        packageId: current.packageId,
                        slicedSlotId: current.slicedSlotId === slicedSlotId ? null : slicedSlotId,
                        parentSlotId: current.slicedSlotId === slicedSlotId ? null : parentSlotId,
                        sessionStart: current.slicedSlotId === slicedSlotId ? null : startTime,
                        sessionEnd: current.slicedSlotId === slicedSlotId ? null : endTime,
                      }))
                    }
                  />
                  {!selection.packageId && (
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
                      onClose()
                      router.push(
                        `/request-availability?mentorId=${resolvedMentorId}&source=coach-for-freshers`
                      )
                    }}
                    className="animated-border-card group mt-4 flex w-full flex-col items-center gap-3 rounded-[16px] p-8 text-center shadow-[0_8px_24px_rgba(0,74,198,0.28)]"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm">
                      <CalendarPlus className="size-5" strokeWidth={2.4} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-[family-name:var(--font-headline)] text-sm font-extrabold text-white">
                        No slots available? Or don&apos;t see a time that works for you?
                      </p>
                      <p className="mt-1 text-xs font-medium text-white/80">
                        Don&apos;t worry, now you can request your booking too.
                      </p>
                    </div>
                    <ChevronRight
                      className="size-4 shrink-0 text-white transition group-hover:translate-x-0.5"
                      strokeWidth={2.4}
                    />
                  </button>
                ) : null}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
