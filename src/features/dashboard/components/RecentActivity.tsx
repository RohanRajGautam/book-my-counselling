'use client'

import { Check, FileClock, XCircle } from 'lucide-react'
import { useMentorBookings } from '@/features/mentor-dashboard/hooks/useMentorBookings'
import { MentorBooking } from '@/features/mentor-dashboard/types/mentor-dashboard.types'

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function ActivityItem({ booking }: { booking: MentorBooking }) {
  const isCompleted = booking.status === 'completed'
  const isCancelled = booking.status === 'cancelled'

  const timestamp = booking.completed_at ?? booking.cancelled_at ?? booking.updated_at

  return (
    <article className="flex gap-4">
      <div
        className={`mt-1 flex size-8 shrink-0 items-center justify-center rounded-full ${
          isCompleted
            ? 'bg-emerald-300 text-emerald-800'
            : isCancelled
              ? 'bg-red-100 text-red-600'
              : 'bg-blue-100 text-slate-500'
        }`}
      >
        {isCompleted ? (
          <Check className="size-4" />
        ) : isCancelled ? (
          <XCircle className="size-4" />
        ) : (
          <FileClock className="size-4" />
        )}
      </div>
      <div className="min-w-0">
        <h3 className="font-headline text-base font-semibold text-slate-950">
          {isCompleted
            ? `Completed session with ${booking.mentee.full_name}`
            : isCancelled
              ? `Session cancelled with ${booking.mentee.full_name}`
              : `Session with ${booking.mentee.full_name}`}
        </h3>
        {booking.topic && (
          <p className="mt-1 text-sm leading-5 text-slate-600">{booking.topic}</p>
        )}
        <p className="mt-2 text-xs font-medium text-slate-400">{timeAgo(timestamp)}</p>
      </div>
    </article>
  )
}

export function RecentActivity() {
  const { data: completedData, isLoading: loadingCompleted } = useMentorBookings('completed', 1, 5)
  const { data: cancelledData, isLoading: loadingCancelled } = useMentorBookings('cancelled', 1, 3)

  const isLoading = loadingCompleted || loadingCancelled

  const allActivity = [
    ...(completedData?.items ?? []),
    ...(cancelledData?.items ?? []),
  ]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 5)

  return (
    <section className="space-y-6">
      <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
        Recent Activity
      </h2>

      <div className="space-y-6 rounded-2xl bg-[#eef4ff] p-5 shadow-sm sm:rounded-3xl sm:p-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        ) : allActivity.length === 0 ? (
          <p className="text-sm text-slate-500">No recent activity yet.</p>
        ) : (
          allActivity.map((booking) => (
            <ActivityItem key={booking.id} booking={booking} />
          ))
        )}
      </div>
    </section>
  )
}
