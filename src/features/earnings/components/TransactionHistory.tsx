'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useMentorBookings } from '@/features/mentor-dashboard/hooks/useMentorBookings'
import { MentorBooking } from '@/features/mentor-dashboard/types/mentor-dashboard.types'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-300 text-emerald-900',
  'bg-amber-200 text-amber-900',
  'bg-rose-100 text-rose-700',
  'bg-purple-100 text-purple-700',
]

function TransactionRow({ booking, index }: { booking: MentorBooking; index: number }) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length]
  const initials = getInitials(booking.mentee.full_name)
  const sessionType = booking.topic ?? 'Session'
  const date = formatDate(booking.session_start)
  const amount = `NPR ${parseFloat(booking.mentor_earning).toLocaleString('en-US', { minimumFractionDigits: 2 })}`

  return (
    <article className="grid gap-3 border-b border-slate-100 px-4 py-5 last:border-b-0 sm:px-5 md:min-h-20 md:grid-cols-[92px_minmax(0,1fr)_126px_120px] md:items-center md:gap-4 md:px-7">
      <p className="text-sm font-semibold leading-5 text-slate-800 md:max-w-20">{date}</p>
      <div className="flex min-w-0 items-center gap-4">
        <span
          className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold ${color}`}
        >
          {initials}
        </span>
        <p className="truncate font-headline text-base font-extrabold leading-5 text-slate-950">
          {booking.mentee.full_name}
        </p>
      </div>
      <span className="w-fit rounded-full bg-blue-100 px-4 py-2 text-center text-xs font-bold leading-4 text-blue-900">
        {sessionType.length > 18 ? sessionType.slice(0, 18) + '…' : sessionType}
      </span>
      <p className="text-left text-base font-extrabold text-slate-950 md:text-right">{amount}</p>
    </article>
  )
}

export function TransactionHistory() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useMentorBookings('completed', page, 10)
  const bookings = data?.items ?? []

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm sm:rounded-3xl">
      <div className="flex items-center justify-between gap-3 bg-[#f4f7ff] px-4 py-5 sm:px-7 sm:py-7">
        <h2 className="font-headline text-lg font-extrabold text-slate-950 sm:text-xl">
          Transaction History
        </h2>
        {data && (
          <span className="text-sm font-semibold text-slate-500">
            {data.total} total
          </span>
        )}
      </div>

      <div className="hidden grid-cols-[92px_minmax(0,1fr)_126px_120px] border-b border-slate-200 px-7 py-5 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-600 md:grid">
        <span>Date</span>
        <span>Student Name</span>
        <span>Session Type</span>
        <span className="text-right">Amount</span>
      </div>

      {isLoading ? (
        <div>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="grid animate-pulse gap-3 border-b border-slate-100 px-4 py-5 last:border-b-0 sm:px-5 md:min-h-20 md:grid-cols-[92px_minmax(0,1fr)_126px_120px] md:items-center md:gap-4 md:px-7"
            >
              <div className="h-4 w-16 rounded-md bg-slate-100 md:max-w-20" />
              <div className="flex items-center gap-4">
                <div className="size-7 shrink-0 rounded-full bg-slate-100" />
                <div className="h-4 w-40 rounded-md bg-slate-100" />
              </div>
              <div className="h-6 w-24 rounded-full bg-slate-100" />
              <div className="ml-auto h-4 w-20 rounded-md bg-slate-100 md:ml-0" />
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <p className="px-7 py-8 text-sm text-slate-500">No completed sessions yet.</p>
      ) : (
        <div>
          {bookings.map((booking, index) => (
            <TransactionRow key={booking.id} booking={booking} index={index} />
          ))}
        </div>
      )}

      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-center gap-3 border-t border-slate-100 px-7 py-5">
          <Button
            variant="outline"
            size="sm"
            disabled={!data.has_prev}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm font-semibold text-slate-600">
            {data.page} / {data.total_pages}
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
  )
}
