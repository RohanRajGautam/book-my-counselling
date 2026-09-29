'use client'

import { CheckCircle2, Eye } from 'lucide-react'

import { OutsideSessionRow } from '../../types/admin.types'
import { formatDateTime, formatShortDate } from '../../lib/format'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { OUTSIDE_SESSION_STATUS_BADGE } from '../lib/outsideSessionBadges'

export interface OutsideSessionCardProps {
  row: OutsideSessionRow
  onView: (row: OutsideSessionRow) => void
  onMarkComplete: (row: OutsideSessionRow) => void
}

export function OutsideSessionCard({
  row,
  onView,
  onMarkComplete,
}: OutsideSessionCardProps) {
  const isScheduled = row.status === 'scheduled'
  const reviewSubmitted = row.review_token_used_at !== null
  const money = `Cost ${row.cost} / Mentor ${row.mentor_share} / Platform ${row.platform_share}`

  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase',
                OUTSIDE_SESSION_STATUS_BADGE[row.status],
              )}
            >
              {row.status}
            </span>
            {reviewSubmitted ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 uppercase">
                <CheckCircle2 className="size-3" strokeWidth={2.6} />
                Review submitted
              </span>
            ) : null}
          </div>

          <p className="truncate text-base font-extrabold text-slate-950">
            {row.mentor_name}
          </p>
          <p className="truncate text-xs text-slate-500">
            Mentee:{' '}
            <span className="font-bold text-slate-700">{row.mentee_name}</span>{' '}
            &lt;{row.mentee_email}&gt;
          </p>
          <p className="text-xs text-slate-500">
            {formatDateTime(row.session_start)} →{' '}
            {formatDateTime(row.session_end)}
          </p>
          <p className="text-xs text-slate-500">
            <span className="font-bold text-slate-700">NPR</span> {money}
          </p>
          <p className="text-[11px] text-slate-400">
            Recorded {formatShortDate(row.created_at)}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          {isScheduled ? (
            <Button
              size="sm"
              onClick={() => onMarkComplete(row)}
              className="gap-1.5 rounded-xl bg-[#0755d8] font-bold text-white shadow-sm hover:bg-blue-700"
            >
              <CheckCircle2 className="size-3.5" strokeWidth={2.6} />
              Mark complete
            </Button>
          ) : null}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(row)}
            className="gap-1.5 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            <Eye className="size-3.5" strokeWidth={2.6} />
            View
          </Button>
        </div>
      </div>
    </article>
  )
}