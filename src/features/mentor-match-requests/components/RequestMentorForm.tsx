'use client'

import { useRef, useState } from 'react'
import { AxiosError } from 'axios'
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  Sparkles,
  User,
  Wand2,
} from 'lucide-react'
import { toast } from 'sonner'

import { useCreateMentorMatchRequest } from '../hooks/useCreateMentorMatchRequest'
import {
  type MentorMatchFormField,
  type MentorMatchFormValues,
  hasRequiredMentorMatchFields,
  validateMentorMatchRequestForm,
} from '../lib/validation'
import type { MentorMatchResponse } from '../types/mentor-match-requests.types'

// ── Field caps mirrored from the backend Pydantic Field() constraints ─────
const MAX_NAME = 255
const MAX_EXPERTISE = 255
const MAX_GOALS = 2000

const EMPTY_VALUES: MentorMatchFormValues = {
  requester_name: '',
  requester_email: '',
  preferred_expertise: '',
  goals: '',
  preferred_at: '',
}

type FieldErrors = Partial<Record<MentorMatchFormField, string>>

interface BackendFieldError {
  type?: string
  loc?: (string | number)[]
  msg?: string
  input?: unknown
}

interface Backend422Error {
  detail?: BackendFieldError[] | string
}

function parseApiError(err: unknown): { field?: MentorMatchFormField; message: string } | null {
  if (!(err instanceof AxiosError)) return null
  const data = err.response?.data as Backend422Error | undefined
  if (!data) return null

  if (Array.isArray(data.detail)) {
    const first = data.detail.find((d) => Array.isArray(d.loc))
    if (!first || !first.loc || !first.msg) return { message: 'Invalid input.' }
    const path = first.loc.filter((p) => p !== 'body').join('.')
    return {
      field: path as MentorMatchFormField,
      message: first.msg,
    }
  }

  if (typeof data.detail === 'string') {
    return { message: data.detail }
  }

  return null
}

function firstErrorField(errors: FieldErrors): MentorMatchFormField | null {
  const order: MentorMatchFormField[] = [
    'requester_name',
    'requester_email',
    'preferred_expertise',
    'goals',
    'preferred_at',
  ]
  return order.find((f) => Boolean(errors[f])) ?? null
}

interface EmptyStateProps {
  context: 'mentor' | 'coach'
}

interface RequestMentorFormProps {
  /**
   * Fired after a successful submission. The parent uses it to swap the
   * "No mentor found" headline for a celebratory panel so the search-failure
   * framing disappears once the requester takes action.
   */
  onSubmitted: (result: MentorMatchResponse) => void
}

/**
 * Wrapper that owns the "No mentor found" → form → success lifecycle. After
 * a successful submit, the headline + subtitle go away; only the success
 * card remains in the same white frame so the requester gets closure.
 */
