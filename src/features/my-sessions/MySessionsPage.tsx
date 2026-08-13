'use client'

import { useState } from 'react'
import { CalendarCheck2, Clock, Timer, Wallet } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useMentorBookings } from '@/features/mentor-dashboard/hooks/useMentorBookings'
import { useUpdateBookingStatus } from '@/features/mentor-dashboard/hooks/useMentorBookings'
import { MentorBooking } from '@/features/mentor-dashboard/types/mentor-dashboard.types'
import { BookingStatus } from '@/features/mentor-dashboard/types/booking-status'

const STATUS_TABS: { label: string; value: BookingStatus | undefined }[] = [
  { label: 'Upcoming', value: 'confirmed' },
  // { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function formatSessionTime(sessionStart: string): string {
  const date = new Date(sessionStart)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const sessionDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  if (sessionDay.getTime() === today.getTime()) return `Today · ${timeStr}`
  if (sessionDay.getTime() === tomorrow.getTime()) return `Tomorrow · ${timeStr}`
  return (
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ` · ${timeStr}`
  )
}

function formatDuration(sessionStart: string, sessionEnd: string): string {
  const mins = Math.round(
    (new Date(sessionEnd).getTime() - new Date(sessionStart).getTime()) / 60000
  )
  if (mins >= 60) {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return m === 0 ? `${h}h` : `${h}h ${m}m`
  }
  return `${mins} min`
}

function isJoinable(sessionStart: string): boolean {
  const start = new Date(sessionStart)
  const now = new Date()
  const diffMins = (start.getTime() - now.getTime()) / 60000
  return diffMins <= 15 && diffMins >= -60
}

type StatusVisuals = {
  badge: string
  badgeInk: string
  badgeDot: string
  label: string
}

function visualsFor(status: BookingStatus | undefined, joinable: boolean): StatusVisuals {
  if (status === 'completed') {
    return {
      badge: 'bg-emerald-50',
      badgeInk: 'text-emerald-700',
      badgeDot: 'bg-emerald-500',
      label: 'Completed',
    }
  }
  if (status === 'cancelled') {
    return {
      badge: 'bg-rose-50',
      badgeInk: 'text-rose-700',
      badgeDot: 'bg-rose-500',
      label: 'Cancelled',
    }
  }
  if (status === 'confirmed') {
    if (joinable) {
      return {
        badge: 'bg-blue-600',
        badgeInk: 'text-white',
        badgeDot: 'bg-white',
        label: 'Live now',
      }
    }
    return {
      badge: 'bg-blue-50',
      badgeInk: 'text-blue-700',
      badgeDot: 'bg-blue-500',
      label: 'Confirmed',
    }
  }
  if (status === 'pending') {
    return {
      badge: 'bg-amber-50',
      badgeInk: 'text-amber-700',
      badgeDot: 'bg-amber-500',
      label: 'Awaiting confirmation',
    }
  }
  return {
    badge: 'bg-slate-50',
    badgeInk: 'text-slate-700',
    badgeDot: 'bg-slate-400',
    label: 'Scheduled',
  }
}

