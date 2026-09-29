'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Check, ChevronDown, ChevronRight, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

import {
  OutsideSessionCreate,
  OutsideSessionRow,
  AdminMentorPickerOption,
} from '../../types/admin.types'
import { formatDateTime, formatShortDate } from '../../lib/format'
import { MentorPickerCombobox } from '../../mentors/_shared/MentorPickerCombobox'
import {
  combineDateTime,
  derivedStatusFromSessionStart,
  OutsideSessionFormData,
  toIsoLocal,
  validateOutsideSessionForm,
} from '../lib/validation'
import { OUTSIDE_SESSION_STATUS_BADGE, formatNprDecimal } from '../lib/outsideSessionBadges'
import { useCreateOutsideSession } from '../hooks/useOutsideSessions'
import { cn } from '@/lib/utils'

export interface AdminCreateOutsideSessionModalProps {
  open: boolean
  onClose: () => void
  /** When set, pre-fills the form for this mentor. */
  initialMentor?: AdminMentorPickerOption
  /** Called after a successful submit so the parent can show a toast. */
  onCreated?: (row: OutsideSessionRow) => void
}

const EMPTY_FORM: OutsideSessionFormData = {
  menteeEmail: '',
  menteeFullName: '',
  sessionDate: '',
  sessionStartTime: '',
  sessionEndTime: '',
  cost: '',
  mentorShare: '',
  platformShare: '',
  promoCode: '',
  notes: '',
  menteeTimezone: '',
}

function localTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return ''
  }
}

/** Pull a human-friendly string from a FastAPI error payload (4xx or 422). */
function extractApiMessage(err: unknown): {
  topBanner: string | null
  fieldErrors: Record<string, string>
} {
  const empty = { topBanner: null, fieldErrors: {} as Record<string, string> }
  if (!err || typeof err !== 'object') return empty
  const e = err as Record<string, unknown>
  const response = e['response'] as Record<string, unknown> | undefined
  const data = response?.['data'] as Record<string, unknown> | undefined
  if (!data) return empty

  if (Array.isArray(data['detail'])) {
    const items = data['detail'] as Array<Record<string, unknown>>
    const fieldErrors: Record<string, string> = {}
    const remaining: string[] = []
    for (const row of items) {
      const msg = typeof row['msg'] === 'string' ? row['msg'] : ''
      if (!msg) continue
      const loc = Array.isArray(row['loc'])
        ? (row['loc'] as unknown[]).filter((l) => l !== 'body')
        : null
      if (!loc || loc.length === 0) {
        remaining.push(msg)
        continue
      }
      const tail = loc[loc.length - 1]
      if (typeof tail === 'string' || typeof tail === 'number') {
        fieldErrors[snakeToCamel(String(tail))] = msg
      } else {
        remaining.push(msg)
      }
    }
    const banner = remaining.length > 0 ? remaining.join('\n') : null
    return { topBanner: banner, fieldErrors }
  }

  if (typeof data['detail'] === 'string') {
    return { topBanner: data['detail'], fieldErrors: {} }
  }

  return empty
}

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
}

