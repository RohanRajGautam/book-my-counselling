'use client'

import { PAYOUT_STATUS_BADGE } from '../lib/payoutBadges'
import type { PayoutStatus } from '../types/payouts.types'

export interface AdminPayoutStatusBadgeProps {
  status: PayoutStatus
  className?: string
}

/** Tiny pill rendering one of `pending` / `paid` / `cancelled`. */
export function AdminPayoutStatusBadge({ status, className }: AdminPayoutStatusBadgeProps) {
  const badge = PAYOUT_STATUS_BADGE[status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold ${badge.cls} ${className ?? ''}`}
    >
      {badge.label}
    </span>
  )
}