function StatusPill({ visuals }: { visuals: StatusVisuals }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-[0.06em] uppercase ${visuals.badge} ${visuals.badgeInk}`}
    >
      <span className={`size-1.5 rounded-full ${visuals.badgeDot}`} />
      {visuals.label}
    </span>
  )
}

function MetaStat({
  icon: Icon,
  label,
  value,
  strong,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
        <Icon className="size-3" />
        {label}
      </div>
      <p
        className={`mt-1.5 truncate font-headline text-sm font-extrabold ${
          strong ? 'text-slate-950' : 'text-slate-700'
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function SessionCardSkeleton() {
  return (
    <article className="flex animate-pulse flex-col gap-5 rounded-3xl bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] ring-1 ring-slate-100/80 sm:p-6 md:p-6">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 rounded-md bg-slate-100" />
          <div className="h-3 w-56 rounded-md bg-slate-100" />
        </div>
        <div className="h-6 w-24 rounded-full bg-slate-100" />
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-4 border-t border-slate-100 pt-4 sm:grid-cols-3">
        <div className="space-y-2">
          <div className="h-3 w-10 rounded bg-slate-100" />
          <div className="h-4 w-24 rounded-md bg-slate-100" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-12 rounded bg-slate-100" />
          <div className="h-4 w-16 rounded-md bg-slate-100" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-12 rounded bg-slate-100" />
          <div className="h-4 w-20 rounded-md bg-slate-100" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-9 w-24 rounded-full bg-slate-100" />
        <div className="h-9 w-20 rounded-full bg-slate-100" />
      </div>
    </article>
  )
}

function SessionCard({
  booking,
  activeStatus,
}: {
  booking: MentorBooking
  activeStatus: BookingStatus | undefined
}) {
  const { mutate: updateStatus, isPending } = useUpdateBookingStatus()
  const joinable = isJoinable(booking.session_start)
  const initials = getInitials(booking.mentee.full_name)
  const subject = [booking.topic, booking.current_school].filter(Boolean).join(' · ')
  const visuals = visualsFor(activeStatus, joinable)
  const isLive = activeStatus === 'confirmed' && joinable

  const handleConfirm = () => updateStatus({ bookingId: booking.id, status: 'confirmed' })
  const handleComplete = () => updateStatus({ bookingId: booking.id, status: 'completed' })

  return (
    <article
      className={`flex flex-col gap-5 rounded-3xl bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] ring-1 ring-slate-100/80 transition-all duration-200 sm:p-6 md:p-6 ${
        isLive ? 'shadow-[0_24px_55px_rgba(0,74,198,0.16)] ring-blue-200/80' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="size-10 shrink-0">
            <AvatarFallback className="bg-blue-100 text-sm font-bold text-blue-700">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h2 className="truncate font-headline text-lg font-extrabold leading-tight text-slate-950 sm:text-xl">
              {booking.mentee.full_name}
            </h2>
            <p className="truncate text-sm leading-5 text-slate-500">
              {subject || 'Session'}
            </p>
          </div>
        </div>
        <StatusPill visuals={visuals} />
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-4 border-t border-slate-100 pt-4 sm:grid-cols-3">
        <MetaStat
          icon={CalendarCheck2}
          label="Time"
          value={formatSessionTime(booking.session_start)}
          strong
        />
        <MetaStat
          icon={Timer}
          label="Duration"
          value={formatDuration(booking.session_start, booking.session_end)}
        />
        <MetaStat icon={Wallet} label="Earning" value={`NPR ${booking.mentor_earning}`} />
      </div>

      <div className="flex flex-wrap gap-2 max-sm:[&>button]:flex-1">
        {activeStatus === 'pending' && (
          <Button
            size="sm"
            className="h-9 rounded-full bg-blue-600 px-5 font-bold text-white hover:bg-blue-700"
            onClick={handleConfirm}
            disabled={isPending}
          >
            Confirm
          </Button>
        )}
        {activeStatus === 'confirmed' && (
          <>
            {joinable && (
              <Button
                size="sm"
                className="h-9 rounded-full bg-blue-600 px-5 font-bold text-white shadow-sm shadow-blue-200 hover:bg-blue-700"
              >
                Join now
              </Button>
            )}
            <Button
              size="sm"
              className="h-9 rounded-full bg-blue-600 px-5 font-bold text-white hover:bg-blue-700"
              onClick={handleComplete}
              disabled={isPending}
            >
              Mark complete
            </Button>
          </>
        )}
        {activeStatus === 'completed' && (
          <span className="inline-flex h-9 items-center rounded-full bg-emerald-50 px-4 text-sm font-bold text-emerald-700">
            ✓ Completed
          </span>
        )}
        {activeStatus === 'cancelled' && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-9 items-center rounded-full bg-rose-50 px-4 text-sm font-bold text-rose-700">
              Cancelled
            </span>
            <RefundBadge paymentStatus={booking.payment_status} />
          </div>
        )}
      </div>
    </article>
  )
}

function RefundBadge({ paymentStatus }: { paymentStatus: string }) {
  if (paymentStatus === 'refunded') {
    return (
      <span className="inline-flex h-9 items-center rounded-full bg-emerald-50 px-4 text-sm font-bold text-emerald-700">
        Refunded
      </span>
    )
  }
  if (paymentStatus === 'paid') {
    return (
      <span
        className="inline-flex h-9 items-center rounded-full bg-amber-50 px-4 text-sm font-bold text-amber-700"
        title="Refund is awaiting admin processing. The mentee will receive an email once it's completed."
      >
        Refund pending
      </span>
    )
  }
  return null
}

export function MySessionsPage() {
  const [activeTab, setActiveTab] = useState<BookingStatus | undefined>('confirmed')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useMentorBookings(activeTab, page, 10)
  const bookings = data?.items ?? []

  const handleTabChange = (status: BookingStatus | undefined) => {
    setActiveTab(status)
    setPage(1)
  }

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1180px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:space-y-10 lg:px-8 lg:py-8">
        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h1 className="font-headline text-3xl leading-tight font-extrabold tracking-normal text-slate-950 sm:text-4xl lg:text-5xl">
              My Sessions
            </h1>
          </div>

          {/* Status tabs */}
          <div
            role="tablist"
            aria-label="Filter by status"
            className="mb-4 inline-flex flex-wrap rounded-full bg-slate-100 p-1"
          >
            {STATUS_TABS.map((tab) => {
              const active = activeTab === tab.value
              return (
                <button
                  key={tab.label}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleTabChange(tab.value)}
                  className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition ${
                    active
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {isLoading ? (
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <SessionCardSkeleton key={i} />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <p className="rounded-3xl bg-white px-7 py-8 text-sm text-slate-500 shadow-sm ring-1 ring-slate-100/80">
              No {STATUS_TABS.find((t) => t.value === activeTab)?.label.toLowerCase()} sessions.
            </p>
          ) : (
            <div className="space-y-5">
              {bookings.map((booking) => (
                <SessionCard key={booking.id} booking={booking} activeStatus={activeTab} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.total_pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={!data.has_prev}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm font-semibold text-slate-600">
                Page {data.page} of {data.total_pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!data.has_next}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}