'use client'

import { useEffect } from 'react'
import { Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

import { AdminBookingRow } from '../../types/admin.types'
import { formatDateTime, formatNPR } from '../../lib/format'
import { httpStatus } from '../../lib/apiError'
import { Button } from '@/components/ui/button'
import { useAdminCompleteBooking } from '../hooks/useAdminBookings'

export interface AdminMarkCompleteBookingModalProps {
  booking: AdminBookingRow
  onClose: () => void
}

export function AdminMarkCompleteBookingModal({
  booking,
  onClose,
}: AdminMarkCompleteBookingModalProps) {
  const { mutate, isPending } = useAdminCompleteBooking()

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const handleSubmit = () => {
    mutate(booking.id, {
      onSuccess: () => {
        toast.success('Booking completed. The mentee got a review link by email.')
        onClose()
      },
      onError: (err) => {
        const status = httpStatus(err)
        if (status === 400) {
          toast.error('A cancelled booking cannot be marked as completed.')
          return
        }
        if (status === 403) {
          toast.error("You don't have admin access.")
          return
        }
        if (status === 404) {
          toast.error('That booking no longer exists. Refresh the list.')
          onClose()
          return
        }
        toast.error('Failed to mark the booking as complete. Please try again.')
      },
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-3 py-6 sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mark-complete-booking-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div className="relative z-[1] flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
          <h2
            id="mark-complete-booking-title"
            className="font-headline text-lg font-extrabold tracking-tight text-slate-950 sm:text-xl"
          >
            Mark as completed?
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="space-y-3 px-4 py-4 sm:px-6">
          <p className="text-sm leading-6 text-slate-700">
            We&apos;ll email{' '}
            <span className="font-bold text-slate-900">
              {booking.mentee.full_name || booking.mentee.email}
            </span>{' '}
            a review link and bump{' '}
            <span className="font-bold text-slate-900">{booking.mentor.full_name}</span>
            &apos;s session count by 1.
          </p>
          <dl className="grid gap-2 rounded-xl bg-slate-50 p-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <dt className="shrink-0 text-xs font-bold text-slate-500 uppercase">Mentor</dt>
              <dd className="min-w-0 text-right text-sm font-bold text-slate-900">
                {booking.mentor.full_name}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="shrink-0 text-xs font-bold text-slate-500 uppercase">Mentee</dt>
              <dd className="min-w-0 text-right text-sm font-bold text-slate-900">
                {booking.mentee.email}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="shrink-0 text-xs font-bold text-slate-500 uppercase">Session</dt>
              <dd className="min-w-0 text-right text-sm font-bold text-slate-900">
                {formatDateTime(booking.session_start)}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="shrink-0 text-xs font-bold text-slate-500 uppercase">Amount</dt>
              <dd className="min-w-0 text-right text-sm font-bold text-slate-900">
                {formatNPR(Number(booking.agreed_price), { cents: true })}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 bg-white px-4 pt-3 pb-3 sm:px-6">
          <Button variant="outline" onClick={onClose} disabled={isPending} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="gap-1.5 rounded-xl bg-[#0755d8] text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" /> Completing…
              </>
            ) : (
              'Mark complete'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
