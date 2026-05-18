'use client'

import { useEffect, useState } from 'react'
import {
  CalendarClock, ChevronLeft, ChevronRight, Loader2, Search, X,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  useAdminBookings, useAdminCancelBooking,
} from '../hooks/useAdminBookings'
import {
  AdminBookingRow, AdminBookingStatus, AdminPaymentStatus,
} from '../types/admin.types'

const STATUS_OPTIONS: { value: AdminBookingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const PAYMENT_OPTIONS: { value: AdminPaymentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All payments' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'paid', label: 'Paid' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'failed', label: 'Failed' },
]

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

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])
  return debounced
}

export function BookingsPanel() {
  const [q, setQ] = useState('')
  const debouncedQ = useDebouncedValue(q, 350)
  const [status, setStatus] = useState<AdminBookingStatus | 'all'>('all')
  const [paymentStatus, setPaymentStatus] = useState<AdminPaymentStatus | 'all'>('all')
  const [page, setPage] = useState(1)

  // Reset to page 1 whenever a filter changes
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

  return (
    <div>
      {/* Filter bar */}
      <div className="mt-4 grid gap-3 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by mentee email/name, mentor name, or booking ID prefix…"
            className="h-11 w-full rounded-xl bg-slate-50 pl-10 pr-10 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-200"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as AdminBookingStatus | 'all')}
          className="h-11 rounded-xl bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value as AdminPaymentStatus | 'all')}
          className="h-11 rounded-xl bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200"
        >
          {PAYMENT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className={`mt-4 ${isFetching && !isLoading ? 'opacity-70' : ''}`}>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-white" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <CalendarClock className="mx-auto mb-3 size-8 text-slate-300" />
            <p className="text-sm font-semibold text-slate-400">
              {debouncedQ || status !== 'all' || paymentStatus !== 'all'
                ? 'No bookings match these filters.'
                : 'No bookings yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((b) => (
              <BookingRow key={b.id} booking={b} />
            ))}
          </div>
        )}

        {data && data.total_pages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={!data.has_prev}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-semibold text-slate-600">
              {data.page} / {data.total_pages} · {data.total} bookings
            </span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={!data.has_next}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function BookingRow({ booking }: { booking: AdminBookingRow }) {
  const [cancelOpen, setCancelOpen] = useState(false)
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed'

  return (
    <>
      <article className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-headline text-base font-extrabold text-slate-950">
                {booking.topic || 'Untitled session'}
              </p>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${STATUS_BADGE[booking.status]}`}
              >
                {booking.status}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${PAYMENT_BADGE[booking.payment_status]}`}
              >
                {booking.payment_status}
              </span>
              {booking.refund && booking.refund.status !== 'processed' && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold uppercase text-amber-700">
                  Refund {booking.refund.status}
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-slate-700">
              <span className="font-bold">{booking.mentee.full_name || '(no name)'}</span>{' '}
              <span className="text-slate-400">·</span>{' '}
              <a
                href={`mailto:${booking.mentee.email}`}
                className="text-blue-600 hover:underline"
              >
                {booking.mentee.email}
              </a>
              <span className="text-slate-400"> with </span>
              <span className="font-bold">{booking.mentor.full_name}</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {formatDateTime(booking.session_start)} · NPR {booking.agreed_price}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase text-slate-300">
              ID {booking.id}
            </p>
            {booking.cancellation_reason && (
              <p className="mt-2 text-xs italic text-slate-500">
                Cancelled: {booking.cancellation_reason}
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            {canCancel ? (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => setCancelOpen(true)}
              >
                <X className="size-3.5" />
                Cancel booking
              </Button>
            ) : (
              <span className="text-xs font-semibold text-slate-400">
                {booking.status === 'completed' ? 'Completed' : 'Closed'}
              </span>
            )}
          </div>
        </div>
      </article>

      {cancelOpen && (
        <CancelBookingModal
          booking={booking}
          onClose={() => setCancelOpen(false)}
        />
      )}
    </>
  )
}

function CancelBookingModal({
  booking,
  onClose,
}: {
  booking: AdminBookingRow
  onClose: () => void
}) {
  const [reason, setReason] = useState('')
  const { mutate, isPending } = useAdminCancelBooking()

  const canSubmit = reason.trim().length > 0 && !isPending
  const isPaid = booking.payment_status === 'paid'

  const handleSubmit = () => {
    if (!canSubmit) return
    mutate(
      { id: booking.id, reason: reason.trim() },
      {
        onSuccess: () => {
          toast.success(
            isPaid
              ? 'Booking cancelled. Refund request opened for admin review.'
              : 'Booking cancelled.'
          )
          onClose()
        },
        onError: () => toast.error('Failed to cancel booking.'),
      },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-headline text-lg font-extrabold text-slate-950">
            Cancel booking
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 text-sm">
          <p className="font-bold text-slate-800">
            {booking.mentee.full_name || booking.mentee.email}
          </p>
          <p className="text-slate-500">
            with {booking.mentor.full_name} · {formatDateTime(booking.session_start)}
          </p>
          <p className="mt-1 text-slate-500">NPR {booking.agreed_price}</p>
        </div>

        {isPaid && (
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
            This booking has been <strong>paid</strong>. Cancelling will open
            a refund request — you&apos;ll process it via the Refunds tab.
          </p>
        )}

        <label className="mt-4 block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            Cancellation reason
          </span>
          <textarea
            rows={3}
            autoFocus
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="E.g. mentee requested cancellation via email on 2026-05-17"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            disabled={isPending}
          />
        </label>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Keep booking
          </Button>
          <Button
            className="gap-1.5 bg-red-600 text-white hover:bg-red-700"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
            Cancel booking
          </Button>
        </div>
      </div>
    </div>
  )
}