export function RequestMentorEmptyState({ context }: EmptyStateProps) {
  const noun = context === 'coach' ? 'coach' : 'mentor'
  const [submitted, setSubmitted] = useState<MentorMatchResponse | null>(null)

  return (
    <div className="relative mb-10 overflow-hidden rounded-3xl bg-white p-7 text-center shadow-[0_16px_40px_rgba(18,28,42,0.06)] ring-1 ring-[var(--color-surface-container-high)] ring-inset sm:p-12">
      {/* Soft brand wash at the top — purely decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--brand-blue-soft)]/45 via-[var(--brand-blue-soft)]/10 to-transparent"
      />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center">
        {submitted ? (
          <RequestReceivedPanel submitted={submitted} onReset={() => setSubmitted(null)} />
        ) : (
          <>
            <p className="mt-2 font-[family-name:var(--font-headline)] text-2xl font-extrabold tracking-tight text-slate-950 sm:text-[28px]">
              No {noun} found
            </p>
            <p className="mt-2 mb-3 max-w-md text-sm leading-6 font-medium text-slate-500 sm:mb-4 sm:text-base">
              Tell us what you’re looking for — we’ll match you with a {noun} and reach out the
              moment a fit comes up. No signup, no payment.
            </p>
            <div className="mt-6 w-full text-left">
              <RequestMentorForm onSubmitted={setSubmitted} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * Inline "request a mentor" form. Self-contained for values / errors /
 * validation, but delegates the post-submit UI to its parent via `onSubmitted`
 * so the "No mentor found" framing can disappear.
 */
export function RequestMentorForm({ onSubmitted }: RequestMentorFormProps) {
  const createMutation = useCreateMentorMatchRequest()
  const [values, setValues] = useState<MentorMatchFormValues>(EMPTY_VALUES)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<MentorMatchFormField, boolean>>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const firstFieldRef = useRef<HTMLDivElement | null>(null)
  const preferredAtInputRef = useRef<HTMLInputElement | null>(null)

  function openPreferredAtPicker() {
    const el = preferredAtInputRef.current
    if (!el) return
    if (typeof el.showPicker === 'function') {
      try {
        el.showPicker()
        return
      } catch {
        // Some browsers throw if the document isn't user-activated; fall back.
      }
    }
    el.focus()
  }

  function setField<K extends keyof MentorMatchFormValues>(key: K, next: MentorMatchFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: next }))
    setErrors((prev) => {
      if (!prev[key]) return prev
      const nextErrors = { ...prev }
      delete nextErrors[key]
      return nextErrors
    })
  }

  function showError(field: MentorMatchFormField): string | undefined {
    return touched[field] ? errors[field] : undefined
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    setSubmitError(null)

    const validationErrors = validateMentorMatchRequestForm(values)
    const fieldErrors: FieldErrors = {}
    for (const err of validationErrors) {
      fieldErrors[err.field as MentorMatchFormField] = err.message
    }
    setErrors(fieldErrors)
    setTouched({
      requester_name: true,
      requester_email: true,
      preferred_expertise: true,
      goals: true,
      preferred_at: true,
    })

    if (validationErrors.length > 0) {
      const first = firstErrorField(fieldErrors)
      if (first) {
        const el = document.getElementById(`mmr-${first}`)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        ;(el as HTMLInputElement | HTMLTextAreaElement | null)?.focus()
      }
      return
    }

    try {
      const trimmedPreferredAt = values.preferred_at.trim()
      const result = await createMutation.mutateAsync({
        requester_name: values.requester_name.trim(),
        requester_email: values.requester_email.trim(),
        preferred_expertise: values.preferred_expertise.trim(),
        goals: values.goals.trim(),
        preferred_at: trimmedPreferredAt ? new Date(trimmedPreferredAt).toISOString() : null,
      })
      onSubmitted(result)
      toast.success('Request sent — we’ll be in touch when we find a match.')
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      if (parsed?.field) {
        setErrors((prev) => ({ ...prev, [parsed.field as MentorMatchFormField]: parsed.message }))
        setTouched((t) => ({ ...t, [parsed.field as MentorMatchFormField]: true }))
        const el = document.getElementById(`mmr-${parsed.field}`)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
      if (parsed?.message) {
        setSubmitError(parsed.message)
        return
      }
      setSubmitError('Something went wrong. Please try again in a moment.')
    }
  }

  const canSubmit = !createMutation.isPending && hasRequiredMentorMatchFields(values)

  // `datetime-local` takes "YYYY-MM-DDTHH:mm" in the requester's local timezone.
  // Recomputed per render so the browser's native picker refuses stale past
  // picks; the validator catches anything that slips past the picker chrome.
  const preferredAtMin = (() => {
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
  })()

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 text-left">
      <div ref={firstFieldRef} className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" required error={showError('requester_name')} icon={User}>
          <input
            id="mmr-requester_name"
            type="text"
            autoComplete="name"
            maxLength={MAX_NAME}
            value={values.requester_name}
            onChange={(e) => setField('requester_name', e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, requester_name: true }))}
            placeholder="e.g. Anita Shrestha"
            aria-invalid={showError('requester_name') ? 'true' : 'false'}
            className={inputClass(showError('requester_name'))}
          />
        </Field>
        <Field label="Email" required error={showError('requester_email')} icon={Mail}>
          <input
            id="mmr-requester_email"
            type="email"
            autoComplete="email"
            value={values.requester_email}
            onChange={(e) => setField('requester_email', e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, requester_email: true }))}
            placeholder="anita@example.com"
            aria-invalid={showError('requester_email') ? 'true' : 'false'}
            className={inputClass(showError('requester_email'))}
          />
        </Field>
      </div>

      <Field
        label="What expertise are you looking for?"
        required
        help="Be specific — e.g. “cryptocurrency regulation”, “FP&A for early-stage SaaS”."
        error={showError('preferred_expertise')}
        icon={Wand2}
      >
        <input
          id="mmr-preferred_expertise"
          type="text"
          maxLength={MAX_EXPERTISE}
          value={values.preferred_expertise}
          onChange={(e) => setField('preferred_expertise', e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, preferred_expertise: true }))}
          placeholder="e.g. Cryptocurrency regulation"
          aria-invalid={showError('preferred_expertise') ? 'true' : 'false'}
          className={inputClass(showError('preferred_expertise'))}
        />
      </Field>

      <Field
        label="What are you hoping to get from a mentor?"
        required
        help="A sentence or two is plenty — goals, where you’re stuck, what success looks like."
        error={showError('goals')}
        icon={MessageSquare}
        multiline
      >
        <textarea
          id="mmr-goals"
          rows={4}
          maxLength={MAX_GOALS}
          value={values.goals}
          onChange={(e) => setField('goals', e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, goals: true }))}
          placeholder="e.g. I’m exploring entry paths into compliance roles and would value guidance on how the field is shaping up in Nepal."
          aria-invalid={showError('goals') ? 'true' : 'false'}
          className={`${inputClass(showError('goals'))} resize-y leading-relaxed`}
        />
      </Field>

      <Field
        label="Preferred time"
        optional
        help="Pick a date and time in your local timezone that works best for you — we’ll try to match you with a mentor who can make it."
        error={showError('preferred_at')}
        icon={Calendar}
      >
        <input
          id="mmr-preferred_at"
          ref={preferredAtInputRef}
          type="datetime-local"
          min={preferredAtMin}
          value={values.preferred_at}
          onClick={openPreferredAtPicker}
          onChange={(e) => setField('preferred_at', e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, preferred_at: true }))}
          aria-invalid={showError('preferred_at') ? 'true' : 'false'}
          className={`${inputClass(showError('preferred_at'))} cursor-pointer pr-12`}
        />
      </Field>

      {submitError ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm font-medium text-red-700"
        >
          {submitError}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Sparkles className="size-3.5 text-[var(--brand-blue)]" aria-hidden="true" />
          No payment, no signup — just a quick note.
        </p>
        <button
          type="submit"
          disabled={!canSubmit}
          className="group relative inline-flex h-14 shrink-0 items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-7 text-sm font-extrabold text-white shadow-[0_14px_32px_rgba(0,83,219,0.32)] transition hover:shadow-[0_18px_38px_rgba(0,83,219,0.4)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              <span className="relative">Send request</span>
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </div>
    </form>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────

interface FieldProps {
  label: string
  required?: boolean
  optional?: boolean
  help?: string
  error?: string
  children: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  multiline?: boolean
}

function Field({
  label,
  required,
  optional,
  help,
  error,
  children,
  icon: Icon,
  multiline,
}: FieldProps) {
  return (
    <div className="block">
      <label
        htmlFor={(children as { props?: { id?: string } })?.props?.id}
        className="flex items-center gap-2 font-[family-name:var(--font-label)] text-[11px] font-extrabold tracking-[0.16em] text-slate-700 uppercase"
      >
        <span>{label}</span>
        {required ? (
          <span className="rounded-full bg-[var(--brand-blue-soft)] px-2 py-0.5 text-[9px] tracking-[0.2em] text-[var(--brand-blue)] uppercase">
            Required
          </span>
        ) : optional ? (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] tracking-[0.2em] text-slate-500 uppercase">
            Optional
          </span>
        ) : null}
      </label>
      <div className="relative mt-2">
        {Icon ? (
          <Icon
            className={[
              'pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400 transition-colors',
              multiline ? 'top-3.5 translate-y-0' : '',
            ].join(' ')}
            aria-hidden="true"
          />
        ) : null}
        {children}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-bold text-red-600" role="alert">
          {error}
        </p>
      ) : help ? (
        <p className="mt-1.5 text-xs font-medium text-slate-500">{help}</p>
      ) : null}
    </div>
  )
}

