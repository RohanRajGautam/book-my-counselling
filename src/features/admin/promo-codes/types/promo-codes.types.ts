export interface PromoCodeResponse {
  id: string
  /** Upper-cased canonical form, e.g. "BYC1234". */
  code: string
  /** Numeric "50.00". */
  discount_percent: string
  description: string | null
  is_active: boolean
  /** ISO 8601. `null` means no expiry. */
  valid_until: string | null
  created_at: string
  updated_at: string
  /** Count of bookings that reference this code. */
  times_used: number
}

export interface PromoCodeCreate {
  /** Must match ^BYC[A-Z0-9]{4,8}\$. Stored upper-case. */
  code: string
  /** Numeric 0 < x <= 100. */
  discount_percent: string
  description?: string
  valid_until?: string | null
}

export interface PromoCodeUpdate {
  discount_percent?: string
  description?: string
  is_active?: boolean
  /** `null` clears the expiry. */
  valid_until?: string | null
}

export interface PromoCodeListParams {
  status?: 'active' | 'inactive'
  page?: number
  page_size?: number
}