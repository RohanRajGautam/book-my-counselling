'use client'

import { CalendarClock, Star, UsersRound } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useMentorBookings } from '@/features/mentor-dashboard/hooks/useMentorBookings'
import { useMentorProfile } from '@/features/mentor-dashboard/hooks/useMentorProfile'

function isUpcomingThisWeek(sessionStart: string): boolean {
  const now = new Date()
  const start = new Date(sessionStart)
  const weekEnd = new Date(now)
  weekEnd.setDate(now.getDate() + 7)
  return start >= now && start <= weekEnd
}

function getNextSessionLabel(sessionStart: string): string {
  const now = new Date()
  const start = new Date(sessionStart)
  const diffMs = start.getTime() - now.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffHours < 1) return `Next session in ${diffMins} min`
  if (diffHours < 24) return `Next session in ${diffHours} hour${diffHours > 1 ? 's' : ''}`
  const diffDays = Math.floor(diffHours / 24)
  return `Next session in ${diffDays} day${diffDays > 1 ? 's' : ''}`
}

export function DashboardStats() {
  const { data: completedData, isPending: completedPending } = useMentorBookings('completed', 1, 1)
  const { data: confirmedData, isPending: confirmedPending } = useMentorBookings('confirmed', 1, 100)
  const { data: profileData, isPending: profilePending } = useMentorProfile()

  const totalSessions = profileData?.total_sessions ?? completedData?.total ?? 0
  const averageRating = profileData?.average_rating ?? 0
  const totalReviews = profileData?.total_reviews ?? 0

  const upcomingBookings = confirmedData?.items ?? []
  const upcomingThisWeek = upcomingBookings.filter((b) => isUpcomingThisWeek(b.session_start))

  const nextSession = upcomingBookings
    .filter((b) => new Date(b.session_start) > new Date())
    .sort((a, b) => new Date(a.session_start).getTime() - new Date(b.session_start).getTime())[0]

  const nextSessionLabel = nextSession
    ? getNextSessionLabel(nextSession.session_start)
    : 'No upcoming sessions'

  const sessionsLoading = profilePending && completedPending
  const upcomingLoading = confirmedPending
  const ratingLoading = profilePending

  return (
    <section
      aria-label="Dashboard statistics"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <article className="min-h-[132px] rounded-2xl bg-[#eef4ff] p-5 shadow-sm sm:min-h-[148px] sm:rounded-3xl sm:p-6 lg:p-7">
        <div className="flex items-center gap-3">
          <UsersRound className="size-5 text-blue-700" />
          <h2 className="text-xs font-bold uppercase leading-4 tracking-[0.16em] text-slate-600">
            Total Sessions
          </h2>
        </div>
        {sessionsLoading ? (
          <Skeleton className="mt-5 h-10 w-24 rounded-md bg-white/60 sm:mt-6 lg:h-12" />
        ) : (
          <p className="mt-5 text-3xl font-extrabold leading-none tracking-normal text-slate-950 sm:mt-6 sm:text-4xl lg:text-5xl">
            {totalSessions}
          </p>
        )}
        <p className="mt-4 text-sm font-semibold text-emerald-700">All time</p>
      </article>

      <article className="min-h-[132px] rounded-2xl bg-[#0755d8] p-5 text-white shadow-sm shadow-blue-200 sm:min-h-[148px] sm:rounded-3xl sm:p-6 lg:p-7">
        <div className="flex items-center gap-3">
          <CalendarClock className="size-5 text-white" />
          <h2 className="text-xs font-bold uppercase leading-4 tracking-[0.16em] text-blue-50">
            Upcoming This Week
          </h2>
        </div>
        {upcomingLoading ? (
          <Skeleton className="mt-5 h-10 w-20 rounded-md bg-white/20 sm:mt-6 lg:h-12" />
        ) : (
          <p className="mt-5 text-3xl font-extrabold leading-none tracking-normal sm:mt-6 sm:text-4xl lg:text-5xl">
            {upcomingThisWeek.length}
          </p>
        )}
        <p className="mt-4 text-sm font-semibold text-blue-100">{nextSessionLabel}</p>
      </article>

      <article className="relative min-h-[132px] overflow-hidden rounded-2xl bg-white p-5 shadow-sm sm:min-h-[148px] sm:rounded-3xl sm:p-6 lg:p-7">
        <Star
          className="absolute -right-1 -top-2 size-20 fill-[#eef4ff] text-[#eef4ff]"
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-3">
          <Star className="size-5 text-amber-600" />
          <h2 className="text-xs font-bold uppercase leading-4 tracking-[0.16em] text-slate-600">
            Average Rating
          </h2>
        </div>
        {ratingLoading ? (
          <Skeleton className="relative mt-5 h-10 w-24 rounded-md bg-slate-100 sm:mt-6 lg:h-12" />
        ) : (
          <p className="relative mt-5 text-3xl font-extrabold leading-none tracking-normal text-slate-950 sm:mt-6 sm:text-4xl lg:text-5xl">
            {averageRating > 0 ? averageRating.toFixed(1) : '—'}
          </p>
        )}
        {totalReviews > 0 && (
          <p className="relative mt-4 text-sm font-semibold text-slate-500">
            From {totalReviews} student review{totalReviews !== 1 ? 's' : ''}
          </p>
        )}
      </article>
    </section>
  )
}
