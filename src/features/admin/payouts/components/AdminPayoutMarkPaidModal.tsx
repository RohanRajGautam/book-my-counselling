'use client'

import { useMemo, useState } from 'react'
import { AlertCircle, Banknote, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { extractApiErrorDetail } from '../lib/payoutBadges'
import {
  EMPTY_MARK_PAID_FORM,
  PAYMENT_METHOD_LABEL,
  validateMarkPaidForm,
  type MarkPaidFormValues,
} from '../lib/payoutValidation'
import { useMarkPayoutPaid } from '../hooks/useAdminPayouts'
import type { PayoutDetailResponse } from '../types/payouts.types'

import { AdminPayoutModalShell } from './AdminPayoutModalShell'

export interface AdminPayoutMarkPaidModalProps {
  payout: PayoutDetailResponse
  onClose: () => void
}

const MAX_REF = 255

export function AdminPayoutMarkPaidModal({ payout, onClose }: AdminPayoutMarkPaidModalProps) {
  // The parent passes `key={payout.id}` so this component remounts with
  // fresh state when a different payout is opened — no reset effect.
  const [form, setForm] = useState<MarkPaidFormValues>(EMPTY_MARK_PAID_FORM)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { mutate, isPending } = useMarkPayoutPaid()

  const errors = useMemo(() => validateMarkPaidForm(form), [form])
  const errorFor = (field: string) =>
    submitAttempted ? errors.find((e) => e.field === field)?.message : undefined

  const refLen = form.payment_reference.trim().length
  const canSubmit = errors.length === 0 && !isPending

  const handleSubmit = () => {
    setSubmitAttempted(true)
    setErrorMsg(null)
    if (!canSubmit) return
    const trimmedNotes = form.notes.trim()
    mutate(
      {
        id: payout.id,
        payload: {
          payment_method: form.payment_method,
          payment_reference: form.payment_reference.trim(),
          ...(trimmedNotes ? { notes: trimmedNotes } : {}),
        },
      },
      {
        onSuccess: () => {
          toast.success('Payout marked paid. Bookings are now locked out of /owed.')
          onClose()
        },
        onError: (err) => {
          setErrorMsg(extractApiErrorDetail(err) ?? 'Failed to mark payout paid.')
        },
      },
    )
  }

  const inputCls = (hasError: boolean) =>
    `w-full rounded-xl border bg-slate-50 p-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 ${
      hasError ? 'border-red-300' : 'border-slate-200'
    }`

  return (
    <AdminPayoutModalShell
      busy={isPending}
      title="Mark payout as paid"
      subtitle={
        <span>
          Recording a wire of{' '}
          <strong className="font-extrabold text-slate-700">NPR {payout.total_amount}</strong> for{' '}
          {payout.booking_count} booking{payout.booking_count === 1 ? '' : 's'}. This is
          irreversible from this view.
        </span>
      }
      onClose={onClose}
    >
      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-xs font-extrabold tracking-[0.14em] text-slate-500 uppercase">
          Total disbursed
        </p>
        <p className="mt-1 font-headline text-2xl font-extrabold tracking-tight text-slate-950">
          NPR {payout.total_amount}
        </p>
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-extrabold tracking-wide text-slate-500 uppercase">
          Payment method
        </span>
        <select
          value={form.payment_method}
          onChange={(e) =>
            setForm((p) => ({ ...p, payment_method: e.target.value as MarkPaidFormValues['payment_method'] }))
          }
          disabled={isPending}
          className={`mt-1 ${inputCls(Boolean(errorFor('payment_method')))}`}
        >
          {(Object.entries(PAYMENT_METHOD_LABEL) as [MarkPaidFormValues['payment_method'], string][]).map(
            ([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ),
          )}
        </select>
      </label>

      <label className="mt-3 block">
        <span className="text-xs font-extrabold tracking-wide text-slate-500 uppercase">
          Payment reference
        </span>
        <input
          type="text"
          autoFocus
          required
          maxLength={MAX_REF}
          value={form.payment_reference}
          onChange={(e) => setForm((p) => ({ ...p, payment_reference: e.target.value }))}
          placeholder="e.g. FNB-2026-09-16-001"
          disabled={isPending}
          className={`mt-1 ${inputCls(Boolean(errorFor('payment_reference')))}`}
        />
        <div className="mt-1 flex items-center justify-between text-xs">
          {errorFor('payment_reference') ? (
            <p className="font-bold text-red-600">{errorFor('payment_reference')}</p>
          ) : (
            <p className="text-slate-500">
              Bank txn id, eSewa ref, etc. — what you&apos;d find if you audited this.
            </p>
          )}
          <span
            className={`shrink-0 font-bold ${refLen > MAX_REF ? 'text-red-600' : 'text-slate-400'}`}
          >
            {refLen}/{MAX_REF}
          </span>
        </div>
      </label>

      <label className="mt-3 block">
        <span className="text-xs font-extrabold tracking-wide text-slate-500 uppercase">
          Note (optional, appended to existing notes)
        </span>
        <textarea
          rows={2}
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          placeholder="e.g. Wired via NIC Asia"
          disabled={isPending}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </label>

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
          className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Banknote className="size-4" />
          )}
          Confirm payment
        </Button>
      </div>
    </AdminPayoutModalShell>
  )
}