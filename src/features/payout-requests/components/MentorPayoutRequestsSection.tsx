'use client'

import { useMemo, useState } from 'react'
import { HandCoins, Inbox } from 'lucide-react'

import { AdminMentorPagination } from '@/features/admin/mentors/components/AdminMentorPagination'

import { useMyPayoutRequests } from '../hooks/usePayoutRequests'

import { MentorPayoutRequestCard } from './MentorPayoutRequestCard'
import { RequestPayoutButton } from './RequestPayoutButton'

const PAGE_SIZE = 5

/**
 * Compact section embedded in the mentor earnings tab. Replaces the
 * static demo "Payout Settings" card with the real flow: a request
 * payout CTA (hard-blocked while one is open) and a list of the
 * mentor's own past requests so they see the admin's ack right next
 * to their earnings.
 */
export function MentorPayoutRequestsSection() {
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching, isPlaceholderData } = useMyPayoutRequests({
    page,
    pageSize: PAGE_SIZE,
  })

  // We can only detect an open request from the page that's currently
  // loaded. If a previous row is sitting on a different page, the
  // dialog's 409 handler still covers it so the mentor gets a friendly
  // message rather than a silent failure.
  const blockedByOpenRequest = useMemo(() => {
    if (!data) return false
    return data.items.some((r) => r.status === 'open')
  }, [data])

  const rows = useMemo(
    () =>
      [...(data?.items ?? [])].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [data?.items]
  )

  const showSkeleton = isLoading || isPlaceholderData
  const total = data?.total ?? 0

  return (
    <section
      aria-label="Payout requests"
      className="overflow-hidden rounded-2xl bg-white shadow-sm sm:rounded-3xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#f4f7ff] px-4 py-5 sm:px-7 sm:py-7">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <HandCoins className="size-5" strokeWidth={2.2} />
          </span>
          <div>
            <h2 className="font-headline text-lg font-extrabold text-slate-950 sm:text-xl">
              Payout requests
            </h2>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Ping the admin team when you want your balance paid out. Ack shows up here.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {data ? (
            <span className="text-sm font-semibold text-slate-500">{total} total</span>
          ) : null}
          <RequestPayoutButton blockedByOpenRequest={blockedByOpenRequest} />
        </div>
      </div>

      {blockedByOpenRequest ? (
        <div
          role="status"
          className="border-b border-amber-200 bg-amber-50/70 px-4 py-3 text-sm font-medium text-amber-900 sm:px-7"
        >
          <p className="text-[10px] font-extrabold tracking-[0.16em] text-amber-700 uppercase">
            Pending
          </p>
          <p className="mt-0.5">
            You already have a payout request in flight. We&apos;ll let you file another as soon as
            the admin acknowledges it.
          </p>
        </div>
      ) : null}

      <div
        className={isFetching && !isLoading ? 'opacity-70 transition-opacity' : ''}
        aria-busy={showSkeleton}
        aria-live="polite"
      >
        {showSkeleton ? (
          <div>
            {[1, 2].map((i) => (
              <div
                key={i}
                className="grid animate-pulse gap-3 border-b border-slate-100 px-4 py-5 last:border-b-0 sm:px-7"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <div className="h-5 w-32 rounded-md bg-slate-100" />
                  <div className="h-4 w-16 rounded-full bg-slate-100" />
                </div>
                <div className="h-3 w-48 rounded bg-slate-100" />
                <div className="h-3 w-full rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-7 py-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#eff4ff] text-[#004ac6]">
              <Inbox className="size-6" strokeWidth={2.2} />
            </span>
            <p className="text-sm font-extrabold text-slate-700">No payout requests yet</p>
            <p className="max-w-md text-xs font-medium text-slate-500">
              When you file one, the snapshot balance and the admin&apos;s reply show up here.
            </p>
          </div>
        ) : (
          <div>
            {rows.map((r) => (
              <MentorPayoutRequestCard key={r.id} request={r} />
            ))}
          </div>
        )}
      </div>

      {data && data.total_pages > 1 ? (
        <div className="flex items-center justify-center gap-3 border-t border-slate-100 px-7 py-5">
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
        </div>
      ) : null}
    </section>
  )
}
