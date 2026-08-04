'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import axios from 'axios'
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Loader2,
  MessageSquareQuote,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import { useReviewInvitation } from '../hooks/useReviewInvitation'
import { useSubmitReviewInvitation } from '../hooks/useSubmitReviewInvitation'
import {
  REVIEW_COMMENT_MAX,
  normalizeReviewComment,
  validateReviewForm,
} from '../lib/validation'
import {
  mapFetchError,
  mapSubmitError,
  type FetchError,
} from '../lib/reviewInvitation.errors'
import type { ReviewInvitation, ReviewSubmitRequest } from '../types/reviews.types'
import type { ValidationError } from '@/features/booking/lib/validation'
import { StarRatingInput } from './StarRatingInput'

interface Props {
  token: string
}

type View =
  | { kind: 'loading' }
  | { kind: 'invalid' }
  | { kind: 'expired' }
  | { kind: 'already' }
  | { kind: 'form' }
  | { kind: 'success' }
  | { kind: 'error' }

type SubmitError = {
  invitation: ReviewInvitation
  rating: number
  comment: string
}

function formatInTz(iso: string, tz: string | null): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: tz ?? undefined,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(d)
  } catch {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(d)
  }
}

function fetchErrorToView(err: FetchError): View {
  switch (err.kind) {
    case 'invalid':
      return { kind: 'invalid' }
    case 'expired':
      return { kind: 'expired' }
    case 'already':
      return { kind: 'already' }
    case 'network':
      // Couldn't reach the server. Without an invitation to retry against,
      // surface as invalid so the user understands the link didn't load.
      return { kind: 'invalid' }
  }
}

export function ReviewInvitationPage({ token }: Props) {
  const query = useReviewInvitation(token)
  const submitMutation = useSubmitReviewInvitation(token)

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [touched, setTouched] = useState<{ rating: boolean; comment: boolean }>({
    rating: false,
    comment: false,
  })
  const [validation, setValidation] = useState<{
    fieldErrors: ValidationError[]
    submitMessage?: string
  }>({ fieldErrors: [] })
  // Set after a successful POST. Sticks on `success` even when the
  // post-submit invalidation refetch lands with already_reviewed=true.
  const [submitted, setSubmitted] = useState(false)
  // Preserved for retry after a 5xx-equivalent error.
  const [submitError, setSubmitError] = useState<SubmitError | null>(null)

  const sessionLabel = useMemo(() => {
    if (query.data) return formatInTz(query.data.session_start, query.data.mentee_timezone)
    return null
  }, [query.data])

  const view = computeView({
    query,
    submitted,
    submitError,
    mutationPending: submitMutation.isPending,
  })

  function handleSubmit() {
    const invitation = query.data
    if (!invitation) return

    const validationErrors = validateReviewForm({ rating, comment })
    if (validationErrors.length > 0) {
      setTouched({ rating: true, comment: true })
      setValidation({
        fieldErrors: validationErrors,
        submitMessage: 'Please fix the highlighted fields.',
      })
      return
    }

    setValidation({ fieldErrors: [] })
    setSubmitError(null)

    submitMutation.mutate(
      {
        rating,
        comment: normalizeReviewComment(comment),
      } satisfies ReviewSubmitRequest,
      {
        onSuccess: () => setSubmitted(true),
        onError: (err) => {
          const mapped = mapSubmitError(err)
          if (mapped.kind === 'error' || mapped.kind === 'network') {
            setSubmitError({ invitation, rating, comment })
            return
          }
          if (mapped.kind === 'validation') {
            setValidation({
              fieldErrors: mapped.errors,
              submitMessage: mapped.message,
            })
            return
          }
          if (mapped.kind === 'invalid') {
            setSubmitted(false)
            return
          }
          // 'expired' or 'already' land on the matching terminal view via
          // a refetch the mutation's onSuccess invalidates — handled by
          // computeView. We don't need to set state here.
        },
      }
    )
  }

  // ── Render ────────────────────────────────────────────────────────────

  if (view.kind === 'loading') return <LoadingState />
  if (view.kind === 'invalid') return <StatusCard tone="invalid" />
  if (view.kind === 'expired') return <StatusCard tone="expired" />
  if (view.kind === 'already') return <StatusCard tone="already" />
  if (view.kind === 'success')
    return (
      <StatusCard
        tone="success"
        action={
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-sm font-extrabold text-emerald-700 shadow-sm ring-1 ring-emerald-200 transition-colors hover:bg-emerald-50"
          >
            Back to home
          </Link>
        }
      />
    )

  if (view.kind === 'error' && submitError) {
    return (
      <ErrorState
        onRetry={() => {
          setSubmitError(null)
          handleSubmit()
        }}
      />
    )
  }

  // Form view — query has data, not yet reviewed, not submitted.
  if (view.kind === 'form' && query.data && sessionLabel) {
    return (
      <ReviewForm
        invitation={query.data}
        sessionLabel={sessionLabel}
        submitting={submitMutation.isPending}
        rating={rating}
        comment={comment}
        touched={touched}
        fieldErrors={validation.fieldErrors}
        submitMessage={validation.submitMessage}
        onRatingChange={(n) => {
          setRating(n)
          setTouched((t) => ({ ...t, rating: true }))
        }}
        onCommentChange={(v) => {
          setComment(v)
          setTouched((t) => ({ ...t, comment: true }))
        }}
        onSubmit={(e) => {
          e.preventDefault()
          setTouched({ rating: true, comment: true })
          handleSubmit()
        }}
      />
    )
  }

  return <LoadingState />
}

