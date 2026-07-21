'use client'

import { useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useAdminCancelBooking } from '../hooks/useAdminBookings'
import { AdminBookingRow } from '../../types/admin.types'
import { formatDateTime } from '../../lib/format'

export interface AdminCancelBookingModalProps {
  booking: AdminBookingRow
  onClose: () => void
}

export function AdminCancelBookingModal({
  booking,
  onClose,
}: AdminCancelBookingModalProps) {
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
              : 'Booking cancelled.',
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

        {isPaid ? (
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
            This booking has been <strong>paid</strong>. Cancelling will open
            a refund request — you&apos;ll process it via the Refunds tab.
          </p>
        ) : null}

        <label className="mt-4 block">
          <span className="text-xs font-extrabold tracking-wide text-slate-500 uppercase">
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
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <X className="size-4" />
            )}
            Cancel booking
          </Button>
        </div>
      </div>
    </div>
  )
}
