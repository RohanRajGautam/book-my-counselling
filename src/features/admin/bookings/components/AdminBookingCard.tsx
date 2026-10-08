'use client'

import { useState } from 'react'
import { Copy, ExternalLink, Video, X, X as XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { AdminBookingRow } from '../../types/admin.types'
import { PAYMENT_BADGE, STATUS_BADGE } from '../lib/bookingBadges'
import { formatDateTime, formatNPR } from '../../lib/format'
import { cn } from '@/lib/utils'
import { AdminCancelBookingModal } from './AdminCancelBookingModal'

function parseAmount(raw: string): number {
  const n = parseFloat(raw)
  return Number.isFinite(n) ? n : 0
}

function PriceBreakdown({ booking }: { booking: AdminBookingRow }) {
  const original = parseAmount(booking.original_price)
  const discount = parseAmount(booking.discount_amount)
  const mentorEarning = parseAmount(booking.mentor_earning)
  const platformEarning = parseAmount(booking.platform_earning)

  return (
    <dl className="mt-3 grid gap-1 rounded-xl bg-slate-50 p-3 text-xs">
      <div className="flex items-center justify-between gap-2">
        <dt className="text-slate-500">Original price</dt>
        <dd className="font-extrabold text-slate-800">{formatNPR(original, { cents: true })}</dd>
      </div>
      {discount > 0 ? (
        <div className="flex items-center justify-between gap-2">
          <dt className="text-slate-500">
            Discount
            {booking.promo_code ? (
              <span className="ml-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-extrabold text-blue-700">
                {booking.promo_code}
              </span>
            ) : null}
          </dt>
          <dd className="font-extrabold text-emerald-700">−{formatNPR(discount, { cents: true })}</dd>
        </div>
      ) : null}
      <div className="my-1 h-px bg-slate-200" />
      <div className="flex items-center justify-between gap-2">
        <dt className="font-bold text-slate-600">Amount paid</dt>
        <dd className="font-extrabold text-slate-950">
          {formatNPR(parseAmount(booking.agreed_price), { cents: true })}
        </dd>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <dt className="text-slate-500">Mentor&apos;s cut</dt>
        <dd className="font-bold text-slate-700">{formatNPR(mentorEarning, { cents: true })}</dd>
      </div>
      <div className="flex items-center justify-between gap-2">
        <dt className="text-slate-500">Platform</dt>
        <dd className="font-bold text-slate-700">{formatNPR(platformEarning, { cents: true })}</dd>
      </div>
    </dl>
  )
}

function MeetingLinkRow({ booking }: { booking: AdminBookingRow }) {
  const missing =
    !booking.meeting_link &&
    (booking.meeting_attempts >= 5 || (booking.meeting_error?.length ?? 0) > 0)

  if (booking.meeting_link && booking.status !== 'cancelled') {
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(booking.meeting_link!)
      } catch {
        /* clipboard unavailable — silently ignore */
      }
    }
    return (
      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-blue-50 p-2 ring-1 ring-blue-100">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-[#0755d8] ring-1 ring-blue-100">
          <Video className="size-3.5" />
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex min-w-0 flex-1 items-center gap-2 truncate text-left font-mono text-xs font-semibold text-slate-800"
          title="Copy meeting link"
        >
          <span className="min-w-0 truncate">{booking.meeting_link}</span>
          <Copy className="size-3 shrink-0 text-blue-500" />
        </button>
        <a
          href={booking.meeting_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 items-center gap-1 rounded-lg bg-blue-600 px-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
        >
          Open
          <ExternalLink className="size-3" />
        </a>
      </div>
    )
  }

  if (missing) {
    return (
      <p className="mt-3 inline-flex items-start gap-1.5 rounded-lg bg-rose-50 px-2 py-1.5 text-xs font-bold text-rose-700 ring-1 ring-rose-100">
        <XIcon className="mt-0.5 size-3 shrink-0" />
        <span>
          Meeting link wasn&apos;t generated automatically. Please create one manually and email it to
          both the mentee and mentor.
        </span>
      </p>
    )
  }

  return null
}

export function AdminBookingCard({ booking }: { booking: AdminBookingRow }) {
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
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase',
                  STATUS_BADGE[booking.status],
                )}
              >
                {booking.status}
              </span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase',
                  PAYMENT_BADGE[booking.payment_status],
                )}
              >
                {booking.payment_status}
              </span>
              {booking.refund && booking.refund.status !== 'processed' ? (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold text-amber-700 uppercase">
                  Refund {booking.refund.status}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-slate-700">
              <span className="font-bold">
                {booking.mentee.full_name || '(no name)'}
              </span>{' '}
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
            <p className="mt-1 text-xs text-slate-500">{formatDateTime(booking.session_start)}</p>
            <PriceBreakdown booking={booking} />
            <MeetingLinkRow booking={booking} />
            <p className="mt-2 font-mono text-[10px] uppercase text-slate-300">
              ID {booking.id}
            </p>
            {booking.cancellation_reason ? (
              <p className="mt-2 text-xs italic text-slate-500">
                Cancelled: {booking.cancellation_reason}
              </p>
            ) : null}
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

      {cancelOpen ? (
        <AdminCancelBookingModal
          booking={booking}
          onClose={() => setCancelOpen(false)}
        />
      ) : null}
    </>
  )
}
