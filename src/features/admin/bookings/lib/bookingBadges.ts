import {
  AdminBookingStatus,
  AdminPaymentStatus,
} from '../../types/admin.types'

export const STATUS_BADGE: Record<AdminBookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-600',
}

export const PAYMENT_BADGE: Record<AdminPaymentStatus, string> = {
  unpaid: 'bg-slate-100 text-slate-600',
  paid: 'bg-emerald-50 text-emerald-700',
  refunded: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-600',
}

export interface BookingFilterOption<V> {
  value: V
  label: string
}

export const BOOKING_STATUS_OPTIONS: BookingFilterOption<
  AdminBookingStatus | 'all'
>[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export const BOOKING_PAYMENT_OPTIONS: BookingFilterOption<
  AdminPaymentStatus | 'all'
>[] = [
  { value: 'all', label: 'All payments' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'paid', label: 'Paid' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'failed', label: 'Failed' },
]
