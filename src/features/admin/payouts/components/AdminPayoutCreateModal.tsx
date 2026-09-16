'use client'

import { useMemo, useState } from 'react'
import { AlertCircle, CalendarRange, Loader2, ListChecks } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { extractApiErrorDetail } from '../lib/payoutBadges'
import {
  EMPTY_WINDOW_FORM,
  utcIsoFromDateInput,
  validateWindowForm,
  type WindowFormValues,
} from '../lib/payoutValidation'
import { useCreatePayout, useEligibleBookings } from '../hooks/useAdminPayouts'
import type {
  OwedPerBookingItem,
  OwedPerMentorSummary,
  PayoutDetailResponse,
} from '../types/payouts.types'

import { AdminPayoutModalShell } from './AdminPayoutModalShell'
import { AdminPayoutEligibleBookingsTable } from './AdminPayoutEligibleBookingsTable'

type Mode = 'manual' | 'window'

export interface AdminPayoutCreateModalProps {
  /** Mentor to pre-fill. The create flow always starts from one mentor. */
  mentor: OwedPerMentorSummary
  onClose: () => void
  onCreated?: (payout: PayoutDetailResponse) => void
}

/**
 * Two-mode create modal:
 *  - manual → admin picks specific eligible bookings
 *  - window → admin picks a date range; every eligible booking in that
 *    range gets pulled in
 *
 * In both modes the eligible-bookings query runs (with the window
 * filter when applicable) so the summary table stays live — what
 * admins see is exactly what the payout will include.
 */
