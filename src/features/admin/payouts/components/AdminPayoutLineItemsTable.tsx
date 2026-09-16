'use client'

import { formatDateTime, formatShortDate } from '../../lib/format'
import type { PayoutItemResponse } from '../types/payouts.types'

import { AdminPayoutClawbackBadge } from './AdminPayoutClawbackBadge'

export interface AdminPayoutLineItemsTableProps {
  items: PayoutItemResponse[]
  /** When true, render the mentor_earning column as "Earned at payout time". */
  showSnapshot?: boolean
}

export function AdminPayoutLineItemsTable({
  items,
  showSnapshot,
}: AdminPayoutLineItemsTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-slate-50 p-6 text-center">
        <p className="text-sm font-semibold text-slate-400">
          No line items on this payout.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-[10px] font-extrabold tracking-[0.12em] text-slate-500 uppercase">
          <tr>
            <th className="px-3 py-2.5">Session</th>
            <th className="px-3 py-2.5">Mentee</th>
            <th className="px-3 py-2.5 text-right">Original</th>
            <th className="px-3 py-2.5 text-right">Discount</th>
            <th className="px-3 py-2.5 text-right">
              {showSnapshot ? 'Snapshot' : 'Mentor earned'}
            </th>
            <th className="px-3 py-2.5">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {items.map((item) => (
            <tr key={item.id} className="align-top">
              <td className="px-3 py-2.5">
                <p className="font-bold text-slate-900">
                  {formatShortDate(item.session_start)}
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                  {formatDateTime(item.session_start)}
                </p>
              </td>
              <td className="px-3 py-2.5 text-slate-700">
                <p className="font-medium">{item.mentee_id.slice(0, 8)}</p>
              </td>
              <td className="px-3 py-2.5 text-right font-medium text-slate-700">
                NPR {item.original_price_snapshot}
              </td>
              <td className="px-3 py-2.5 text-right font-medium text-slate-500">
                {Number(item.discount_amount_snapshot) > 0
                  ? `- NPR ${item.discount_amount_snapshot}`
                  : 'NPR 0.00'}
              </td>
              <td className="px-3 py-2.5 text-right font-extrabold text-slate-950">
                NPR {item.mentor_earning_snapshot}
              </td>
              <td className="px-3 py-2.5">
                {item.clawed_back_at ? (
                  <AdminPayoutClawbackBadge clawedBackAt={item.clawed_back_at} />
                ) : (
                  <span className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase">
                    —
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}