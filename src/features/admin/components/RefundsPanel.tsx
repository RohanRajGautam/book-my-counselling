'use client'

import { useState } from 'react'
import {
  Banknote, Check, ChevronLeft, ChevronRight, Loader2,
  RotateCcw, ShieldAlert, X,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  useAdminRefunds,
  useApproveRefund,
  useMarkRefundProcessed,
  useRejectRefund,
} from '../hooks/useAdminRefunds'
import { RefundReason, RefundRequest, RefundStatus } from '../types/admin.types'

type Tab = { id: RefundStatus | 'all'; label: string; status: RefundStatus | undefined; emptyMsg: string }

const TABS: Tab[] = [
  { id: 'requested', label: 'Pending', status: 'requested', emptyMsg: 'No refunds waiting for review.' },
  { id: 'approved', label: 'Approved', status: 'approved', emptyMsg: 'No approved refunds awaiting processing.' },
  { id: 'processed', label: 'Processed', status: 'processed', emptyMsg: 'No completed refunds yet.' },
  { id: 'rejected', label: 'Rejected', status: 'rejected', emptyMsg: 'No rejected refunds.' },
  { id: 'all', label: 'All', status: undefined, emptyMsg: 'No refunds yet.' },
]

const REASON_LABEL: Record<RefundReason, string> = {
  mentee_cancellation: 'Mentee cancelled',
  mentor_cancellation: 'Mentor cancelled',
  admin_cancellation: 'Admin cancelled',
  slot_conflict: 'Slot conflict (auto)',
  other: 'Other',
}

const STATUS_BADGE: Record<RefundStatus, { label: string; cls: string }> = {
  requested: { label: 'PENDING', cls: 'bg-amber-100 text-amber-700' },
  approved: { label: 'APPROVED', cls: 'bg-blue-100 text-blue-700' },
  processed: { label: 'PROCESSED', cls: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'REJECTED', cls: 'bg-red-100 text-red-600' },
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

export function RefundsPanel() {
  const [tabId, setTabId] = useState<Tab['id']>('requested')
  const [page, setPage] = useState(1)

  const activeTab = TABS.find((t) => t.id === tabId)!
  const { data, isLoading } = useAdminRefunds(activeTab.status, page)
  const refunds = data?.items ?? []

  const handleTabChange = (id: Tab['id']) => {
    setTabId(id)
    setPage(1)
  }

  return (
    <div>
      {/* Sub-tabs */}
      <div className="mt-4 flex flex-wrap gap-1 rounded-2xl bg-white p-1 shadow-sm">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => handleTabChange(t.id)}
            className={`flex-1 min-w-[5.5rem] whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-extrabold transition ${
              tabId === t.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="mt-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-white" />
            ))}
          </div>
        ) : refunds.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-400">{activeTab.emptyMsg}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {refunds.map((r) => (
              <RefundRow key={r.id} refund={r} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {data && data.total_pages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={!data.has_prev}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-semibold text-slate-600">
              {data.page} / {data.total_pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={!data.has_next}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function RefundRow({ refund }: { refund: RefundRequest }) {
  const [open, setOpen] = useState(false)
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
          setOpen(false)
        },
        onError: () => toast.error('Failed to reject refund.'),
      },
    )

  const badge = STATUS_BADGE[refund.status]
  const isSlotConflict = refund.reason === 'slot_conflict'

  return (
    <>
      <article className="rounded-2xl bg-white p-5 shadow-sm">
        {/* Header row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-headline text-lg font-extrabold text-slate-950">
                NPR {refund.amount}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${badge.cls}`}
              >
                {badge.label}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-600">
                {REASON_LABEL[refund.reason]}
              </span>
              {isSlotConflict && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-extrabold text-red-600">
                  <ShieldAlert className="size-3" />
                  AUTO-RAISED
                </span>
              )}
            </div>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Requested {formatDateTime(refund.requested_at)}
              {refund.requested_by ? ` by ${refund.requested_by.full_name}` : ''}
            </p>
            {refund.booking && (
              <p className="mt-2 text-sm text-slate-700">
                <span className="font-bold">Session:</span>{' '}
                {refund.booking.topic || 'Untitled'} —{' '}
                {formatDateTime(refund.booking.session_start)}
              </p>
            )}
            {refund.reason_notes && (
              <p className="mt-2 line-clamp-2 text-xs text-slate-500">
                <span className="font-bold">Notes:</span> {refund.reason_notes}
              </p>
            )}
            {refund.decision_notes && (
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                <span className="font-bold">Admin:</span> {refund.decision_notes}
              </p>
            )}
            {refund.fonepay_refund_reference && (
              <p className="mt-1 text-xs text-emerald-700">
                <span className="font-bold">Fonepay ref:</span>{' '}
                {refund.fonepay_refund_reference}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex shrink-0 flex-wrap gap-2">
            {refund.status === 'requested' && (
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
                  onClick={() => setOpen(true)}
                >
                  <X className="size-3.5" />
                  Reject
                </Button>
              </>
            )}
            {refund.status === 'approved' && (
              <Button
                size="sm"
                className="gap-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setProcessOpen(true)}
              >
                <Banknote className="size-3.5" />
                Mark Processed
              </Button>
            )}
            {refund.status === 'processed' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
                <Check className="size-3" />
                Completed
              </span>
            )}
            {refund.status === 'rejected' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-xs font-extrabold text-red-600">
                <X className="size-3" />
                Rejected
              </span>
            )}
          </div>
        </div>
      </article>

      {open && (
        <RejectModal
          onClose={() => setOpen(false)}
          onSubmit={handleReject}
          submitting={rejecting}
        />
      )}
      {processOpen && (
        <MarkProcessedModal
          refund={refund}
          onClose={() => setProcessOpen(false)}
        />
      )}
    </>
  )
}

