import type { PayoutRequestStatus } from '../types/payout-requests.types'

/** Tailwind class set for each status badge — open is amber/pending, ack is blue/done. */
export const PAYOUT_REQUEST_STATUS_BADGE: Record<PayoutRequestStatus, string> = {
  open: 'bg-amber-100 text-amber-700 ring-amber-200',
  acknowledged: 'bg-blue-100 text-blue-700 ring-blue-200',
}

/** Human-readable label for each status. */
export const PAYOUT_REQUEST_STATUS_LABEL: Record<PayoutRequestStatus, string> = {
  open: 'Open',
  acknowledged: 'Acknowledged',
}

export interface PayoutRequestFilterOption<V> {
  value: V
  label: string
}

export type PayoutRequestStatusFilter = PayoutRequestStatus | 'all'

export const PAYOUT_REQUEST_STATUS_OPTIONS: PayoutRequestFilterOption<PayoutRequestStatusFilter>[] =
  [
    { value: 'all', label: 'All statuses' },
    { value: 'open', label: 'Open' },
    { value: 'acknowledged', label: 'Acknowledged' },
  ]
