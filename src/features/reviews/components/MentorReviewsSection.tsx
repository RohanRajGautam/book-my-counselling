'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useMentorReviews } from '../hooks/useMentorReviews'
import type { ReviewResponse } from '../types/reviews.types'

interface MentorReviewsSectionProps {
  mentorId: string | null
}

export function MentorReviewsSection({ mentorId }: MentorReviewsSectionProps) {
  const [reviewPage, setReviewPage] = useState(1)
  const { data: reviewsData, isPending: isReviewsLoading, isFetching } = useMentorReviews(mentorId, reviewPage)

  const reviews = useMemo(() => reviewsData?.items ?? [], [reviewsData?.items])
  const totalReviews = reviewsData?.total ?? 0
  const totalPages = reviewsData?.total_pages ?? 1
  const hasNextPage = reviewsData?.has_next ?? false

  const histogram = useMemo(() => buildHistogram(reviews), [reviews])
  const averageRating = totalReviews > 0 ? histogram.weightedAverage : 0

  // Default ordering: highest rating first.
  const visibleReviews = useMemo(
    () => [...reviews].sort((a, b) => b.rating - a.rating),
    [reviews]
  )

  if (isReviewsLoading) {
    return (
      <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_8px_24px_rgba(18,28,42,0.04)]">
        <div className="flex items-center justify-between gap-6 border-b border-[#eff4ff] px-5 py-5 sm:px-6">
          <div className="flex items-baseline gap-3">
            <Skeleton className="h-7 w-12 rounded bg-slate-100" />
            <Skeleton className="h-4 w-24 rounded bg-slate-100" />
          </div>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="size-4 rounded-full bg-slate-100" />
            ))}
          </div>
        </div>
        <ol className="flex flex-col divide-y divide-[#eff4ff]">
          {[1, 2, 3].map((i) => (
            <li key={i} className="flex gap-3 p-5 sm:p-6">
              <Skeleton className="size-12 shrink-0 rounded-full bg-slate-100" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40 rounded bg-slate-100" />
                <Skeleton className="h-3 w-full rounded bg-slate-100" />
                <Skeleton className="h-3 w-3/4 rounded bg-slate-100" />
              </div>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  if (totalReviews === 0) {
    return (
      <div className="rounded-[24px] bg-white p-8 text-center shadow-[0_8px_24px_rgba(18,28,42,0.04)]">
        <p className="text-sm font-medium text-[#737686]">No reviews yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_8px_24px_rgba(18,28,42,0.04)]">
      {/* Summary header */}
      <div className="flex items-center justify-between gap-6 border-b border-[#eff4ff] px-5 py-5 sm:px-6">
        <div className="flex items-baseline gap-2">
          <span className="font-[family-name:var(--font-headline)] text-2xl font-bold text-[#121c2a] tabular-nums">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-sm font-medium text-[#737686]">
            from {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </span>
        </div>
        <div className="flex items-center gap-0.5 text-amber-500">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`size-4 ${star <= Math.round(averageRating) ? 'fill-amber-400' : 'text-[#dee9fc]'}`}
            />
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <ol
        className={`flex max-h-[480px] flex-col divide-y divide-[#eff4ff] overflow-y-auto transition-opacity duration-200 ${
          isFetching ? 'opacity-50' : 'opacity-100'
        }`}
      >
        {visibleReviews.map((review) => (
          <ReviewRow key={review.id} review={review} />
        ))}
      </ol>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#eff4ff] px-5 py-4 sm:px-6">
          <button
            disabled={reviewPage === 1 || isFetching}
            onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1 text-sm font-medium text-[#004ac6] disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
            Previous
          </button>
          <span className="text-xs font-medium text-[#737686] tabular-nums">
            {reviewPage} / {totalPages}
          </span>
          <button
            disabled={!hasNextPage || isFetching}
            onClick={() => setReviewPage((p) => p + 1)}
            className="flex items-center gap-1 text-sm font-medium text-[#004ac6] disabled:opacity-40"
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}

interface Histogram {
  buckets: Record<1 | 2 | 3 | 4 | 5, number>
  weightedAverage: number
}

function buildHistogram(reviews: ReviewResponse[]): Histogram {
  const buckets: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  let sum = 0
  for (const review of reviews) {
    if (review.rating >= 1 && review.rating <= 5) {
      buckets[review.rating as 1 | 2 | 3 | 4 | 5] += 1
      sum += review.rating
    }
  }
  return {
    buckets,
    weightedAverage: reviews.length > 0 ? sum / reviews.length : 0,
  }
}

function ReviewRow({ review }: { review: ReviewResponse }) {
  const comment = review.comment?.trim()
  const [isExpanded, setIsExpanded] = useState(false)
  const isLong = comment !== undefined && comment.length > 220
  const visibleComment = isLong && !isExpanded ? `${comment.slice(0, 220).trimEnd()}…` : comment

  return (
    <li className="flex gap-3 px-5 py-5 sm:px-6">
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e6eeff] text-sm font-extrabold text-[#004ac6]"
        aria-hidden
      >
        {review.reviewer?.full_name?.charAt(0)?.toUpperCase() || 'M'}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-semibold text-[#121c2a]">
              {review.reviewer?.full_name ?? 'Anonymous mentee'}
            </span>
            <span className="text-xs text-[#737686]">·</span>
            <time className="text-xs font-medium text-[#737686]">
              {formatRelativeDate(review.created_at)}
            </time>
          </div>
          <div className="flex items-center gap-0.5 text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`size-3.5 ${star <= review.rating ? 'fill-amber-400' : 'text-[#dee9fc]'}`}
              />
            ))}
          </div>
        </div>

        {visibleComment && (
          <p className="text-sm leading-6 text-[#434655]">{visibleComment}</p>
        )}

        {isLong && (
          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            className="self-start text-xs font-medium text-[#0053db] hover:text-[#004ac6]"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </li>
  )
}

function formatRelativeDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso

  const now = new Date()
  const startOfDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const diffDays = Math.round((startOfDay(now) - startOfDay(d)) / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
  return `${Math.floor(diffDays / 365)}y ago`
}
