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
  qr_code_url: string
  deep_link: string
  qr_message: string
  amount: number
  expires_at: string
  websocket_id: string
}

export type PaymentStep =
  | 'IDLE'
  | 'BANK_SELECTION'
  | 'QR_DISPLAY'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'EXPIRED'

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error'

export interface PaymentStatus {
  transaction_id: string
  status: 'pending' | 'success' | 'failed' | 'expired'
  fonepay_transaction_id?: string | null
  paid_at?: string | null
  amount: number
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
