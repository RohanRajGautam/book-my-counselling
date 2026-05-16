'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useMentorBookings } from '@/features/mentor-dashboard/hooks/useMentorBookings'
import { useUpdateBookingStatus } from '@/features/mentor-dashboard/hooks/useMentorBookings'
import { MentorBooking } from '@/features/mentor-dashboard/types/mentor-dashboard.types'
import { BookingStatus } from '@/features/mentor-dashboard/types/booking-status'
import { useMentorProfile } from '@/features/mentor-dashboard/hooks/useMentorProfile'

const STATUS_TABS: { label: string; value: BookingStatus | undefined }[] = [
  { label: 'Upcoming', value: 'confirmed' },
  { label: 'Pending', value: 'pending' },
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
  if (sessionDay.getTime() === today.getTime()) return `Today, ${timeStr}`
  if (sessionDay.getTime() === tomorrow.getTime()) return `Tomorrow, ${timeStr}`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + `, ${timeStr}`
}

function formatDuration(sessionStart: string, sessionEnd: string): string {
  const mins = Math.round(
    (new Date(sessionEnd).getTime() - new Date(sessionStart).getTime()) / 60000
  )
  return `${mins} min session`
}

function isJoinable(sessionStart: string): boolean {
  const start = new Date(sessionStart)
  const now = new Date()
  const diffMins = (start.getTime() - now.getTime()) / 60000
  return diffMins <= 15 && diffMins >= -60
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
  const subject = [booking.topic, booking.current_school].filter(Boolean).join(' • ')

  const handleConfirm = () => updateStatus({ bookingId: booking.id, status: 'confirmed' })
  const handleComplete = () => updateStatus({ bookingId: booking.id, status: 'completed' })
  const handleCancel = () =>
    updateStatus({ bookingId: booking.id, status: 'cancelled', cancellationReason: 'Cancelled by mentor' })

  return (
    <article className="grid min-h-[132px] gap-5 rounded-[24px] bg-white px-4 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:px-7 sm:py-6 md:grid-cols-[minmax(0,1fr)_175px_auto] md:items-center">
      <div className="flex min-w-0 items-center gap-4 sm:gap-5">
        <Avatar className="size-12 shrink-0 sm:size-[54px]">
          <AvatarFallback className="bg-blue-100 text-base font-extrabold text-blue-700">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h2 className="font-headline text-lg font-extrabold leading-tight text-slate-950 sm:text-xl">
            {booking.mentee.full_name}
          </h2>
          <p className="mt-2 max-w-[250px] text-sm leading-5 text-slate-500 sm:text-base sm:leading-6">
            {subject || 'Session'}
          </p>
        </div>
      </div>

      <div className="text-left md:text-center">
        <p className="text-base font-extrabold text-slate-950">
          {formatSessionTime(booking.session_start)}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-500">
          {formatDuration(booking.session_start, booking.session_end)}
        </p>
        <p className="mt-1 text-xs font-semibold text-slate-400">
          NPR {booking.agreed_price} • {booking.payment_status}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 max-sm:[&>button]:flex-1">
        {activeStatus === 'pending' && (
          <Button
            size="sm"
            className="rounded-2xl bg-blue-600 px-5 font-extrabold text-white hover:bg-blue-700"
            onClick={handleConfirm}
            disabled={isPending}
          >
            Confirm
          </Button>
        )}
        {activeStatus === 'confirmed' && joinable && (
          <Button
            size="sm"
            className="rounded-2xl bg-blue-100 px-5 font-extrabold text-blue-700 hover:bg-blue-200"
          >
            Join
          </Button>
        )}
        {activeStatus === 'confirmed' && (
          <Button
            size="sm"
            variant="outline"
            className="rounded-2xl border-slate-100 bg-slate-50 px-5 font-extrabold text-blue-700 hover:bg-blue-50"
            onClick={handleComplete}
            disabled={isPending}
          >
            Complete
          </Button>
        )}
        {(activeStatus === 'pending' || activeStatus === 'confirmed') && (
          <Button
            size="sm"
            variant="outline"
            className="rounded-2xl border-red-100 bg-red-50 px-5 font-extrabold text-red-600 hover:bg-red-100"
            onClick={handleCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}
        {(activeStatus === 'completed' || activeStatus === 'cancelled') && (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold ${
              activeStatus === 'completed'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {activeStatus === 'completed' ? 'Completed' : 'Cancelled'}
          </span>
        )}
      </div>
    </article>
  )
}

export function MySessionsPage() {
  const [activeTab, setActiveTab] = useState<BookingStatus | undefined>('confirmed')
  const [page, setPage] = useState(1)
  const { data: profileData } = useMentorProfile()

  const { data, isLoading } = useMentorBookings(activeTab, page, 10)
  const bookings = data?.items ?? []

  const handleTabChange = (status: BookingStatus | undefined) => {
    setActiveTab(status)
    setPage(1)
  }

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto grid w-full max-w-[1180px] gap-6 px-3 py-5 sm:px-6 sm:py-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8 lg:px-8 lg:py-11">
        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h1 className="font-headline text-2xl font-extrabold text-slate-950">My Sessions</h1>
          </div>

          {/* Status tabs */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-extrabold transition ${
                  activeTab === tab.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 shadow-sm hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-[24px] bg-slate-100" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <p className="rounded-[24px] bg-white px-7 py-8 text-sm text-slate-500 shadow-sm">
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

        <aside>
          <ShareProfileCard mentorId={profileData?.id} />
        </aside>
      </div>
    </div>
  )
}

function ShareProfileCard({ mentorId }: { mentorId?: string }) {
  const profileUrl = mentorId
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/explore-mentors/${mentorId}`
    : '#'

  const handleShare = () => {
    if (navigator.share && mentorId) {
      navigator.share({ title: 'My Counselling Profile', url: profileUrl }).catch(() => {})
    } else if (mentorId) {
      navigator.clipboard.writeText(profileUrl).catch(() => {})
    }
  }

  return (
    <section className="rounded-[28px] bg-[#243247] p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-9">
      <h2 className="font-headline text-xl font-extrabold">Share your profile</h2>
      <p className="mt-4 max-w-[220px] text-base leading-6 text-slate-200">
        For maximum visibility, share your profile on your social medias.
      </p>
      <Button
        className="mt-8 h-11 w-full rounded-2xl bg-white font-extrabold text-slate-950 hover:bg-blue-50 sm:w-[172px]"
        onClick={handleShare}
      >
        Share Now
      </Button>
    </section>
  )
}