export function AdminCreateOutsideSessionModal({
  open,
  onClose,
  initialMentor,
  onCreated,
}: AdminCreateOutsideSessionModalProps) {
  const [form, setForm] = useState<OutsideSessionFormData>(EMPTY_FORM)
  const [selectedMentorId, setSelectedMentorId] = useState<string>(initialMentor?.id ?? '')
  const [submittedRow, setSubmittedRow] = useState<OutsideSessionRow | null>(null)
  const [topError, setTopError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const { mutate, isPending } = useCreateOutsideSession()

  // Reset state on the open→closed transition. Done during render so the
  // form starts clean on every open without a cascading effect.
  const [prevOpen, setPrevOpen] = useState(open)
  if (prevOpen !== open) {
    setPrevOpen(open)
    if (open) {
      setForm({
        ...EMPTY_FORM,
        menteeTimezone: localTimezone(),
      })
      setSelectedMentorId(initialMentor?.id ?? '')
      setSubmittedRow(null)
      setTopError(null)
      setFieldErrors({})
      setSubmitAttempted(false)
    }
  }

  // Live status preview — derived from session_start, mirroring the backend.
  const statusPreview = useMemo(() => {
    const startIso = toIsoLocal(form.sessionDate, form.sessionStartTime)
    if (!startIso) return null
    return derivedStatusFromSessionStart(startIso)
  }, [form.sessionDate, form.sessionStartTime])

  // Live money preview — verbatim from the inputs. The backend stores these
  // three numbers as-is, so the preview is a sanity check only (no balance
  // computation). Returns `null` until all three are valid numbers.
  const moneyPreview = useMemo(() => {
    const cost = Number(form.cost)
    const mshare = Number(form.mentorShare)
    const pshare = Number(form.platformShare)
    if (![cost, mshare, pshare].every(Number.isFinite)) return null
    return { cost, mentorShare: mshare, platformShare: pshare }
  }, [form.cost, form.mentorShare, form.platformShare])

  const platformShareIsNegative = moneyPreview !== null && moneyPreview.platformShare < 0

  const handleClose = () => {
    if (isPending) return
    onClose()
  }

  const updateField = <K extends keyof OutsideSessionFormData>(
    key: K,
    value: OutsideSessionFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (fieldErrors[key as string]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[key as string]
        return next
      })
    }
  }

  const handleSubmit = () => {
    setSubmitAttempted(true)
    setTopError(null)
    setFieldErrors({})

    const errors = validateOutsideSessionForm({
      form,
      mentorId: selectedMentorId,
    })
    if (errors.length > 0) {
      const fieldMap: Record<string, string> = {}
      let firstMsg: string | null = null
      for (const e of errors) {
        fieldMap[e.field] = e.message
        if (firstMsg === null) firstMsg = e.message
      }
      setFieldErrors(fieldMap)
      if (firstMsg !== null) {
        toast.error(firstMsg)
        if (typeof window !== 'undefined') {
          const el = document.getElementById(`outside-session-${errors[0]?.field}`)
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el?.focus()
        }
      }
      return
    }

    const startIso = toIsoLocal(form.sessionDate, form.sessionStartTime)
    const endIso = toIsoLocal(form.sessionDate, form.sessionEndTime)
    if (!startIso || !endIso) return

    const payload: OutsideSessionCreate = {
      mentor_id: selectedMentorId,
      mentee_email: form.menteeEmail.trim(),
      mentee_full_name: form.menteeFullName.trim(),
      session_start: startIso,
      session_end: endIso,
      cost: form.cost.trim(),
      mentor_share: form.mentorShare.trim(),
      platform_share: form.platformShare.trim(),
    }
    if (form.promoCode.trim()) payload.promo_code = form.promoCode.trim()
    if (form.notes.trim()) payload.notes = form.notes.trim()
    if (form.menteeTimezone.trim()) payload.mentee_timezone = form.menteeTimezone.trim()

    mutate(payload, {
      onSuccess: (row) => {
        setSubmittedRow(row)
        toast.success(
          row.status === 'completed'
            ? 'Session recorded. Review email sent.'
            : 'Session recorded as scheduled.'
        )
        onCreated?.(row)
      },
      onError: (err) => {
        const { topBanner, fieldErrors: fe } = extractApiMessage(err)
        setFieldErrors(fe)
        setTopError(
          topBanner ?? 'Something went wrong on our end. Please try again or contact engineering.'
        )
        if (typeof window !== 'undefined') {
          const modal = document.getElementById('admin-create-outside-session-modal-scroll')
          modal?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      },
    })
  }

  const handleRecordAnother = () => {
    setSubmittedRow(null)
    setForm({
      ...EMPTY_FORM,
      menteeTimezone: localTimezone(),
    })
    // Keep the mentor chosen so the admin can batch-record several sessions
    // for the same mentor.
    setTopError(null)
    setFieldErrors({})
    setSubmitAttempted(false)
  }

  if (!open) return null

  if (submittedRow) {
    return (
      <ModalShell title="Session recorded" onClose={handleClose} wide>
        <OutsideSessionSuccessPanel row={submittedRow} />
        <div className="sticky bottom-0 -mx-4 mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 bg-white px-4 pt-3 pb-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleRecordAnother}
            className="rounded-xl bg-[#0755d8] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
          >
            Record another
          </button>
        </div>
      </ModalShell>
    )
  }

  return (
    <ModalShell
      title="Record an outside session"
      subtitle="For sessions that happened (or will happen) outside the platform's booking page. Use this for offline payments, partner-sponsored sessions, free volunteer sessions, or any time the mentee didn't actually book through the website."
      onClose={handleClose}
      wide
    >
      <div
        id="admin-create-outside-session-modal-scroll"
        className="space-y-4 overflow-y-auto px-4 pb-4 sm:px-6"
      >
        <InfoCallout />

        {topError ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {topError}
          </div>
        ) : null}

        {/* Mentor + mentee */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <MentorPickerCombobox
              value={selectedMentorId}
              onChange={({ id }) => setSelectedMentorId(id)}
              initialMentor={initialMentor}
              error={submitAttempted ? fieldErrors['mentorId'] : undefined}
              disabled={isPending}
            />
          </div>

          <div>
            <FieldLabel htmlFor="outside-session-menteeEmail" required>
              Mentee email
            </FieldLabel>
            <input
              id="outside-session-menteeEmail"
              type="email"
              autoComplete="off"
              value={form.menteeEmail}
              onChange={(e) => updateField('menteeEmail', e.target.value)}
              placeholder="student@example.com"
              disabled={isPending}
              className={fieldInputCx(submitAttempted && fieldErrors['menteeEmail'])}
            />
            <FieldHint>
              If this email is not in our system, we&apos;ll create a mentee account.
            </FieldHint>
            <FieldError message={submitAttempted ? fieldErrors['menteeEmail'] : undefined} />
          </div>

          <div>
            <FieldLabel htmlFor="outside-session-menteeFullName" required>
              Mentee full name
            </FieldLabel>
            <input
              id="outside-session-menteeFullName"
              type="text"
              autoComplete="off"
              value={form.menteeFullName}
              onChange={(e) => updateField('menteeFullName', e.target.value)}
              placeholder="Student Name"
              disabled={isPending}
              className={fieldInputCx(submitAttempted && fieldErrors['menteeFullName'])}
            />
            <FieldHint>Used only if we create the mentee account.</FieldHint>
            <FieldError message={submitAttempted ? fieldErrors['menteeFullName'] : undefined} />
          </div>
        </div>

        {/* Date + time */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor="outside-session-sessionDate" required>
              Session date
            </FieldLabel>
            <input
              id="outside-session-sessionDate"
              type="date"
              value={form.sessionDate}
              max="2099-12-31"
              onChange={(e) => updateField('sessionDate', e.target.value)}
              disabled={isPending}
              className={fieldInputCx(submitAttempted && fieldErrors['sessionDate'])}
            />
            <FieldError message={submitAttempted ? fieldErrors['sessionDate'] : undefined} />
          </div>
          <div>
            <FieldLabel htmlFor="outside-session-sessionStartTime" required>
              Start time
            </FieldLabel>
            <input
              id="outside-session-sessionStartTime"
              type="time"
              value={form.sessionStartTime}
              onChange={(e) => updateField('sessionStartTime', e.target.value)}
              disabled={isPending}
              className={fieldInputCx(submitAttempted && fieldErrors['sessionStartTime'])}
            />
            <FieldError message={submitAttempted ? fieldErrors['sessionStartTime'] : undefined} />
          </div>
          <div>
            <FieldLabel htmlFor="outside-session-sessionEndTime" required>
              End time
            </FieldLabel>
            <input
              id="outside-session-sessionEndTime"
              type="time"
              value={form.sessionEndTime}
              onChange={(e) => updateField('sessionEndTime', e.target.value)}
              disabled={isPending}
              className={fieldInputCx(submitAttempted && fieldErrors['sessionEndTime'])}
              onBlur={() => {
                // Auto-suggest start + 60min if end is empty.
                if (!form.sessionEndTime && form.sessionDate && form.sessionStartTime) {
                  const start = combineDateTime(form.sessionDate, form.sessionStartTime)
                  if (start) {
                    const end = new Date(start.getTime() + 60 * 60_000)
                    const hh = String(end.getHours()).padStart(2, '0')
                    const mm = String(end.getMinutes()).padStart(2, '0')
                    updateField('sessionEndTime', `${hh}:${mm}`)
                  }
                }
              }}
            />
            <FieldError message={submitAttempted ? fieldErrors['sessionEndTime'] : undefined} />
          </div>
        </div>

        {/* Status preview — CRITICAL: shows the admin what auto-status will land */}
        {statusPreview ? (
          <div
            className={cn(
              'rounded-xl border px-3 py-2.5',
              statusPreview === 'completed'
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-blue-200 bg-blue-50'
            )}
            role="status"
            aria-live="polite"
          >
            <p
              className={cn(
                'text-[11px] font-extrabold tracking-wide uppercase',
                statusPreview === 'completed' ? 'text-emerald-700' : 'text-blue-700'
              )}
            >
              Status preview
            </p>
            <p
              className={cn(
                'mt-0.5 text-sm font-bold',
                statusPreview === 'completed' ? 'text-emerald-800' : 'text-blue-800'
              )}
            >
              Will be marked as {statusPreview === 'completed' ? 'COMPLETED' : 'SCHEDULED'}.
            </p>
            <p className="mt-1 text-xs text-slate-700">
              {statusPreview === 'completed'
                ? "Mentee will receive a review link by email. Mentor's total_sessions will be bumped by 1."
                : 'No review email yet. Use the "Mark complete" button on this row after the session to send the review email and bump the mentor\'s count.'}
            </p>
          </div>
        ) : null}

        {/* Money fields */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor="outside-session-cost" required>
              Cost (NPR)
            </FieldLabel>
            <input
              id="outside-session-cost"
              type="number"
              inputMode="decimal"
              min={0}
              max={100000}
              step="0.01"
              value={form.cost}
              onChange={(e) => updateField('cost', e.target.value)}
              placeholder="100.00"
              disabled={isPending}
              className={fieldInputCx(submitAttempted && fieldErrors['cost'])}
            />
            <FieldHint>How much the mentee actually paid (or 0 if free). 0–100000.</FieldHint>
            <FieldError message={submitAttempted ? fieldErrors['cost'] : undefined} />
          </div>

          <div>
            <FieldLabel htmlFor="outside-session-mentorShare" required>
              Mentor share (NPR)
            </FieldLabel>
            <input
              id="outside-session-mentorShare"
              type="number"
              inputMode="decimal"
              min={-100000}
              max={100000}
              step="0.01"
              value={form.mentorShare}
              onChange={(e) => updateField('mentorShare', e.target.value)}
              placeholder="60.00"
              disabled={isPending}
              className={fieldInputCx(submitAttempted && fieldErrors['mentorShare'])}
            />
            <FieldHint>How much the mentor will be paid. Can be negative.</FieldHint>
            <FieldError message={submitAttempted ? fieldErrors['mentorShare'] : undefined} />
          </div>

          <div>
            <FieldLabel htmlFor="outside-session-platformShare" required>
              Platform share (NPR)
            </FieldLabel>
            <input
              id="outside-session-platformShare"
              type="number"
              inputMode="decimal"
              min={-100000}
              max={100000}
              step="0.01"
              value={form.platformShare}
              onChange={(e) => updateField('platformShare', e.target.value)}
              placeholder="40.00"
              disabled={isPending}
              className={fieldInputCx(submitAttempted && fieldErrors['platformShare'])}
            />
            <FieldHint>How much the platform keeps. Negative when BYC absorbs a loss.</FieldHint>
            <FieldError message={submitAttempted ? fieldErrors['platformShare'] : undefined} />
          </div>
        </div>

        {/* Money preview + negative-share warning */}
        {moneyPreview ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
              Money preview (for your records)
            </p>
            <dl className="mt-2 grid gap-1 text-xs">
              <PreviewRow
                label="Mentee paid"
                value={`NPR ${formatNprDecimal(moneyPreview.cost)}`}
              />
              <PreviewRow
                label="Mentor gets"
                value={`NPR ${formatNprDecimal(moneyPreview.mentorShare)}`}
                tone="bold"
              />
              <PreviewRow
                label={moneyPreview.platformShare < 0 ? 'Platform absorbs' : 'Platform keeps'}
                value={`NPR ${formatNprDecimal(moneyPreview.platformShare)}`}
                tone={moneyPreview.platformShare < 0 ? 'red' : undefined}
              />
            </dl>
            <p className="mt-2 border-t border-slate-200 pt-2 text-[11px] leading-5 text-slate-600">
              These three numbers are saved verbatim — the backend does not verify they balance.
            </p>
          </div>
        ) : null}

        {platformShareIsNegative ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-950"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-700" strokeWidth={2.4} />
            <p>
              <span className="font-extrabold text-amber-900">Platform share is negative —</span>{' '}
              this records BYC absorbing the loss (e.g. mentee used a 100%-off promo but mentor
              still got paid their full share).
            </p>
          </div>
        ) : null}

        {/* Promo code (free text) */}
        <div>
          <FieldLabel htmlFor="outside-session-promoCode">
            Promo code <span className="ml-1 font-normal text-slate-400">(optional)</span>
          </FieldLabel>
          <input
            id="outside-session-promoCode"
            type="text"
            value={form.promoCode}
            onChange={(e) => updateField('promoCode', e.target.value)}
            placeholder="PARTNER100"
            autoComplete="off"
            spellCheck={false}
            disabled={isPending}
            className={fieldInputCx(submitAttempted && fieldErrors['promoCode'])}
          />
          <FieldHint>For your records only — we don&apos;t validate this field.</FieldHint>
          <FieldError message={submitAttempted ? fieldErrors['promoCode'] : undefined} />
        </div>

        {/* Internal notes */}
        <div>
          <FieldLabel htmlFor="outside-session-notes">
            Internal notes <span className="ml-1 font-normal text-slate-400">(optional)</span>
          </FieldLabel>
          <textarea
            id="outside-session-notes"
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="E.g. Sponsored by partner org X — mentor invoiced separately."
            rows={2}
            disabled={isPending}
            className={fieldInputCx(false, 'min-h-20')}
          />
          <FieldHint>Internal-only — not visible to mentor or mentee in any email.</FieldHint>
        </div>

        {/* Mentee timezone */}
        <div>
          <FieldLabel htmlFor="outside-session-menteeTimezone">
            Mentee timezone <span className="ml-1 font-normal text-slate-400">(optional)</span>
          </FieldLabel>
          <input
            id="outside-session-menteeTimezone"
            type="text"
            value={form.menteeTimezone}
            onChange={(e) => updateField('menteeTimezone', e.target.value)}
            placeholder="Asia/Kathmandu"
            disabled={isPending}
            className={fieldInputCx(false)}
          />
          <FieldHint>IANA tz string. Used in the review email.</FieldHint>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 -mx-4 mt-2 flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 bg-white px-4 pt-3 pb-3 sm:-mx-6 sm:px-6">
        <button
          type="button"
          onClick={handleClose}
          disabled={isPending}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0755d8] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" /> Recording…
            </>
          ) : (
            'Record session'
          )}
        </button>
      </div>
    </ModalShell>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────

