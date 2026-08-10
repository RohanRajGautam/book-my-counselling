'use client'

import { useEffect, useState } from 'react'
import { CalendarClock } from 'lucide-react'

import { AdminPageHeader } from '../layout/AdminPageHeader'
import { useAdminBookings } from './hooks/useAdminBookings'
import { AdminBookingFiltersBar } from './components/AdminBookingFiltersBar'
import { AdminBookingCard } from './components/AdminBookingCard'
import { AdminMentorPagination } from '../mentors/components/AdminMentorPagination'
import {
  AdminBookingStatus,
  AdminPaymentStatus,
} from '../types/admin.types'

function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])
  return debounced
}

export function AdminBookingsPage() {
  const [q, setQ] = useState('')
  const debouncedQ = useDebouncedValue(q, 350)
  const [status, setStatus] = useState<AdminBookingStatus | 'all'>('all')
  const [paymentStatus, setPaymentStatus] = useState<AdminPaymentStatus | 'all'>('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [debouncedQ, status, paymentStatus])

  const { data, isLoading, isFetching } = useAdminBookings({
    q: debouncedQ.trim() || undefined,
    status: status === 'all' ? undefined : status,
    paymentStatus: paymentStatus === 'all' ? undefined : paymentStatus,
    page,
  })

  const rows = data?.items ?? []
  const hasFilters = !!debouncedQ || status !== 'all' || paymentStatus !== 'all'

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Bookings"
          subtitle="Search, filter, and cancel bookings across the platform."
          action={
            <span className="hidden self-start rounded-full bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700 sm:inline-flex">
              {data?.total ?? 0} total
            </span>
          }
        />

        <AdminBookingFiltersBar
          q={q}
          setQ={setQ}
          status={status}
          setStatus={setStatus}
          paymentStatus={paymentStatus}
          setPaymentStatus={setPaymentStatus}
        />

        <section
          aria-label="Bookings list"
          className={isFetching && !isLoading ? 'opacity-70 transition-opacity' : ''}
        >
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="h-5 w-48 rounded-md bg-slate-100" />
                        <div className="h-4 w-16 rounded-full bg-slate-100" />
                        <div className="h-4 w-20 rounded-full bg-slate-100" />
                      </div>
                      <div className="h-3 w-40 rounded-md bg-slate-100" />
                      <div className="h-3 w-32 rounded-md bg-slate-100" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="h-6 w-24 rounded-md bg-slate-100" />
                      <div className="h-8 w-20 rounded-xl bg-slate-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <CalendarClock className="mx-auto mb-3 size-8 text-slate-300" />
              <p className="text-sm font-semibold text-slate-400">
                {hasFilters
                  ? 'No bookings match these filters.'
                  : 'No bookings yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((b) => (
                <AdminBookingCard key={b.id} booking={b} />
              ))}
            </div>
          )}
        </section>

        {data ? (
          <AdminMentorPagination
            page={data.page}
            totalPages={data.total_pages}
            total={data.total}
            itemLabel="bookings"
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
