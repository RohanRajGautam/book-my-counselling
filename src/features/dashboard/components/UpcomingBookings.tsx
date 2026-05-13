'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useMentorBookings } from '@/features/mentor-dashboard/hooks/useMentorBookings'
import { MentorBooking } from '@/features/mentor-dashboard/types/mentor-dashboard.types'

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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${timeStr}`
}

function formatDuration(sessionStart: string, sessionEnd: string): string {
  const start = new Date(sessionStart)
  const end = new Date(sessionEnd)
  const mins = Math.round((end.getTime() - start.getTime()) / 60000)
  return `${mins} min session`
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function isJoinable(sessionStart: string): boolean {
  const start = new Date(sessionStart)
  const now = new Date()
  const diffMins = (start.getTime() - now.getTime()) / 60000
  return diffMins <= 15 && diffMins >= -60
}

export function UpcomingBookings() {
  const { data, isLoading } = useMentorBookings('confirmed', 1, 5)
  const bookings = data?.items ?? []

  const upcoming = bookings
    .filter((b) => new Date(b.session_start) > new Date(Date.now() - 60 * 60 * 1000))
    .sort((a, b) => new Date(a.session_start).getTime() - new Date(b.session_start).getTime())
    .slice(0, 5)

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
          Upcoming Bookings
        </h2>
        <Link href="/mentor/my-sessions" className="text-sm font-bold text-blue-700 hover:text-blue-900">
          View All
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100 sm:rounded-3xl" />
          ))}
        </div>
      ) : upcoming.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm sm:rounded-3xl">
          No upcoming sessions scheduled.
        </p>
      ) : (
        <div className="space-y-4">
          {upcoming.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </section>
  )
}

function BookingCard({ booking }: { booking: MentorBooking }) {
  const joinable = isJoinable(booking.session_start)
  const initials = getInitials(booking.mentee.full_name)
  const subject = [booking.topic, booking.current_school].filter(Boolean).join(' • ')

  return (
    <article className="grid gap-5 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:rounded-3xl sm:p-6">
      <div className="flex min-w-0 items-center gap-4">
        <Avatar className="size-11">
          <AvatarFallback className="bg-blue-100 text-sm font-bold text-blue-700">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h3 className="font-headline text-base font-bold text-slate-950">
            {booking.mentee.full_name}
          </h3>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            {subject || 'Session'}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between sm:justify-end sm:gap-6">
        <div className="text-left sm:text-right">
          <p className="text-sm font-bold text-slate-950">{formatSessionTime(booking.session_start)}</p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {formatDuration(booking.session_start, booking.session_end)}
          </p>
        </div>
        <Button
          variant={joinable ? 'default' : 'outline'}
          className={
            joinable
              ? 'h-9 min-w-20 rounded-full bg-blue-100 px-5 font-bold text-blue-700 hover:bg-blue-200'
              : 'h-9 min-w-20 rounded-full border-slate-100 bg-slate-50 px-5 font-bold text-blue-700 hover:bg-blue-50'
          }
        >
          {joinable ? 'Join' : 'Details'}
        </Button>
      </div>
    </article>
  )
}
