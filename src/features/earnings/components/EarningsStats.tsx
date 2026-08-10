'use client'

import { Banknote, CalendarClock, WalletCards } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useMentorStats } from '@/features/mentor-dashboard/hooks/useMentorStats'

function formatMoney(value: string): string {
  return `NPR ${value}`
}

function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural ?? `${singular}s`}`
}

export function EarningsStats() {
  const { data, isLoading } = useMentorStats()

  const totalEarnings = data?.total_earnings ?? '0.00'
  const pendingEarnings = data?.pending_earnings ?? '0.00'
  const upcomingSessions = data?.upcoming_sessions ?? 0
  const totalSessions = data?.total_sessions ?? 0
  const totalMentees = data?.total_mentees ?? 0
  const sharePct = data?.mentor_share_pct ?? '50.00'

  return (
    <section aria-label="Earnings statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <EarningsStatCard
        icon={<WalletCards className="size-5 text-blue-700" />}
        label="Total earnings"
        value={formatMoney(totalEarnings)}
        helper={
          parseFloat(pendingEarnings) > 0
            ? `${formatMoney(pendingEarnings)} pending`
            : 'No pending earnings'
        }
        helperClassName={
          parseFloat(pendingEarnings) > 0 ? 'text-emerald-700' : 'text-slate-500'
        }
        iconClassName="bg-blue-100"
        title={`You earn ${sharePct}% of each session.`}
        loading={isLoading}
      />
      <EarningsStatCard
        icon={<CalendarClock className="size-5 text-amber-800" />}
        label="Upcoming"
        value={pluralize(upcomingSessions, 'session')}
        helper={
          upcomingSessions === 0 ? 'Nothing on the books yet.' : 'Confirmed or pending.'
        }
        helperClassName="text-slate-500"
        iconClassName="bg-amber-100"
        loading={isLoading}
      />
      <EarningsStatCard
        icon={<Banknote className="size-5 text-emerald-800" />}
        label="Total sessions"
        value={String(totalSessions)}
        helper={
          totalSessions === 0
            ? 'Lifetime'
            : `${pluralize(totalMentees, 'mentee')} lifetime`
        }
        helperClassName="text-slate-500"
        iconClassName="bg-emerald-100"
        loading={isLoading}
      />
    </section>
  )
}

function EarningsStatCard({
  icon,
  label,
  value,
  helper,
  helperClassName,
  iconClassName,
  title,
  loading,
}: {
  icon: React.ReactNode
  label: string
  value: string
  helper: string
  helperClassName: string
  iconClassName: string
  title?: string
  loading?: boolean
}) {
  return (
    <article
      className="min-h-[152px] rounded-2xl bg-white p-5 shadow-sm sm:min-h-[176px] sm:rounded-3xl sm:p-6 lg:min-h-[200px] lg:p-8"
      title={title}
    >
      <div className={`flex size-11 items-center justify-center rounded-xl ${iconClassName}`}>
        {icon}
      </div>
      <h2 className="mt-5 text-xs font-bold tracking-[0.14em] text-slate-500 uppercase sm:mt-6 sm:tracking-[0.18em]">
        {label}
      </h2>
      {loading ? (
        <Skeleton className="mt-3 h-8 w-32 rounded-md bg-slate-100 sm:mt-4 lg:h-10 lg:w-40" />
      ) : (
        <p className="mt-2 text-2xl leading-tight font-extrabold tracking-normal break-words text-slate-950 sm:text-3xl lg:text-4xl">
          {value}
        </p>
      )}
      <p className={`mt-5 text-sm font-extrabold ${helperClassName}`}>{helper}</p>
    </article>
  )
}
