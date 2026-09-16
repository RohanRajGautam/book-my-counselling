'use client'

import { useState } from 'react'
import {
  Banknote,
  CalendarClock,
  Check,
  ExternalLink,
  FileText,
  Undo2,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

import { formatDateTime } from '../../lib/format'
import { PAYOUT_PAYMENT_METHOD_LABEL } from '../lib/payoutBadges'
import { usePayoutDetail } from '../hooks/useAdminPayouts'
import type { PayoutDetailResponse } from '../types/payouts.types'

import { AdminPayoutModalShell } from './AdminPayoutModalShell'
import { AdminPayoutStatusBadge } from './AdminPayoutStatusBadge'
import { AdminPayoutLineItemsTable } from './AdminPayoutLineItemsTable'
import { AdminPayoutMarkPaidModal } from './AdminPayoutMarkPaidModal'
import { AdminPayoutCancelModal } from './AdminPayoutCancelModal'

export interface AdminPayoutDetailProps {
  payoutId: string
  /** Optional pre-fetched payout (e.g. from the list query). */
  initial?: PayoutDetailResponse | null
  onClose: () => void
}

/**
 * Full payout + line items view. Modal body has three regions:
 *  1. Header — status, mentor, totals, period (if window-mode)
 *  2. Line items — with clawback badges per row
 *  3. Audit (notes + meta) — rendered with `whitespace-pre-wrap`
 *
 * Action buttons render conditionally based on `payout.status`:
 *  - pending  → Mark paid, Cancel
 *  - paid     → read-only banner ("No further actions")
 *  - cancelled→ read-only banner explaining the bookings flow back
 */
export function AdminPayoutDetail({ payoutId, initial, onClose }: AdminPayoutDetailProps) {
  const { data, isLoading, isError } = usePayoutDetail(payoutId)
  const [markPaidOpen, setMarkPaidOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)

  // Once the detail mutation lands (mark-paid / cancel) it updates the
  // cache via the hook's onSuccess — we just re-render.
  const live: PayoutDetailResponse | undefined = data ?? initial ?? undefined

  return (
    <>
      <AdminPayoutModalShell
        size="wide"
        title={
          live ? (
            <div className="flex flex-wrap items-center gap-2">
              <span>Payout · {live.id.slice(0, 8)}</span>
              <AdminPayoutStatusBadge status={live.status} />
            </div>
          ) : (
            'Payout detail'
          )
        }
        subtitle={
          live ? (
            <span className="block">
              Created {formatDateTime(live.created_at)} · {live.booking_count} booking
              {live.booking_count === 1 ? '' : 's'} ·{' '}
              <strong className="font-extrabold text-slate-700">NPR {live.total_amount}</strong>
            </span>
          ) : null
        }
        onClose={onClose}
      >
        {isLoading && !live ? (
          <div className="space-y-3">
            <div className="h-24 animate-pulse rounded-xl bg-slate-50" />
            <div className="h-32 animate-pulse rounded-xl bg-slate-50" />
            <div className="h-20 animate-pulse rounded-xl bg-slate-50" />
          </div>
        ) : isError && !live ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Couldn&apos;t load this payout. Try closing and reopening.
          </div>
        ) : live ? (
          <div className="space-y-5">
            {/* Clawback banner — informational only */}
            {live.has_clawbacks ? (
              <div className="flex items-start gap-2 rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm font-medium text-orange-900">
                <Undo2 className="mt-0.5 size-4 shrink-0 text-orange-700" />
                <div>
                  <p className="font-extrabold">
                    {live.items.filter((i) => i.clawed_back_at).length} item
                    {live.items.filter((i) => i.clawed_back_at).length === 1 ? '' : 's'} clawed back
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-orange-800/80">
                    {live.items.filter((i) => i.clawed_back_at).length === 1 ? 'A booking was' : 'Some bookings were'} refunded after this payout was marked paid.
                    The payout itself stays paid; the platform absorbs the loss on the affected items.
                  </p>
                </div>
              </div>
            ) : null}

            {/* Summary tiles */}
            <div className="grid gap-3 sm:grid-cols-3">
              <SummaryTile label="Total amount" value={`NPR ${live.total_amount}`} tone="blue" />
              <SummaryTile
                label="Bookings"
                value={live.booking_count.toString()}
                tone="slate"
                sub={live.period_start && live.period_end
                  ? `${new Date(live.period_start).toLocaleDateString()} → ${new Date(live.period_end).toLocaleDateString()}`
                  : null}
              />
              <SummaryTile
                label={live.status === 'paid' ? 'Paid' : live.status === 'cancelled' ? 'Cancelled' : 'Created'}
                value={formatDateTime(
                  live.status === 'paid'
                    ? live.paid_at ?? live.updated_at
                    : live.status === 'cancelled'
                      ? live.cancelled_at ?? live.updated_at
                      : live.created_at,
                )}
                tone={live.status === 'paid' ? 'emerald' : live.status === 'cancelled' ? 'slate' : 'amber'}
              />
            </div>

            {/* Payment metadata when paid */}
            {live.status === 'paid' && live.payment_method ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-sm">
                <p className="text-xs font-extrabold tracking-[0.14em] text-emerald-700 uppercase">
                  Payment
                </p>
                <p className="mt-1 font-bold text-emerald-900">
                  {PAYOUT_PAYMENT_METHOD_LABEL[live.payment_method]} ·{' '}
                  <span className="font-extrabold">{live.payment_reference}</span>
                </p>
              </div>
            ) : null}

            {/* Cancellation metadata when cancelled */}
            {live.status === 'cancelled' && live.cancellation_reason ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                <p className="text-xs font-extrabold tracking-[0.14em] text-slate-500 uppercase">
                  Cancellation reason
                </p>
                <p className="mt-1 font-bold text-slate-700">{live.cancellation_reason}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Bookings returned to the owed pool.
                </p>
              </div>
            ) : null}

            {/* Line items */}
            <section>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-extrabold tracking-[0.14em] text-slate-500 uppercase">
                  Line items
                </h3>
                {live.period_start && live.period_end ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                    <CalendarClock className="size-3" />
                    Window payout
                  </span>
                ) : null}
              </div>
              <AdminPayoutLineItemsTable items={live.items} showSnapshot />
            </section>

            {/* Notes — pre-wrap so the `\n--- paid ---\n` separator renders as a real line break */}
            {live.notes ? (
              <section>
                <h3 className="text-xs font-extrabold tracking-[0.14em] text-slate-500 uppercase">
                  Notes
                </h3>
                <pre className="mt-2 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-3 font-sans text-sm text-slate-700">
                  {live.notes}
                </pre>
              </section>
            ) : null}

            {/* Audit footer */}
            <section className="grid gap-3 sm:grid-cols-2">
              <AuditField
                label="Created"
                value={formatDateTime(live.created_at)}
                icon={<FileText className="size-3.5" />}
              />
              <AuditField
                label="Updated"
                value={formatDateTime(live.updated_at)}
                icon={<FileText className="size-3.5" />}
              />
            </section>

            {/* Actions */}
            <section className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
              {live.status === 'pending' ? (
                <>
                  <Button
                    variant="outline"
                    className="gap-1.5 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => setCancelOpen(true)}
                  >
                    <X className="size-3.5" />
                    Cancel payout
                  </Button>
                  <Button
                    className="gap-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => setMarkPaidOpen(true)}
                  >
                    <Banknote className="size-3.5" />
                    Mark paid
                  </Button>
                </>
              ) : null}

              {live.status === 'paid' ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
                  <Check className="size-3" />
                  Paid — no further actions
                </span>
              ) : null}

              {live.status === 'cancelled' ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-extrabold text-slate-600">
                  <X className="size-3" />
                  Cancelled — bookings returned to owed pool
                </span>
              ) : null}
            </section>

            {live.booking_count > 0 ? (
              <p className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                <ExternalLink className="size-3" />
                Booking IDs are clickable from the platform&apos;s bookings admin when available.
              </p>
            ) : null}
          </div>
        ) : null}
      </AdminPayoutModalShell>

      {markPaidOpen && live ? (
        <AdminPayoutMarkPaidModal
          key={live.id}
          payout={live}
          onClose={() => setMarkPaidOpen(false)}
        />
      ) : null}
      {cancelOpen && live ? (
        <AdminPayoutCancelModal
          key={live.id}
          payout={live}
          onClose={() => setCancelOpen(false)}
        />
      ) : null}
    </>
  )
}

