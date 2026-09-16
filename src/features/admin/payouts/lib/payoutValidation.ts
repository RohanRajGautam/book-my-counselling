import type { ValidationError } from '@/features/booking/lib/validation'
import type { PayoutPaymentMethod } from '../types/payouts.types'

const PAYMENT_METHODS: readonly PayoutPaymentMethod[] = [
  'bank_transfer',
  'esewa',
  'khalti',
  'cash',
  'other',
]

export const PAYMENT_METHOD_LABEL: Record<PayoutPaymentMethod, string> = {
  bank_transfer: 'Bank transfer',
  esewa: 'eSewa',
  khalti: 'Khalti',
  cash: 'Cash',
  other: 'Other',
}

export interface MarkPaidFormValues {
  payment_method: PayoutPaymentMethod
  payment_reference: string
  notes: string
}

export const EMPTY_MARK_PAID_FORM: MarkPaidFormValues = {
  payment_method: 'bank_transfer',
  payment_reference: '',
  notes: '',
}

export function validateMarkPaidForm(form: MarkPaidFormValues): ValidationError[] {
  const errors: ValidationError[] = []
  const ref = form.payment_reference.trim()

  if (!ref) {
    errors.push({ field: 'payment_reference', message: 'Payment reference is required.' })
  } else if (ref.length > 255) {
    errors.push({
      field: 'payment_reference',
      message: 'Payment reference must be 255 characters or fewer.',
    })
  }

  if (!PAYMENT_METHODS.includes(form.payment_method)) {
    errors.push({ field: 'payment_method', message: 'Choose a payment method.' })
  }

  return errors
}

// ── Cancel form ──────────────────────────────────────────────────────────

export interface CancelFormValues {
  cancellation_reason: string
}

export const EMPTY_CANCEL_FORM: CancelFormValues = {
  cancellation_reason: '',
}

export function validateCancelForm(form: CancelFormValues): ValidationError[] {
  const errors: ValidationError[] = []
  if (!form.cancellation_reason.trim()) {
    errors.push({
      field: 'cancellation_reason',
      message: 'A cancellation reason is required.',
    })
  }
  return errors
}

// ── Window-mode date validation ──────────────────────────────────────────

export interface WindowFormValues {
  startDate: string
  endDate: string
  notes: string
}

export const EMPTY_WINDOW_FORM: WindowFormValues = {
  startDate: '',
  endDate: '',
  notes: '',
}

/**
 * Build a UTC ISO datetime for an inclusive-end calendar day.
 * `<input type="date">` returns `YYYY-MM-DD`; we splice it to ISO and
 * convert to UTC so the API's `period_end` upper bound catches
 * bookings throughout the picked day.
 */
export function utcIsoFromDateInput(value: string, edge: 'start' | 'end'): string {
  const time = edge === 'start' ? 'T00:00:00Z' : 'T23:59:59Z'
  return new Date(`${value}${time}`).toISOString()
}

export function validateWindowForm(form: WindowFormValues): ValidationError[] {
  const errors: ValidationError[] = []
  if (!form.startDate) {
    errors.push({ field: 'startDate', message: 'Start date is required.' })
  }
  if (!form.endDate) {
    errors.push({ field: 'endDate', message: 'End date is required.' })
  }
  if (form.startDate && form.endDate) {
    const start = new Date(form.startDate)
    const end = new Date(form.endDate)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      errors.push({ field: 'startDate', message: 'Invalid dates.' })
    } else if (start.getTime() > end.getTime()) {
      errors.push({
        field: 'startDate',
        message: 'Start date must be on or before end date.',
      })
    }
  }
  return errors
}