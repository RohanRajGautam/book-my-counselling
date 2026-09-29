'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronDown, ChevronRight, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

import {
  AdminBookingRow,
  AdminCreateBookingRequest,
  AdminMentorPickerOption,
} from '../../types/admin.types'
import {
  formatDateTime,
  formatNPR,
  formatShortDate,
} from '../../lib/format'
import { PAYMENT_BADGE, STATUS_BADGE } from '../lib/bookingBadges'
import { useAdminCreateBookingOnBehalf } from '../hooks/useAdminBookings'
import { validatePromoCode } from '@/features/promo-codes/api/promo-codes.api'
import { MentorPickerCombobox } from '../../mentors/_shared/MentorPickerCombobox'
import { cn } from '@/lib/utils'
import {
  combineDateTime,
  derivedStatusFromSessionStart,
  RecordSessionFormData,
  toIsoLocal,
  validateRecordSessionForm,
} from '../lib/recordSessionValidation'
import {
  computeRecordSessionPricing,
  formatNprDecimal,
} from '../lib/pricing'

export interface AdminRecordSessionModalProps {
  open: boolean
  onClose: () => void
  /** When set, pre-fills the form for this mentor (from the mentor detail page). */
  initialMentor?: AdminMentorPickerOption
  /** Called after a successful submit so the parent can show a toast. */
  onRecorded?: (booking: AdminBookingRow) => void
}

const EMPTY_FORM: RecordSessionFormData = {
  menteeEmail: '',
  menteeFullName: '',
  sessionDate: '',
  sessionStartTime: '',
  sessionEndTime: '',
  topic: '',
  goals: '',
  notes: '',
  agreedPrice: '',
  promoCode: '',
  slotId: '',
  packageId: '',
  currentSchool: '',
  guardianPhone: '',
  preparationNotes: '',
  menteeTimezone: '',
}

interface SelectedMentor {
  id: string
  option: AdminMentorPickerOption | null
}

function localTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return ''
  }
}

