'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { FormInput } from '@/features/booking/components/FormInput'
import { FormTextarea } from '@/features/booking/components/FormTextarea'

import {
  type AvailabilityRequestDuration,
  type AvailabilityRequestResponse,
} from '../types/availability-requests.types'
import { useCreateAvailabilityRequest } from '../hooks/useAvailabilityRequests'
import { DurationPicker } from './DurationPicker'
import {
  datetimeLocalToDate,
  isFutureDate,
  validateEmail,
  validateRequesterName,
  validateRequestMessage,
} from '../lib/validation'

interface AvailabilityRequestFormProps {
  mentorId: string
  mentorName: string
  /**
   * Initial duration selection. Defaults to 60 minutes.
   */
  defaultDuration?: AvailabilityRequestDuration
}

type FieldErrors = Partial<Record<'name' | 'email' | 'requested_start' | 'message', string>>

interface BackendFieldError {
  type?: string
  loc?: (string | number)[]
  msg?: string
  input?: unknown
}

interface Backend422Error {
  detail?: BackendFieldError[] | string
}

function parseApiError(err: unknown): { field?: keyof FieldErrors; message: string } | null {
  if (!(err instanceof AxiosError)) return null
  const data = err.response?.data as Backend422Error | undefined
  if (!data) return null

  if (Array.isArray(data.detail)) {
    const first = data.detail.find((d) => Array.isArray(d.loc))
    if (!first || !first.loc || !first.msg) return { message: 'Invalid input.' }
    const path = first.loc.filter((p) => p !== 'body').join('.')
    return { field: path as keyof FieldErrors, message: first.msg }
  }

  if (typeof data.detail === 'string') {
    const message = data.detail
    const lower = message.toLowerCase()
    if (lower.includes('requested_start') || lower.includes('future')) {
      return { field: 'requested_start', message }
    }
    return { message }
  }

  return null
}

