'use client'

import { Star, Trash2 } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { AdminReviewRow } from '../../types/admin.types'
import { formatDateTime, getInitials } from '../../lib/format'
import { cn } from '@/lib/utils'

export interface AdminReviewCardProps {
  review: AdminReviewRow
  /** Opens the delete confirmation modal for this review. */
  onDelete: (review: AdminReviewRow) => void
}

const STAR_VALUES = [1, 2, 3, 4, 5] as const

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {STAR_VALUES.map((n) => (
        <Star
          key={n}
          className={cn(
            'size-4',
            n <= rating ? 'fill-amber-400 text-amber-400' : 'text-[#c3c6d7]',
          )}
          aria-hidden
        />
      ))}
    </div>
  )
}

export function AdminReviewCard({ review, onDelete }: AdminReviewCardProps) {
  const source = review.booking_id ? 'Booking' : 'Outside session'

  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <Avatar className="size-10 shrink-0 shadow-sm ring-2 ring-white">
              <AvatarImage src={review.reviewer.avatar_url ?? undefined} alt="" />
              <AvatarFallback className="bg-blue-50 text-sm font-extrabold text-blue-700">
                {getInitials(review.reviewer.full_name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="font-headline text-sm font-extrabold text-slate-950">
                  {review.reviewer.full_name}
                </p>
                <RatingStars rating={review.rating} />
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-600 uppercase">
                  {source}
                </span>
              </div>
              {review.reviewer.email ? (
                <a
                  href={`mailto:${review.reviewer.email}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  {review.reviewer.email}
                </a>
              ) : null}
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-700">
            reviewed{' '}
            <span className="font-bold text-slate-900">{review.mentor.full_name}</span>
            {review.mentor.title ? (
              <span className="text-slate-500"> · {review.mentor.title}</span>
            ) : null}
            {review.mentor.email ? (
              <>
                <span className="text-slate-400"> · </span>
                <a
                  href={`mailto:${review.mentor.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {review.mentor.email}
                </a>
              </>
            ) : null}
          </p>

          {review.comment ? (
            <p className="mt-2 rounded-xl bg-slate-50 p-3 text-sm whitespace-pre-wrap text-slate-700">
              {review.comment}
            </p>
          ) : (
            <p className="mt-2 text-xs font-semibold text-slate-400">
              No comment left — rating only.
            </p>
          )}

          <p className="mt-2 text-xs text-slate-500">{formatDateTime(review.created_at)}</p>
          <p className="mt-1 font-mono text-[10px] text-slate-300 uppercase">ID {review.id}</p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => onDelete(review)}
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </div>
      </div>
    </article>
  )
}