// ── View computation ──────────────────────────────────────────────────────

interface ComputeViewInput {
  query: ReturnType<typeof useReviewInvitation>
  submitted: boolean
  submitError: SubmitError | null
  mutationPending: boolean
}

function computeView({ query, submitted, submitError, mutationPending }: ComputeViewInput): View {
  // Post-submit terminal state wins. A refetch after success shouldn't
  // downgrade us back to 'form' or flash 'loading'.
  if (submitted) return { kind: 'success' }

  // A 5xx-equivalent submit error sticks on its own card until the user
  // retries.
  if (submitError && !mutationPending) return { kind: 'error' }

  if (query.isPending) return { kind: 'loading' }

  if (query.isError) {
    const status = axios.isAxiosError(query.error)
      ? query.error.response?.status ?? null
      : null
    const body = axios.isAxiosError(query.error) ? query.error.response?.data : undefined
    return fetchErrorToView(mapFetchError(status, body))
  }

  if (query.data) {
    if (query.data.already_reviewed) return { kind: 'already' }
    return { kind: 'form' }
  }

  return { kind: 'loading' }
}

// ── Sub-views ─────────────────────────────────────────────────────────────

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f0f4ff] px-4 py-12 text-[#121c2a]">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
            <MessageSquareQuote className="size-6 text-white" />
          </div>
          <h1 className="font-headline text-2xl font-extrabold text-slate-950">
            Share your session feedback
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Your review helps other mentees find the right mentor.
          </p>
        </div>
        <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          {children}
        </div>
        <p className="mt-6 text-center text-xs font-medium text-slate-400">
          Book Your Counselling
        </p>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <PageShell>
      <div className="flex flex-col items-center gap-3 py-10 text-slate-500">
        <Loader2 className="size-7 animate-spin text-blue-600" aria-hidden />
        <p className="text-sm font-medium">Loading your review…</p>
      </div>
    </PageShell>
  )
}

const STATUS_VARIANTS = {
  invalid: {
    card: 'border-rose-200 bg-rose-50/70',
    iconWrap: 'bg-rose-100 shadow-rose-100',
    iconClass: 'text-rose-600',
    Icon: ShieldAlert,
    title: 'This review link is invalid',
    body: "We couldn't find a session matching this link. It may have been removed or never existed.",
  },
  expired: {
    card: 'border-amber-200 bg-amber-50/70',
    iconWrap: 'bg-amber-100 shadow-amber-100',
    iconClass: 'text-amber-700',
    Icon: CalendarClock,
    title: 'This review link has expired',
    body: 'Review links are valid for 14 days. Reach out to your mentor if you’d still like to share feedback.',
  },
  already: {
    card: 'border-emerald-200 bg-emerald-50/70',
    iconWrap: 'bg-emerald-100 shadow-emerald-100',
    iconClass: 'text-emerald-600',
    Icon: CheckCircle2,
    title: 'You’ve already reviewed this session',
    body: 'Thanks for sharing your feedback — it helps other mentees find the right mentor.',
  },
  success: {
    card: 'border-emerald-200 bg-emerald-50/70',
    iconWrap: 'bg-emerald-100 shadow-emerald-100',
    iconClass: 'text-emerald-600',
    Icon: CheckCircle2,
    title: 'Thanks for your feedback!',
    body: 'Your review has been submitted. It may take a moment to appear on your mentor’s profile.',
  },
} as const

type StatusTone = keyof typeof STATUS_VARIANTS

function StatusCard({ tone, action }: { tone: StatusTone; action?: React.ReactNode }) {
  const v = STATUS_VARIANTS[tone]
  return (
    <PageShell>
      <div className={`rounded-2xl border p-6 text-center ${v.card}`}>
        <div
          className={`mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl shadow-sm ${v.iconWrap}`}
        >
          <v.Icon className={`size-6 ${v.iconClass}`} aria-hidden />
        </div>
        <h2 className="font-headline text-lg font-extrabold text-slate-950">{v.title}</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{v.body}</p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </PageShell>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <PageShell>
      <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-rose-100 shadow-sm shadow-rose-100">
          <AlertCircle className="size-6 text-rose-600" aria-hidden />
        </div>
        <h2 className="font-headline text-lg font-extrabold text-slate-950">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
          We couldn’t submit your review just now. Please try again in a moment.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-extrabold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </PageShell>
  )
}

