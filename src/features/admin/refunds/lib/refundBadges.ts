import { RefundReason, RefundStatus } from '../../types/admin.types'

export const REFUND_STATUS_BADGE: Record<
  RefundStatus,
  { label: string; cls: string }
> = {
  requested: { label: 'PENDING', cls: 'bg-amber-100 text-amber-700' },
  approved: { label: 'APPROVED', cls: 'bg-blue-100 text-blue-700' },
  processed: { label: 'PROCESSED', cls: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'REJECTED', cls: 'bg-red-100 text-red-600' },
}

export const REFUND_REASON_LABEL: Record<RefundReason, string> = {
  mentee_cancellation: 'Mentee cancelled',
  mentor_cancellation: 'Mentor cancelled',
  admin_cancellation: 'Admin cancelled',
  slot_conflict: 'Slot conflict (auto)',
  other: 'Other',
}

export interface RefundTab {
  id: RefundStatus | 'all'
  label: string
  status: RefundStatus | undefined
  emptyMsg: string
}

export const REFUND_TABS: readonly RefundTab[] = [
  {
    id: 'requested',
    label: 'Pending',
    status: 'requested',
    emptyMsg: 'No refunds waiting for review.',
  },
  {
    id: 'approved',
    label: 'Approved',
    status: 'approved',
    emptyMsg: 'No approved refunds awaiting processing.',
  },
  {
    id: 'processed',
    label: 'Processed',
    status: 'processed',
    emptyMsg: 'No completed refunds yet.',
  },
  {
    id: 'rejected',
    label: 'Rejected',
    status: 'rejected',
    emptyMsg: 'No rejected refunds.',
  },
  {
    id: 'all',
    label: 'All',
    status: undefined,
    emptyMsg: 'No refunds yet.',
  },
] as const

export function findRefundTab(id: string): RefundTab {
  const tab = REFUND_TABS.find((t) => t.id === id)
  return tab ?? REFUND_TABS[0]!
}
