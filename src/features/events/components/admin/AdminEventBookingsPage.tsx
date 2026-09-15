'use client'

import Link from 'next/link'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Inbox, Loader2, RefreshCw, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { AdminPageHeader } from '@/features/admin/layout/AdminPageHeader'

import { useAdminEvent } from '../../hooks/useAdminEvents'
import { useAdminEventBookings } from '../../hooks/useAdminEventBookings'
import { ADMIN_EVENT_BOOKINGS_PAGE_SIZE } from '../../lib/events.constants'
import { formatLongDate } from '../../lib/events.utils'

import { AdminEventBookingRow } from './AdminEventBookingRow'
import { AdminEventPagination } from './AdminEventPagination'

interface AdminEventBookingsPageProps {
  eventId: string
}

export function AdminEventBookingsPage({ eventId }: AdminEventBookingsPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Page is derived from `?page=N`. URL is the single source of truth so
  // pasting `/bookings?page=3` deep-links straight there.
  const pageParam = Number(searchParams?.get('page') ?? '1')
  const page = Number.isFinite(pageParam) && pageParam >= 1 ? Math.floor(pageParam) : 1

  const { data: event, isLoading: eventLoading, error: eventError } = useAdminEvent(eventId)
  const {
    data,
    isLoading,
    isPlaceholderData,
    isFetching,
    error: bookingsError,
  } = useAdminEventBookings(eventId, page, ADMIN_EVENT_BOOKINGS_PAGE_SIZE)
  const showSkeleton = isLoading || isPlaceholderData

  const total = data?.total ?? 0

  const handlePageChange = (next: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    params.set('page', String(next))
    router.replace(`/admin/events/${eventId}/bookings?${params.toString()}`, { scroll: false })
  }

  // ── Loading state ─────────────────────────────────────────────────────
  if (eventLoading) return <BookingsSkeleton />

  // ── Event-level error / not found ─────────────────────────────────────
  if (eventError || !event) {
    const isNotFound = axios.isAxiosError(eventError) && eventError.response?.status === 404
    return (
      <StateShell>
        <div className="mx-auto grid size-14 place-items-center rounded-[22px] bg-amber-50 text-amber-600">
          <ArrowLeft className="size-6" />
        </div>
        <h1 className="mt-4 font-headline text-2xl font-extrabold text-slate-950">
          {isNotFound ? 'Event not found' : 'Could not load this event'}
        </h1>
        <p className="mt-1 max-w-sm text-sm text-slate-600">
          {isNotFound
            ? 'The event may have been deleted. Head back to the events list to pick another.'
            : 'Something went wrong while loading the event. Try again in a moment.'}
        </p>
        <Button
          variant="outline"
          className="mt-5 rounded-[22px]"
          nativeButton={false}
          render={<Link href="/admin/events" />}
        >
          Back to events
        </Button>
      </StateShell>
    )
  }

  return (
    <div className="min-h-svh bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] min-w-0 space-y-6 overflow-x-hidden px-3 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <Link
          href={`/admin/events/${eventId}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-slate-500 uppercase hover:text-slate-800"
        >
          <ArrowLeft className="size-3.5" />
          Back to event
        </Link>

        <AdminPageHeader
          title={`Bookings · ${event.title}`}
          subtitle={`${formatLongDate(event.event_date)}${
            event.event_time ? ` · ${event.event_time}` : ''
          }${event.location ? ` · ${event.location}` : ''}`}
          action={
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6eeff] px-3 py-1.5 text-xs font-extrabold tracking-wide text-[#004ac6] uppercase ring-1 ring-[#c9d7f4]">
                <Users className="size-3.5" aria-hidden="true" />
                {total.toLocaleString('en-US')} booking{total === 1 ? '' : 's'}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 rounded-[22px] border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                onClick={() => router.refresh()}
              >
                <RefreshCw className="size-3.5" strokeWidth={2.4} />
                Refresh
              </Button>
            </div>
          }
        />

        {/* Bookings list */}
        {showSkeleton ? (
          <div className="space-y-3" aria-busy="true" aria-live="polite">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-slate-200/60 sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="size-12 shrink-0 rounded-full bg-slate-100" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-40 rounded-[22px] bg-slate-100" />
                    <div className="h-3 w-56 rounded-[22px] bg-slate-100" />
                    <div className="h-3 w-32 rounded-[22px] bg-slate-100" />
                  </div>
                  <div className="h-4 w-20 rounded-[22px] bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : bookingsError ? (
          <ErrorState onRetry={() => router.refresh()} />
        ) : data && data.items.length === 0 ? (
          <EmptyState eventTitle={event.title} />
        ) : data ? (
          <section aria-label="Event bookings" className="space-y-3">
            {data.items.map((booking) => (
              <AdminEventBookingRow key={booking.id} booking={booking} />
            ))}
          </section>
        ) : null}

        {!showSkeleton && data ? (
          <AdminEventPagination
            page={data.page}
            totalPages={data.total_pages}
            total={data.total}
            itemLabel="bookings"
            hasPrev={data.has_prev}
            hasNext={data.has_next}
            onPrev={() => handlePageChange(Math.max(1, page - 1))}
            onNext={() => handlePageChange(page + 1)}
          />
        ) : null}

        {!showSkeleton && data && isFetching ? (
          <p className="text-center text-xs font-semibold text-slate-400">
            <Loader2 className="mr-1 inline size-3 animate-spin" />
            Refreshing…
          </p>
        ) : null}
      </div>
    </div>
  )
}

// ── Sub-states ──────────────────────────────────────────────────────────

function EmptyState({ eventTitle }: { eventTitle: string }) {
  return (
    <div className="rounded-[22px] bg-white p-12 text-center shadow-sm ring-1 ring-slate-200/60">
      <Inbox className="mx-auto mb-3 size-8 text-slate-300" aria-hidden="true" />
      <p className="font-headline text-base font-extrabold text-slate-900">
        No bookings yet
      </p>
      <p className="mt-1 text-sm font-medium text-slate-500">
        When someone books a seat for {eventTitle}, their name, email, and phone will show up
        here.
      </p>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-[22px] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200/60">
      <p className="font-headline text-base font-extrabold text-slate-900">
        Couldn&rsquo;t load bookings
      </p>
      <p className="mt-1 text-sm text-slate-500">
        Something went wrong while fetching the bookings list.
      </p>
      <Button variant="outline" size="sm" onClick={onRetry} className="mt-4 rounded-[22px]">
        <RefreshCw className="size-3.5" /> Retry
      </Button>
    </div>
  )
}

function BookingsSkeleton() {
  return (
    <div className="min-h-svh bg-[#f8f9ff]">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
        <div className="space-y-3">
          <div className="h-10 w-72 animate-pulse rounded-[22px] bg-slate-200" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-[22px] bg-slate-200"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function StateShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-[#f8f9ff]">
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        {children}
      </div>
    </div>
  )
}