function inputClass(hasError: string | undefined): string {
  return [
    'w-full rounded-2xl bg-[#eef4ff] py-3.5 pr-4 pl-11 text-sm font-medium text-slate-800',
    'outline-none transition-colors duration-150 placeholder:text-slate-400',
    'hover:bg-[#dceaff]',
    'focus:bg-white focus:ring-2 focus:ring-[var(--brand-blue)]/40',
    hasError ? 'bg-red-50 ring-2 ring-red-200 hover:bg-red-50 focus:bg-red-50' : '',
  ].join(' ')
}

function RequestReceivedPanel({
  submitted,
  onReset,
}: {
  submitted: MentorMatchResponse
  onReset: () => void
}) {
  return (
    <div className="relative space-y-6 text-center">
      <div className="flex flex-col items-center">
        <div className="relative grid place-items-center">
          <div
            aria-hidden="true"
            className="absolute size-20 rounded-full bg-emerald-100/55 blur-md"
          />
          <div
            aria-hidden="true"
            className="absolute size-16 rounded-full bg-emerald-100/85 ring-1 ring-emerald-200/70"
          />
          <div className="relative grid size-12 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-[0_14px_30px_rgba(16,185,129,0.4)]">
            <CheckCircle2 className="size-7 text-white" aria-hidden="true" strokeWidth={2.6} />
          </div>
        </div>
        <h3 className="mt-5 font-[family-name:var(--font-headline)] text-2xl font-extrabold tracking-tight text-slate-950 sm:text-[26px]">
          We’ll find a perfect mentor for you
        </h3>
        <p className="mt-2 max-w-md text-sm leading-6 font-medium text-slate-600 sm:text-base">
          Your note is with our matching team. We’ll reach out at{' '}
          <span className="font-bold text-slate-800">{submitted.requester_email}</span> the moment
          we find a mentor that fits — no fixed timeline, but you’re on our radar.
        </p>
      </div>

      <dl className="grid gap-x-6 gap-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left sm:grid-cols-2">
        <SummaryItem label="Name" value={submitted.requester_name} />
        <SummaryItem label="Email" value={submitted.requester_email} />
        <SummaryItem label="Expertise" value={submitted.preferred_expertise} fullWidth />
      </dl>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Submit another
        </button>
      </div>

      <p className="text-xs font-medium text-slate-400">
        Reference{' '}
        <span className="font-mono tracking-tight text-slate-500">{submitted.id.slice(0, 8)}</span>
      </p>
    </div>
  )
}

function SummaryItem({
  label,
  value,
  fullWidth,
}: {
  label: string
  value: string
  fullWidth?: boolean
}) {
  return (
    <div className={fullWidth ? 'sm:col-span-2' : ''}>
      <dt className="text-[10px] font-extrabold tracking-[0.16em] text-slate-500 uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-extrabold break-words text-slate-900">{value}</dd>
    </div>
  )
}
