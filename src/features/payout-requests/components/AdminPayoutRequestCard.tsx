'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CheckCircle2, Copy, Loader2, MessageSquare, WalletCards } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { useAcknowledgePayoutRequest } from '../hooks/usePayoutRequests'
import type { PayoutRequestAdminRow } from '../types/payout-requests.types'
import {
  PAYOUT_REQUEST_STATUS_BADGE,
  PAYOUT_REQUEST_STATUS_LABEL,
} from '../lib/payoutRequestBadges'
import {
  formatPayoutRequestAmount,
  formatPayoutRequestDateTimeRelative,
  getPayoutRequestInitials,
} from '../lib/payoutRequestsFormat'

import { AcknowledgePayoutDialog } from './AcknowledgePayoutDialog'

interface AdminPayoutRequestCardProps {
  request: PayoutRequestAdminRow
}

const EMAIL_COPIED_RESET_MS = 1600

/**
 * Admin view of a single payout request. Shows mentor identity (name +
 * email), the snapshot balance, the eligible-booking count, the
 * mentor's note, and an Acknowledge button when status is `open`.
 */
export function AdminPayoutRequestCard({ request }: AdminPayoutRequestCardProps) {
  const [ackOpen, setAckOpen] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)
  const [optimisticStatus, setOptimisticStatus] = useState(request.status)

  // We track the mutation's pending state so the Acknowledge button
  // disables while the request is in flight. The actual mutation call
  // lives inside `AcknowledgePayoutDialog`.
  const { isPending } = useAcknowledgePayoutRequest()
  const status = optimisticStatus
  const isOpen = status === 'open'
  const canAck = isOpen && !isPending

  const initials = getPayoutRequestInitials(request.mentor_name)
  const bookingCount = request.eligible_booking_count
  const bookingLabel =
    bookingCount === 1 ? '1 eligible booking' : `${bookingCount} eligible bookings`

  function handleAck() {
    setAckOpen(true)
  }

  function handleAcknowledged() {
    setOptimisticStatus('acknowledged')
    toast.success(`Acknowledged — ${request.mentor_name} can see the read receipt on their end.`)
  }

  return (
    <>
      <article
        className={cn(
          'rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 transition sm:p-6',
          !isOpen && 'opacity-95'
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-[family-name:var(--font-headline)] text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">
                {request.mentor_name}
              </h3>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase ring-1 ring-inset',
                  PAYOUT_REQUEST_STATUS_BADGE[status]
                )}
              >
                {PAYOUT_REQUEST_STATUS_LABEL[status]}
              </span>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-extrabold text-blue-700 ring-1 ring-blue-200 ring-inset">
                {bookingLabel}
              </span>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 sm:text-sm">
              <span className="truncate">{request.mentor_email}</span>
              <button
                type="button"
                title={`Copy ${request.mentor_email}`}
                aria-label={`Copy mentor email ${request.mentor_email}`}
                onClick={() => {
                  void navigator.clipboard.writeText(request.mentor_email)
                  setEmailCopied(true)
                  window.setTimeout(() => setEmailCopied(false), EMAIL_COPIED_RESET_MS)
                  toast.success('Email copied')
                }}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-blue-700"
              >
                {emailCopied ? (
                  <CheckCircle2 className="size-3.5" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                {emailCopied ? 'Copied' : 'Copy email'}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-semibold text-slate-600 sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <WalletCards className="size-3.5 text-slate-400" strokeWidth={2.4} />
                {formatPayoutRequestAmount(request.balance_snapshot)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                Filed {formatPayoutRequestDateTimeRelative(request.created_at)}
              </span>
            </div>

            {request.mentor_message ? (
              <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700 sm:p-4">
                <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-extrabold tracking-[0.16em] text-slate-500 uppercase">
                  <MessageSquare className="size-3" strokeWidth={2.4} />
                  Note from mentor
                </div>
                <p className="text-sm leading-6 font-medium break-words whitespace-pre-wrap text-slate-700">
                  {request.mentor_message}
                </p>
              </div>
            ) : null}

            {status === 'acknowledged' && request.acknowledged_at ? (
              <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-3 text-sm text-blue-800 sm:p-4">
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-extrabold tracking-[0.16em] text-blue-700 uppercase">
                  Acknowledged
                  {request.acknowledged_by_admin_name ? (
                    <span className="text-blue-700/80">
                      by {request.acknowledged_by_admin_name}
                    </span>
                  ) : null}
                  <span className="text-blue-700/70">
                    · {formatPayoutRequestDateTimeRelative(request.acknowledged_at)}
                  </span>
                </div>
                {request.admin_note ? (
                  <p className="mt-1.5 text-sm leading-6 font-medium break-words whitespace-pre-wrap text-blue-900">
                    {request.admin_note}
                  </p>
                ) : (
                  <p className="mt-1 text-xs font-medium text-blue-700/80">No reply note left.</p>
                )}
              </div>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-stretch">
            {isOpen ? (
              <Button
                size="sm"
                onClick={handleAck}
                disabled={!canAck}
                className="h-10 gap-1.5 rounded-xl bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-5 font-extrabold text-white shadow-[0_8px_18px_rgba(0,83,219,0.22)] hover:from-[#003fa8] hover:to-[#1d4ed8]"
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-4" strokeWidth={2.4} />
                )}
                Acknowledge
              </Button>
            ) : (
              <span className="rounded-xl bg-blue-50 px-3 py-2 text-center text-xs font-extrabold text-blue-700 ring-1 ring-blue-200 ring-inset">
                Acknowledged
              </span>
            )}
            <Link
              href={`/admin/payouts?mentor=${encodeURIComponent(request.mentor_id)}`}
              title="Open the mentor's row in Mentor Payouts"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
            >
              <WalletCards className="size-4" strokeWidth={2.4} />
              Pay mentor
            </Link>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-50 text-[10px] font-extrabold text-blue-700 shadow-sm">
            {initials}
          </div>
          <p className="font-mono text-[10px] tracking-wider text-slate-300 uppercase">
            Mentor {request.mentor_id.slice(0, 8)} · Request {request.id.slice(0, 8)}
          </p>
        </div>
      </article>

      {ackOpen ? (
        <AcknowledgePayoutDialog
          request={request}
          onClose={() => setAckOpen(false)}
          onAcknowledged={handleAcknowledged}
        />
      ) : null}
    </>
  )
}