function SummaryTile({
  label,
  value,
  sub,
  tone,
}: {
  label: string
  value: string
  sub?: string | null
  tone: 'blue' | 'emerald' | 'amber' | 'slate'
}) {
  const tones: Record<typeof tone, string> = {
    blue: 'bg-blue-50/70 border-blue-100',
    emerald: 'bg-emerald-50/70 border-emerald-100',
    amber: 'bg-amber-50/70 border-amber-100',
    slate: 'bg-slate-50 border-slate-100',
  }
  return (
    <div className={`rounded-xl border p-3 ${tones[tone]}`}>
      <p className="text-[10px] font-extrabold tracking-[0.14em] text-slate-500 uppercase">
        {label}
      </p>
      <p className="mt-1 font-headline text-base font-extrabold tracking-tight text-slate-950">
        {value}
      </p>
      {sub ? (
        <p className="mt-0.5 text-[11px] font-medium text-slate-500">{sub}</p>
      ) : null}
    </div>
  )
}

function AuditField({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 text-xs">
      {icon ? <span className="text-slate-400">{icon}</span> : null}
      <div className="min-w-0">
        <p className="text-[10px] font-extrabold tracking-[0.14em] text-slate-500 uppercase">
          {label}
        </p>
        <p className="mt-0.5 font-bold text-slate-700">{value}</p>
      </div>
    </div>
  )
}