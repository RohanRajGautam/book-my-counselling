'use client'

import { useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'

import { OutsideSessionRow } from '../../types/admin.types'
import { formatDateTime, formatShortDate } from '../../lib/format'
import { cn } from '@/lib/utils'
import { OUTSIDE_SESSION_STATUS_BADGE } from '../lib/outsideSessionBadges'

export interface OutsideSessionDetailModalProps {
  row: OutsideSessionRow | null
  onClose: () => void
}

export function OutsideSessionDetailModal({
  row,
  onClose,
}: OutsideSessionDetailModalProps) {
  useEffect(() => {
    if (!row) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [row, onClose])

  if (!row) return null

  const isCompleted = row.status === 'completed'
  const reviewSubmitted = row.review_token_used_at !== null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-3 py-6 sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="outside-session-detail-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div className="relative z-[1] flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h2
              id="outside-session-detail-title"
              className="font-headline text-lg font-extrabold tracking-tight text-slate-950 sm:text-xl"
            >
              Outside session
            </h2>
            <p className="mt-1 text-xs leading-5 font-medium text-slate-500 sm:text-sm">
              Recorded {formatShortDate(row.created_at)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
          <div
            className={cn(
              'flex flex-wrap items-center gap-2 rounded-xl px-3 py-2.5 ring-1',
              isCompleted
                ? 'bg-emerald-50 ring-emerald-200'
                : 'bg-blue-50 ring-blue-200',
            )}
          >
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

          <dl className="grid gap-2 rounded-xl bg-slate-50 p-3 text-sm">
            <Row
              label="Mentee"
              value={`${row.mentee_name} <${row.mentee_email}>`}
            />
            <Row
              label="Mentor"
              value={`${row.mentor_name} <${row.mentor_email}>`}
            />
            <Row label="Session" value={formatDateTime(row.session_start)} />
            <Row label="Ends" value={formatDateTime(row.session_end)} />
            <Row
              label="Cost"
              value={`NPR ${row.cost}`}
            />
            <Row
              label="Mentor share"
              value={`NPR ${row.mentor_share}`}
            />
            <Row
              label="Platform share"
              value={`NPR ${row.platform_share}`}
            />
            {row.promo_code ? (
              <Row label="Promo code" value={row.promo_code} />
            ) : null}
            {row.notes ? (
              <Row label="Internal notes" value={row.notes} />
            ) : null}
          </dl>

          <dl className="grid gap-2 rounded-xl bg-slate-50 p-3 text-sm">
            <Row
              label="Recorded by"
              value={row.created_by_admin_id}
            />
            <Row label="Recorded at" value={formatDateTime(row.created_at)} />
            {row.completed_at ? (
              <Row
                label="Completed at"
                value={formatDateTime(row.completed_at)}
              />
            ) : null}
            {row.review_token_expires_at ? (
              <Row
                label="Review link expires"
                value={formatDateTime(row.review_token_expires_at)}
              />
            ) : null}
          </dl>
        </div>

        <div className="sticky bottom-0 flex justify-end border-t border-slate-200 bg-white px-4 pt-3 pb-3 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-xs font-bold text-slate-500 uppercase">
        {label}
      </dt>
      <dd className="min-w-0 text-right text-sm font-bold text-slate-900">
        {value}
      </dd>
    </div>
  )
}