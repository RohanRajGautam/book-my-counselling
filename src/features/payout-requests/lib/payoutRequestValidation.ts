// Hand-rolled validation for the payout-request form. Returns
// `ValidationError[]` so the caller can map by field, mirroring the
// booking-form convention.

export interface ValidationError {
  field: string
  message: string
}

export interface PayoutRequestFormValues {
  mentor_message: string
}

export const EMPTY_PAYOUT_REQUEST_FORM: PayoutRequestFormValues = {
  mentor_message: '',
}

const MAX_MENTOR_MESSAGE = 1000

export function validatePayoutRequestForm(form: PayoutRequestFormValues): ValidationError[] {
  const errors: ValidationError[] = []
  const msg = form.mentor_message.trim()
  if (msg.length > MAX_MENTOR_MESSAGE) {
    errors.push({
      field: 'mentor_message',
      message: `Note must be ${MAX_MENTOR_MESSAGE} characters or fewer.`,
    })
  }
  return errors
}
