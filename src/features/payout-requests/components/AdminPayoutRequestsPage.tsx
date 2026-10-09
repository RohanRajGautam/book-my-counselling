'use client'

import { useEffect, useMemo, useState } from 'react'
import { Inbox, RefreshCcw } from 'lucide-react'

import { AdminPageHeader } from '@/features/admin/layout/AdminPageHeader'
import { AdminMentorPagination } from '@/features/admin/mentors/components/AdminMentorPagination'

import { useAdminPayoutRequests } from '../hooks/usePayoutRequests'
import type { PayoutRequestStatusFilter } from '../lib/payoutRequestBadges'

import { AdminPayoutRequestCard } from './AdminPayoutRequestCard'
import { PayoutRequestFiltersBar } from './PayoutRequestFiltersBar'

const PAGE_SIZE = 20
const POLL_INTERVAL_MS = 30_000

/**
 * Admin queue for mentor payout requests. Defaults to the `open` tab
 * because that's the actionable view, polls every 30s so newly-filed
 * requests from another tab surface without a manual refresh, and uses
 * the standard `AdminPageHeader` + `AdminMentorPagination` shells.
 *
 * Acknowledging a request does NOT move money — money still moves via
 * the existing `/admin/payouts` flow. This page is a notification
 * surface, not a payout ledger.
 */
export function AdminPayoutRequestsPage() {
  const [status, setStatus] = useState<PayoutRequestStatusFilter>('open')
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching, isPlaceholderData, refetch } = useAdminPayoutRequests({
    status: status === 'all' ? undefined : status,
    page,
    pageSize: PAGE_SIZE,
  })

  // Poll every 30s while the page is open. `refetchInterval` is
  // TanStack's built-in — keeps the queue fresh when a mentor files
  // a request from another browser. Disabled when the tab is in the
  // background to be polite to the backend.
  useEffect(() => {
    if (typeof window === 'undefined') return
    let intervalId: ReturnType<typeof setInterval> | null = null

    function start() {
      if (intervalId) return
      intervalId = setInterval(() => {
        if (document.visibilityState === 'visible') {
          void refetch()
        }
      }, POLL_INTERVAL_MS)
    }

    function stop() {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        start()
      } else {
        stop()
      }
    }

    start()
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [refetch])

  // Backend already orders open-first then acknowledged. We don't
  // re-sort — the rule lives in the API contract. We only re-order
  // if the API ever changes shape.
  const rows = useMemo(() => data?.items ?? [], [data?.items])

  const showSkeleton = isLoading || isPlaceholderData

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Payout requests"
          subtitle="Mentors can ping the admin team to ask for a payout. Acknowledge to send a read receipt — funds still move through Mentor Payouts."
          action={
            <div className="flex shrink-0 items-center gap-3">
              <span className="hidden self-start rounded-full bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700 sm:inline-flex">
                {data?.total ?? 0} total
              </span>
              <button
                type="button"
                onClick={() => void refetch()}
                aria-label="Refresh"
                title="Refresh"
                className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 active:scale-[0.96]"
              >
                <RefreshCcw className="size-4" />
              </button>
            </div>
          }
        />

        <div className="rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200/70 sm:p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <PayoutRequestFiltersBar
              status={status}
              onStatusChange={(next) => {
                setStatus(next)
                setPage(1)
              }}
            />
            <p className="px-2 text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase sm:px-1">
              {rows.length} of {data?.total ?? 0} requests
            </p>
          </div>
        </div>

        <section
          aria-label="All payout requests"
          className={isFetching && !isLoading ? 'opacity-70 transition-opacity' : ''}
        >
          {showSkeleton ? (
            <div className="space-y-3" aria-busy="true" aria-live="polite">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-6"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="h-5 w-40 rounded-md bg-slate-100" />
                      <div className="h-4 w-16 rounded-full bg-slate-100" />
                    </div>
                    <div className="h-3 w-56 rounded-md bg-slate-100" />
                    <div className="h-3 w-full rounded bg-slate-100" />
                    <div className="h-3 w-5/6 rounded bg-slate-100" />
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
                <AdminPayoutRequestCard key={request.id} request={request} />
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

function EmptyState({ status }: { status: PayoutRequestStatusFilter }) {
  let title = 'Inbox zero'
  let message = 'No requests to show on this view.'

  if (status === 'open') {
    title = 'No open requests'
    message =
      'Mentors can ping from their Earnings page when they want a payout. The queue will show up here.'
  } else if (status === 'acknowledged') {
    title = 'No acknowledged requests'
    message =
      "Once you (or another admin) acknowledge a request, it'll show up here with the reply note."
  }

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
