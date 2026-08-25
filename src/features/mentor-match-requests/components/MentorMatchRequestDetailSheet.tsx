'use client'

import { useState } from 'react'
import { AxiosError } from 'axios'
import { AlertTriangle, ExternalLink, Loader2, Mail } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { useAdminMentorMatchRequest, useUpdateAdminMentorMatchRequest } from '../hooks/useMentorMatchRequests'
import {
  type MentorMatchRequestStatus,
  type MentorMatchResponse,
  MENTOR_MATCH_STATUSES,
} from '../types/mentor-match-requests.types'
import { badgeClasses, STATUS_LABEL, isTerminalStatus } from '../lib/requestBadges'
import { formatAbsoluteTime, formatRelativeTime } from '../lib/datetime'

interface MentorMatchRequestDetailSheetProps {
  requestId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface BackendError {
  detail?: string
}

function parseApiError(err: unknown): { terminal?: boolean; message: string } | null {
  if (!(err instanceof AxiosError)) return null
  const data = err.response?.data as BackendError | undefined
  const status = err.response?.status
  const detail = data?.detail
  if (status === 400 && typeof detail === 'string') {
    const lower = detail.toLowerCase()
    if (lower.includes('terminal')) {
      return { terminal: true, message: detail }
    }
    return { message: detail }
  }
  if (typeof detail === 'string') return { message: detail }
  return null
}

export function MentorMatchRequestDetailSheet({
  requestId,
  open,
  onOpenChange,
}: MentorMatchRequestDetailSheetProps) {
  const { data: request, isLoading, isFetching } = useAdminMentorMatchRequest(open ? requestId : null)
  const updateMutation = useUpdateAdminMentorMatchRequest()

  const [status, setStatus] = useState<MentorMatchRequestStatus>('pending')
  const [adminNotes, setAdminNotes] = useState('')
  const [terminalError, setTerminalError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [trackedId, setTrackedId] = useState<string | null>(null)

  // Compare-and-reset pattern (https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes).
  // React allows setState during render — they get batched into the same commit,
  // so there's no cascading render.
  if (request && request.id !== trackedId) {
    setTrackedId(request.id)
    setStatus(request.status)
    setAdminNotes(request.admin_notes ?? '')
    setTerminalError(null)
    setSaveError(null)
  }

  async function handleSave() {
    if (!request) return
    setTerminalError(null)
    setSaveError(null)

    const payload: { status?: MentorMatchRequestStatus; admin_notes?: string | null } = {}
    if (status !== request.status) payload.status = status
    const trimmed = adminNotes.trim()
    const currentNotes = request.admin_notes ?? ''
    if (trimmed !== currentNotes) payload.admin_notes = trimmed.length ? trimmed : null
    // Sending `{}` is allowed per the backend — it just bumps the audit fields.

    try {
      await updateMutation.mutateAsync({ id: request.id, payload })
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      if (parsed?.terminal) {
        setTerminalError(parsed.message)
        return
      }
      if (parsed?.message) {
        setSaveError(parsed.message)
        return
      }
      setSaveError('We could not save your changes. Please try again.')
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton
        className="flex w-full flex-col gap-0 overflow-hidden border-l-0 bg-white p-0 shadow-2xl/30 sm:max-w-xl"
      >
        <SheetHeader className="flex flex-col gap-3 border-b border-slate-100 px-6 pt-6 pb-5">
          {isLoading || !request ? (
            <SheetTitle className="font-[family-name:var(--font-headline)] text-xl font-extrabold tracking-tight text-slate-950">
              Loading request…
            </SheetTitle>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className={badgeClasses(request.status)}>{STATUS_LABEL[request.status]}</span>
                {isFetching && !isLoading ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold tracking-[0.16em] text-slate-400 uppercase">
                    <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                    Refreshing
                  </span>
                ) : null}
              </div>
              <SheetTitle className="font-[family-name:var(--font-headline)] text-2xl font-extrabold tracking-tight text-slate-950">
                {request.preferred_expertise}
              </SheetTitle>
              <SheetDescription className="text-sm font-medium text-slate-600">
                {request.requester_name} · {request.requester_email}
              </SheetDescription>
              <a
                href={`mailto:${request.requester_email}`}
                className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-[var(--brand-blue-soft)] px-2.5 py-1 text-xs font-bold text-[var(--brand-blue)] transition hover:bg-[var(--brand-blue)]/15"
              >
                <Mail className="size-3.5" aria-hidden="true" />
                Send email
                <ExternalLink className="size-3" aria-hidden="true" />
              </a>
            </>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isLoading || !request ? (
            <DetailSkeleton />
          ) : (
            <DetailBody
              request={request}
              status={status}
              adminNotes={adminNotes}
              onStatusChange={setStatus}
              onAdminNotesChange={setAdminNotes}
            />
          )}
        </div>

        {request ? (
          <footer className="border-t border-slate-100 bg-white px-6 pt-4 pb-5">
            {terminalError ? (
              <div
                role="alert"
                className="mb-4 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm font-medium text-amber-900"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
                <div>
                  <p className="font-extrabold">This request is closed.</p>
                  <p className="mt-0.5 text-xs font-medium text-amber-800">{terminalError}</p>
                  <p className="mt-1 text-xs font-medium text-amber-800">
                    File a fresh request instead of reopening this one.
                  </p>
                </div>
              </div>
            ) : null}

            {saveError ? (
              <div
                role="alert"
                className="mb-4 rounded-2xl border border-red-200 bg-red-50/80 px-3.5 py-3 text-sm font-medium text-red-700"
              >
                {saveError}
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--brand-blue)] px-6 text-sm font-bold text-white shadow-[0_10px_22px_rgba(7,85,216,0.22)] transition hover:bg-[var(--brand-blue-hover)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Saving…
                  </>
                ) : (
                  'Save changes'
                )}
              </button>
            </div>
          </footer>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

interface DetailBodyProps {
  request: MentorMatchResponse
  status: MentorMatchRequestStatus
  adminNotes: string
  onStatusChange: (next: MentorMatchRequestStatus) => void
  onAdminNotesChange: (next: string) => void
}

function DetailBody({
  request,
  status,
  adminNotes,
  onStatusChange,
  onAdminNotesChange,
}: DetailBodyProps) {
  const terminal = isTerminalStatus(request.status)
  return (
    <div className="space-y-6">
      <Section title="What they’re looking for">
        <div className="space-y-4">
          <SummaryItem label="Expertise" value={request.preferred_expertise} />
          {request.preferred_industry ? (
            <SummaryItem label="Industry" value={request.preferred_industry} />
          ) : null}
          {request.current_role ? (
            <SummaryItem label="Current role" value={request.current_role} />
          ) : null}
          {request.preferred_session_format ? (
            <SummaryItem
              label="Session format"
              value={request.preferred_session_format}
            />
          ) : null}
          {request.timeline ? (
            <SummaryItem label="Timeline" value={request.timeline} />
          ) : null}
          {request.preferred_at ? (
            <SummaryItem
              label="Preferred time"
              value={formatAbsoluteTime(request.preferred_at)}
            />
          ) : null}
          <SummaryItem label="Goals" value={request.goals} fullWidth multiline />
          {request.additional_notes ? (
            <SummaryItem
              label="Additional notes"
              value={request.additional_notes}
              fullWidth
              multiline
            />
          ) : null}
        </div>
      </Section>

      <Section title="Contact">
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
          <SummaryItem label="Name" value={request.requester_name} />
          <SummaryItem label="Email" value={request.requester_email} />
          {request.phone ? <SummaryItem label="Phone" value={request.phone} /> : null}
        </div>
      </Section>

      <Section title="Status">
        <label
          htmlFor="mmr-admin-status"
          className="font-[family-name:var(--font-label)] text-xs font-extrabold tracking-[0.14em] text-slate-700 uppercase"
        >
          Move to status
        </label>
        <select
          id="mmr-admin-status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as MentorMatchRequestStatus)}
          disabled={terminal}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-[var(--brand-blue)] focus:ring-2 focus:ring-[var(--brand-blue)]/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {MENTOR_MATCH_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
              {s === 'fulfilled' || s === 'closed' ? ' (terminal)' : ''}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs font-medium text-slate-500">
          {terminal
            ? 'This request is in a terminal state — no further transitions are allowed.'
            : 'The backend enforces which transitions are legal from the current status.'}
        </p>
      </Section>

      <Section title="Admin notes">
        <label
          htmlFor="mmr-admin-notes"
          className="font-[family-name:var(--font-label)] text-xs font-extrabold tracking-[0.14em] text-slate-700 uppercase"
        >
          Internal notes
        </label>
        <textarea
          id="mmr-admin-notes"
          rows={5}
          value={adminNotes}
          onChange={(e) => onAdminNotesChange(e.target.value)}
          placeholder="e.g. Reached out by email 2026-08-25; suggested 3 mentors in the FinTech space."
          className="mt-2 w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[var(--brand-blue)] focus:ring-2 focus:ring-[var(--brand-blue)]/30"
        />
        <p className="mt-1.5 text-xs font-medium text-slate-500">
          Saving appends an audit entry (who, when) — even if you don’t change the status.
        </p>
      </Section>

      <Section title="Audit">
        <dl className="grid gap-x-6 gap-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
          <SummaryItem label="Filed" value={formatAbsoluteTime(request.created_at)} />
          <SummaryItem
            label="Last touched"
            value={
              request.decision_at
                ? `${request.decided_by?.full_name ?? 'Admin'} · ${formatRelativeTime(request.decision_at)}`
                : 'Not yet touched'
            }
          />
          <SummaryItem
            label="Reference"
            value={request.id}
            mono
            fullWidth
          />
        </dl>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="font-[family-name:var(--font-headline)] text-sm font-extrabold tracking-tight text-slate-950">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function SummaryItem({
  label,
  value,
  fullWidth,
  multiline,
  mono,
}: {
  label: string
  value: string
  fullWidth?: boolean
  multiline?: boolean
  mono?: boolean
}) {
  return (
    <div className={fullWidth ? 'sm:col-span-2' : ''}>
      <dt className="text-[10px] font-extrabold tracking-[0.16em] text-slate-500 uppercase">
        {label}
      </dt>
      <dd
        className={[
          'mt-1 text-sm font-extrabold break-words text-slate-900',
          multiline ? 'whitespace-pre-wrap leading-6 font-medium' : '',
          mono ? 'font-mono tracking-tight' : '',
        ].join(' ')}
      >
        {value}
      </dd>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-live="polite">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse space-y-3">
          <div className="h-3 w-24 rounded bg-slate-100" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-3/4 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  )
}
