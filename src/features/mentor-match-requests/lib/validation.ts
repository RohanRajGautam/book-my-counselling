// Hand-rolled field-validation for the "request a mentor I can't find" form.
// Mirrors `features/booking/lib/validation.ts` and `features/availability-requests/lib/validation.ts`.
// Server enforces the strict spec; these helpers mirror it client-side so we
// can disable submit and surface inline errors before the round-trip.

export interface ValidationError {
  field: string
  message: string
}

/** Loose RFC-5322-ish sanity check. Server enforces the strict spec. */
export function validateEmail(email: string): boolean {
  const trimmed = email.trim()
  if (!trimmed) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
}

export function validateRequesterName(name: string): boolean {
  const trimmed = name.trim()
  return trimmed.length >= 1 && trimmed.length <= 255
}

export function validateExpertise(expertise: string): boolean {
  const trimmed = expertise.trim()
  return trimmed.length >= 1 && trimmed.length <= 255
}

export function validateGoals(goals: string): boolean {
  return goals.trim().length >= 1
}

/**
 * Optional field. Empty → valid.
 * When provided, the local `<input type="datetime-local">` value (e.g.
 * `"2026-09-12T18:00"`) must parse as a real Date and be in the future,
 * mirroring the backend's `preferred_at must be in the future` rule.
 */
export function validatePreferredAt(localValue: string): boolean {
  if (!localValue.trim()) return true
  const date = new Date(localValue)
  if (Number.isNaN(date.getTime())) return false
  return date.getTime() > Date.now()
}

// ── Form-level validator ──────────────────────────────────────────────────

export type MentorMatchFormField =
  | 'requester_name'
  | 'requester_email'
  | 'preferred_expertise'
  | 'goals'
  | 'preferred_at'

export interface MentorMatchFormValues {
  requester_name: string
  requester_email: string
  preferred_expertise: string
  goals: string
  preferred_at: string
}

export function validateMentorMatchRequestForm(
  values: MentorMatchFormValues,
): ValidationError[] {
  const errors: ValidationError[] = []

  if (!validateRequesterName(values.requester_name)) {
    errors.push({ field: 'requester_name', message: 'Please enter your name.' })
  }
  if (!values.requester_email.trim()) {
    errors.push({ field: 'requester_email', message: 'Email is required.' })
  } else if (!validateEmail(values.requester_email)) {
    errors.push({
      field: 'requester_email',
      message: 'Please enter a valid email address.',
    })
  }
  if (!validateExpertise(values.preferred_expertise)) {
    errors.push({
      field: 'preferred_expertise',
      message: 'Tell us the expertise you’re looking for.',
    })
  }
  if (!validateGoals(values.goals)) {
    errors.push({
      field: 'goals',
      message: 'Share a sentence or two about what you’re hoping to get from a mentor.',
    })
  }
  if (values.preferred_at.trim()) {
    const trimmed = values.preferred_at.trim()
    const parsed = new Date(trimmed)
    if (Number.isNaN(parsed.getTime())) {
      errors.push({ field: 'preferred_at', message: 'Please pick a valid date and time.' })
    } else if (parsed.getTime() <= Date.now()) {
      errors.push({ field: 'preferred_at', message: 'Pick a time in the future.' })
    }
  }

  return errors
}

/**
 * Returns true when the form has at least the required fields filled with
 * non-empty / non-whitespace strings. Used to gate the submit button so we
 * don’t ship a request the server will reject.
 */
export function hasRequiredMentorMatchFields(values: MentorMatchFormValues): boolean {
  return (
    validateRequesterName(values.requester_name) &&
    validateEmail(values.requester_email) &&
    validateExpertise(values.preferred_expertise) &&
    validateGoals(values.goals)
  )
}
