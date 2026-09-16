'use client'

import { Calendar, Info } from 'lucide-react'

import { formatDateTime, formatShortDate } from '../../lib/format'
import type { OwedPerBookingItem } from '../types/payouts.types'

export interface AdminPayoutEligibleBookingsTableProps {
  bookings: OwedPerBookingItem[]
}

/**
 * Per-booking line items for one mentor. Sorted by `session_start`
 * ascending server-side, so this just renders in order.
 *
 * Renders the three money fields the doc calls out separately:
 * `original_price` (pre-discount), `discount_amount` (promo absorbed
 * by the platform), `mentor_earning` (what flows into the payout).
 */
export function AdminPayoutEligibleBookingsTable({
  bookings,
}: AdminPayoutEligibleBookingsTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-xl bg-slate-50 p-6 text-center">
        <p className="text-sm font-semibold text-slate-400">
          No eligible bookings in this window.
        </p>
      </div>
    )
  }

  const totalEarning = bookings.reduce((acc, b) => acc + Number(b.mentor_earning), 0)
  const totalOriginal = bookings.reduce((acc, b) => acc + Number(b.original_price), 0)
  const totalDiscount = bookings.reduce((acc, b) => acc + Number(b.discount_amount), 0)

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 rounded-xl bg-blue-50/70 p-3 text-xs font-medium text-blue-900">
        <Info className="mt-0.5 size-3.5 shrink-0 text-blue-700" />
        <span>
          Mentor earning is computed off <strong className="font-extrabold">original price</strong>.
          Promo discounts never reduce the mentor&apos;s cut — the platform absorbs them.
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[10px] font-extrabold tracking-[0.12em] text-slate-500 uppercase">
            <tr>
              <th className="px-3 py-2.5">Session</th>
              <th className="px-3 py-2.5">Mentee</th>
              <th className="px-3 py-2.5 text-right">Original</th>
              <th className="px-3 py-2.5 text-right">Discount</th>
              <th className="px-3 py-2.5 text-right">Mentor earns</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {bookings.map((b) => (
              <tr key={b.booking_id} className="align-top">
                <td className="px-3 py-2.5">
                  <p className="font-bold text-slate-900">{formatShortDate(b.session_start)}</p>
                  <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                    {formatDateTime(b.session_start)}
                  </p>
                </td>
                <td className="px-3 py-2.5 text-slate-700">{b.mentee_name}</td>
                <td className="px-3 py-2.5 text-right font-medium text-slate-700">
                  NPR {b.original_price}
                </td>
                <td className="px-3 py-2.5 text-right font-medium text-slate-500">
                  {Number(b.discount_amount) > 0 ? `- NPR ${b.discount_amount}` : 'NPR 0.00'}
                </td>
                <td className="px-3 py-2.5 text-right font-extrabold text-slate-950">
                  NPR {b.mentor_earning}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 text-xs">
            <tr>
              <td className="px-3 py-2.5 font-extrabold text-slate-700" colSpan={2}>
                Total · {bookings.length} booking{bookings.length === 1 ? '' : 's'}
              </td>
              <td className="px-3 py-2.5 text-right font-bold text-slate-700">
                NPR {totalOriginal.toFixed(2)}
              </td>
              <td className="px-3 py-2.5 text-right font-bold text-slate-700">
                NPR {totalDiscount.toFixed(2)}
              </td>
              <td className="px-3 py-2.5 text-right font-extrabold text-slate-950">
                NPR {totalEarning.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
        <Calendar className="size-3" />
        Sorted by session start (oldest first). All times are in UTC.
      </p>
    </div>
  )
}