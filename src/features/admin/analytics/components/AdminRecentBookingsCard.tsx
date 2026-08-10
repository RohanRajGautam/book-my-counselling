'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'

import { Skeleton } from '@/components/ui/skeleton'
import { searchAdminBookings } from '../../bookings/api/bookings.api'
import {
  AdminBookingRow,
  AdminBookingStatus,
  AdminPaymentStatus,
} from '../../types/admin.types'
import { formatDateTime } from '../../lib/format'
import { cn } from '@/lib/utils'

const STATUS_BADGE: Record<AdminBookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-600',
}

const PAYMENT_BADGE: Record<AdminPaymentStatus, string> = {
  unpaid: 'bg-slate-100 text-slate-600',
  paid: 'bg-emerald-50 text-emerald-700',
  refunded: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-600',
}

/**
 * Compact "latest activity" surface on the analytics dashboard. Uses the same
 * admin bookings endpoint with a small page size — just the first five rows.
 */
export function AdminRecentBookingsCard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'analytics', 'recent-bookings'],
    queryFn: () => searchAdminBookings({ page: 1, pageSize: 5 }),
    staleTime: 60 * 1000,
  })

  const rows = data?.items ?? []
  return (
    <section
      aria-labelledby="admin-recent-bookings-heading"
      className="rounded-2xl bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="admin-recent-bookings-heading"
            className="font-headline text-base font-extrabold text-slate-950 sm:text-lg"
          >
            Recent Bookings
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Latest activity across the platform.
          </p>
        </div>
        <Link
          href="/admin/bookings"
          className="text-xs font-extrabold text-blue-700 hover:text-blue-800"
        >
          View all
        </Link>
      </div>

      {/* Mobile: stacked cards */}
      <ul className="mt-5 space-y-3 lg:hidden">
        {renderRowsMobile(rows, isLoading)}
      </ul>
      {/* Desktop: table */}
      <div className="mt-5 hidden overflow-x-auto lg:block">
        {renderRowsDesktop(rows, isLoading)}
      </div>
    </section>
  )
}

function renderRowsMobile(rows: AdminBookingRow[], isLoading: boolean) {
  if (isLoading) {
    return [1, 2, 3].map((i) => (
      <li key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />
    ))
  }
  if (rows.length === 0) {
    return (
      <li className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs font-medium text-slate-500">
        No bookings yet.
      </li>
    )
  }
  return rows.map((b) => (
    <li key={b.id} className="rounded-xl border border-slate-200/70 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-slate-950">
            {b.mentee.full_name || b.mentee.email}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">with {b.mentor.full_name}</p>
          <p className="mt-1 text-[11px] text-slate-400">{formatDateTime(b.session_start)}</p>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase',
            PAYMENT_BADGE[b.payment_status],
          )}
        >
          {b.payment_status}
        </span>
      </div>
    </li>
  ))
}

function renderRowsDesktop(rows: AdminBookingRow[], isLoading: boolean) {
  if (isLoading) {
    return (
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-[10px] font-extrabold tracking-[0.14em] text-slate-400 uppercase">
            <th className="py-2 pl-2 pr-3">Student</th>
            <th className="px-3 py-2">Mentor</th>
            <th className="px-3 py-2">When</th>
            <th className="py-2 pr-2 pl-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i} className="border-b border-slate-100 last:border-0">
              <td className="py-3 pl-2 pr-3">
                <Skeleton className="h-4 w-32 rounded-md bg-slate-100" />
              </td>
              <td className="px-3 py-3">
                <Skeleton className="h-4 w-32 rounded-md bg-slate-100" />
              </td>
              <td className="px-3 py-3">
                <Skeleton className="h-4 w-28 rounded-md bg-slate-100" />
              </td>
              <td className="py-3 pr-2 pl-3 text-right">
                <Skeleton className="ml-auto h-5 w-16 rounded-full bg-slate-100" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs font-medium text-slate-500">
        No bookings yet.
      </div>
    )
  }
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-200 text-left text-[10px] font-extrabold tracking-[0.14em] text-slate-400 uppercase">
          <th className="py-2 pl-2 pr-3">Student</th>
          <th className="px-3 py-2">Mentor</th>
          <th className="px-3 py-2">When</th>
          <th className="py-2 pr-2 pl-3 text-right">Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((b) => (
          <tr
            key={b.id}
            className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
          >
            <td className="max-w-[180px] truncate py-3 pl-2 pr-3 font-bold text-slate-800">
              {b.mentee.full_name || b.mentee.email}
            </td>
            <td className="max-w-[180px] truncate px-3 py-3 text-slate-700">
              {b.mentor.full_name}
            </td>
            <td className="whitespace-nowrap px-3 py-3 text-slate-600">
              {formatDateTime(b.session_start)}
            </td>
            <td className="py-3 pr-2 pl-3 text-right">
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase',
                  PAYMENT_BADGE[b.payment_status],
                )}
              >
                {b.payment_status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// STATUS_BADGE is exposed for tests / future reuse; keeps a single source of truth.
void STATUS_BADGE
