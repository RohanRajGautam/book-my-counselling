'use client'

import { useState } from 'react'
import { Banknote, Check, ShieldAlert, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { RefundRequest } from '../../types/admin.types'
import { formatDateTime } from '../../lib/format'
import {
  REFUND_REASON_LABEL,
  REFUND_STATUS_BADGE,
} from '../lib/refundBadges'
import {
  useApproveRefund,
  useRejectRefund,
} from '../hooks/useAdminRefunds'
import { AdminRejectRefundModal } from './AdminRejectRefundModal'
import { AdminProcessRefundModal } from './AdminProcessRefundModal'

export function AdminRefundCard({ refund }: { refund: RefundRequest }) {
  const [rejectOpen, setRejectOpen] = useState(false)
  const [processOpen, setProcessOpen] = useState(false)

  const { mutate: approve, isPending: approving } = useApproveRefund()
  const { mutate: reject, isPending: rejecting } = useRejectRefund()

  const handleApprove = () =>
    approve(
      { id: refund.id },
      {
        onSuccess: () => toast.success('Refund approved.'),
        onError: () => toast.error('Failed to approve refund.'),
      },
    )

  const handleReject = (notes: string) =>
    reject(
      { id: refund.id, notes },
      {
        onSuccess: () => {
          toast.success('Refund rejected.')
          setRejectOpen(false)
        },
        onError: () => toast.error('Failed to reject refund.'),
      },
    )

  const badge = REFUND_STATUS_BADGE[refund.status]
  const isSlotConflict = refund.reason === 'slot_conflict'
  const refundAmount = parseFloat(refund.amount)
  const bookingOriginal = refund.booking ? parseFloat(refund.booking.original_price) : NaN
  const showOriginalContext =
    refund.booking && Number.isFinite(bookingOriginal) && bookingOriginal > refundAmount

  return (
    <>
      <article className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-headline text-lg font-extrabold text-slate-950">
                NPR {refund.amount}
              </span>
              {showOriginalContext ? (
                <span className="text-xs font-semibold text-slate-500">
                  of original NPR {refund.booking!.original_price}
                </span>
              ) : null}
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${badge.cls}`}
              >
                {badge.label}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-600">
                {REFUND_REASON_LABEL[refund.reason]}
              </span>
              {isSlotConflict ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-extrabold text-red-600">
                  <ShieldAlert className="size-3" />
                  AUTO-RAISED
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Requested {formatDateTime(refund.requested_at)}
              {refund.requested_by ? ` by ${refund.requested_by.full_name}` : ''}
            </p>
            {refund.booking ? (
              <p className="mt-2 text-sm text-slate-700">
                <span className="font-bold">Session:</span>{' '}
                {refund.booking.topic || 'Untitled'} —{' '}
                {formatDateTime(refund.booking.session_start)}
              </p>
            ) : null}
            {refund.reason_notes ? (
              <p className="mt-2 line-clamp-2 text-xs text-slate-500">
                <span className="font-bold">Notes:</span> {refund.reason_notes}
              </p>
            ) : null}
            {refund.decision_notes ? (
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                <span className="font-bold">Admin:</span> {refund.decision_notes}
              </p>
            ) : null}
            {refund.fonepay_refund_reference ? (
              <p className="mt-1 text-xs text-emerald-700">
                <span className="font-bold">Fonepay ref:</span>{' '}
                {refund.fonepay_refund_reference}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            {refund.status === 'requested' ? (
              <>
                <Button
                  size="sm"
                  className="gap-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                  disabled={approving || rejecting}
                  onClick={handleApprove}
                >
                  <Check className="size-3.5" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                  disabled={approving || rejecting}
                  onClick={() => setRejectOpen(true)}
                >
                  <X className="size-3.5" />
                  Reject
                </Button>
              </>
            ) : null}
            {refund.status === 'approved' ? (
              <Button
                size="sm"
                className="gap-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setProcessOpen(true)}
              >
                <Banknote className="size-3.5" />
                Mark Processed
              </Button>
            ) : null}
            {refund.status === 'processed' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
                <Check className="size-3" />
                Completed
              </span>
            ) : null}
            {refund.status === 'rejected' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-xs font-extrabold text-red-600">
                <X className="size-3" />
                Rejected
              </span>
            ) : null}
          </div>
        </div>
      </article>

      {rejectOpen ? (
        <AdminRejectRefundModal
          onClose={() => setRejectOpen(false)}
          onSubmit={handleReject}
          submitting={rejecting}
        />
      ) : null}
      {processOpen ? (
        <AdminProcessRefundModal
          refund={refund}
          onClose={() => setProcessOpen(false)}
        />
      ) : null}
    </>
  )
}
