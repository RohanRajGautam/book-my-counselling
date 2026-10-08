'use client'

import { useEffect, useState } from 'react'
import { CalendarClock, Link2 } from 'lucide-react'

import { AdminPageHeader } from '../layout/AdminPageHeader'
import { AdminMeetingsFiltersBar } from './components/AdminMeetingsFiltersBar'
import { AdminMeetingCard } from './components/AdminMeetingCard'
import { AdminMentorPagination } from '../mentors/components/AdminMentorPagination'
import { useAdminMeetings } from '@/features/meetings/hooks/useMeetings'
import { BookingStatus } from '@/features/mentor-dashboard/types/booking-status'

function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])
  return debounced
}

export function AdminMeetingsPage() {
  const [q, setQ] = useState('')
  const debouncedQ = useDebouncedValue(q, 350)
  const [hasLink, setHasLink] = useState<'all' | 'true' | 'false'>('all')
  const [status, setStatus] = useState<BookingStatus | 'all'>('all')
  const [page, setPage] = useState(1)

  // Reset to page 1 whenever any filter changes — render-time pattern, matches
  // AdminBookingsPage.
  const filtersSignature = `${debouncedQ}|${hasLink}|${status}`
  const [prevFilters, setPrevFilters] = useState(filtersSignature)
  if (prevFilters !== filtersSignature) {
    setPrevFilters(filtersSignature)
    setPage(1)
  }

  const { data, isLoading, isFetching } = useAdminMeetings({
    q: debouncedQ.trim() || undefined,
    has_link: hasLink === 'all' ? undefined : hasLink === 'true',
    status: status === 'all' ? undefined : status,
    page,
  })

  const rows = data?.items ?? []
  const hasFilters = !!debouncedQ || hasLink !== 'all' || status !== 'all'

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Meetings"
          subtitle="Every auto-created Google Meet link across the platform. Filter by link state or jump to the missing-link recovery queue."
          action={
            <a
              href="/admin/meetings/missing"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-rose-50 px-3 text-xs font-bold text-rose-700 ring-1 ring-rose-100 hover:bg-rose-100"
            >
              <Link2 className="size-3.5" />
              Missing-link queue
            </a>
          }
        />

        <AdminMeetingsFiltersBar
          q={q}
          setQ={setQ}
          hasLink={hasLink}
          setHasLink={setHasLink}
          status={status}
          setStatus={setStatus}
        />

        <section
          aria-label="Meetings list"
          className={isFetching && !isLoading ? 'opacity-70 transition-opacity' : ''}
        >
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="h-5 w-48 rounded-md bg-slate-100" />
                        <div className="h-4 w-16 rounded-full bg-slate-100" />
                      </div>
                      <div className="h-3 w-40 rounded-md bg-slate-100" />
                      <div className="h-3 w-32 rounded-md bg-slate-100" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="h-6 w-40 rounded-md bg-slate-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <CalendarClock className="mx-auto mb-3 size-8 text-slate-300" />
              <p className="text-sm font-semibold text-slate-400">
                {hasFilters ? 'No meetings match these filters.' : 'No meetings yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((row) => (
                <AdminMeetingCard key={row.id} row={row} />
              ))}
            </div>
          )}
        </section>

        {data ? (
          <AdminMentorPagination
            page={data.page}
            totalPages={data.total_pages}
            total={data.total}
            itemLabel="meetings"
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