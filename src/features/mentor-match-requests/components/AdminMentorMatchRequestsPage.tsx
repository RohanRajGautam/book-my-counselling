'use client'

import { useMemo, useState } from 'react'
import { Inbox } from 'lucide-react'

import { AdminMentorPagination } from '@/features/admin/mentors/components/AdminMentorPagination'
import { AdminPageHeader } from '@/features/admin/layout/AdminPageHeader'

import { useAdminMentorMatchRequests } from '../hooks/useMentorMatchRequests'
import type { MentorMatchRequestStatus } from '../types/mentor-match-requests.types'

import { MentorMatchRequestDetailSheet } from './MentorMatchRequestDetailSheet'
import { MentorMatchRequestFiltersBar } from './MentorMatchRequestFiltersBar'
import { MentorMatchRequestRow } from './MentorMatchRequestRow'

const PAGE_SIZE = 20

export function AdminMentorMatchRequestsPage() {
  const [status, setStatus] = useState<MentorMatchRequestStatus | 'all'>('pending')
  const [page, setPage] = useState(1)
  const [openId, setOpenId] = useState<string | null>(null)

  const { data, isLoading, isFetching, isPlaceholderData } = useAdminMentorMatchRequests({
    status: status === 'all' ? undefined : status,
    page,
    pageSize: PAGE_SIZE,
  })

  const rows = useMemo(
    () =>
      [...(data?.items ?? [])].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [data?.items],
  )

  const showSkeleton = isLoading || isPlaceholderData

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Mentor match requests"
          subtitle="Visitors who couldn’t find a mentor on their own. Triage the inbox, reach out, then mark as contacted or fulfilled."
          action={
            <span className="hidden self-start rounded-full bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700 sm:inline-flex">
              {data?.total ?? 0} total
            </span>
          }
        />

        <div className="rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200/70 sm:p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <MentorMatchRequestFiltersBar
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

        <section
          aria-label="All mentor match requests"
          className={isFetching && !isLoading ? 'opacity-70 transition-opacity' : ''}
        >
          {showSkeleton ? (
            <div className="space-y-3" aria-busy="true" aria-live="polite">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-6"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="size-12 shrink-0 rounded-full bg-slate-100 sm:size-14" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-24 rounded bg-slate-100" />
                      <div className="h-3 w-3/4 rounded bg-slate-100" />
                      <div className="h-3 w-1/2 rounded bg-slate-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <EmptyState status={status} />
          ) : (
            <div className="space-y-3">
              {rows.map((request) => (
                <MentorMatchRequestRow
                  key={request.id}
                  request={request}
                  onOpen={() => setOpenId(request.id)}
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

      <MentorMatchRequestDetailSheet
        requestId={openId}
        open={Boolean(openId)}
        onOpenChange={(next) => {
          if (!next) setOpenId(null)
        }}
      />
    </div>
  )
}

function EmptyState({ status }: { status: MentorMatchRequestStatus | 'all' }) {
  const title = status === 'all' ? 'No requests yet' : `No ${status} requests on this view`
  const message =
    status === 'all'
      ? 'Visitors who couldn’t find a mentor on their own will land here. New requests will appear in the Pending tab.'
      : 'Switch tabs to view other statuses, or clear the filter to see every request.'
  return (
    <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#eff4ff] text-[#004ac6]">
        <Inbox className="size-7" strokeWidth={2.2} />
      </div>
      <p className="font-[family-name:var(--font-headline)] mt-4 text-base font-extrabold text-slate-950">
        {title}
      </p>
      <p className="mt-1 max-w-md text-sm font-medium text-slate-500">{message}</p>
    </div>
  )
}
