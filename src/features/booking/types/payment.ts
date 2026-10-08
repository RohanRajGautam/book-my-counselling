export interface BankInfo {
  bank_code: string
  bank_name: string
  logo_url?: string | null
  package_name?: string | null
  intent_scheme?: string | null
}

export interface QRData {
  transaction_id: string
  fonepay_transaction_id: string
  /** Base64-encoded QR image (data:image/png;base64,...) or a URL */
  qr_code_url: string
  /** QR payload string — used as fallback to render QR client-side */
  qr_message: string
  deep_link: string
  amount: number
  expires_at: string
  websocket_id: string
}

export type PaymentStep =
  | 'IDLE'
  | 'QR_DISPLAY'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'EXPIRED'

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error'

export type MeetingProvider = 'google_meet' | null

/**
 * The five meeting fields the backend now surfaces on the payment status
 * endpoint (and most booking responses). All nullable — `meeting_link` is
 * the only one mentees act on, but the other four power the polling +
 * fallback messaging + admin retry flow.
 *
 * When `MEETING_PROVIDER=disabled` server-side, every field comes back as
 * `null` — frontend must NOT render the meeting block in that case (the
 * booking-confirmed modal still shows, just without the link UI).
 */
export interface MeetingFields {
  meeting_link: string | null
  meeting_id: string | null
  meeting_provider: MeetingProvider
  meeting_error: string | null
  meeting_attempts?: number
}

export interface PaymentStatus {
  transaction_id: string
  status: 'pending' | 'success' | 'failed' | 'expired'
  fonepay_transaction_id?: string | null
  paid_at?: string | null
  amount: number
  /** Mentee-side: id of the booking this transaction settled. */
  booking_id?: string | null
  /** Auto-created Google Meet link. Only populated once creation completes. */
  meeting_link?: string | null
  meeting_id?: string | null
  meeting_provider?: MeetingProvider
  /** Populated when meeting creation failed (after exhausting retries). */
  meeting_error?: string | null
  meeting_attempts?: number
}

export interface PaymentError {
  error_code: string
  message: string
}

export interface WebSocketMessage {
  type: 'status_update' | 'error' | 'ping' | 'qr_verified' | 'payment_success'
  status?: string
  message?: string
  transaction_id?: string
  timestamp: string
}
