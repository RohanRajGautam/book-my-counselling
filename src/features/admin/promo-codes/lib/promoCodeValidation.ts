import type { ValidationError } from '@/features/booking/lib/validation'

const PROMO_CODE_REGEX = /^BYC[A-Z0-9]{4,8}$/
const MAX_DESCRIPTION = 500

export interface PromoCodeFormValues {
  code: string
  discountPercent: string
  description: string
  validUntil: string
}

export function validatePromoCodeForm(
  form: PromoCodeFormValues,
  options: { mode: 'create' | 'edit' },
): ValidationError[] {
  const errors: ValidationError[] = []

  if (options.mode === 'create') {
    const code = form.code.trim().toUpperCase()
    if (!code) {
      errors.push({ field: 'code', message: 'Code is required.' })
    } else if (!PROMO_CODE_REGEX.test(code)) {
      errors.push({
        field: 'code',
        message:
          'Code must start with BYC and contain 4–8 letters or digits (uppercase).',
      })
    }
  }

  const percentTrim = form.discountPercent.trim()
  if (!percentTrim) {
    errors.push({ field: 'discountPercent', message: 'Discount percent is required.' })
  } else {
    const pct = Number(percentTrim)
    if (!Number.isFinite(pct) || pct <= 0 || pct > 100) {
      errors.push({
        field: 'discountPercent',
        message: 'Discount must be greater than 0 and at most 100.',
      })
    }
  }

  if (form.description.length > MAX_DESCRIPTION) {
    errors.push({
      field: 'description',
      message: `Description must be ${MAX_DESCRIPTION} characters or fewer.`,
    })
  }

  if (form.validUntil) {
    const parsed = new Date(form.validUntil)
    if (Number.isNaN(parsed.getTime())) {
      errors.push({ field: 'validUntil', message: 'Expiry must be a valid date.' })
    }
  }

  return errors
}