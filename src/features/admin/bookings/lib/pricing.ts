// Pricing math for the admin "record offline session" form.
//
// Mirrors the backend's derivation exactly so the live preview block matches
// what the backend will write to the database — there's no client-side
// guesswork. Four knobs:
//
//   1. `agreedPrice` — the actual amount collected from the mentee offline.
//   2. `promoPercent` — optional 0–100. When 100, `agreedPrice` must be 0.
//   3. `mentorSharePct` — chosen mentor's `mentor_share_pct`, 0–100.
//   4. `hourlyRate` — chosen mentor's `hourly_rate`. Anchor for the 100%-off
//      gross (the only place we can't back-solve from `agreedPrice=0`).
//
// Mentor's share is computed off the GROSS `original_price` (a discount never
// reduces what the mentor is owed). When the discount is bigger than the
// platform's slice, `platform_earning` goes negative (BYC eats the loss).
// This matches the normal mentee funnel.

export interface RecordSessionPricingInput {
  /** Number — admin-typed, already parsed. */
  agreedPrice: number
  /** Number 0–100. `null` when no promo was applied. */
  promoPercent: number | null
  /** Number 0–100, pulled from the chosen mentor's profile. */
  mentorSharePct: number
  /** Mentor's `hourly_rate` — anchor for the 100%-off gross. `null` when the
   *  mentor isn't loaded yet; in that case we can't anchor and return zeros. */
  hourlyRate: number | null
}

export interface RecordSessionPricing {
  agreed: number
  original: number
  discount: number
  mentorEarning: number
  platformEarning: number
}

/**
 * Round to 2 decimals to mirror the backend's `ROUND(value, 2)` quantization
 * on monetary fields. Math operations on Decimals elsewhere in the platform
 * use the same rounding, so the preview block matches the database row.
 */
function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function computeRecordSessionPricing(
  input: RecordSessionPricingInput,
): RecordSessionPricing {
  const { agreedPrice, promoPercent, mentorSharePct, hourlyRate } = input

  // 100%-off promo: backend anchors the gross on the mentor's sticker price
  // (hourly_rate; or package.price if a package is set — caller responsibility
  // for that case). Mentor still gets their share off the gross — they're never
  // penalised for a 100%-off promotion the platform decided to run. When the
  // hourlyRate hasn't loaded we collapse to zeros (caller should disable the
  // preview in that case).
  if (promoPercent !== null && promoPercent >= 100) {
    if (hourlyRate === null || hourlyRate <= 0) {
      return {
        agreed: 0,
        original: 0,
        discount: 0,
        mentorEarning: 0,
        platformEarning: 0,
      }
    }
    const mentorEarning = round2((hourlyRate * mentorSharePct) / 100)
    return {
      agreed: 0,
      original: round2(hourlyRate),
      discount: round2(hourlyRate),
      mentorEarning,
      platformEarning: round2(0 - mentorEarning),
    }
  }

  // No promo → original = agreed, no discount.
  if (promoPercent === null || promoPercent <= 0) {
    const original = agreedPrice
    const mentorEarning = round2((original * mentorSharePct) / 100)
    return {
      agreed: agreedPrice,
      original,
      discount: 0,
      mentorEarning,
      platformEarning: round2(agreedPrice - mentorEarning),
    }
  }

  // Partial promo → back-solve original from agreed: agreed = original * (1 - pct/100).
  const factor = 1 - promoPercent / 100
  const original = factor > 0 ? agreedPrice / factor : agreedPrice
  const discount = original - agreedPrice
  const mentorEarning = round2((original * mentorSharePct) / 100)
  return {
    agreed: agreedPrice,
    original: round2(original),
    discount: round2(discount),
    mentorEarning,
    platformEarning: round2(agreedPrice - mentorEarning),
  }
}

/** Format a 2-decimal NPR amount for the preview block. */
export function formatNprDecimal(n: number): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}