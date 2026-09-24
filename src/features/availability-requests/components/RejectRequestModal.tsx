'use client'

import { useEffect, useRef, useState } from 'react'
import { AxiosError } from 'axios'
import { Loader2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  useAdminRejectAvailabilityRequest,
  useRejectAvailabilityRequest,
} from '../hooks/useAvailabilityRequests'
import type { AvailabilityRequestResponse } from '../types/availability-requests.types'
import { formatRequestDateTimeRelative } from '../lib/datetime'

type Actor = 'mentor' | 'admin'

interface RejectRequestModalProps {
  request: AvailabilityRequestResponse
  onClose: () => void
  onRejected: () => void
  /**
   * Which actor's reject endpoint to hit. `'mentor'` (default) hits the
   * mentor-only endpoint with ownership checks. `'admin'` hits the admin
   * endpoint, which acts on any mentor's pending request.
   */
  actor?: Actor
}

/**
 * Modal for rejecting a pending request. Sends the optional reason to the
 * backend, optimistically closes on success, and surfaces backend errors as a
 * non-fatal alert at the top of the dialog.
 */
export function RejectRequestModal({
  request,
  onClose,
  onRejected,
  actor = 'mentor',
}: RejectRequestModalProps) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { mutate: rejectAsMentor, isPending: pendingAsMentor } = useRejectAvailabilityRequest()
  const { mutate: rejectAsAdmin, isPending: pendingAsAdmin } = useAdminRejectAvailabilityRequest()
  const { mutate, isPending } =
    actor === 'admin'
      ? { mutate: rejectAsAdmin, isPending: pendingAsAdmin }
      : { mutate: rejectAsMentor, isPending: pendingAsMentor }
  const canSubmit = !isPending

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Close on escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !isPending) onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isPending, onClose])

  function handleSubmit() {
    setError(null)
    const trimmed = reason.trim()
    if (trimmed.length > 2000) {
      setError('Reason must be 2000 characters or fewer.')
      return
    }
    mutate(
      { id: request.id, payload: { reason: trimmed || null } },
      {
        onSuccess: () => {
          onRejected()
          onClose()
        },
        onError: (err) => {
          setError(parseAdminRejectError(err, actor))
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
        aria-labelledby="reject-modal-title"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.16em] text-red-600 uppercase">
              Reject request
            </p>
            <h2
              id="reject-modal-title"
              className="mt-1 font-[family-name:var(--font-headline)] text-xl font-extrabold tracking-tight text-slate-950"
            >
              Decline this availability request?
            </h2>
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
        <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm">
          <p className="font-bold text-slate-800">{request.requester_name}</p>
          <p className="text-slate-500">{request.requester_email}</p>
          <p className="mt-1.5 text-xs font-semibold text-slate-500">
            {formatRequestDateTimeRelative(request.requested_start)} · {request.duration_minutes}{' '}
            min
          </p>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
          >
            {error}
          </p>
        ) : null}

        <label className="mt-4 block">
          <span className="text-xs font-extrabold tracking-wide text-slate-500 uppercase">
            Reason (optional)
          </span>
          <textarea
            ref={textareaRef}
            rows={4}
            value={reason}
            maxLength={2000}
            disabled={isPending}
            onChange={(e) => setReason(e.target.value)}
            placeholder="E.g. Outside working hours — feel free to pick a weekday afternoon."
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 disabled:opacity-60"
          />
          <span className="mt-1 block text-right text-[10px] font-bold text-slate-400 uppercase">
            {reason.length} / 2000
          </span>
        </label>

        <div className="mt-2 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="h-10 rounded-xl border-slate-200 px-4 font-bold text-slate-700 hover:bg-slate-50"
          >
            Keep request
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="h-10 gap-1.5 rounded-xl bg-red-600 px-4 font-extrabold text-white shadow-sm hover:bg-red-700"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <X className="size-4" strokeWidth={2.4} />
            )}
            Reject request
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Distinguish admin-specific reject errors per the
 * admin-availability-request-actions spec. 404 means the request was deleted
 * or moved out from under us — refresh and try again. 403 means the JWT is no
 * longer an admin session. Falls through to a generic "try again" for mentor
 * actors and other status codes.
 */
function parseAdminRejectError(err: unknown, actor: Actor): string {
  if (actor !== 'admin') return 'We could not send the rejection. Please try again.'
  if (!(err instanceof AxiosError)) return 'We could not send the rejection. Please try again.'
  const status = err.response?.status
  if (status === 404) return 'Request not found — refresh and try again.'
  if (status === 403) return 'Admin session expired — please sign in again.'
  return 'We could not send the rejection. Please try again.'
}
