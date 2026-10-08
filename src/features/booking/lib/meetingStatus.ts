import { fetchPaymentStatus } from '../api/paymentApi'
import { getBookingDetail } from '../api/bookingApi'
import type { PaymentStatus } from '../types/payment'

export interface MeetingPollResult {
  meetingLink: string | null
  meetingError: string | null
  /** Server-side counter (0..5). */
  meetingAttempts: number
  /** Whether the underlying transaction/booking cleared. */
  resolved: boolean
  /** Booking id, when the source endpoint surfaces it. */
  bookingId: string | null
}

/** Fetcher signature: any source that returns a meeting-state snapshot. */
export type MeetingStateFetcher = () => Promise<MeetingPollResult | null>

function toResultFromPayment(status: PaymentStatus): MeetingPollResult {
  return {
    meetingLink: status.meeting_link ?? null,
    meetingError: status.meeting_error ?? null,
    meetingAttempts: status.meeting_attempts ?? 0,
    resolved: status.status === 'success',
    bookingId: status.booking_id ?? null,
  }
}

function toResultFromBooking(detail: Awaited<ReturnType<typeof getBookingDetail>>): MeetingPollResult {
  return {
    meetingLink: detail.meeting_link,
    meetingError: detail.meeting_error,
    meetingAttempts: detail.meeting_attempts,
    resolved: detail.status === 'confirmed' || detail.status === 'completed',
    bookingId: detail.id,
  }
}

/** Fetcher for the Fonepay path: hits `/payments/status/{tx_id}`. */
export function makePaymentStatusFetcher(transactionId: string): MeetingStateFetcher {
  return async () => {
    try {
      const status = await fetchPaymentStatus(transactionId)
      return toResultFromPayment(status)
    } catch {
      return null
    }
  }
}

/** Fetcher for the 100%-off path: hits `/bookings/{id}`. */
export function makeBookingDetailFetcher(bookingId: string): MeetingStateFetcher {
  return async () => {
    try {
      const detail = await getBookingDetail(bookingId)
      return toResultFromBooking(detail)
    } catch {
      return null
    }
  }
}

/**
 * Poll a meeting-state source until either:
 *   - `meeting_link` becomes non-null (success — stop polling),
 *   - `meeting_error` is set (terminal — stop polling),
 *   - `meetingAttempts >= 5` (server gave up — stop polling),
 *   - `maxAttempts` is exhausted (give up — stop polling).
 *
 * Each attempt fires `onUpdate` so the caller can update UI state. An
 * AbortSignal halts the loop immediately without throwing.
 *
 * Per spec: 5 attempts × 2s = ~10s ceiling before falling back to the
 * "we'll email you the link" messaging.
 */
export async function pollMeetingWith(
  fetcher: MeetingStateFetcher,
  onUpdate: (result: MeetingPollResult) => void,
  maxAttempts = 5,
  intervalMs = 2000,
  signal?: AbortSignal
): Promise<void> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (signal?.aborted) return
    const result = await fetcher()
    if (!result) {
      await sleep(intervalMs, signal)
      continue
    }
    onUpdate(result)
    if (result.meetingLink) return
    if (result.meetingError) return
    if (result.meetingAttempts >= 5) return
    if (attempt < maxAttempts - 1) {
      await sleep(intervalMs, signal)
    }
  }
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve()
      return
    }
    const t = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(t)
        resolve()
      },
      { once: true }
    )
  })
}