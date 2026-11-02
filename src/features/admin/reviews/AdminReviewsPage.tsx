'use client'

import { useEffect, useState } from 'react'
import { MessageSquare } from 'lucide-react'

import { AdminPageHeader } from '../layout/AdminPageHeader'
import { AdminMentorPagination } from '../mentors/components/AdminMentorPagination'
import { AdminMentorPickerOption, AdminReviewRow } from '../types/admin.types'
import { useAdminReviews } from './hooks/useAdminReviews'
import { ReviewRatingFilter } from './lib/reviewBadges'
import { AdminReviewFiltersBar } from './components/AdminReviewFiltersBar'
import { AdminReviewCard } from './components/AdminReviewCard'
import { AdminDeleteReviewModal } from './components/AdminDeleteReviewModal'

function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])
  return debounced
}

export function AdminReviewsPage() {
  const [q, setQ] = useState('')
  const debouncedQ = useDebouncedValue(q, 350)
  const [rating, setRating] = useState<ReviewRatingFilter>('all')
  const [mentorId, setMentorId] = useState('')
  const [mentor, setMentor] = useState<AdminMentorPickerOption | null>(null)
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<AdminReviewRow | null>(null)

  // Reset to page 1 whenever any filter changes. Doing this during render
  // (instead of in an effect) avoids a cascading re-render.
  const filtersSignature = `${debouncedQ}|${mentorId}|${rating}`
  const [prevFilters, setPrevFilters] = useState(filtersSignature)
  if (prevFilters !== filtersSignature) {
    setPrevFilters(filtersSignature)
    setPage(1)
  }

  const { data, isLoading, isFetching } = useAdminReviews({
    q: debouncedQ.trim() || undefined,
    mentorId: mentorId || undefined,
    rating: rating === 'all' ? undefined : rating,
    page,
  })

  const rows = data?.items ?? []
  const hasFilters = !!debouncedQ || mentorId !== '' || rating !== 'all'

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Reviews"
          subtitle="Search and moderate every review left on the platform."
          action={
            <div className="hidden flex-col items-end gap-0.5 self-start sm:flex">
              <span className="text-xs font-extrabold text-slate-700">
                {data ? `${data.total.toLocaleString('en-US')} total reviews` : '…'}
              </span>
              {hasFilters ? (
                <span className="text-[11px] font-semibold text-slate-500">
                  {rows.length} on this page
                </span>
              ) : null}
            </div>
          }
        />

        <AdminReviewFiltersBar
          q={q}
          setQ={setQ}
          rating={rating}
          setRating={setRating}
          mentorId={mentorId}
          setMentorId={setMentorId}
          mentor={mentor}
          setMentor={setMentor}
        />

        <section
          aria-label="Reviews list"
          className={isFetching && !isLoading ? 'opacity-70 transition-opacity' : ''}
        >
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-slate-100" />
                        <div className="h-4 w-40 rounded-md bg-slate-100" />
                      </div>
                      <div className="h-3 w-56 rounded-md bg-slate-100" />
                      <div className="h-12 w-full rounded-xl bg-slate-100" />
                    </div>
                    <div className="h-7 w-20 rounded-xl bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <MessageSquare className="mx-auto mb-3 size-8 text-slate-300" />
              <p className="text-sm font-semibold text-slate-400">
                {hasFilters ? 'No reviews match these filters.' : 'No reviews yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((r) => (
                <AdminReviewCard key={r.id} review={r} onDelete={setDeleteTarget} />
              ))}
            </div>
          )}
        </section>

        {data ? (
          <AdminMentorPagination
            page={data.page}
            totalPages={data.total_pages}
            total={data.total}
            itemLabel="reviews"
            hasPrev={data.has_prev}
            hasNext={data.has_next}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => p + 1)}
          />
        ) : null}
      </div>

      {deleteTarget ? (
        <AdminDeleteReviewModal
          review={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </div>
  )
}
