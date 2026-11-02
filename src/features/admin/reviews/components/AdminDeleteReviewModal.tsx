'use client'

import { useEffect } from 'react'
import { Loader2, Star, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { AdminReviewRow } from '../../types/admin.types'
import { httpStatus } from '../../lib/apiError'
import { useDeleteAdminReview } from '../hooks/useAdminReviews'

export interface AdminDeleteReviewModalProps {
  review: AdminReviewRow
  onClose: () => void
}

export function AdminDeleteReviewModal({ review, onClose }: AdminDeleteReviewModalProps) {
  const { mutate, isPending } = useDeleteAdminReview()

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

  const handleSubmit = () => {
    mutate(review.id, {
      onSuccess: (res) => {
        toast.success(res.message)
        onClose()
      },
      onError: (err) => {
        const status = httpStatus(err)
        if (status === 403) {
          toast.error("You don't have admin access.")
          return
        }
        if (status === 404) {
          toast.error('That review no longer exists. Refreshing the list…')
          onClose()
          return
        }
        toast.error('Failed to delete the review. Please try again.')
      },
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-3 py-6 sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-review-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div className="relative z-[1] flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
          <h2
            id="delete-review-title"
            className="font-headline text-lg font-extrabold tracking-tight text-slate-950 sm:text-xl"
          >
            Delete review?
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="space-y-3 px-4 py-4 sm:px-6">
          <p className="rounded-xl bg-red-50 px-3 py-2 text-xs leading-5 font-medium text-red-700 ring-1 ring-red-100">
            This permanently removes the review and updates{' '}
            <span className="font-bold">{review.mentor.full_name}</span>&apos;s average
            rating. It cannot be undone.
          </p>

          <div className="rounded-xl bg-slate-50 p-3 text-sm">
            <p className="font-bold text-slate-900">
              {review.reviewer.full_name}
              {review.reviewer.email ? (
                <span className="font-medium text-slate-500"> · {review.reviewer.email}</span>
              ) : null}
            </p>
            <p className="mt-0.5 flex items-center gap-1 font-semibold text-amber-600">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
              ))}
              {review.rating} star{review.rating === 1 ? '' : 's'}
            </p>
            <p className="mt-1 text-slate-500">
              about <span className="font-bold text-slate-700">{review.mentor.full_name}</span>
            </p>
            {review.comment ? (
              <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600 italic">
                “{review.comment}”
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 bg-white px-4 pt-3 pb-3 sm:px-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="rounded-xl"
          >
            Keep review
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isPending}
            className="gap-1.5 rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" /> Deleting…
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                Delete review
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
