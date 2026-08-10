'use client'

import { useMemo, useState } from 'react'
import { Inbox } from 'lucide-react'

import { AdminPageHeader } from '@/features/admin/layout/AdminPageHeader'
// Re-use the admin pagination block since it's generic list UI.
// (We don't depend on the admin feature for routing — just the visual.)
import { AdminMentorPagination } from '@/features/admin/mentors/components/AdminMentorPagination'

import { useMyAvailabilityRequests } from '../hooks/useAvailabilityRequests'
import { AvailabilityRequestFiltersBar } from './AvailabilityRequestFiltersBar'
import { AvailabilityRequestCard } from './AvailabilityRequestCard'
import type { AvailabilityRequestStatus } from '../types/availability-requests.types'

const PAGE_SIZE = 20

export function MentorAvailabilityRequestsPage() {
  const [status, setStatus] = useState<AvailabilityRequestStatus | 'all'>('pending')
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching, isPlaceholderData } = useMyAvailabilityRequests({
    status: status === 'all' ? undefined : status,
    page,
    pageSize: PAGE_SIZE,
  })

  // Same placeholder-data pattern as `AdminMentorsPage` — when the mentor
  // switches tabs or pages, the previous result stays visible while the new
  // request is in flight. We swap to a skeleton so they don't see stale data
  // from the wrong tab.
  const showSkeleton = isLoading || isPlaceholderData
  const rows = useMemo(
    () =>
      [...(data?.items ?? [])].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [data?.items]
  )

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1080px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Availability requests"
          subtitle="Visitors who asked you to open a session at a specific time. Approve to open the slot, or decline with an optional note."
          action={
            <span className="hidden self-start rounded-full bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700 sm:inline-flex">
              {data?.total ?? 0} total
            </span>
          }
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <AvailabilityRequestFiltersBar
            status={status}
            onStatusChange={(next) => {
              setStatus(next)
              setPage(1)
            }}
          />

          {/* Subtle per-tab count so the mentor knows the load at a glance. */}
          <p className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">
            Showing{' '}
            <span className="text-slate-700">
              {rows.length} of {data?.total ?? 0}
            </span>
          </p>
        </div>

        <section
          aria-label="Availability requests list"
          className={isFetching && !isLoading ? 'opacity-70 transition-opacity' : ''}
        >
          {showSkeleton ? (
            <div className="space-y-3" aria-busy="true" aria-live="polite">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-6"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="h-5 w-48 rounded-md bg-slate-100" />
                      <div className="h-4 w-16 rounded-full bg-slate-100" />
                    </div>
                    <div className="h-3 w-full rounded bg-slate-100" />
                    <div className="h-3 w-5/6 rounded bg-slate-100" />
                    <div className="h-3 w-3/6 rounded bg-slate-100" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="h-9 w-24 rounded-xl bg-slate-100" />
                    <div className="h-9 w-24 rounded-xl bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <EmptyState status={status} />
          ) : (
            <div className="space-y-3">
              {rows.map((r) => (
                <AvailabilityRequestCard key={r.id} request={r} />
              ))}
            </div>
          )}
        </section>

        {data ? (
          <AdminMentorPagination
            page={data.page}
            totalPages={data.total_pages}
            total={data.total}
            itemLabel="requests"
            hasPrev={data.has_prev}
            hasNext={data.has_next}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => p + 1)}
          />
        ) : null}
      </div>
    </div>
  )
}

function EmptyState({ status }: { status: AvailabilityRequestStatus | 'all' }) {
  const message =
    status === 'pending'
      ? "You're all caught up — no pending requests right now."
      : status === 'confirmed'
        ? 'No confirmed requests on this view yet.'
        : status === 'rejected'
          ? 'No rejected requests on this view yet.'
          : 'No availability requests yet.'

  return (
    <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#eff4ff] text-[#004ac6]">
        <Inbox className="size-7" strokeWidth={2.2} />
      </div>
      <p className="mt-4 font-[family-name:var(--font-headline)] text-base font-extrabold text-slate-950">
        Inbox zero
      </p>
      <p className="mt-1 text-sm font-medium text-slate-500">{message}</p>
      <p className="mt-4 max-w-md text-xs leading-5 font-medium text-slate-400">
        Visitors can ask you to open a specific time from your public profile. You&apos;ll get an
        email each time someone files a new request.
      </p>
    </div>
  )
}
