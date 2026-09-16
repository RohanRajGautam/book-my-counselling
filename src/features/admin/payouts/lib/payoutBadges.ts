import type { PayoutPaymentMethod, PayoutStatus } from '../types/payouts.types'
import { PAYMENT_METHOD_LABEL } from './payoutValidation'

export const PAYOUT_STATUS_BADGE: Record<PayoutStatus, { label: string; cls: string }> = {
  pending: { label: 'PENDING', cls: 'bg-amber-100 text-amber-700' },
  paid: { label: 'PAID', cls: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'CANCELLED', cls: 'bg-slate-100 text-slate-600' },
}

export const PAYOUT_PAYMENT_METHOD_LABEL: Record<PayoutPaymentMethod, string> =
  PAYMENT_METHOD_LABEL

export type PayoutHistoryTab = 'all' | PayoutStatus

export interface PayoutHistoryTabSpec {
  id: PayoutHistoryTab
  label: string
  status: PayoutStatus | undefined
  emptyMsg: string
}

export const PAYOUT_HISTORY_TABS: readonly PayoutHistoryTabSpec[] = [
  { id: 'all', label: 'All', status: undefined, emptyMsg: 'No payouts yet.' },
  { id: 'pending', label: 'Pending', status: 'pending', emptyMsg: 'No pending payouts.' },
  { id: 'paid', label: 'Paid', status: 'paid', emptyMsg: 'No paid payouts.' },
  { id: 'cancelled', label: 'Cancelled', status: 'cancelled', emptyMsg: 'No cancelled payouts.' },
] as const

export function findPayoutHistoryTab(id: string | null | undefined): PayoutHistoryTabSpec {
  const tab = PAYOUT_HISTORY_TABS.find((t) => t.id === id)
  return tab ?? PAYOUT_HISTORY_TABS[0]!
}

/**
 * Robustly extract a backend `detail` field. The payouts endpoint
 * returns human-readable strings on 400/422 (e.g. listing offending
 * booking UUIDs); sometimes it's an array of `ValidationError`-like
 * objects — handle both.
 */
export function extractApiErrorDetail(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null
  const detail = (err as { response?: { data?: { detail?: unknown } } }).response?.data
    ?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    const parts = detail
      .map((item) => {
        if (item && typeof item === 'object' && 'msg' in item && typeof item.msg === 'string') {
          return item.msg
        }
        return null
      })
      .filter((s): s is string => !!s)
    if (parts.length > 0) return parts.join('; ')
  }
  return null
}