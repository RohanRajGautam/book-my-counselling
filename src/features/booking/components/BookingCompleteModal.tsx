'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { Check, Calendar, Clock, Copy, Hash, Sparkles, TimerReset, Video, X } from 'lucide-react'

import { getInitials } from '@/features/mentors/components/MentorCard'

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
}

const PALETTE = ['#004ac6', '#2563eb', '#60a5fa', '#22d3ee', '#6cf8bb', '#fde68a', '#fca5a5']

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 26, mass: 0.8, delay: 0.05 },
  },
  exit: { opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.2 } },
}

const checkBadgeVariants: Variants = {
  hidden: { scale: 0, rotate: -20 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 320, damping: 16, delay: 0.25 },
  },
}

const checkDrawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.45, ease: 'easeOut', delay: 0.55 },
  },
}

const pulseRingVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0.55 },
  visible: {
    scale: [1, 1.6, 1.6],
    opacity: [0.55, 0, 0],
    transition: { duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 0.6 },
  },
}

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut', delay: 0.4 + i * 0.06 },
  }),
}

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.85 } },
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

interface ConfettiPieceProps {
  index: number
}

function ConfettiPiece({ index }: ConfettiPieceProps) {
  const seeded = useMemo(() => {
    const angle = (index / 28) * Math.PI * 2
    const distance = 240 + (index % 7) * 18
    const drift = ((index * 47) % 90) - 45
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance * 0.8 + 80,
      rotate: (index * 73) % 360,
      delay: (index % 12) * 0.04,
      duration: 1.6 + (index % 5) * 0.2,
      drift,
      color: PALETTE[index % PALETTE.length],
      width: 6 + (index % 4) * 2,
      height: 10 + (index % 5) * 3,
      shape: index % 3,
    }
  }, [index])

  const initialY = -40
  const initialX = seeded.drift * 1.2

  return (
    <motion.span
      aria-hidden="true"
      initial={{ x: initialX, y: initialY, opacity: 1, rotate: 0 }}
      animate={{
        x: seeded.x + seeded.drift,
        y: seeded.y,
        opacity: [1, 1, 0],
        rotate: seeded.rotate,
      }}
      transition={{
        duration: seeded.duration,
        delay: seeded.delay,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      className="pointer-events-none absolute left-1/2 top-1/2 block origin-center"
      style={{
        width: seeded.width,
        height: seeded.height,
        background:
          seeded.shape === 0
            ? seeded.color
            : seeded.shape === 1
              ? `linear-gradient(135deg, ${seeded.color}, rgba(255,255,255,0.6))`
              : 'transparent',
        borderRadius: seeded.shape === 1 ? '999px' : '2px',
        border: seeded.shape === 2 ? `2px solid ${seeded.color}` : 'none',
        boxShadow: '0 4px 10px rgba(15, 23, 42, 0.12)',
      }}
    />
  )
}

export function BookingCompleteModal({
  open,
  onClose,
  bookingId,
  mentor,
  session,
  price,
  priceLabel,
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
  const formattedPrice = priceLabel ?? `NPR ${price.toLocaleString('en-NP', { minimumFractionDigits: 2 })}`

  const handleCopyBookingId = async () => {
    if (!bookingId) return
    try {
      await navigator.clipboard.writeText(bookingId)
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  }

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
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
        >
          <button
            type="button"
            aria-label="Close booking confirmation"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-[#0b1b3a]/55 backdrop-blur-md"
          />

          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {Array.from({ length: 28 }).map((_, i) => (
              <ConfettiPiece key={i} index={i} />
            ))}
          </div>

          <motion.div
            key="booking-complete-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-[1] w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-20px_rgba(15,23,42,0.45)] ring-1 ring-slate-200/60"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-white/80 text-slate-500 ring-1 ring-slate-200 transition hover:bg-white hover:text-slate-800"
            >
              <X className="size-4" />
            </button>

            <div className="relative overflow-hidden bg-gradient-to-br from-[#004ac6] via-[#2563eb] to-[#60a5fa] px-8 pb-12 pt-10 text-center text-white">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    'radial-gradient(circle at 20% 0%, rgba(255,255,255,0.6), transparent 45%), radial-gradient(circle at 80% 100%, rgba(108,248,187,0.5), transparent 55%)',
                }}
              />

              <div className="relative mx-auto mb-5 flex items-center justify-center">
                <motion.div
                  variants={pulseRingVariants}
                  initial="hidden"
                  animate="visible"
                  aria-hidden="true"
                  className="absolute size-24 rounded-full bg-white/30 blur-[2px]"
                />
                <motion.div
                  variants={pulseRingVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 1.2 }}
                  aria-hidden="true"
                  className="absolute size-24 rounded-full bg-white/25"
                />
                <motion.div
                  variants={checkBadgeVariants}
                  initial="hidden"
                  animate="visible"
                  className="relative grid size-24 place-items-center rounded-full bg-white text-[#004ac6] shadow-[0_18px_40px_rgba(0,74,198,0.45)] ring-4 ring-white/40"
                >
                  <svg
                    viewBox="0 0 52 52"
                    className="size-12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={5}
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
              </div>

              <motion.h2
                id="booking-complete-title"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.35 }}
                className="font-[family-name:var(--font-headline)] text-2xl font-bold tracking-tight sm:text-3xl"
              >
                Booking Confirmed!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.5 }}
                className="mt-2 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-white/85"
              >
                <Sparkles className="size-3.5 text-[#6cf8bb]" />
                You&rsquo;re all set — see you in your session.
              </motion.p>
            </div>

            <div className="space-y-4 px-6 py-6 sm:px-8">
              {mentor && (
                <motion.div
                  custom={0}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-4 rounded-2xl bg-[#f8f9ff] p-4 ring-1 ring-[#e6eeff]"
                >
                  <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full ring-2 ring-[#0053db]/20">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={mentor.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#e6eeff] text-base font-extrabold text-[#004ac6]">
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-[family-name:var(--font-headline)] font-bold text-[#121c2a]">
                      {mentor.name}
                    </p>
                    <p className="truncate text-sm text-[#006c49]">{mentor.title}</p>
                  </div>
                </motion.div>
              )}

              {session && (
                <motion.div
                  custom={1}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#eff4ff] text-[#004ac6]">
                        <Video className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#121c2a]">
                          {session.type}
                        </p>
                        <p className="text-xs text-[#434655]">Session package</p>
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#eff4ff] px-3 py-1 text-xs font-extrabold text-[#004ac6]">
                      <TimerReset className="size-3.5" />
                      {session.duration}
                    </span>
                  </div>

                  {sessionDateTime && (
                    <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4 text-sm sm:grid-cols-2">
                      <div className="flex items-center gap-2 text-[#434655]">
                        <Calendar className="size-4 shrink-0 text-[#004ac6]" />
                        <span className="font-medium text-[#121c2a]">{sessionDateTime.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#434655]">
                        <Clock className="size-4 shrink-0 text-[#004ac6]" />
                        <span className="font-medium text-[#121c2a]">{sessionDateTime.time}</span>
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
                className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#eff4ff] to-[#f8f9ff] px-4 py-3 ring-1 ring-[#dbe6ff]"
              >
                <span className="text-sm font-semibold text-[#434655]">Total paid</span>
                <span className="font-[family-name:var(--font-headline)] text-xl font-bold text-[#004ac6]">
                  {formattedPrice}
                </span>
              </motion.div>

              {bookingId && (
                <motion.button
                  type="button"
                  onClick={handleCopyBookingId}
                  custom={3}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex w-full items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-left ring-1 ring-slate-200/70 transition hover:bg-slate-100"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-[#004ac6] ring-1 ring-slate-200">
                    <Hash className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold tracking-wider text-[#434655] uppercase">
                      Booking ID
                    </p>
                    <p className="truncate font-mono text-sm font-semibold text-[#121c2a]">
                      {bookingId}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#004ac6] opacity-0 transition group-hover:opacity-100">
                    <Copy className="size-3.5" />
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
                  className="order-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-[#434655] transition hover:bg-slate-50 sm:order-1"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    router.push('/')
                  }}
                  className="order-1 w-full rounded-2xl bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(0,74,198,0.28)] transition hover:from-[#003fa8] hover:to-[#1d4ed8] sm:order-2"
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
