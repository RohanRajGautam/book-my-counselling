'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Building2, Check, ChevronRight, Globe, Link, X, CalendarPlus } from 'lucide-react'
import { toast } from 'sonner'

import { ProfileModalSkeleton } from '@/components/ui/skeleton'
import { AvailabilityPicker } from '@/features/availability/components/AvailabilityPicker'
import { useMentorAvailability } from '@/features/availability/hooks/useMentorAvailability'
import { getInitials } from '@/features/mentors/components/MentorCard'
import { useMentor } from '@/features/mentors/hooks/useMentor'
import { displayTagName } from '@/features/mentors/utils/mentors.utils'
import { MentorReviewsSection } from '@/features/reviews/components/MentorReviewsSection'
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
  /**
   * Analytics / behavior tag forwarded to `/booking` via the `source` URL
   * param. Defaults to `'coach-for-freshers'` because that's the modal's home
   * context; callers that surface it elsewhere (e.g. the homepage Featured
   * Mentors row) should pass a tag that matches the surface they came from.
   */
  source?: string
}

export function CoachForFreshersProfileModal({
  mentorId,
  onClose,
  source = 'coach-for-freshers',
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
  const avatarUrl = mentor?.user?.avatar_url ?? null
  const companyLogoUrl = mentor?.company_logo_url ?? null
  const companyName = mentor?.company ?? null
  const hasCompany = Boolean(companyLogoUrl || companyName)
  const firstName = mentor?.user?.full_name?.split(' ')[0] ?? 'this coach'
  const bioText = (mentor?.bio ?? '').replace(/\n+/g, '\n')
  const bioFallback =
    'Choose a package and time for focused guidance on CVs, interviews, and first-job readiness.'
  const linkedinHref = mentor?.linkedin_url || '#'
  const portfolioHref = mentor?.website_url || '#'
  const isLoading = isMentorLoading || isPackagesLoading || isAvailabilityLoading
  const ctaLabel = !selectedPackage
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
      source,
    })

    if (selection.parentSlotId) {
      params.set('slotId', selection.parentSlotId)
    }

    router.push(`/booking?${params.toString()}`)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#27313f]/40 p-3 backdrop-blur-[12px] sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative grid max-h-[calc(100dvh-1.5rem)] w-full max-w-7xl grid-cols-1 gap-3 overflow-y-auto overscroll-contain rounded-3xl bg-[#f8f9ff] p-4 sm:max-h-[calc(100dvh-2rem)] sm:gap-4 sm:rounded-3xl sm:p-6 lg:grid-cols-12 lg:gap-6 lg:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="fixed top-3 right-3 z-[60] flex size-11 items-center justify-center rounded-lg bg-white/95 text-[#434655] transition-colors hover:bg-[#dee9fc] sm:top-5 sm:right-5"
          aria-label="Close booking details"
        >
          <X className="size-6" />
        </button>

        {isLoading || !mentor ? (
          <ProfileModalSkeleton />
        ) : (
          <>
            <div className="flex flex-col gap-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:gap-5 sm:pb-[calc(6rem+env(safe-area-inset-bottom))] lg:col-span-4 lg:pb-[7rem]">
              <div className="relative overflow-hidden rounded-3xl">
                {/* Cover — blue gradient banner behind the profile image */}
                <div className="h-32 bg-[linear-gradient(180deg,#002875_0%,#004ac6_55%,#2563eb_100%)] sm:h-36" />
                <div className="px-5 pb-5 text-center sm:px-6 sm:pb-6 lg:px-7 lg:pb-7">
                  <div className="relative mx-auto -mt-14 mb-5 size-28 rounded-full ring-4 ring-white ring-offset-4 ring-offset-[#0053db]/10 sm:-mt-16">
                    <div className="size-full overflow-hidden rounded-full">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={`${mentor.user.full_name} profile`}
                          width={112}
                          height={112}
                          className="size-full rounded-full object-cover"
                        />
                      ) : (
                        <div
                          aria-label={`${mentor.user?.full_name} profile initials`}
                          className="flex size-full items-center justify-center rounded-full bg-[#e6eeff] text-5xl font-extrabold text-[#004ac6]"
                        >
                          {initials}
                        </div>
                      )}
                    </div>
                    {mentor.is_verified && (
                      <div
                        className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border-[3px] border-white bg-green-700"
                        aria-label="Verified profile"
                        title="Verified profile"
                      >
                        <Check className="size-4 text-white" strokeWidth={4} aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <h2 className="mb-2 font-[family-name:var(--font-headline)] text-3xl leading-[1.05] font-extrabold tracking-tight text-[var(--foreground)] sm:text-3xl">
                    {mentor.user?.full_name}
                  </h2>
                  <p className="mx-auto mb-4 max-w-[320px] text-base leading-7 font-medium text-[#434655]">
                    {mentor.title}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={linkedinHref}
                      target={mentor.linkedin_url ? '_blank' : undefined}
                      aria-disabled={!mentor.linkedin_url}
                      onClick={(event) => {
                        if (!mentor.linkedin_url) event.preventDefault()
                      }}
                      className={`flex items-center justify-center gap-2 rounded-2xl bg-[#eff4ff] px-4 py-3 text-sm font-bold text-[#434655] transition-colors hover:bg-[#dee9fc] ${
                        !mentor.linkedin_url ? 'cursor-not-allowed opacity-55' : ''
                      }`}
                    >
                      <Link className="size-5" />
                      LinkedIn
                    </a>
                    <a
                      href={portfolioHref}
                      target={mentor.website_url ? '_blank' : undefined}
                      aria-disabled={!mentor.website_url}
                      onClick={(event) => {
                        if (!mentor.website_url) event.preventDefault()
                      }}
                      className={`flex items-center justify-center gap-2 rounded-2xl bg-[#eff4ff] px-4 py-3 text-sm font-bold text-[#434655] transition-colors hover:bg-[#dee9fc] ${
                        !mentor.website_url ? 'cursor-not-allowed opacity-55' : ''
                      }`}
                    >
                      <Globe className="size-5" />
                      Portfolio
                    </a>
                  </div>
                </div>

                {/* Company — inline block, no card wrapper */}
                {hasCompany ? (
                  <>
                    <div className="my-6 border-t border-slate-100" />
                    <div className="px-5 sm:px-6 lg:px-7">
                      <h3 className="mb-1 font-[family-name:var(--font-headline)] text-base font-bold text-[#121c2a] sm:text-lg">
                        Current Company
                      </h3>
                      <div className="flex items-center gap-4" data-testid="mentor-company-block">
                        <div className="mt-2 flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border-[3px]">
                          {companyLogoUrl ? (
                            <Image
                              src={companyLogoUrl}
                              alt={companyName ? `${companyName} logo` : 'Company logo'}
                              width={34}
                              height={34}
                              className="size-full object-contain"
                              unoptimized
                            />
                          ) : (
                            <Building2 className="size-7 text-[#737686]" aria-hidden />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="mt-1 truncate font-[family-name:var(--font-headline)] text-base font-semibold text-[#121c2a] sm:text-lg">
                            {companyName || '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}

                {/* Services — no card wrapper, sits inside unified surface */}
                <div className={hasCompany ? 'mt-6' : 'mt-6 border-t border-slate-100 pt-6'}>
                  <div className="px-5 sm:px-6 lg:px-7">
                    <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
                      <h3 className="font-[family-name:var(--font-headline)] text-base font-bold text-[#121c2a] sm:text-lg">
                        Services offered
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {mentor.tags.length > 0 ? (
                        mentor.tags.map((tag) => (
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
                </div>
              </div>

              {hasAvailability ? (
                <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-7xl bg-[#f8f9ff]/95 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-[8px] sm:inset-x-4 sm:rounded-b-[32px] lg:inset-x-auto lg:bottom-5 lg:left-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:z-30 lg:w-[calc((min(100vw,80rem)-4rem-1.5rem)*4/12)] lg:max-w-none lg:rounded-3xl lg:bg-[#f8f9ff]/90 lg:p-3 lg:pt-3 lg:backdrop-blur-md">
                  <button
                    type="button"
                    disabled={!canBook}
                    onClick={handleBook}
                    className="block w-full rounded-[24px] bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-6 py-3.5 text-center font-[family-name:var(--font-headline)] text-base font-bold text-white transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:hover:scale-100 sm:px-8 sm:py-4 sm:text-lg"
                  >
                    {ctaLabel}
                  </button>
                </div>
              ) : null}
            </div>

            <section className="flex flex-col gap-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:gap-5 sm:pb-[calc(6rem+env(safe-area-inset-bottom))] lg:col-span-8 lg:gap-6 lg:pb-0">
              <div className="rounded-3xl bg-white p-5 sm:p-6 lg:p-8">
                {/* About */}
                <section>
                  <h3 className="mb-3 font-[family-name:var(--font-headline)] text-xl font-bold text-[#121c2a] sm:text-2xl">
                    About Mentor
                  </h3>
                  <p className="text-base leading-7 font-medium whitespace-pre-line text-[#434655] sm:leading-8">
                    {bioText || bioFallback}
                  </p>
                </section>

                {/* Divider */}
                <div className="my-6 border-t border-slate-100" />

                {/* Packages */}
                <section>
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
                            className={`group relative cursor-pointer overflow-hidden rounded-3xl p-5 text-left ring-1 transition-all ring-inset ${
                              isSelected
                                ? 'bg-[#004ac6] text-white ring-[#004ac6]'
                                : 'bg-[#f8f9ff] ring-[#eff4ff] hover:bg-[#eff4ff]/70'
                            }`}
                          >
                            {index === 1 && (
                              <div
                                className={`absolute top-0 right-0 rounded-tr-3xl rounded-bl-xl px-3 py-1 text-[10px] font-bold ${
                                  isSelected
                                    ? 'bg-white/20 text-white'
                                    : 'bg-[#6cf8bb] text-[#00714d]'
                                }`}
                              >
                                Popular
                              </div>
                            )}
                            <h4
                              className={`mb-1 font-[family-name:var(--font-headline)] text-lg font-bold ${
                                isSelected ? 'text-white' : 'text-[#121c2a]'
                              }`}
                            >
                              {servicePackage.title}
                            </h4>
                            <p
                              className={`mb-5 text-sm font-semibold ${
                                isSelected ? 'text-white/80' : 'text-[#434655]'
                              }`}
                            >
                              {servicePackage.duration_minutes} minutes
                            </p>
                            <div
                              className={`font-[family-name:var(--font-headline)] text-2xl font-extrabold ${
                                isSelected ? 'text-white' : 'text-[#004ac6]'
                              }`}
                            >
                              NPR {Number(servicePackage.price)}
                            </div>
                          </button>
                        )
                      })
                    ) : (
                      <div className="col-span-full rounded-2xl bg-[#f8f9ff] p-5 text-center text-sm font-semibold text-[#737686]">
                        No active packages are available for this coach yet.
                      </div>
                    )}
                  </div>
                </section>

                {/* Divider */}
                <div className="my-6 border-t border-slate-100" />

                {/* Availability */}
                <section>
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
                        className="absolute inset-0 z-10 cursor-not-allowed rounded-2xl bg-transparent"
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
                      className="animated-border-card group mt-4 flex h-[144px] w-full items-center justify-between gap-3 rounded-xl px-8 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm">
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
                </section>

                {/* Divider */}
                <div className="my-6 border-t border-slate-100" />

                {/* Reviews */}
                <section>
                  <MentorReviewsSection mentorId={resolvedMentorId} />
                </section>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
