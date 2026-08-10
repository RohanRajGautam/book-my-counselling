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
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { getInitials } from '@/features/mentors/components/MentorCard'
import { useReviewInvitation } from '../hooks/useReviewInvitation'
import { useSubmitReviewInvitation } from '../hooks/useSubmitReviewInvitation'
import { REVIEW_COMMENT_MAX, normalizeReviewComment, validateReviewForm } from '../lib/validation'
import { mapFetchError, mapSubmitError, type FetchError } from '../lib/reviewInvitation.errors'
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
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0053db] px-6 text-sm font-extrabold text-white transition-colors hover:bg-[#004ac6]"
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
    const status = axios.isAxiosError(query.error) ? (query.error.response?.status ?? null) : null
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

function PageShell({
  children,
  showHeader = true,
}: {
  children: React.ReactNode
  showHeader?: boolean
}) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f8f9ff] px-4 py-12 text-[#121c2a]">
      <div className="w-full max-w-[460px]">
        {showHeader && (
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-2xl bg-[#e6eeff]">
              <MessageSquareQuote className="size-5 text-[#0053db]" />
            </div>
            <h1 className="font-headline text-2xl font-extrabold tracking-tight text-[#121c2a]">
              Share your session feedback
            </h1>
            <p className="mt-1.5 text-sm font-medium text-[#737686]">
              Your review helps other mentees find the right mentor.
            </p>
          </div>
        )}
        <div className="overflow-hidden rounded-[24px] bg-white p-6 ring-1 ring-[#eff4ff] sm:p-8">
          {children}
        </div>
        <p className="mt-6 text-center text-[11px] font-semibold tracking-wide text-[#9aa0b0]">
          Book Your Counselling
        </p>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <PageShell>
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="rounded-2xl border border-[#eaf0fa] bg-[#fafbff] p-5">
          <div className="flex items-start gap-4">
            <Skeleton className="size-12 shrink-0 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40 rounded bg-slate-200" />
              <Skeleton className="h-3 w-32 rounded bg-slate-200" />
              <Skeleton className="h-3 w-48 rounded bg-slate-200" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 py-4">
          <Skeleton className="h-4 w-56 rounded bg-slate-200" />
          <Skeleton className="h-10 w-48 rounded-full bg-slate-200" />
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <Skeleton className="h-3 w-28 rounded bg-slate-200" />
            <Skeleton className="h-3 w-16 rounded bg-slate-200" />
          </div>
          <Skeleton className="h-32 w-full rounded-2xl bg-slate-200" />
        </div>
        <Skeleton className="h-12 w-full rounded-2xl bg-slate-200" />
      </div>
    </PageShell>
  )
}

const STATUS_VARIANTS = {
  invalid: {
    iconWrap: 'bg-[#ffdad6]',
    iconClass: 'text-[#ba1a1a]',
    Icon: ShieldAlert,
    title: 'This review link is invalid',
    body: "We couldn't find a session matching this link. It may have been removed or never existed.",
  },
  expired: {
    iconWrap: 'bg-amber-50',
    iconClass: 'text-amber-600',
    Icon: CalendarClock,
    title: 'This review link has expired',
    body: 'Review links are valid for 14 days. Reach out to your mentor if you’d still like to share feedback.',
  },
  already: {
    iconWrap: 'bg-[#e6eeff]',
    iconClass: 'text-[#0053db]',
    Icon: CheckCircle2,
    title: 'You’ve already reviewed this session',
    body: 'Thanks for sharing your feedback — it helps other mentees find the right mentor.',
  },
  success: {
    iconWrap: 'bg-[#e6eeff]',
    iconClass: 'text-[#0053db]',
    Icon: CheckCircle2,
    title: 'Thanks for your feedback!',
    body: 'Your review has been submitted. It may take a moment to appear on your mentor’s profile.',
  },
} as const

type StatusTone = keyof typeof STATUS_VARIANTS