interface ModalShellProps {
  title: string
  subtitle?: string
  onClose: () => void
  wide?: boolean
  children: React.ReactNode
}

function ModalShell({ title, subtitle, onClose, wide, children }: ModalShellProps) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-3 py-6 sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-create-outside-session-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div
        className={cn(
          'relative z-[1] flex max-h-[92vh] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl',
          wide ? 'max-w-3xl' : 'max-w-md'
        )}
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h2
              id="admin-create-outside-session-title"
              className="font-headline text-lg font-extrabold tracking-tight text-slate-950 sm:text-xl"
            >
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 text-xs leading-5 font-medium text-slate-500 sm:text-sm">
                {subtitle}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </header>
        {children}
      </div>
    </div>
  )
}

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-[11px] font-extrabold tracking-wide text-slate-500 uppercase"
    >
      {children}
      {required ? <span className="ml-0.5 text-red-600">*</span> : null}
    </label>
  )
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-[11px] text-slate-400">{children}</p>
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="mt-1 text-xs font-medium text-red-600" role="alert">
      {message}
    </p>
  )
}

function fieldInputCx(hasError: boolean | string | undefined, extra = ''): string {
  const err = Boolean(hasError)
  return cn(
    'w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-200',
    err ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200',
    extra
  )
}

function PreviewRow({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: 'bold' | 'red'
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-slate-500">{label}</dt>
      <dd
        className={cn(
          'font-bold',
          tone === 'bold' && 'text-slate-950',
          tone === 'red' && 'text-red-700',
          !tone && 'text-slate-700'
        )}
      >
        {value}
      </dd>
    </div>
  )
}

