'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import {
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Hash,
  Loader2,
  Mail,
  TimerReset,
  Video,
  X,
} from 'lucide-react'

import { getInitials } from '@/features/mentors/components/MentorCard'
import { formatJoinCountdown, isMeetingJoinable } from '@/features/meetings/lib/meetingFormat'

type Mentor = {
  name: string
  title: string
  imageUrl?: string | null
}

type Session = {
  type: string
  duration: string
  startTime?: string | null
  endTime?: string | null
}

interface BookingCompleteModalProps {
  open: boolean
  onClose: () => void
  bookingId: string | null
  mentor: Mentor | null
  session: Session | null
  price: number
  priceLabel?: string
  breakdown?: {
    original: string
    discount: string
    final: string
    code: string
  }
  /** True when the booking was confirmed for free via a 100%-off promo. */
  freeBooking?: boolean
  /**
   * Auto-generated Google Meet link for this booking. `null` (or omitted)
   * while the backend is still creating the meeting, or when the meeting
   * provider is disabled. The modal renders the meeting block only when at
   * least one of `meetingLink`, `meetingPreparing`, `meetingErrorFallback`
   * is set — leaving all three off is how the parent opts out for the
   * `MEETING_PROVIDER=disabled` case.
   */
  meetingLink?: string | null
  /** True while the parent is polling for the link. Renders a skeleton. */
  meetingPreparing?: boolean
  /**
   * True after polling gave up (5 attempts, no link, no error).
   * Renders a softer "we'll email you" message so the modal never blocks.
   */
  meetingErrorFallback?: boolean
  /** Display label — "Google Meet" today; future-proofed for new providers. */
  meetingProviderLabel?: string
}

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: 'easeOut', delay: 0.05 },
  },
  exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.15 } },
}

const checkBadgeVariants: Variants = {
  hidden: { scale: 0.6, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: 'easeOut', delay: 0.2 } },
}

const checkDrawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut', delay: 0.4 },
  },
}

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut', delay: 0.3 + i * 0.05 },
  }),
}

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, delay: 0.55 } },
}

function buildSessionDateTime(session: Session) {
  if (!session.startTime || !session.endTime) return null
  const start = new Date(session.startTime)
  const end = new Date(session.endTime)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null

  const date = start.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const startTime = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  const endTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  return { date, time: `${startTime} - ${endTime}` }
}

