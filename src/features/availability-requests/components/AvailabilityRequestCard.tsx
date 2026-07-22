'use client'

import Image from 'next/image'
import { useState } from 'react'
import { AxiosError } from 'axios'
import {
  Check,
  CheckCircle2,
  CalendarClock,
  Clock,
  Copy,
  Loader2,
  MessageSquare,
  X,
} from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import { useConfirmAvailabilityRequest } from '../hooks/useAvailabilityRequests'
import type { AvailabilityRequestResponse } from '../types/availability-requests.types'
import { DURATION_BADGE, STATUS_BADGE, STATUS_LABEL } from '../lib/requestBadges'
import {
  formatRequestDateTimeRelative,
  formatTimeRange,
  getRequesterInitials,
} from '../lib/datetime'
import { RejectRequestModal } from './RejectRequestModal'

interface AvailabilityRequestCardProps {
  request: AvailabilityRequestResponse
  /**
   * Disable the action buttons. The mentor dashboard always sets this true
   * once the request leaves `pending`; the admin view always sets it true
   * because admins can't action on requests.
   */
  readOnly?: boolean
  /**
   * Render a `created_slot_id` chip when status is confirmed. Admin only.
   */
  showCreatedSlot?: boolean
  /**
   * Render the mentor identity row. Admin only.
   */
  showMentor?: boolean
}

