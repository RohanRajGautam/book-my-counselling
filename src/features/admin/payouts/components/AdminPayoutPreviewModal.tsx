'use client'

import { useState } from 'react'
import { CalendarRange, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import {
  EMPTY_WINDOW_FORM,
  utcIsoFromDateInput,
  validateWindowForm,
  type WindowFormValues,
} from '../lib/payoutValidation'
import { useEligibleBookings } from '../hooks/useAdminPayouts'
import type { OwedPerMentorSummary } from '../types/payouts.types'

import { AdminPayoutModalShell } from './AdminPayoutModalShell'
import { AdminPayoutEligibleBookingsTable } from './AdminPayoutEligibleBookingsTable'

export interface AdminPayoutPreviewModalProps {
  mentor: OwedPerMentorSummary
  onClose: () => void
  onCreate: () => void
}

/**
 * "What would a payout for this mentor include?" preview. Defaults to
 * the full eligible set; admins can narrow with an optional date
 * window to preview just a slice. This is a read-only view — the
 * action button jumps straight into the create flow with the same
 * mentor prefilled.
 */
export function AdminPayoutPreviewModal({
  mentor,
  onClose,
  onCreate,
}: AdminPayoutPreviewModalProps) {
  const [window, setWindow] = useState<WindowFormValues>(EMPTY_WINDOW_FORM)
  const [attempted, setAttempted] = useState(false)

  const windowErrors = validateWindowForm(window)
  const hasWindow = !!window.startDate && !!window.endDate && windowErrors.length === 0

  const { data, isLoading } = useEligibleBookings({
    mentor_id: mentor.mentor_id,
    enabled: true,
    ...(hasWindow
      ? {
          period_start: utcIsoFromDateInput(window.startDate, 'start'),
          period_end: utcIsoFromDateInput(window.endDate, 'end'),
        }
      : {}),
  })

  const errorFor = (field: string) =>
    attempted ? windowErrors.find((e) => e.field === field)?.message : undefined

  const displayName = mentor.mentor_name || mentor.mentor_email || 'this mentor'

  const inputCls = (hasError: boolean) =>
    `w-full rounded-xl border bg-slate-50 p-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
      hasError ? 'border-red-300' : 'border-slate-200'
    }`

  return (
    <AdminPayoutModalShell
      size="wide"
      title={`Preview · ${displayName}`}
      subtitle={
        <span>
          Currently owes{' '}
          <strong className="font-extrabold text-slate-700">NPR {mentor.total_owed}</strong>{' '}
          across {mentor.booking_count} booking{mentor.booking_count === 1 ? '' : 's'}.
        </span>
      }
      onClose={onClose}
    >
      {/* Optional date filter */}
      <details className="group rounded-xl border border-slate-200 bg-slate-50/40 p-3 [&[open]]:bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-extrabold tracking-[0.14em] text-slate-500 uppercase">
          <span className="flex items-center gap-2">
            <CalendarRange className="size-3.5" />
            Filter by date range (optional)
          </span>
          <span className="text-slate-400 transition group-open:rotate-180">▾</span>
        </summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label>
            <span className="text-xs font-extrabold tracking-wide text-slate-500 uppercase">
              Start date
            </span>
            <input
              type="date"
              value={window.startDate}
              onChange={(e) => setWindow((p) => ({ ...p, startDate: e.target.value }))}
              onBlur={() => setAttempted(true)}
              className={`mt-1 ${inputCls(Boolean(errorFor('startDate')))}`}
            />
            {errorFor('startDate') ? (
              <p className="mt-1 text-xs font-bold text-red-600">{errorFor('startDate')}</p>
            ) : null}
          </label>
          <label>
            <span className="text-xs font-extrabold tracking-wide text-slate-500 uppercase">
              End date
            </span>
            <input
              type="date"
              value={window.endDate}
              onChange={(e) => setWindow((p) => ({ ...p, endDate: e.target.value }))}
              onBlur={() => setAttempted(true)}
              className={`mt-1 ${inputCls(Boolean(errorFor('endDate')))}`}
            />
            {errorFor('endDate') ? (
              <p className="mt-1 text-xs font-bold text-red-600">{errorFor('endDate')}</p>
            ) : null}
          </label>
        </div>
      </details>

      <div className="mt-4">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-50" />
            ))}
          </div>
        ) : (
          <AdminPayoutEligibleBookingsTable bookings={data ?? []} />
        )}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button
          className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700"
          onClick={onCreate}
          disabled={isLoading || (data ?? []).length === 0}
        >
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
          Create payout for this mentor
        </Button>
      </div>
    </AdminPayoutModalShell>
  )
}