export function AvailabilityRequestForm({
  mentorId,
  mentorName,
  defaultDuration = 60,
}: AvailabilityRequestFormProps) {
  const router = useRouter()
  const createMutation = useCreateAvailabilityRequest()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [duration, setDuration] = useState<AvailabilityRequestDuration>(defaultDuration)
  const [requestedStart, setRequestedStart] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof FieldErrors, boolean>>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<AvailabilityRequestResponse | null>(null)

  const minStart = useMemo(() => {
    const d = new Date()
    d.setMinutes(d.getMinutes() + 30)
    d.setSeconds(0, 0)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }, [])

  function validate(): FieldErrors {
    const next: FieldErrors = {}
    if (!validateRequesterName(name)) {
      next.name = 'Please enter your name (up to 255 characters).'
    }
    if (!email.trim()) {
      next.email = 'Email is required.'
    } else if (!validateEmail(email)) {
      next.email = 'Please enter a valid email address.'
    }
    const startDate = datetimeLocalToDate(requestedStart)
    if (!startDate) {
      next.requested_start = 'Please pick a date and time.'
    } else if (!isFutureDate(startDate)) {
      next.requested_start = 'Pick a time in the future.'
    }
    if (message && !validateRequestMessage(message)) {
      next.message = 'Please keep your note under 2000 characters.'
    }
    return next
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    setSubmitError(null)
    const allErrors = validate()
    setErrors(allErrors)
    setTouched({ name: true, email: true, requested_start: true, message: true })

    if (Object.keys(allErrors).length > 0) {
      const firstField = Object.keys(allErrors)[0] as keyof FieldErrors
      const el = document.getElementById(`ar-${firstField}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    const trimmedMessage = message.trim()
    const startDate = datetimeLocalToDate(requestedStart)
    if (!startDate) return

    try {
      const result = await createMutation.mutateAsync({
        mentor_id: mentorId,
        requester_name: name.trim(),
        requester_email: email.trim(),
        duration_minutes: duration,
        requested_start: startDate.toISOString(),
        message: trimmedMessage ? trimmedMessage : null,
      })
      setSubmitted(result)
      toast.success('Request received — we’ll email you when the mentor confirms.')
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      if (parsed?.field === 'requested_start') {
        setErrors((prev) => ({ ...prev, requested_start: parsed.message }))
        return
      }
      if (parsed?.field) {
        setErrors((prev) => ({ ...prev, [parsed.field as keyof FieldErrors]: parsed.message }))
        return
      }
      if (parsed?.message) {
        setSubmitError(parsed.message)
        return
      }
      setSubmitError('Something went wrong. Please try again in a moment.')
    }
  }

  function showError(field: keyof FieldErrors): string | undefined {
    return touched[field] ? errors[field] : undefined
  }

  if (submitted) {
    return (
      <RequestReceivedPanel
        submitted={submitted}
        mentorName={mentorName}
        onReset={() => {
          setSubmitted(null)
          setName('')
          setEmail('')
          setMessage('')
          setRequestedStart('')
          setErrors({})
          setTouched({})
        }}
        onClose={() => router.push('/')}
      />
    )
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7">
      {/* Identity */}
      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
        <FormInput
          id="ar-name"
          label="Your name"
          placeholder="e.g. Anita Shrestha"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          error={showError('name')}
          autoComplete="name"
          maxLength={255}
        />
        <FormInput
          id="ar-email"
          label="Email"
          type="email"
          placeholder="anita@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          error={showError('email')}
          autoComplete="email"
        />
      </div>

      {/* Duration */}
      <Field label="Session length">
        <DurationPicker value={duration} onChange={setDuration} />
      </Field>

      {/* Date / time */}
      <Field
        label="Preferred start time"
        help={`Times shown in your timezone (${timezone}).`}
        error={showError('requested_start')}
      >
        <DateTimePicker
          value={requestedStart}
          minDateTime={minStart}
          onChange={(next) => {
            setRequestedStart(next)
            if (errors.requested_start) {
              setErrors((prev) => {
                const nextErrors = { ...prev }
                delete nextErrors.requested_start
                return nextErrors
              })
            }
          }}
          error={showError('requested_start')}
        />
      </Field>

      {/* Optional note */}
      <Field label="Note to the mentor (optional)" help={`${message.length} / 2000`}>
        <FormTextarea
          id="ar-message"
          label=""
          placeholder="Share what's on your mind so the mentor can prepare — e.g. what you're hoping to get from the session."
          rows={5}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
            if (errors.message) {
              setErrors((prev) => {
                const nextErrors = { ...prev }
                delete nextErrors.message
                return nextErrors
              })
            }
          }}
          onBlur={() => setTouched((t) => ({ ...t, message: true }))}
          error={showError('message')}
          maxLength={2000}
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

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium text-slate-500">
          By submitting, you agree to be contacted at the email above about this request.
        </p>
        <Button
          type="submit"
          disabled={createMutation.isPending}
          className="h-12 shrink-0 rounded-2xl bg-[#0755d8] px-6 font-bold text-white shadow-[0_10px_22px_rgba(7,85,216,0.22)] hover:bg-blue-700 disabled:opacity-60"
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Sending…
            </>
          ) : (
            'Send request'
          )}
        </Button>
      </div>
    </form>
  )
}

function DateTimePicker({
  value,
  minDateTime,
  onChange,
  error,
}: {
  value: string
  minDateTime: string
  onChange: (next: string) => void
  error?: string
}) {
  return (
    <input
      id="ar-requested_start"
      type="datetime-local"
      value={value}
      min={minDateTime}
      onClick={(event) => event.currentTarget.showPicker?.()}
      onChange={(event) => onChange(event.target.value)}
      aria-invalid={error ? 'true' : 'false'}
      className={`w-full cursor-pointer rounded-2xl bg-[#eef4ff] px-4 py-3.5 text-sm font-medium text-slate-800 transition outline-none focus:bg-white focus:ring-2 focus:ring-blue-200 sm:px-5 ${
        error ? 'ring-2 ring-red-200' : ''
      }`}
    />
  )
}

// ── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  help,
  error,
  children,
}: {
  label: string
  help?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="block">
      <span className="text-xs font-bold tracking-[0.16em] text-slate-600 uppercase">{label}</span>
      <div className="mt-2">{children}</div>
      {error ? (
        <p className="mt-1.5 text-xs font-bold text-red-600">{error}</p>
      ) : help ? (
        <p className="mt-1.5 text-xs font-medium text-slate-500">{help}</p>
      ) : null}
    </div>
  )
}

// ── Success state ───────────────────────────────────────────────────────────

function RequestReceivedPanel({
  submitted,
  mentorName,
  onReset,
  onClose,
}: {
  submitted: AvailabilityRequestResponse
  mentorName: string
  onReset: () => void
  onClose: () => void
}) {
  const dateLabel = new Date(submitted.requested_start).toLocaleString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-[0_12px_28px_rgba(16,185,129,0.32)]">
          <svg
            viewBox="0 0 24 24"
            className="size-9 text-white"
            fill="none"
            strokeWidth={3}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <polyline points="4 12 10 18 20 6" />
          </svg>
        </div>
        <h2 className="font-headline mt-5 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
          Request received
        </h2>
        <p className="mt-2 max-w-md text-sm font-medium text-slate-600 sm:text-base">
          Your request is with {mentorName} now. We&apos;ll email you when they confirm the time and
          open a booking slot.
        </p>
      </div>

      <dl className="grid gap-x-6 gap-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2 sm:p-6">
        <SummaryItem label="Mentor" value={mentorName} />
        <SummaryItem
          label="When"
          value={dateLabel}
          subValue={`${submitted.duration_minutes}-minute session`}
        />
        <SummaryItem label="Your name" value={submitted.requester_name} />
        <SummaryItem label="Email" value={submitted.requester_email} />
      </dl>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="h-11 rounded-2xl border-slate-200 px-5 font-bold text-slate-700 hover:bg-slate-50"
        >
          Submit another
        </Button>
        <Button
          type="button"
          onClick={onClose}
          className="h-11 rounded-2xl bg-[#0755d8] px-6 font-bold text-white shadow-[0_10px_22px_rgba(7,85,216,0.22)] hover:bg-blue-700"
        >
          Back to home
        </Button>
      </div>

      <p className="text-center text-xs font-medium text-slate-400">
        Reference{' '}
        <span className="font-mono tracking-tight text-slate-500">{submitted.id.slice(0, 8)}</span>
      </p>
    </div>
  )
}

function SummaryItem({
  label,
  value,
  subValue,
}: {
  label: string
  value: string
  subValue?: string
}) {
  return (
    <div>
      <dt className="text-[10px] font-extrabold tracking-[0.16em] text-slate-500 uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-extrabold break-words text-slate-900">{value}</dd>
      {subValue ? <dd className="mt-0.5 text-xs font-medium text-slate-600">{subValue}</dd> : null}
    </div>
  )
}