function MentorCard({
  invitation,
  sessionLabel,
}: {
  invitation: ReviewInvitation
  sessionLabel: string
}) {
  const initials = (invitation.mentor_name || 'M')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
  const showTopic = Boolean(invitation.topic)

  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-[#eef4ff] to-white p-5">
      <div className="flex items-center gap-4">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
          {invitation.mentor_avatar_url ? (
            <Image
              src={invitation.mentor_avatar_url}
              alt={`${invitation.mentor_name} profile`}
              width={56}
              height={56}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <div
              aria-label={`${invitation.mentor_name} profile initials`}
              className="flex h-full w-full items-center justify-center bg-[#0053db] text-lg font-extrabold text-white"
            >
              {initials || 'M'}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-extrabold text-slate-950">
            {invitation.mentor_name}
          </p>
          <p className="truncate text-sm font-medium text-slate-500">{invitation.mentor_title}</p>
        </div>
      </div>

      {(showTopic || sessionLabel) && (
        <dl className="mt-4 grid gap-2 text-xs font-medium text-slate-600">
          {showTopic && (
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-blue-500" aria-hidden />
              <div className="min-w-0">
                <dt className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                  Topic
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-slate-700">{invitation.topic}</dd>
              </div>
            </div>
          )}
          {sessionLabel && (
            <div className="flex items-start gap-2">
              <CalendarClock className="mt-0.5 size-3.5 shrink-0 text-blue-500" aria-hidden />
              <div className="min-w-0">
                <dt className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                  Session
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-slate-700">{sessionLabel}</dd>
              </div>
            </div>
          )}
        </dl>
      )}
    </div>
  )
}

interface ReviewFormProps {
  invitation: ReviewInvitation
  sessionLabel: string
  submitting: boolean
  rating: number
  comment: string
  touched: { rating: boolean; comment: boolean }
  fieldErrors: ValidationError[]
  submitMessage?: string
  onRatingChange: (n: number) => void
  onCommentChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
}

function ReviewForm({
  invitation,
  sessionLabel,
  submitting,
  rating,
  comment,
  touched,
  fieldErrors,
  submitMessage,
  onRatingChange,
  onCommentChange,
  onSubmit,
}: ReviewFormProps) {
  const commentLength = comment.length
  const ratingError = touched.rating ? fieldErrors.find((e) => e.field === 'rating')?.message : undefined
  const commentError = touched.comment
    ? fieldErrors.find((e) => e.field === 'comment')?.message
    : undefined

  return (
    <PageShell>
      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <MentorCard invitation={invitation} sessionLabel={sessionLabel} />

        <p className="text-center text-sm font-medium leading-6 text-slate-600">
          How was your session with{' '}
          <span className="font-extrabold text-slate-800">{invitation.mentor_name}</span>?
        </p>

        <div className="flex flex-col items-center gap-2">
          <StarRatingInput
            value={rating}
            onChange={onRatingChange}
            disabled={submitting}
            invalid={!!ratingError}
          />
          {ratingError && (
            <p className="text-xs font-extrabold text-rose-500" role="alert">
              {ratingError}
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label
              htmlFor="review-comment"
              className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500"
            >
              Comment (optional)
            </label>
            <span
              className={`text-xs font-medium tabular-nums ${
                commentLength > REVIEW_COMMENT_MAX
                  ? 'text-rose-500'
                  : commentLength > REVIEW_COMMENT_MAX * 0.9
                    ? 'text-amber-600'
                    : 'text-slate-400'
              }`}
              aria-live="polite"
            >
              {commentLength}/{REVIEW_COMMENT_MAX}
            </span>
          </div>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            disabled={submitting}
            rows={4}
            maxLength={REVIEW_COMMENT_MAX}
            placeholder="What did you find most helpful about the session?"
            aria-invalid={commentError ? true : undefined}
            aria-describedby={commentError ? 'review-comment-error' : undefined}
            className="w-full resize-none rounded-2xl bg-[#f0f4ff] px-4 py-3 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
          />
          {commentError && (
            <p
              id="review-comment-error"
              className="mt-1.5 text-xs font-extrabold text-rose-500"
              role="alert"
            >
              {commentError}
            </p>
          )}
        </div>

        {submitMessage && (
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm font-medium text-rose-700">
            {submitMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || rating < 1}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-extrabold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Submitting…
            </>
          ) : (
            'Submit feedback'
          )}
        </button>
      </form>
    </PageShell>
  )
}