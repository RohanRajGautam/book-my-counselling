export interface PromoCodeValidationRequest {
  /** Up to 20 chars, case-insensitive on input. */
  code: string
  mentor_id: string
  package_id?: string
}

export interface PromoCodeValidationResponse {
  /** Upper-cased canonical form, e.g. "BYC1234". */
  code: string
  /** Numeric string, e.g. "50.00". */
  discount_percent: string
  /** Gross price the mentee would have paid without the promo. */
  original_amount: string
  /** How much the promo took off. */
  discount_amount: string
  /** Net price the mentee will pay. */
  final_amount: string
}