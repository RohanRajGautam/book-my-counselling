'use client'

import { useEffect, useRef, useState } from 'react'
import { AlertCircle, Loader2, Mail, Pencil, ShieldAlert, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { validateEmail } from '@/features/booking/lib/validation'
import type { UserResponse } from '@/features/auth/types/auth.types'
import { useUpdateAdminUserEmail } from '../../hooks/useAdminMentors'

export interface AdminEditMentorEmailDialogProps {
  currentEmail: string
  /** Display name of the user whose email is being changed. Used in the copy. */
  mentorName: string
  userId: string
  onClose: () => void
  /**
   * Receives the freshly-stored (server-normalized) `UserResponse` after a
   * successful save. The page uses this to reseed its local `email` state.
   */
  onSaved: (updated: UserResponse) => void
}

/**
 * Confirmation modal for `PATCH /admin/users/{userId}/email`.
 *
 * - Pre-fills with the current email and focuses the field on mount.
 * - Client-side rejects malformed addresses and the no-op (same email) case
 *   before round-tripping.
 * - Surfaces 409 (duplicate email of another user) and 422 (server-side
 *   validation failure) with friendly copy.
 * - On success: toast, hand the updated `UserResponse` to the parent, close.
 *
 * The endpoint is user-agnostic (mentee / mentor / admin) — this dialog just
 * happens to live in the admin-mentors feature because that's the only admin
 * surface that surfaces email today. The parent mounts this component only
 * while the modal is open and remounts it on every open / save so local
 * state stays fresh.
 */
export function AdminEditMentorEmailDialog({
  currentEmail,
  mentorName,
  userId,
  onClose,
  onSaved,
}: AdminEditMentorEmailDialogProps) {
  const [value, setValue] = useState(currentEmail)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { mutate, isPending } = useUpdateAdminUserEmail(userId)

  // The parent remounts this component via `key={emailDialogOpen-email}` so
  // local state (value / submitAttempted / errorMsg) is fresh on every open
  // and after every successful save — no in-effect reset needed.
  useEffect(() => {
    const t = window.setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 30)
    return () => window.clearTimeout(t)
  }, [])

  const trimmed = value.trim()
  const normalized = trimmed.toLowerCase()
  const noChange = normalized === currentEmail.toLowerCase()
  const formatError = trimmed && !validateEmail(trimmed) ? 'Enter a valid email address.' : null
  const inlineError = formatError
  const fieldError = submitAttempted ? inlineError : undefined
  const canSubmit = !isPending && !noChange && !inlineError

  const errorFor = (field: string) => (field === 'email' ? fieldError : undefined)

  const handleSubmit = () => {
    setSubmitAttempted(true)
    setErrorMsg(null)
    if (!canSubmit) return
    mutate(
      { email: trimmed },
      {
        onSuccess: (data) => {
          toast.success('Email updated.')
          onSaved(data)
          onClose()
        },
        onError: (err) => {
          setErrorMsg(translateEmailError(err) ?? 'Failed to update email.')
        },
      }
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && canSubmit) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const inputCls = (hasError: boolean) =>
    `mt-1 w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-sm font-bold tracking-wide text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 ${
      hasError ? 'border-red-300' : 'border-slate-200'
    }`

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-edit-email-title"
      aria-describedby="admin-edit-email-description"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6"
    >
      <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-extrabold tracking-[0.14em] text-blue-700 uppercase">
              <Pencil className="size-3" strokeWidth={2.6} />
              Change email
            </div>
            <h2
              id="admin-edit-email-title"
              className="font-headline mt-2 text-lg font-extrabold text-slate-950"
            >
              Update email for {mentorName}
            </h2>
            <p
              id="admin-edit-email-description"
              className="mt-1 text-sm font-medium text-slate-500"
            >
              Currently{' '}
              <strong className="font-extrabold text-slate-700">{currentEmail}</strong>.
              The change applies immediately on save.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="shrink-0 text-slate-400 hover:text-slate-700 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-3">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-700" strokeWidth={2.4} />
            <div className="text-xs leading-5 font-medium text-amber-900">
              <p className="font-extrabold">Heads up.</p>
              <p>
                The user is not emailed at the old or new address. Active sessions stay valid
                until they expire. If they have bookings, payouts, or external integrations
                (Stripe, Calendly) tied to this address, sync those separately.
              </p>
            </div>
          </div>

          <label className="mt-5 block">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold tracking-[0.14em] text-slate-500 uppercase">
              <Mail className="size-3" strokeWidth={2.6} />
              New email address
            </span>
            <input
              ref={inputRef}
              type="email"
              autoComplete="off"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isPending}
              placeholder="name@example.com"
              className={inputCls(Boolean(errorFor('email')))}
            />
            {errorFor('email') ? (
              <p className="mt-1 text-xs font-bold text-red-600">{errorFor('email')}</p>
            ) : noChange ? (
              <p className="mt-1 text-xs font-bold text-slate-500">No change to save.</p>
            ) : (
              <p className="mt-1 text-xs font-medium text-slate-500">
                Saved as lowercase. The user will log in with this address next time.
              </p>
            )}
          </label>

          {errorMsg ? (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-6 py-4">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Pencil className="size-4" />
            )}
            Save email
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Map known API failures to friendly copy. Falls back to extracting the
 * server's `detail` field, then a generic message.
 */
function translateEmailError(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null
  const e = err as Record<string, unknown>
  const response = e['response'] as Record<string, unknown> | undefined
  const status = response?.['status']
  const data = response?.['data'] as Record<string, unknown> | undefined

  if (status === 409) {
    return 'This email is already used by another account.'
  }
  if (status === 422) {
    return 'Enter a valid email address.'
  }

  if (Array.isArray(data?.['detail'])) {
    const items = (data['detail'] as Array<Record<string, unknown>>)
      .map((row) => (typeof row['msg'] === 'string' ? row['msg'] : ''))
      .filter(Boolean)
    if (items.length > 0) return items.join('\n')
  }

  if (typeof data?.['detail'] === 'string') return data['detail']

  return null
}