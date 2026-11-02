'use client'

import { CalendarCheck, CircleSlash, Layers, TimerReset } from 'lucide-react'

import { MentorSessionSummary } from '../../types/admin.types'
import { cn } from '@/lib/utils'

export interface AdminMentorSessionSummaryCardsProps {
  summary: MentorSessionSummary | undefined
  loading: boolean
}

interface StatProps {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  tone?: 'open' | 'plain'
}

function Stat({ label, value, icon: Icon, tone = 'plain' }: StatProps) {
  return (
    <div
      className={cn(
        'rounded-2xl px-4 py-3 ring-1',
        tone === 'open'
          ? 'bg-amber-50 ring-amber-200'
          : 'bg-white ring-slate-200/60 shadow-sm',
      )}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
        <Icon className={cn('size-3.5', tone === 'open' ? 'text-amber-600' : 'text-slate-400')} />
        {label}
      </div>
      <p
        className={cn(
          'mt-1 text-2xl font-extrabold tabular-nums',
          tone === 'open' ? 'text-amber-700' : 'text-slate-950',
        )}
      >
        {value.toLocaleString('en-US')}
      </p>
    </div>
  )
}

function StatSkeleton() {
  return <div className="h-[74px] animate-pulse rounded-2xl bg-slate-100" />
}

/**
 * The count strip above the list.
 *
 * "Still open" is the hero number — it is what an admin comes to this page
 * to find (sessions the mentor never closed out). The counts cover the
 * mentor's whole history, not the current filter or page.
 */
export function AdminMentorSessionSummaryCards({
  summary,
  loading,
}: AdminMentorSessionSummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
    )
  }

  const bookings = summary?.bookings

  return (
    <div>
      <p className="mb-2 text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
        Platform bookings
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total" value={bookings?.total ?? 0} icon={Layers} />
        <Stat label="Still open" value={bookings?.unclosed ?? 0} icon={TimerReset} tone="open" />
        <Stat label="Completed" value={bookings?.completed ?? 0} icon={CalendarCheck} />
        <Stat label="Cancelled" value={bookings?.cancelled ?? 0} icon={CircleSlash} />
      </div>
    </div>
  )
}