function StatusCard({ tone, action }: { tone: StatusTone; action?: React.ReactNode }) {
  const v = STATUS_VARIANTS[tone]
  return (
    <PageShell showHeader={false}>
      <div className="px-2 py-4 text-center">
        <div
          className={`mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl ${v.iconWrap}`}
        >
          <v.Icon className={`size-6 ${v.iconClass}`} aria-hidden />
        </div>
        <h2 className="font-headline text-lg font-extrabold text-[#121c2a]">{v.title}</h2>
        <p className="mt-2 text-sm leading-6 font-medium text-[#434655]">{v.body}</p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </PageShell>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <PageShell showHeader={false}>
      <div className="px-2 py-4 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#ffdad6]">
          <AlertCircle className="size-6 text-[#ba1a1a]" aria-hidden />
        </div>
        <h2 className="font-headline text-lg font-extrabold text-[#121c2a]">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm leading-6 font-medium text-[#434655]">
          We couldn’t submit your review just now. Please try again in a moment.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#0053db] px-6 text-sm font-extrabold text-white transition-colors hover:bg-[#004ac6]"
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
  const showTopic = Boolean(invitation.topic)

  return (
    <div className="rounded-2xl border border-[#eaf0fa] bg-[#fafbff] p-5">
      <div className="flex items-center gap-4">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
          {invitation.mentor_avatar_url ? (
            <Image
              src={invitation.mentor_avatar_url}
              alt={`${invitation.mentor_name} profile`}
              width={48}
              height={48}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <div
              aria-label={`${invitation.mentor_name} profile initials`}
              className="flex h-full w-full items-center justify-center bg-[#e6eeff] text-sm font-extrabold text-[#004ac6]"
            >
              {getInitials(invitation.mentor_name)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-extrabold text-[#121c2a]">
            {invitation.mentor_name}
          </p>
          <p className="truncate text-sm font-medium text-[#737686]">{invitation.mentor_title}</p>
        </div>
      </div>

      {(showTopic || sessionLabel) && (
        <dl className="mt-4 flex flex-col gap-2.5 border-t border-[#eaf0fa] pt-4">
          {showTopic && (
            <div className="flex items-baseline justify-between gap-4">
              <dt className="shrink-0 text-[11px] font-bold tracking-[0.1em] text-[#9aa0b0] uppercase">
                Topic
              </dt>
              <dd className="min-w-0 truncate text-sm font-semibold text-[#434655]">
                {invitation.topic}
              </dd>
            </div>
          )}
          {sessionLabel && (
            <div className="flex items-baseline justify-between gap-4">
              <dt className="shrink-0 text-[11px] font-bold tracking-[0.1em] text-[#9aa0b0] uppercase">
                Session
              </dt>
              <dd className="min-w-0 truncate text-sm font-semibold text-[#434655]">
                {sessionLabel}
              </dd>
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
  const ratingError = touched.rating
    ? fieldErrors.find((e) => e.field === 'rating')?.message
    : undefined
  const commentError = touched.comment
    ? fieldErrors.find((e) => e.field === 'comment')?.message
    : undefined

  return (
    <PageShell>
      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <MentorCard invitation={invitation} sessionLabel={sessionLabel} />

        <p className="text-center text-sm leading-6 font-medium text-[#434655]">
          How was your session with{' '}
          <span className="font-extrabold text-[#121c2a]">{invitation.mentor_name}</span>?
        </p>

        <div className="flex flex-col items-center gap-2">
          <StarRatingInput
            value={rating}
            onChange={onRatingChange}
            disabled={submitting}
            invalid={!!ratingError}
          />
          {ratingError && (
            <p className="text-xs font-extrabold text-[#ba1a1a]" role="alert">
              {ratingError}
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label
              htmlFor="review-comment"
              className="text-[11px] font-bold tracking-[0.1em] text-[#737686] uppercase"
            >
              Comment (optional)
            </label>
            <span
              className={`text-xs font-medium tabular-nums ${
                commentLength > REVIEW_COMMENT_MAX
                  ? 'text-[#ba1a1a]'
                  : commentLength > REVIEW_COMMENT_MAX * 0.9
                    ? 'text-amber-600'
                    : 'text-[#9aa0b0]'
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
            className="w-full resize-none rounded-2xl bg-white px-4 py-3 text-sm font-medium text-[#121c2a] ring-1 ring-[#e2ebfb] transition outline-none placeholder:text-[#9aa0b0] focus:ring-2 focus:ring-[#0053db] disabled:cursor-not-allowed disabled:opacity-60"
          />
          {commentError && (
            <p
              id="review-comment-error"
              className="mt-1.5 text-xs font-extrabold text-[#ba1a1a]"
              role="alert"
            >
              {commentError}
            </p>
          )}
        </div>

        {submitMessage && (
          <div className="rounded-xl border border-[#f4d7d4] bg-[#fdf6f5] px-4 py-3 text-sm font-medium text-[#ba1a1a]">
            {submitMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || rating < 1}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#0053db] text-sm font-extrabold text-white transition-colors hover:bg-[#004ac6] disabled:cursor-not-allowed disabled:opacity-40"
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