export function AdminPayoutCreateModal({
  mentor,
  onClose,
  onCreated,
}: AdminPayoutCreateModalProps) {
  const [mode, setMode] = useState<Mode>('manual')
  const [notes, setNotes] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [window, setWindow] = useState<WindowFormValues>(EMPTY_WINDOW_FORM)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { mutate, isPending } = useCreatePayout()

  // For window mode we need eligible bookings as a "preview" of what
  // will be included. The server will recompute this on POST, so the
  // preview is informational only — admins still need to trust the
  // API's authoritative pick.
  const windowParams = useMemo(() => {
    if (mode !== 'window') return null
    if (!window.startDate || !window.endDate) return null
    return {
      mentor_id: mentor.mentor_id,
      period_start: utcIsoFromDateInput(window.startDate, 'start'),
      period_end: utcIsoFromDateInput(window.endDate, 'end'),
    }
  }, [mode, window, mentor.mentor_id])

  const { data: eligible, isLoading: eligibleLoading } = useEligibleBookings({
    mentor_id: mentor.mentor_id,
    ...(windowParams ?? {}),
    enabled: mode === 'window' && windowParams !== null,
  })

  const windowErrors = useMemo(() => validateWindowForm(window), [window])
  const windowHasErrors = windowErrors.length > 0
  const errorFor = (field: string) =>
    submitAttempted ? windowErrors.find((e) => e.field === field)?.message : undefined

  const displayName = mentor.mentor_name || mentor.mentor_email || 'this mentor'

  // Manual-mode bookings are loaded unconditionally — the date window
  // only applies to window mode.
  const { data: manualEligible, isLoading: manualLoading } = useEligibleBookings({
    mentor_id: mentor.mentor_id,
    enabled: mode === 'manual',
  })

  const bookingsForMode: OwedPerBookingItem[] = mode === 'manual'
    ? (manualEligible ?? [])
    : (eligible ?? [])

  const isLoadingForMode = mode === 'manual' ? manualLoading : eligibleLoading

  const totalSelected = useMemo(() => {
    if (mode === 'window') {
      return (eligible ?? []).reduce((acc, b) => acc + Number(b.mentor_earning), 0)
    }
    return bookingsForMode
      .filter((b) => selectedIds.has(b.booking_id))
      .reduce((acc, b) => acc + Number(b.mentor_earning), 0)
  }, [mode, eligible, bookingsForMode, selectedIds])

  const canSubmitManual = selectedIds.size > 0 && !isPending
  const canSubmitWindow = !isPending && !windowHasErrors && (eligible?.length ?? 0) > 0

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSubmit = () => {
    setSubmitAttempted(true)
    setErrorMsg(null)

    let payload:
      | { mentor_id: string; booking_ids: string[]; notes?: string }
      | { mentor_id: string; period_start: string; period_end: string; notes?: string }

    if (mode === 'manual') {
      if (!canSubmitManual) return
      payload = {
        mentor_id: mentor.mentor_id,
        booking_ids: Array.from(selectedIds),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      }
    } else {
      if (!canSubmitWindow || !windowParams) return
      payload = {
        mentor_id: mentor.mentor_id,
        period_start: windowParams.period_start!,
        period_end: windowParams.period_end!,
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      }
    }

    mutate(payload, {
      onSuccess: (data) => {
        onCreated?.(data)
        onClose()
      },
      onError: (err) => {
        setErrorMsg(extractApiErrorDetail(err) ?? 'Failed to create payout.')
      },
    })
  }

  const inputCls = (hasError: boolean) =>
    `w-full rounded-xl border bg-slate-50 p-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 ${
      hasError ? 'border-red-300' : 'border-slate-200'
    }`

  return (
    <AdminPayoutModalShell
      size="wide"
      busy={isPending}
      title={`Create payout · ${displayName}`}
      subtitle={
        <span>
          Currently owes{' '}
          <strong className="font-extrabold text-slate-700">NPR {mentor.total_owed}</strong>{' '}
          across {mentor.booking_count} booking{mentor.booking_count === 1 ? '' : 's'}.
        </span>
      }
      onClose={onClose}
    >
      {/* Mode tabs */}
      <div
        role="tablist"
        aria-label="Creation mode"
        className="flex flex-wrap gap-1 rounded-2xl bg-slate-100 p-1"
      >
        <ModeTab
          active={mode === 'manual'}
          onClick={() => setMode('manual')}
          icon={<ListChecks className="size-3.5" />}
          label="Pick specific bookings"
        />
        <ModeTab
          active={mode === 'window'}
          onClick={() => setMode('window')}
          icon={<CalendarRange className="size-3.5" />}
          label="Auto-pick by date range"
        />
      </div>

      {/* Manual mode */}
      {mode === 'manual' ? (
        <section className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold tracking-[0.14em] text-slate-500 uppercase">
              Eligible bookings
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {selectedIds.size} selected
            </span>
          </div>

          {manualLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-50" />
              ))}
            </div>
          ) : (manualEligible ?? []).length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-6 text-center">
              <p className="text-sm font-semibold text-slate-400">
                Nothing is eligible for {displayName} right now.
              </p>
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200">
              <ul className="divide-y divide-slate-100">
                {(manualEligible ?? []).map((b) => {
                  const checked = selectedIds.has(b.booking_id)
                  return (
                    <li key={b.booking_id}>
                      <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSelected(b.booking_id)}
                          className="size-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-200"
                          disabled={isPending}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-900">{b.mentee_name}</p>
                          <p className="text-[11px] font-medium text-slate-500">
                            Session: {new Date(b.session_start).toLocaleString()}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-extrabold text-slate-950">
                            NPR {b.mentor_earning}
                          </p>
                          {Number(b.discount_amount) > 0 ? (
                            <p className="text-[10px] font-medium text-slate-500">
                              off NPR {b.original_price}
                            </p>
                          ) : null}
                        </div>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </section>
      ) : null}

      {/* Window mode */}
      {mode === 'window' ? (
        <section className="mt-5 space-y-4">
          <h3 className="text-xs font-extrabold tracking-[0.14em] text-slate-500 uppercase">
            Date range (inclusive)
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="text-xs font-extrabold tracking-wide text-slate-500 uppercase">
                Start date
              </span>
              <input
                type="date"
                value={window.startDate}
                onChange={(e) => setWindow((p) => ({ ...p, startDate: e.target.value }))}
                disabled={isPending}
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
                disabled={isPending}
                className={`mt-1 ${inputCls(Boolean(errorFor('endDate')))}`}
              />
              {errorFor('endDate') ? (
                <p className="mt-1 text-xs font-bold text-red-600">{errorFor('endDate')}</p>
              ) : null}
            </label>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <AdminPayoutEligibleBookingsTable bookings={eligible ?? []} />
          </div>

          {window.startDate && window.endDate && !windowHasErrors && !eligibleLoading && (eligible ?? []).length === 0 ? (
            <p className="text-xs font-semibold text-amber-700">
              No eligible bookings in this window. Pick a wider range or switch to manual mode.
            </p>
          ) : null}
        </section>
      ) : null}

      {/* Notes (shared) */}
      <label className="mt-5 block">
        <span className="text-xs font-extrabold tracking-wide text-slate-500 uppercase">
          Notes (optional)
        </span>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={`e.g. "Q3 2026 disbursement"`}
          disabled={isPending}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      {/* Confirmation summary */}
      <div className="mt-5 rounded-xl bg-blue-50 p-3 text-sm font-medium text-blue-900">
        Create a <strong className="font-extrabold">pending</strong> payout for{' '}
        <strong className="font-extrabold">{displayName}</strong> totalling{' '}
        <strong className="font-extrabold">NPR {totalSelected.toFixed(2)}</strong>?
        You&apos;ll be able to mark it paid (or cancel it) from the detail view.
      </div>

      {errorMsg ? (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      ) : null}

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleSubmit}
          disabled={isPending || isLoadingForMode || (mode === 'manual' ? !canSubmitManual : !canSubmitWindow)}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ListChecks className="size-4" />
          )}
          Create pending payout
        </Button>
      </div>
    </AdminPayoutModalShell>
  )
}

function ModeTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-extrabold transition ${
        active
          ? 'bg-white text-slate-950 shadow-sm'
          : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}