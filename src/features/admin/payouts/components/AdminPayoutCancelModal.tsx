'use client'

import { useMemo, useState } from 'react'
import { AlertCircle, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { extractApiErrorDetail } from '../lib/payoutBadges'
import {
  EMPTY_CANCEL_FORM,
  validateCancelForm,
  type CancelFormValues,
} from '../lib/payoutValidation'
import { useCancelPayout } from '../hooks/useAdminPayouts'
import type { PayoutDetailResponse } from '../types/payouts.types'

import { AdminPayoutModalShell } from './AdminPayoutModalShell'

export interface AdminPayoutCancelModalProps {
  payout: PayoutDetailResponse
  onClose: () => void
}

export function AdminPayoutCancelModal({ payout, onClose }: AdminPayoutCancelModalProps) {
  // The parent passes `key={payout.id}` so this component remounts with
  // fresh state when a different payout is opened — no reset effect.
  const [form, setForm] = useState<CancelFormValues>(EMPTY_CANCEL_FORM)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { mutate, isPending } = useCancelPayout()

  const errors = useMemo(() => validateCancelForm(form), [form])
  const errorFor = (field: string) =>
    submitAttempted ? errors.find((e) => e.field === field)?.message : undefined
  const canSubmit = errors.length === 0 && !isPending

  const handleSubmit = () => {
    setSubmitAttempted(true)
    setErrorMsg(null)
    if (!canSubmit) return
    mutate(
      { id: payout.id, payload: { cancellation_reason: form.cancellation_reason.trim() } },
      {
        onSuccess: () => {
          toast.success('Payout cancelled. Bookings are back in the owed pool.')
          onClose()
        },
        onError: (err) => {
          setErrorMsg(extractApiErrorDetail(err) ?? 'Failed to cancel payout.')
        },
      },
    )
  }

  return (
    <AdminPayoutModalShell
      busy={isPending}
      title="Cancel payout"
      subtitle={
        <span>
          Cancelling will return {payout.booking_count} booking
          {payout.booking_count === 1 ? '' : 's'} back to the owed pool. The line items
          themselves remain as an audit trail.
        </span>
      }
      onClose={onClose}
    >
      <label className="block">
        <span className="text-xs font-extrabold tracking-wide text-slate-500 uppercase">
          Cancellation reason
        </span>
        <textarea
          rows={3}
          autoFocus
          required
          value={form.cancellation_reason}
          onChange={(e) =>
            setForm((p) => ({ ...p, cancellation_reason: e.target.value }))
          }
          placeholder="e.g. Mentor requested direct wire instead."
          disabled={isPending}
          className={`mt-1 w-full rounded-xl border bg-slate-50 p-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 ${
            errorFor('cancellation_reason') ? 'border-red-300' : 'border-slate-200'
          }`}
        />
        {errorFor('cancellation_reason') ? (
          <p className="mt-1 text-xs font-bold text-red-600">
            {errorFor('cancellation_reason')}
          </p>
        ) : (
          <p className="mt-1 text-xs text-slate-500">Shown in the audit trail.</p>
        )}
      </label>

      {errorMsg ? (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      ) : null}

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          Keep payout
        </Button>
        <Button
          className="gap-1.5 bg-red-600 text-white hover:bg-red-700"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
          Cancel payout
        </Button>
      </div>
    </AdminPayoutModalShell>
  )
}