export function AvailabilityRequestCard({
  request,
  readOnly = false,
  showCreatedSlot = false,
  showMentor = false,
}: AvailabilityRequestCardProps) {
  const [optimisticStatus, setOptimisticStatus] = useState(request.status)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [mentorCopied, setMentorCopied] = useState(false)

  const { mutate: confirm, isPending: confirming } = useConfirmAvailabilityRequest()
  const actionInFlight = confirming

  const status = optimisticStatus
  const isPending = status === 'pending'
  const canAct = isPending && !readOnly && !actionInFlight

  function handleConfirm() {
    setActionError(null)
    setOptimisticStatus('confirmed')
    confirm(
      { id: request.id },
      {
        onSuccess: () => toast.success('Confirmed — we emailed the requester with a booking link.'),
        onError: (err) => {
          setOptimisticStatus('pending')
          const msg = parseSlotOverlap(err)
          if (msg) {
            setActionError(msg)
            toast.error(msg)
          } else {
            setActionError('We could not confirm the request.')
            toast.error('We could not confirm the request.')
          }
        },
      }
    )
  }

  function handleRejected() {
    setOptimisticStatus('rejected')
    toast.success('Request rejected — the requester has been emailed.')
  }

  const initials = getRequesterInitials(request.requester_name, request.requester_email)
  const durationKey = String(request.duration_minutes) as '30' | '60' | '90'
  const mentor = request.mentor
  const mentorName = mentor?.full_name || `Mentor ${request.mentor_id.slice(0, 8)}`

  return (
    <>
      <article
        className={cn(
          'rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 transition sm:p-6',
          status !== 'pending' && 'opacity-90'
        )}
      >
        {showMentor ? (
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-[#f8f9ff] p-3 ring-1 ring-[#eff4ff]">
            <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-100 text-xs font-extrabold text-blue-700">
              {mentor?.avatar_url ? (
                <Image src={mentor.avatar_url} alt={mentorName} fill className="object-cover" />
              ) : (
                mentorName
                  .split(' ')
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-extrabold tracking-[0.14em] text-slate-400 uppercase">
                Mentor
              </p>
              <p className="truncate text-sm font-extrabold text-slate-900">{mentorName}</p>
              {mentor?.title ? (
                <p className="truncate text-xs font-medium text-slate-500">{mentor.title}</p>
              ) : null}
            </div>
            {mentor?.email ? (
              <button
                type="button"
                title={`Copy ${mentor.email}`}
                aria-label={`Copy mentor email ${mentor.email}`}
                onClick={() => {
                  void navigator.clipboard.writeText(mentor.email as string)
                  setMentorCopied(true)
                  window.setTimeout(() => setMentorCopied(false), 1600)
                }}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold text-slate-500 transition hover:bg-white hover:text-blue-700"
              >
                {mentorCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                <span className="hidden sm:inline">{mentorCopied ? 'Copied' : 'Copy email'}</span>
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            {/* Header row: avatar + name + email + status badge */}
            <div className="flex items-start gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-50 text-sm font-extrabold text-blue-700 shadow-sm sm:size-14">
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-[family-name:var(--font-headline)] text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">
                    {request.requester_name || request.requester_email}
                  </h3>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase ring-1 ring-inset',
                      STATUS_BADGE[status]
                    )}
                  >
                    {STATUS_LABEL[status]}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-extrabold ring-1 ring-inset',
                      DURATION_BADGE[durationKey]
                    )}
                  >
                    {request.duration_minutes} min
                  </span>
                </div>

                <a
                  href={`mailto:${request.requester_email}`}
                  className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-xs font-semibold text-blue-700 hover:underline sm:text-sm"
                >
                  {request.requester_email}
                </a>

                {/* Time row */}
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-600 sm:text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarClock className="size-3.5 text-slate-400" strokeWidth={2.4} />
                    {formatRequestDateTimeRelative(request.requested_start)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-slate-500">
                    <Clock className="size-3.5 text-slate-400" strokeWidth={2.4} />
                    {formatTimeRange(request.requested_start, request.requested_end)}
                  </span>
                </div>
              </div>
            </div>

            {/* Message */}
            {request.message ? (
              <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700 sm:p-4">
                <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-extrabold tracking-[0.16em] text-slate-500 uppercase">
                  <MessageSquare className="size-3" strokeWidth={2.4} />
                  Note from requester
                </div>
                <p className="text-sm leading-6 font-medium break-words whitespace-pre-wrap text-slate-700">
                  {request.message}
                </p>
              </div>
            ) : null}

            {/* Status-specific metadata */}
            {status === 'rejected' && request.rejection_reason ? (
              <div className="mt-3 rounded-2xl border border-red-100 bg-red-50/60 p-3 text-sm text-red-700">
                <p className="text-[10px] font-extrabold tracking-[0.16em] text-red-600 uppercase">
                  Your reply
                </p>
                <p className="mt-1 break-words">{request.rejection_reason}</p>
              </div>
            ) : null}

            {status === 'confirmed' ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 ring-1 ring-emerald-200 ring-inset">
                  <CheckCircle2 className="size-3" strokeWidth={2.4} />
                  Requester emailed
                </span>
                {showCreatedSlot && request.created_slot_id ? (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-slate-600 ring-1 ring-slate-200 ring-inset">
                    slot {request.created_slot_id.slice(0, 8)}
                  </span>
                ) : null}
              </div>
            ) : null}

            {actionError ? (
              <p
                role="alert"
                className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-3 text-xs font-medium text-amber-800"
              >
                <span className="font-extrabold">Heads up:</span> {actionError}
              </p>
            ) : null}
          </div>

          {/* Actions */}
          <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-stretch">
            {isPending ? (
              <>
                <Button
                  size="sm"
                  onClick={handleConfirm}
                  disabled={!canAct}
                  className="h-10 gap-1.5 rounded-xl bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-5 font-extrabold text-white shadow-[0_8px_18px_rgba(0,83,219,0.22)] hover:from-[#003fa8] hover:to-[#1d4ed8]"
                >
                  {confirming ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-4" strokeWidth={2.4} />
                  )}
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRejectOpen(true)}
                  disabled={!canAct}
                  className="h-10 gap-1.5 rounded-xl border-red-200 px-5 font-extrabold text-red-600 hover:bg-red-50"
                >
                  <X className="size-4" strokeWidth={2.4} />
                  Reject
                </Button>
              </>
            ) : (
              <span className="rounded-xl bg-slate-100 px-3 py-2 text-center text-xs font-semibold text-slate-500">
                {status === 'confirmed' ? 'Confirmed' : 'Rejected'}
              </span>
            )}
          </div>
        </div>

        {/* ID footer */}
        <p className="mt-4 font-mono text-[10px] tracking-wider text-slate-300 uppercase">
          Mentor {request.mentor_id.slice(0, 8)} · Request {request.id.slice(0, 8)} · Filed{' '}
          {new Date(request.created_at).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </article>

      {rejectOpen ? (
        <RejectRequestModal
          request={request}
          onClose={() => setRejectOpen(false)}
          onRejected={handleRejected}
        />
      ) : null}
    </>
  )
}

/**
 * Distinguish a slot-overlap 400 (the most useful message) from any other 4xx
 * the backend might return on confirm. Slot overlap means the mentor must
 * manually open a slot from the availability page.
 */
function parseSlotOverlap(err: unknown): string | null {
  if (!(err instanceof AxiosError)) return null
  const status = err.response?.status
  if (status !== 400 && status !== 422 && status !== 409) return null
  const data = err.response?.data as { detail?: string | unknown[] } | undefined
  const detail = data?.detail
  if (typeof detail !== 'string') return null
  const lower = detail.toLowerCase()
  if (lower.includes('overlap') || lower.includes('conflict') || lower.includes('slot')) {
    return `${detail} Open the slot manually from your Availability page if you'd still like to host this session.`
  }
  return null
}
