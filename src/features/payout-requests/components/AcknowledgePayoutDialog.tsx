'use client'

import { useEffect, useRef, useState } from 'react'
import { AxiosError } from 'axios'
import { CheckCircle2, Loader2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { useAcknowledgePayoutRequest } from '../hooks/usePayoutRequests'
import type { PayoutRequestAdminRow } from '../types/payout-requests.types'
import { formatPayoutRequestAmount } from '../lib/payoutRequestsFormat'

interface AcknowledgePayoutDialogProps {
  request: PayoutRequestAdminRow
  onClose: () => void
  /**
   * Called after a successful acknowledgement. The parent flips state
   * to close the dialog. Optimistic updates aren't done here because
   * the list cache is invalidated on success — the parent just
   * re-renders with the new status.
   */
  onAcknowledged: () => void
}

const MAX_ADMIN_NOTE = 1000

/**
 * Modal for acknowledging an open payout request. The note is optional
 * (≤1000 chars) and is later shown to the mentor on their payout list.
 *
 * 400 from the backend means the request is no longer `open` (likely
 * another admin already acked it). We surface that as a friendly
 * "another admin beat you to it" toast and close so the queue refresh
 * matches.
 */
export function AcknowledgePayoutDialog({
  request,
  onClose,
  onAcknowledged,
}: AcknowledgePayoutDialogProps) {
  const [note, setNote] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { mutate, isPending } = useAcknowledgePayoutRequest()
  const noteLen = note.trim().length
  const tooLong = noteLen > MAX_ADMIN_NOTE

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !isPending) onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isPending, onClose])

  function handleSubmit() {
    setErrorMsg(null)
    if (tooLong) {
      setErrorMsg(`Note must be ${MAX_ADMIN_NOTE} characters or fewer.`)
      return
    }
    const trimmed = note.trim()
    mutate(
      { id: request.id, payload: { admin_note: trimmed === '' ? null : trimmed } },
      {
        onSuccess: () => {
          onAcknowledged()
          onClose()
        },
        onError: (err) => {
          const friendly = parseAcknowledgeError(err)
          setErrorMsg(friendly)
        },
      }
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isPending) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ack-payout-title"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.16em] text-blue-700 uppercase">
              Acknowledge request
            </p>
            <h2
              id="ack-payout-title"
              className="mt-1 font-[family-name:var(--font-headline)] text-xl font-extrabold tracking-tight text-slate-950"
            >
              Let the mentor know you saw this
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Acknowledging is a read receipt — funds still move through the regular{' '}
              <span className="font-bold text-slate-700">Mentor Payouts</span> flow.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Close"
            className="flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Request summary */}
        <div className="mt-4 rounded-2xl bg-slate-50 p-3">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xs font-extrabold text-blue-700">
              {request.mentor_name
                .split(/\s+/)
                .map((p) => p[0] ?? '')
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold text-slate-900">
                {request.mentor_name}
              </p>
              <p className="truncate text-xs font-semibold text-slate-500">
                {request.mentor_email}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                <span className="rounded-full bg-blue-100 px-2 py-0.5 font-extrabold text-blue-800">
                  {formatPayoutRequestAmount(request.balance_snapshot)}
                </span>
                <span className="text-slate-500">
                  ·{' '}
                  {request.eligible_booking_count === 1
                    ? '1 eligible booking'
                    : `${request.eligible_booking_count} eligible bookings`}
                </span>
              </div>
            </div>
          </div>

          {request.mentor_message ? (
            <div className="mt-3 rounded-xl bg-white p-3 ring-1 ring-slate-200/70">
              <p className="text-[10px] font-extrabold tracking-[0.16em] text-slate-500 uppercase">
                Mentor&apos;s note
              </p>
              <p className="mt-1 text-sm leading-6 font-medium break-words whitespace-pre-wrap text-slate-700">
                {request.mentor_message}
              </p>
            </div>
          ) : null}
        </div>

        {errorMsg ? (
          <p
            role="alert"
            className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
          >
            {errorMsg}
          </p>
        ) : null}

        <label className="mt-4 block">
          <span className="text-xs font-extrabold tracking-wide text-slate-500 uppercase">
            Reply note (optional, visible to mentor)
          </span>
          <textarea
            ref={textareaRef}
            rows={3}
            value={note}
            maxLength={MAX_ADMIN_NOTE}
            disabled={isPending}
            onChange={(e) => setNote(e.target.value)}
            placeholder='E.g. "Will wire Friday — thanks for the nudge."'
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
          />
          <span className="mt-1 block text-right text-[10px] font-bold text-slate-400 uppercase">
            {noteLen} / {MAX_ADMIN_NOTE}
          </span>
        </label>

        <div className="mt-2 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="h-10 rounded-xl border-slate-200 px-4 font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || tooLong}
            className="h-10 gap-1.5 rounded-xl bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-4 font-extrabold text-white shadow-sm hover:from-[#003fa8] hover:to-[#1d4ed8]"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4" strokeWidth={2.4} />
            )}
            Acknowledge
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Map the acknowledge-call errors per the spec: 400 means another admin
 * already acked (no longer open). 404 means the row was deleted. 403
 * means the JWT lost admin privileges. Anything else falls through to
 * a generic "try again" message.
 */
function parseAcknowledgeError(err: unknown): string {
  if (!(err instanceof AxiosError)) return 'We could not acknowledge the request. Please try again.'
  const status = err.response?.status
  if (status === 400) {
    return 'Already acknowledged — another admin beat you to it. The list will refresh shortly.'
  }
  if (status === 404) return 'Request not found — refresh and try again.'
  if (status === 403) return 'Admin session expired — please sign in again.'
  return 'We could not acknowledge the request. Please try again.'
}