function InfoCallout() {
  const [open, setOpen] = useState(true)
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3 text-xs text-blue-950">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-[11px] font-extrabold tracking-wide text-blue-700 uppercase"
        aria-expanded={open}
      >
        {open ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
        What this does
      </button>
      {open ? (
        <div className="mt-2 space-y-2">
          <p>
            <Check className="mr-1 inline size-3 text-emerald-600" />
            Records the session so it appears in the mentor&apos;s total_sessions count.
          </p>
          <p>
            <Check className="mr-1 inline size-3 text-emerald-600" />
            For sessions that already happened, sends the mentee a link to leave a review.
          </p>
          <p>
            <Check className="mr-1 inline size-3 text-emerald-600" />
            Auto-creates a mentee account if the email is new. The mentee gets the review email;
            they cannot log in unless they later reset their password.
          </p>
          <p className="mt-2 border-t border-blue-100 pt-2 text-slate-700">
            <span className="font-bold text-slate-900">Does not</span> charge the mentee, trigger a
            payout, show up on the platform revenue dashboard, or appear in the Bookings list.
          </p>
        </div>
      ) : null}
    </div>
  )
}

function OutsideSessionSuccessPanel({ row }: { row: OutsideSessionRow }) {
  const isCompleted = row.status === 'completed'
  return (
    <div className="space-y-3 px-4 pt-4 sm:px-6">
      <div
        className={cn(
          'rounded-xl px-3 py-3 ring-1',
          isCompleted ? 'bg-emerald-50 ring-emerald-200' : 'bg-blue-50 ring-blue-200'
        )}
      >
        <p
          className={cn(
            'text-[11px] font-extrabold tracking-wide uppercase',
            isCompleted ? 'text-emerald-700' : 'text-blue-700'
          )}
        >
          Status
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase',
              OUTSIDE_SESSION_STATUS_BADGE[row.status]
            )}
          >
            {row.status}
          </span>
        </div>
        <p className={cn('mt-2 text-xs', isCompleted ? 'text-emerald-700' : 'text-blue-700')}>
          {isCompleted
            ? 'The mentee has been emailed a review link at the email above. They have 14 days to submit it.'
            : 'Use the "Mark complete" button on this row after the session to send the review email and bump the mentor\'s count.'}
        </p>
      </div>

      <dl className="grid gap-2 rounded-xl bg-slate-50 p-3 text-sm">
        <Row label="Mentee" value={`${row.mentee_name} <${row.mentee_email}>`} />
        <Row label="Mentor" value={row.mentor_name} />
        <Row label="Session" value={formatDateTime(row.session_start)} />
        <Row label="Date recorded" value={formatShortDate(row.created_at)} />
        <Row
          label="Money"
          value={`Cost ${row.cost} / Mentor ${row.mentor_share} / Platform ${row.platform_share}`}
        />
      </dl>

      <p className="text-xs text-slate-500">
        Confirmation emails sent to the mentee and mentor; admin notification delivered.
      </p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-xs font-bold text-slate-500 uppercase">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-bold text-slate-900">{value}</dd>
    </div>
  )
}