/** Pull a human-friendly string from a FastAPI error payload (4xx or 422). */
function extractErrorMessage(err: unknown): {
  topBanner: string | null
  fieldErrors: Record<string, string>
} {
  const empty = { topBanner: null, fieldErrors: {} as Record<string, string> }
  if (!err || typeof err !== 'object') return empty
  const e = err as Record<string, unknown>
  const response = e['response'] as Record<string, unknown> | undefined
  const data = response?.['data'] as Record<string, unknown> | undefined
  if (!data) return empty

  // 422 — array of {loc, msg, type}. Map field paths to inline errors and
  // collect the rest into a top banner so the admin still sees them.
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
        // Map Pydantic's snake_case paths to camelCase form keys. Mostly the
        // names already match (mentor_id, mentee_email, agreed_price, etc.).
        const key = String(tail)
        fieldErrors[snakeToCamel(key)] = msg
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

export function AdminRecordSessionModal({
  open,
  onClose,
  initialMentor,
  onRecorded,
}: AdminRecordSessionModalProps) {
  const [form, setForm] = useState<RecordSessionFormData>(EMPTY_FORM)
  const [selectedMentor, setSelectedMentor] = useState<SelectedMentor>({
    id: '',
    option: null,
  })
  const [submittedBooking, setSubmittedBooking] = useState<AdminBookingRow | null>(null)
  const [topError, setTopError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [showOptionalFields, setShowOptionalFields] = useState(false)
  /** Validated promo percent (e.g. 50 for "LAUNCH50"). `null` when no promo
   *  has been successfully validated yet — the preview uses this, not the raw
   *  text in the input. */
  const [validatedPromoPercent, setValidatedPromoPercent] = useState<number | null>(null)

  const { mutate, isPending } = useAdminCreateBookingOnBehalf()

  // Reset every time the modal opens. Pre-fill the mentor when seeded from
  // another page so the admin sees the choice immediately. We do this during
  // render (instead of in a useEffect) to avoid the cascading-render warning
  // — see https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes
  const [prevOpen, setPrevOpen] = useState(open)
  if (prevOpen !== open) {
    setPrevOpen(open)
    if (open) {
      setForm({
        ...EMPTY_FORM,
        menteeTimezone: localTimezone(),
      })
      setSelectedMentor({
        id: initialMentor?.id ?? '',
        option: initialMentor ?? null,
      })
      setSubmittedBooking(null)
      setTopError(null)
      setFieldErrors({})
      setSubmitAttempted(false)
      setShowOptionalFields(false)
    }
  }

  // Live pricing preview — pure computation off the current form values. Returns
  // `null` for any required input we don't have yet so the block doesn't
  // distract with partial numbers.
  const pricing = useMemo(() => {
    const priceNum = Number(form.agreedPrice)
    if (!Number.isFinite(priceNum)) return null
    if (!selectedMentor.option) return null
    const pctNum = Number(selectedMentor.option.mentor_share_pct)
    const mentorShare = Number.isFinite(pctNum) ? pctNum : 50
    const rateNum = selectedMentor.option.hourly_rate
      ? Number(selectedMentor.option.hourly_rate)
      : null
    return computeRecordSessionPricing({
      agreedPrice: priceNum,
      promoPercent: validatedPromoPercent,
      mentorSharePct: mentorShare,
      hourlyRate: rateNum !== null && Number.isFinite(rateNum) ? rateNum : null,
    })
  }, [form.agreedPrice, validatedPromoPercent, selectedMentor.option])

  // Live status preview — derived from session_start, like the backend.
  const statusPreview = useMemo(() => {
    const startIso = toIsoLocal(form.sessionDate, form.sessionStartTime)
    if (!startIso) return null
    return derivedStatusFromSessionStart(startIso)
  }, [form.sessionDate, form.sessionStartTime])

  // True when a validated 100%-off promo is in play. Locks the agreed_price
  // input (backend rejects anything else with a 400) and surfaces the
  // "original = hourly_rate" footnote in the preview.
  const isFullDiscountPromo =
    validatedPromoPercent !== null && validatedPromoPercent >= 100

  const promoCheck = useQuery({
    queryKey: ['admin', 'record-session', 'promo', form.promoCode.trim(), selectedMentor.id],
    enabled: false, // invoked manually
    queryFn: () =>
      validatePromoCode({
        code: form.promoCode.trim(),
        mentor_id: selectedMentor.id,
      }),
  })

  const handlePromoCheck = () => {
    if (!form.promoCode.trim() || !selectedMentor.id) return
    promoCheck.refetch().then((res) => {
      if (res.isError) {
        const msg = extractErrorMessage(res.error).topBanner ?? 'Invalid promo code.'
        toast.error(msg)
        setValidatedPromoPercent(null)
      } else if (res.data) {
        const pct = Number(res.data.discount_percent)
        setValidatedPromoPercent(Number.isFinite(pct) ? pct : null)
        toast.success(`Promo ${res.data.code} applies ${res.data.discount_percent}% off.`)
      }
    })
  }

  // Drop the validated promo whenever the typed code or mentor changes — the
  // previous percent is no longer trustworthy. Doing this during render avoids
  // the cascading-effect pattern.
  const promoKey = `${selectedMentor.id}|${form.promoCode.trim()}`
  const [prevPromoKey, setPrevPromoKey] = useState(promoKey)
  if (prevPromoKey !== promoKey) {
    setPrevPromoKey(promoKey)
    setValidatedPromoPercent(null)
  }

  // 100%-off promo forces agreed_price to 0 — backend rejects anything else
  // with a 400. Snap the input on the rising edge so the admin doesn't have to
  // chase the validator. Render-time, no effect.
  const [prevPromoPct, setPrevPromoPct] = useState(validatedPromoPercent)
  if (prevPromoPct !== validatedPromoPercent) {
    setPrevPromoPct(validatedPromoPercent)
    if (validatedPromoPercent !== null && validatedPromoPercent >= 100) {
      setForm((cur) => ({ ...cur, agreedPrice: '0' }))
    }
  }

  const handleClose = () => {
    if (isPending) return
    onClose()
  }

  const updateField = <K extends keyof RecordSessionFormData>(
    key: K,
    value: RecordSessionFormData[K],
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

    const errors = validateRecordSessionForm({
      form,
      mentorId: selectedMentor.id,
      promoApplied: form.promoCode.trim().length > 0,
    })
    if (errors.length > 0) {
      const fieldMap: Record<string, string> = {}
      const first = errors[0]
      for (const e of errors) fieldMap[e.field] = e.message
      setFieldErrors(fieldMap)
      if (first) {
        toast.error(first.message)
        // Scroll the first error into view.
        if (typeof window !== 'undefined') {
          const el = document.getElementById(`record-session-${first.field}`)
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el?.focus()
        }
      }
      return
    }

    const startIso = toIsoLocal(form.sessionDate, form.sessionStartTime)
    const endIso = toIsoLocal(form.sessionDate, form.sessionEndTime)
    if (!startIso || !endIso) return

    const payload: AdminCreateBookingRequest = {
      mentor_id: selectedMentor.id,
      mentee_email: form.menteeEmail.trim(),
      mentee_full_name: form.menteeFullName.trim(),
      session_start: startIso,
      session_end: endIso,
      goals: form.goals.trim(),
      agreed_price: form.agreedPrice.trim(),
    }

    // Optional fields — only send when non-empty so the backend's "must be a
    // non-empty list" defaults don't trip on `[]`.
    if (form.slotId.trim()) payload.slot_id = form.slotId.trim()
    if (form.packageId.trim()) payload.package_id = form.packageId.trim()
    if (form.topic.trim()) payload.topic = form.topic.trim()
    if (form.notes.trim()) payload.notes = form.notes.trim()
    if (form.promoCode.trim()) payload.promo_code = form.promoCode.trim()
    if (form.currentSchool.trim()) payload.current_school = form.currentSchool.trim()
    if (form.guardianPhone.trim()) payload.guardian_phone = form.guardianPhone.trim()
    if (form.preparationNotes.trim())
      payload.preparation_notes = form.preparationNotes.trim()
    if (form.menteeTimezone.trim())
      payload.mentee_timezone = form.menteeTimezone.trim()

    mutate(payload, {
      onSuccess: (booking) => {
        setSubmittedBooking(booking)
        toast.success('Session recorded. Confirmation emails sent.')
        onRecorded?.(booking)
      },
      onError: (err) => {
        const { topBanner, fieldErrors: fe } = extractErrorMessage(err)
        setFieldErrors(fe)
        setTopError(
          topBanner ?? 'Something went wrong on our end. Please try again or contact engineering.',
        )
        if (typeof window !== 'undefined') {
          const modal = document.getElementById('admin-record-session-modal-scroll')
          modal?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      },
    })
  }

  const handleRecordAnother = () => {
    setSubmittedBooking(null)
    setForm({
      ...EMPTY_FORM,
      menteeTimezone: localTimezone(),
    })
    // Keep the mentor chosen so the admin can batch-record several sessions
    // for the same mentor. Re-seed only the form, not the selection.
    setSelectedMentor((cur) => ({
      id: cur.id,
      option: cur.option,
    }))
    setTopError(null)
    setFieldErrors({})
    setSubmitAttempted(false)
  }

  // ─── Success view ─────────────────────────────────────────────────────
  // Gate the whole render on `open`. The reset block above still fires on the
  // open→closed transition (prevOpen flips), so the next open starts clean.
  if (!open) return null

  if (submittedBooking) {
    return (
      <ModalShell title="Session recorded" onClose={handleClose} wide>
        <RecordSessionSuccessPanel booking={submittedBooking} />
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

  // ─── Form view ────────────────────────────────────────────────────────
  return (
    <ModalShell
      title="Record an offline session"
      subtitle="For sessions that happened (or will happen) outside the platform's booking page. Use this when the mentee's payment failed but the session still went ahead, or when the session was arranged out-of-band."
      onClose={handleClose}
      wide
    >
      <div
        id="admin-record-session-modal-scroll"
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
              value={selectedMentor.id}
              onChange={({ id, mentor }) =>
                setSelectedMentor({
                  id,
                  option: mentor.id ? mentor : null,
                })
              }
              initialMentor={initialMentor}
              error={submitAttempted ? fieldErrors['mentorId'] : undefined}
              disabled={isPending}
            />
          </div>

          <div>
            <FieldLabel htmlFor="record-session-menteeEmail" required>
              Mentee email
            </FieldLabel>
            <input
              id="record-session-menteeEmail"
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
            <FieldLabel htmlFor="record-session-menteeFullName" required>
              Mentee full name
            </FieldLabel>
            <input
              id="record-session-menteeFullName"
              type="text"
              autoComplete="off"
              value={form.menteeFullName}
              onChange={(e) => updateField('menteeFullName', e.target.value)}
              placeholder="Student Name"
              disabled={isPending}
              className={fieldInputCx(
                submitAttempted && fieldErrors['menteeFullName'],
              )}
            />
            <FieldHint>
              Used only if we create the mentee account.
            </FieldHint>
            <FieldError
              message={submitAttempted ? fieldErrors['menteeFullName'] : undefined}
            />
          </div>
        </div>

        {/* Date + time */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor="record-session-sessionDate" required>
              Session date
            </FieldLabel>
            <input
              id="record-session-sessionDate"
              type="date"
              value={form.sessionDate}
              max="2099-12-31"
              onChange={(e) => updateField('sessionDate', e.target.value)}
              disabled={isPending}
              className={fieldInputCx(submitAttempted && fieldErrors['sessionDate'])}
            />
            <FieldError
              message={submitAttempted ? fieldErrors['sessionDate'] : undefined}
            />
          </div>
          <div>
            <FieldLabel htmlFor="record-session-sessionStartTime" required>
              Start time
            </FieldLabel>
            <input
              id="record-session-sessionStartTime"
              type="time"
              value={form.sessionStartTime}
              onChange={(e) => updateField('sessionStartTime', e.target.value)}
              disabled={isPending}
              className={fieldInputCx(
                submitAttempted && fieldErrors['sessionStartTime'],
              )}
            />
            <FieldError
              message={
                submitAttempted ? fieldErrors['sessionStartTime'] : undefined
              }
            />
          </div>
          <div>
            <FieldLabel htmlFor="record-session-sessionEndTime" required>
              End time
            </FieldLabel>
            <input
              id="record-session-sessionEndTime"
              type="time"
              value={form.sessionEndTime}
              onChange={(e) => updateField('sessionEndTime', e.target.value)}
              disabled={isPending}
              className={fieldInputCx(
                submitAttempted && fieldErrors['sessionEndTime'],
              )}
              onBlur={(e) => {
                // Auto-suggest start + 60min if end is empty.
                if (
                  !form.sessionEndTime &&
                  form.sessionDate &&
                  form.sessionStartTime
                ) {
                  const start = combineDateTime(form.sessionDate, form.sessionStartTime)
                  if (start) {
                    const end = new Date(start.getTime() + 60 * 60_000)
                    const hh = String(end.getHours()).padStart(2, '0')
                    const mm = String(end.getMinutes()).padStart(2, '0')
                    updateField('sessionEndTime', `${hh}:${mm}`)
                    // Don't recurse into onBlur handler — just update value.
                    void e
                  }
                }
              }}
            />
            <FieldError
              message={submitAttempted ? fieldErrors['sessionEndTime'] : undefined}
            />
          </div>
        </div>

        {/* Status preview — CRITICAL: shows the admin what auto-status will land */}
        {statusPreview ? (
          <div
            className={cn(
              'rounded-xl border px-3 py-2.5',
              statusPreview === 'completed'
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-blue-200 bg-blue-50',
            )}
            role="status"
            aria-live="polite"
          >
            <p
              className={cn(
                'text-[11px] font-extrabold tracking-wide uppercase',
                statusPreview === 'completed' ? 'text-emerald-700' : 'text-blue-700',
              )}
            >
              Status preview
            </p>
            <p
              className={cn(
                'mt-0.5 text-sm font-bold',
                statusPreview === 'completed' ? 'text-emerald-800' : 'text-blue-800',
              )}
            >
              Will be marked as {statusPreview === 'completed' ? 'COMPLETED' : 'CONFIRMED'}.
            </p>
            <p className="mt-1 text-xs text-slate-700">
              {statusPreview === 'completed'
                ? 'Mentee will receive a review link by email. Mentor payout becomes eligible.'
                : 'Will flip to COMPLETED when the mentor marks it done from their dashboard.'}
            </p>
          </div>
        ) : null}

        {/* Topic + goals */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="record-session-topic">Topic</FieldLabel>
            <input
              id="record-session-topic"
              type="text"
              value={form.topic}
              onChange={(e) => updateField('topic', e.target.value)}
              placeholder="e.g. College application strategy"
              disabled={isPending}
              className={fieldInputCx(submitAttempted && fieldErrors['topic'])}
            />
            <FieldError message={submitAttempted ? fieldErrors['topic'] : undefined} />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="record-session-goals" required>
            Goals
          </FieldLabel>
          <textarea
            id="record-session-goals"
            value={form.goals}
            onChange={(e) => updateField('goals', e.target.value)}
            placeholder="Help me prepare for my upcoming college applications."
            rows={3}
            disabled={isPending}
            className={fieldInputCx(submitAttempted && fieldErrors['goals'], 'min-h-24')}
          />
          <FieldHint>10–2000 characters.</FieldHint>
          <FieldError message={submitAttempted ? fieldErrors['goals'] : undefined} />
        </div>

        {/* Admin notes — visible to the mentor in their notification email */}
        <div>
          <FieldLabel htmlFor="record-session-notes">
            Internal notes{' '}
            <span className="ml-1 font-normal text-slate-400">(visible to mentor)</span>
          </FieldLabel>
          <textarea
            id="record-session-notes"
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="E.g. Payment collected offline — Fonepay timed out twice."
            rows={2}
            disabled={isPending}
            className={fieldInputCx(false, 'min-h-20')}
          />
        </div>

        {/* Pricing + promo */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="record-session-agreedPrice" required>
              Agreed price (NPR)
              {isFullDiscountPromo ? (
                <span className="ml-1 font-normal text-amber-700">
                  (locked — 100%-off promo)
                </span>
              ) : null}
            </FieldLabel>
            <input
              id="record-session-agreedPrice"
              type="number"
              inputMode="decimal"
              min={0}
              max={100000}
              step="0.01"
              value={form.agreedPrice}
              onChange={(e) => updateField('agreedPrice', e.target.value)}
              placeholder="100.00"
              disabled={isPending || isFullDiscountPromo}
              className={fieldInputCx(
                submitAttempted && fieldErrors['agreedPrice'],
                isFullDiscountPromo ? 'bg-slate-100 text-slate-500' : '',
              )}
            />
            <FieldHint>
              {isFullDiscountPromo
                ? '100%-off promo requires NPR 0.00. Mentor is still paid their share of the hourly rate.'
                : '0–100000 NPR.'}
            </FieldHint>
            <FieldError
              message={submitAttempted ? fieldErrors['agreedPrice'] : undefined}
            />
          </div>
          <div>
            <FieldLabel htmlFor="record-session-promoCode">
              Promo code{' '}
              <span className="ml-1 font-normal text-slate-400">(optional)</span>
            </FieldLabel>
            <div className="flex gap-2">
              <input
                id="record-session-promoCode"
                type="text"
                value={form.promoCode}
                onChange={(e) =>
                  updateField('promoCode', e.target.value.toUpperCase())
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && form.promoCode.trim() && selectedMentor.id) {
                    e.preventDefault()
                    handlePromoCheck()
                  }
                }}
                placeholder="e.g. BYC1234"
                autoComplete="off"
                spellCheck={false}
                disabled={isPending || !selectedMentor.id}
                className={fieldInputCx(false)}
              />
              <button
                type="button"
                onClick={handlePromoCheck}
                disabled={
                  !form.promoCode.trim() || !selectedMentor.id || promoCheck.isFetching
                }
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {promoCheck.isFetching ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  'Validate'
                )}
              </button>
            </div>
            <FieldHint>Soft check only — backend validates at submit.</FieldHint>
          </div>
        </div>

        {/* Mentor earnings preview */}
        {pricing && selectedMentor.option ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
              Mentor earnings preview
            </p>
            <dl className="mt-2 grid gap-1 text-xs">
              <PreviewRow
                label="Agreed price"
                value={`NPR ${formatNprDecimal(pricing.agreed)}`}
              />
              <PreviewRow
                label="Original price"
                value={`NPR ${formatNprDecimal(pricing.original)}`}
              />
              {pricing.discount > 0 ? (
                <PreviewRow
                  label="Discount"
                  value={`−NPR ${formatNprDecimal(pricing.discount)}`}
                  tone="emerald"
                />
              ) : null}
              <PreviewRow
                label={`Mentor share (${selectedMentor.option.mentor_share_pct}%)`}
                value={`NPR ${formatNprDecimal(pricing.mentorEarning)}`}
                tone="bold"
              />
              <PreviewRow
                label={pricing.platformEarning < 0 ? 'Platform absorbs' : 'Platform keeps'}
                value={`NPR ${formatNprDecimal(pricing.platformEarning)}`}
                tone={pricing.platformEarning < 0 ? 'red' : undefined}
              />
            </dl>
            {isFullDiscountPromo ? (
              <p className="mt-2 border-t border-slate-200 pt-2 text-[11px] leading-5 text-slate-600">
                Original = mentor&apos;s hourly rate of{' '}
                <span className="font-bold text-slate-900">
                  NPR {formatNprDecimal(Number(selectedMentor.option.hourly_rate) || 0)}
                </span>{' '}
                (the gross anchor). The mentor is paid their share of the gross
                regardless of the promo — the platform absorbs the difference.
              </p>
            ) : null}
          </div>
        ) : null}

        {/* Optional fields toggle */}
        <button
          type="button"
          onClick={() => setShowOptionalFields((v) => !v)}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900"
          aria-expanded={showOptionalFields}
        >
          {showOptionalFields ? (
            <ChevronDown className="size-3.5" />
          ) : (
            <ChevronRight className="size-3.5" />
          )}
          {showOptionalFields ? 'Hide' : 'Show'} optional fields
        </button>

        {showOptionalFields ? (
          <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="record-session-currentSchool">
                Current school
              </FieldLabel>
              <input
                id="record-session-currentSchool"
                type="text"
                value={form.currentSchool}
                onChange={(e) => updateField('currentSchool', e.target.value)}
                disabled={isPending}
                className={fieldInputCx(false)}
              />
            </div>
            <div>
              <FieldLabel htmlFor="record-session-guardianPhone">
                Guardian phone
              </FieldLabel>
              <input
                id="record-session-guardianPhone"
                type="text"
                value={form.guardianPhone}
                onChange={(e) => updateField('guardianPhone', e.target.value)}
                disabled={isPending}
                className={fieldInputCx(false)}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="record-session-preparationNotes">
                Preparation notes
              </FieldLabel>
              <textarea
                id="record-session-preparationNotes"
                value={form.preparationNotes}
                onChange={(e) => updateField('preparationNotes', e.target.value)}
                rows={2}
                disabled={isPending}
                className={fieldInputCx(false, 'min-h-16')}
              />
            </div>
            <div>
              <FieldLabel htmlFor="record-session-menteeTimezone">
                Mentee timezone
              </FieldLabel>
              <input
                id="record-session-menteeTimezone"
                type="text"
                value={form.menteeTimezone}
                onChange={(e) => updateField('menteeTimezone', e.target.value)}
                placeholder="Asia/Kathmandu"
                disabled={isPending}
                className={fieldInputCx(false)}
              />
            </div>
          </div>
        ) : null}
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
      aria-labelledby="admin-record-session-title"
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
          wide ? 'max-w-3xl' : 'max-w-md',
        )}
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h2
              id="admin-record-session-title"
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
    extra,
  )
}

function PreviewRow({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: 'bold' | 'emerald' | 'red'
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-slate-500">{label}</dt>
      <dd
        className={cn(
          'font-bold',
          tone === 'bold' && 'text-slate-950',
          tone === 'emerald' && 'text-emerald-700',
          tone === 'red' && 'text-red-700',
          !tone && 'text-slate-700',
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
            Writes a real booking record so the mentor is paid and the session
            shows up in payout reports.
          </p>
          <p>
            <Check className="mr-1 inline size-3 text-emerald-600" />
            For sessions that already happened, sends the mentee a link to leave a
            review.
          </p>
          <p>
            <Check className="mr-1 inline size-3 text-emerald-600" />
            Auto-creates a mentee account if the email is new.
          </p>
          <p className="mt-2 border-t border-blue-100 pt-2 text-slate-700">
            <span className="font-bold text-slate-900">Does not</span> charge
            the mentee, refund anything, or change mentor availability.
          </p>
          <p className="mt-2 border-t border-blue-100 pt-2 text-blue-950">
            <span className="font-extrabold text-blue-900">Heads up:</span>{' '}
            for accounting purposes, sessions recorded here don&apos;t show up
            on the platform revenue dashboard (only Fonepay-collected payments
            do). They DO show up in the bookings count and in the mentor&apos;s
            payout queue.
          </p>
        </div>
      ) : null}
    </div>
  )
}

function RecordSessionSuccessPanel({ booking }: { booking: AdminBookingRow }) {
  const isCompleted = booking.status === 'completed'
  const earning = Number(booking.mentor_earning)

  return (
    <div className="space-y-3 px-4 pt-4 sm:px-6">
      <div
        className={cn(
          'rounded-xl px-3 py-3 ring-1',
          isCompleted
            ? 'bg-emerald-50 ring-emerald-200'
            : 'bg-blue-50 ring-blue-200',
        )}
      >
        <p
          className={cn(
            'text-[11px] font-extrabold tracking-wide uppercase',
            isCompleted ? 'text-emerald-700' : 'text-blue-700',
          )}
        >
          Status
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase',
              STATUS_BADGE[booking.status],
            )}
          >
            {booking.status}
          </span>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase',
              PAYMENT_BADGE[booking.payment_status],
            )}
          >
            {booking.payment_status}
          </span>
        </div>
        <p
          className={cn(
            'mt-2 text-xs',
            isCompleted ? 'text-emerald-700' : 'text-blue-700',
          )}
        >
          {isCompleted
            ? 'The mentee has been emailed a review link at the email above.'
            : 'The mentee will receive a confirmation email. The session will be marked complete when the mentor does so from their dashboard.'}
        </p>
      </div>

      <dl className="grid gap-2 rounded-xl bg-slate-50 p-3 text-sm">
        <Row label="Mentee" value={`${booking.mentee.full_name} <${booking.mentee.email}>`} />
        <Row
          label="Mentor"
          value={`${booking.mentor.full_name} (will earn ${formatNPR(earning)})`}
        />
        <Row label="Session" value={formatDateTime(booking.session_start)} />
        <Row label="Date recorded" value={formatShortDate(booking.created_at)} />
        <Row label="Amount" value={`NPR ${booking.agreed_price}`} />
      </dl>

      {booking.topic ? (
        <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
          <span className="font-bold text-slate-700">Topic:</span> {booking.topic}
        </p>
      ) : null}

      <p className="text-xs text-slate-500">
        Confirmation emails sent to the mentee and mentor; admin notification
        delivered.
      </p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-xs font-bold text-slate-500 uppercase">
        {label}
      </dt>
      <dd className="min-w-0 text-right text-sm font-bold text-slate-900">
        {value}
      </dd>
    </div>
  )
}