// ── Reject modal ───────────────────────────────────────────────────────────

function RejectModal({
  onClose,
  onSubmit,
  submitting,
}: {
  onClose: () => void
  onSubmit: (notes: string) => void
  submitting: boolean
}) {
  const [notes, setNotes] = useState('')

  return (
    <ModalShell title="Reject refund" onClose={onClose}>
      <p className="text-sm text-slate-500">
        The mentee will be notified by email. A short reason helps reduce
        follow-up support tickets.
      </p>
      <textarea
        className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        rows={3}
        placeholder="Reason (will be shown to mentee, optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={submitting}
      />
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          className="gap-1.5 bg-red-600 text-white hover:bg-red-700"
          onClick={() => onSubmit(notes.trim())}
          disabled={submitting}
        >
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
          Reject refund
        </Button>
      </div>
    </ModalShell>
  )
}

// ── Mark-processed modal ───────────────────────────────────────────────────

function MarkProcessedModal({
  refund,
  onClose,
}: {
  refund: RefundRequest
  onClose: () => void
}) {
  const [reference, setReference] = useState('')
  const [notes, setNotes] = useState('')
  const { mutate, isPending } = useMarkRefundProcessed()

  const canSubmit = reference.trim().length > 0 && !isPending

  const handleSubmit = () => {
    if (!canSubmit) return
    mutate(
      { id: refund.id, reference: reference.trim(), notes: notes.trim() || undefined },
      {
        onSuccess: () => {
          toast.success('Refund marked as processed. Mentee notified.')
          onClose()
        },
        onError: () => toast.error('Failed to mark refund processed.'),
      },
    )
  }

  return (
    <ModalShell title="Mark refund processed" onClose={onClose}>
      <p className="text-sm text-slate-500">
        After you&apos;ve reversed the payment in Fonepay&apos;s merchant
        portal, paste the Fonepay reference below. The booking will flip to
        <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 text-xs">refunded</code>
        and the mentee will receive a completion email.
      </p>
      <label className="mt-4 block">
        <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
          Fonepay refund reference
        </span>
        <input
          type="text"
          required
          autoFocus
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="e.g. FNP-REF-123456"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          disabled={isPending}
        />
      </label>
      <label className="mt-3 block">
        <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
          Internal note (optional)
        </span>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything to record about this refund"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          disabled={isPending}
        />
      </label>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw className="size-4" />}
          Mark processed
        </Button>
      </div>
    </ModalShell>
  )
}

// ── Modal shell ────────────────────────────────────────────────────────────

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-headline text-lg font-extrabold text-slate-950">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

