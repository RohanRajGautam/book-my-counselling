'use client'

import { Undo2 } from 'lucide-react'

export interface AdminPayoutClawbackBadgeProps {
  /** When the clawback stamp was applied (ISO timestamp). */
  clawedBackAt: string
}

/**
 * Per-line-item badge signalling that this booking was refunded
 * *after* the payout was marked paid. Matches the "refunded post-payout"
 * copy suggested in the payouts spec.
 */
export function AdminPayoutClawbackBadge({ clawedBackAt }: AdminPayoutClawbackBadgeProps) {
  return (
    <span
      title={`Refunded post-payout on ${new Date(clawedBackAt).toLocaleString()}`}
      className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-extrabold text-orange-700"
    >
      <Undo2 className="size-3" />
      REFUNDED POST-PAYOUT
    </span>
  )
}