export function BookingCompleteModal({
  open,
  onClose,
  bookingId,
  mentor,
  session,
  price,
  priceLabel,
  breakdown,
  freeBooking = false,
  meetingLink,
  meetingPreparing,
  meetingErrorFallback,
  meetingProviderLabel = 'Google Meet',
}: BookingCompleteModalProps) {
  const router = useRouter()

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const sessionDateTime = session ? buildSessionDateTime(session) : null
  const initials = mentor ? getInitials(mentor.name) : ''
  const imageSrc = mentor?.imageUrl?.trim() || null
  const formattedPrice =
    priceLabel ?? `NPR ${price.toLocaleString('en-NP', { minimumFractionDigits: 2 })}`

  // Defer the "Join the meeting" CTA until the session is within Google's
  // 15-min early-join window. Snapshot of `now` — the modal mounts shortly
  // after payment, so the countdown is correct at that moment; if the user
  // keeps the modal open across the join window, closing + reopening (or
  // pulling the link from the emailed confirmation) is the fallback.
  const sessionStart = session?.startTime ?? null
  const joinable = isMeetingJoinable(sessionStart)
  const joinCountdown = joinable ? '' : formatJoinCountdown(sessionStart)
  const hasScheduledStart = !!sessionStart

  const handleCopyBookingId = async () => {
    if (!bookingId) return
    try {
      await navigator.clipboard.writeText(bookingId)
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  }

  const handleCopyMeetingLink = async () => {
    if (!meetingLink) return
    try {
      await navigator.clipboard.writeText(meetingLink)
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  }

  // Meeting block visibility — opt-in via any of these three signals. The
  // "MEETING_PROVIDER=disabled" case leaves all three off, so the block
  // doesn't render at all.
  const meetingBlockActive = !!meetingLink || !!meetingPreparing || !!meetingErrorFallback

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="booking-complete-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-complete-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 py-8 backdrop-blur-sm"
        >
          <button
            type="button"
            aria-label="Close booking confirmation"
            onClick={onClose}
            className="absolute inset-0 cursor-default"
          />

          <motion.div
            key="booking-complete-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-[1] w-full max-w-lg overflow-hidden rounded-[24px] bg-white shadow-[0_24px_60px_-18px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/70"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 grid size-8 place-items-center rounded-[24px] text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="size-4" />
            </button>

            <div className="flex flex-col items-center gap-3 px-6 pt-8 pb-6 text-center sm:px-8">
              <motion.div
                variants={checkBadgeVariants}
                initial="hidden"
                animate="visible"
                className="grid size-12 place-items-center rounded-[24px] bg-[var(--brand-blue-surface)] text-[var(--brand-blue)] ring-1 ring-[var(--brand-blue-soft)]"
              >
                <svg
                  viewBox="0 0 52 52"
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <motion.path
                    variants={checkDrawVariants}
                    initial="hidden"
                    animate="visible"
                    d="M14 27 L23 36 L40 18"
                  />
                </svg>
              </motion.div>

              <div>
                <h2
                  id="booking-complete-title"
                  className="font-[family-name:var(--font-headline)] text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl"
                >
                  Booking Confirmed
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {freeBooking
                    ? '100% off promo applied — see you in your session.'
                    : 'You’re all set — see you in your session.'}
                </p>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-100 px-6 py-5 sm:px-8">
              {mentor && (
                <motion.div
                  custom={0}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-3 rounded-[24px] bg-slate-50 p-3 ring-1 ring-slate-200/70"
                >
                  <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-[24px] ring-1 ring-slate-200">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={mentor.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[var(--brand-blue-soft)] text-sm font-extrabold text-[var(--brand-blue)]">
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-[family-name:var(--font-headline)] text-sm font-bold text-slate-950">
                      {mentor.name}
                    </p>
                    <p className="truncate text-xs text-[#434655]">{mentor.title}</p>
                  </div>
                </motion.div>
              )}

              {session && (
                <motion.div
                  custom={1}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  className="rounded-[24px] bg-white p-3 ring-1 ring-slate-200/70"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-[24px] bg-[var(--brand-blue-surface)] text-[var(--brand-blue)]">
                        <Video className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {session.type}
                        </p>
                        <p className="text-xs text-[#434655]">Session package</p>
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-[24px] bg-[var(--brand-blue-surface)] px-2 py-1 text-xs font-bold text-[var(--brand-blue)]">
                      <TimerReset className="size-3" />
                      {session.duration}
                    </span>
                  </div>

                  {sessionDateTime && (
                    <div className="mt-3 grid gap-2 border-t border-slate-100 pt-3 text-sm sm:grid-cols-2">
                      <div className="flex items-center gap-2 text-[#737686]">
                        <Calendar className="size-3.5 shrink-0 text-[var(--brand-blue)]" />
                        <span className="font-medium text-slate-950">{sessionDateTime.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#737686]">
                        <Clock className="size-3.5 shrink-0 text-[var(--brand-blue)]" />
                        <span className="font-medium text-slate-950">{sessionDateTime.time}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              <motion.div
                custom={2}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                className="rounded-[24px] bg-[var(--brand-blue-surface)] p-3 ring-1 ring-[var(--brand-blue-soft)]"
              >
                {breakdown ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm text-[#434655]">
                      <span>Original price</span>
                      <span className="font-semibold text-slate-950">
                        NPR {Number(breakdown.original).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-emerald-700">
                      <span>
                        Discount{' '}
                        <span className="ml-1 rounded-[24px] bg-white px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-700 uppercase ring-1 ring-emerald-200">
                          {breakdown.code}
                        </span>
                      </span>
                      <span className="font-semibold">
                        −NPR {Number(breakdown.discount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-[var(--brand-blue-soft)] pt-2">
                      <span className="text-sm font-semibold text-[#434655]">Total paid</span>
                      <span className="font-[family-name:var(--font-headline)] text-lg font-extrabold">
                        {freeBooking ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold tracking-wide text-emerald-700 uppercase ring-1 ring-emerald-200">
                            Free
                          </span>
                        ) : (
                          <span className="text-[var(--brand-blue)]">
                            NPR {Number(breakdown.final).toLocaleString()}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#434655]">Total paid</span>
                    <span className="font-[family-name:var(--font-headline)] text-lg font-extrabold text-[var(--brand-blue)]">
                      {formattedPrice}
                    </span>
                  </div>
                )}
              </motion.div>

              {meetingBlockActive && (
                <motion.div
                  custom={3}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  className="rounded-[24px] bg-[var(--brand-blue-surface)] p-3 ring-1 ring-[var(--brand-blue-soft)]"
                  aria-label="Meeting link"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-[24px] bg-white text-[var(--brand-blue)] ring-1 ring-[var(--brand-blue-soft)]">
                      <Video className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">Your meeting</p>
                      {meetingLink ? (
                        <p className="flex items-center gap-1.5 text-xs text-[#434655]">
                          <CheckCircle2 className="size-3 shrink-0 text-emerald-600" />
                          {meetingProviderLabel} · ready to join
                        </p>
                      ) : meetingErrorFallback ? (
                        <p className="text-xs text-[#434655]">
                          An admin will email you the link shortly.
                        </p>
                      ) : (
                        <p className="text-xs text-[#434655]">Preparing your meeting link…</p>
                      )}
                    </div>
                  </div>

                  {meetingLink ? (
                    <div className="mt-3 space-y-2 border-t border-[var(--brand-blue-soft)] pt-3">
                      {joinable ? (
                        <a
                          href={meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex w-full items-center justify-center gap-2 rounded-[24px] bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(7,85,216,0.18)] transition hover:from-[#003fa8] hover:to-[#1d4ed8]"
                        >
                          Join the meeting
                          <ExternalLink className="size-3.5" />
                        </a>
                      ) : (
                        <div
                          aria-disabled="true"
                          className="inline-flex w-full cursor-not-allowed flex-col items-center justify-center gap-0.5 rounded-[24px] bg-[var(--brand-blue-soft)] px-5 py-2.5 text-center"
                        >
                          <p className="flex items-center gap-2 text-sm font-bold text-[var(--brand-blue)]">
                            <Clock className="size-3.5" />
                            {joinCountdown || 'Not joinable yet'}
                          </p>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={handleCopyMeetingLink}
                        className="flex w-full items-center gap-2 truncate rounded-[24px] bg-white/70 px-3 py-2 text-left font-mono text-xs text-[var(--brand-blue)] ring-1 ring-[var(--brand-blue-soft)] transition hover:bg-white"
                      >
                        <span className="min-w-0 flex-1 truncate">{meetingLink}</span>
                        <Copy className="size-3 shrink-0" />
                      </button>
                      <p className="flex items-center gap-1.5 text-xs text-[#737686]">
                        <Mail className="size-3 shrink-0" />
                        We&apos;ve also emailed this link to your inbox.
                      </p>
                    </div>
                  ) : meetingErrorFallback ? (
                    <p className="mt-3 rounded-[24px] bg-white/70 px-3 py-2.5 text-xs leading-5 text-[#434655] ring-1 ring-[var(--brand-blue-soft)]">
                      An admin will email you the meeting link within a few minutes.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2 border-t border-[var(--brand-blue-soft)] pt-3">
                      <div
                        aria-disabled="true"
                        className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-[24px] bg-gradient-to-br from-[#004ac6]/60 to-[#2563eb]/60 px-5 py-2.5 text-sm font-bold text-white opacity-70"
                      >
                        <Loader2 className="size-3.5 animate-spin" />
                        Preparing…
                      </div>
                      <div className="h-3 w-3/4 animate-pulse rounded bg-white/70" />
                      <p className="text-xs text-[#737686]">This usually takes a few seconds.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {bookingId && (
                <motion.button
                  type="button"
                  onClick={handleCopyBookingId}
                  custom={4}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  whileTap={{ scale: 0.99 }}
                  className="group flex w-full items-center gap-3 rounded-[24px] bg-slate-50 px-3 py-2.5 text-left ring-1 ring-slate-200/70 transition hover:bg-slate-100"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-[24px] bg-white text-[var(--brand-blue)] ring-1 ring-slate-200">
                    <Hash className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold tracking-[0.1em] text-[#737686] uppercase">
                      Booking ID
                    </p>
                    <p className="truncate font-mono text-sm font-semibold text-slate-950">
                      {bookingId}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[var(--brand-blue)] opacity-0 transition group-hover:opacity-100">
                    <Copy className="size-3" />
                    Copy
                  </span>
                </motion.button>
              )}

              <motion.div
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-2 pt-2 sm:flex-row"
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="order-2 w-full rounded-[24px] border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-[#434655] transition hover:bg-slate-50 sm:order-1"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    router.push('/')
                  }}
                  className="order-1 w-full rounded-[24px] bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-5 py-2.5 text-sm font-bold text-white transition hover:from-[#003fa8] hover:to-[#1d4ed8] sm:order-2"
                >
                  Back to Home
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
