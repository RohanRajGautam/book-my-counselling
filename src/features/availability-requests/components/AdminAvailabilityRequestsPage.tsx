'use client'

import { useMemo, useState } from 'react'
import { Inbox } from 'lucide-react'

import { AdminPageHeader } from '@/features/admin/layout/AdminPageHeader'
import { AdminMentorPagination } from '@/features/admin/mentors/components/AdminMentorPagination'

import { useAllAvailabilityRequests } from '../hooks/useAvailabilityRequests'
import { AvailabilityRequestFiltersBar } from './AvailabilityRequestFiltersBar'
import { AvailabilityRequestCard } from './AvailabilityRequestCard'
import type { AvailabilityRequestStatus } from '../types/availability-requests.types'

const PAGE_SIZE = 20

export function AdminAvailabilityRequestsPage() {
  const [status, setStatus] = useState<AvailabilityRequestStatus | 'all'>('pending')
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching, isPlaceholderData } = useAllAvailabilityRequests({
    status: status === 'all' ? undefined : status,
    page,
    pageSize: PAGE_SIZE,
  })

  const rows = useMemo(
    () =>
      [...(data?.items ?? [])].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [data?.items]
  )

  // Same placeholder-data pattern as `AdminMentorsPage` — show skeleton when
  // the tab/page changes so the admin doesn't briefly see the wrong tab's data.
  const showSkeleton = isLoading || isPlaceholderData

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Availability requests"
          subtitle="A watchdog view across every mentor. Filter by status to spot mentors slow to respond — confirm/reject stays with the mentor."
          action={
            <span className="hidden self-start rounded-full bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700 sm:inline-flex">
              {data?.total ?? 0} total
            </span>
          }
        />

        <div className="rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200/70 sm:p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <AvailabilityRequestFiltersBar
              status={status}
              onStatusChange={(next) => {
                setStatus(next)
                setPage(1)
              }}
            />
            <div className="flex items-center justify-between gap-3 px-2 sm:px-1">
              <p className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">
                {rows.length} of {data?.total ?? 0} requests
              </p>
              <p className="text-[11px] font-extrabold text-slate-600">Newest first</p>
            </div>
          </div>
        </div>

        {/* Body uses viewport-aware dim while background refetch runs. */}
        <section
          aria-label="All availability requests"
          className={isFetching && !isLoading ? 'opacity-70 transition-opacity' : ''}
        >
          {showSkeleton ? (
            <div className="space-y-3" aria-busy="true" aria-live="polite">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-6"
                >
                  <div className="mb-4 flex items-center gap-3 rounded-2xl bg-[#f8f9ff] p-3 ring-1 ring-[#eff4ff]">
                    <div className="size-10 shrink-0 rounded-xl bg-slate-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-16 rounded bg-slate-100" />
                      <div className="h-3 w-32 rounded bg-slate-100" />
                      <div className="h-3 w-24 rounded bg-slate-100" />
                    </div>
                  </div>
                  <div className="space-y-3">
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
              {rows.map((request) => (
                <AvailabilityRequestCard
                  key={request.id}
                  request={request}
                  readOnly
                  showCreatedSlot
                  showMentor
                />
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
  const title = status === 'all' ? 'No requests yet' : `No ${status} requests on this view`
  const message =
    status === 'all'
      ? 'Visitors can ask mentors to open a specific time from their public profile. New requests will land here.'
      : 'Switch tabs to view other statuses, or clear the filter to see every request.'
  return (
    <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#eff4ff] text-[#004ac6]">
        <Inbox className="size-7" strokeWidth={2.2} />
      </div>
      <p className="mt-4 font-[family-name:var(--font-headline)] text-base font-extrabold text-slate-950">
        {title}
      </p>
      <p className="mt-1 max-w-md text-sm font-medium text-slate-500">{message}</p>
    </div>
  )
}
