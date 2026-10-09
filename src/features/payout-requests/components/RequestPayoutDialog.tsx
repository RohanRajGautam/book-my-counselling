'use client'

import { useEffect, useRef, useState } from 'react'
import { AxiosError } from 'axios'
import { Loader2, Send, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { useCreatePayoutRequest } from '../hooks/usePayoutRequests'
import {
  EMPTY_PAYOUT_REQUEST_FORM,
  validatePayoutRequestForm,
  type PayoutRequestFormValues,
} from '../lib/payoutRequestValidation'

interface RequestPayoutDialogProps {
  onClose: () => void
  /**
   * Optional context the parent can pass — for example, "this mentor's
   * mentor profile returned 404, so the button is disabled." We surface
   * the message inside the dialog so the mentor understands why they
   * can't file a request right now.
   */
  unavailableReason?: string | null
}

const MAX_MENTOR_MESSAGE = 1000

/**
 * Modal for filing a new payout request. Optional note (≤1000 chars) is
 * the only field. Surfaces the backend's 409 ("you already have an open
 * request") and 404 ("no MentorProfile row") as friendly toasts.
 */
export function RequestPayoutDialog({ onClose, unavailableReason }: RequestPayoutDialogProps) {
  const [form, setForm] = useState<PayoutRequestFormValues>(EMPTY_PAYOUT_REQUEST_FORM)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { mutate, isPending } = useCreatePayoutRequest()
  const isBlocked = !!unavailableReason
  const msgLen = form.mentor_message.trim().length

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

  const errors = validatePayoutRequestForm(form)
  const errorFor = (field: string) =>
    submitAttempted ? errors.find((e) => e.field === field)?.message : undefined
  const canSubmit = !isPending && !isBlocked && errors.length === 0

  function handleSubmit() {
    setSubmitAttempted(true)
    setErrorMsg(null)
    if (!canSubmit) return
    const trimmed = form.mentor_message.trim()
    mutate(
      { mentor_message: trimmed === '' ? null : trimmed },
      {
        onSuccess: () => {
          toast.success('Payout request sent — we&apos;ll nudge the admin team.')
          onClose()
        },
        onError: (err) => {
          const friendly = parsePayoutRequestError(err)
          if (friendly) {
            setErrorMsg(friendly)
            toast.error(friendly)
            return
          }
          setErrorMsg('We could not send the request. Please try again.')
          toast.error('We could not send the request. Please try again.')
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
        aria-labelledby="request-payout-title"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.16em] text-blue-700 uppercase">
              Request payout
            </p>
            <h2
              id="request-payout-title"
              className="mt-1 font-[family-name:var(--font-headline)] text-xl font-extrabold tracking-tight text-slate-950"
            >
              Ping the admin team?
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-500">
              We&apos;ll let admins know you&apos;d like your balance paid out. They&apos;ll
              acknowledge and proceed with the payment.
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

        {isBlocked ? (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800"
          >
            {unavailableReason}
          </p>
        ) : null}

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
            Note for admins (optional)
          </span>
          <textarea
            ref={textareaRef}
            rows={4}
            value={form.mentor_message}
            maxLength={MAX_MENTOR_MESSAGE}
            disabled={isPending || isBlocked}
            onChange={(e) => setForm({ mentor_message: e.target.value })}
            placeholder="E.g. Please pay by month-end if possible."
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
          />
          <span className="mt-1 block text-right text-[10px] font-bold text-slate-400 uppercase">
            {msgLen} / {MAX_MENTOR_MESSAGE}
          </span>
          {errorFor('mentor_message') ? (
            <p className="mt-1 text-xs font-bold text-red-600">{errorFor('mentor_message')}</p>
          ) : null}
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
            disabled={!canSubmit}
            className="h-10 gap-1.5 rounded-xl bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-4 font-extrabold text-white shadow-sm hover:from-[#003fa8] hover:to-[#1d4ed8]"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" strokeWidth={2.4} />
            )}
            Send request
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Map the create-request errors to a single line. 409 means a previous
 * request from this mentor is still open — we surface a friendly hint
 * instead of the raw server text. 404 means the user has no
 * `MentorProfile` row — the parent should have hidden the CTA, but if
 * we got here anyway, fall back to a generic message.
 */
function parsePayoutRequestError(err: unknown): string | null {
  if (!(err instanceof AxiosError)) return null
  const status = err.response?.status
  if (status === 409) {
    return 'You already have a pending payout request — wait for the admin to acknowledge it.'
  }
  if (status === 404) {
    return 'Your mentor profile is not fully set up. Finish onboarding to file a payout request.'
  }
  if (status === 403) {
    return 'Your session no longer has mentor access — sign in again.'
  }
  return null
}
