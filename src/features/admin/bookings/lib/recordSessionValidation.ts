// Form validation for the admin "record offline session" form.
//
// Returns the same `{ field, message }[]` shape used by `booking/lib/validation.ts`
// so the modal can drop errors straight into the form's inline-error slots.

import { validateEmail } from '@/features/booking/lib/validation'

export interface RecordSessionFormErrors {
  field: string
  message: string
}

/**
 * Raw form state for the record-session modal — every field is a string so the
 * inputs can be fully controlled. Parsing/validation happens before submit.
 */
export interface RecordSessionFormData {
  menteeEmail: string
  menteeFullName: string
  // Date is "YYYY-MM-DD" (HTML date input value). Times are "HH:MM".
  sessionDate: string
  sessionStartTime: string
  sessionEndTime: string
  topic: string
  goals: string
  notes: string
  agreedPrice: string
  promoCode: string
  /** Optional — only validated when present. */
  slotId: string
  packageId: string
  currentSchool: string
  guardianPhone: string
  preparationNotes: string
  menteeTimezone: string
}

/** Match the backend's hard limits. Anything outside these is a 422. */
export const GOALS_MIN = 10
export const GOALS_MAX = 2000
export const NAME_MIN = 2
export const NAME_MAX = 255
export const EMAIL_MIN = 3
export const EMAIL_MAX = 255
export const TOPIC_MAX = 255
export const SCHOOL_MAX = 255
export const GUARDIAN_PHONE_MAX = 50
export const AGREED_PRICE_MIN = 0
export const AGREED_PRICE_MAX = 100000

export interface RecordSessionValidationInput {
  form: RecordSessionFormData
  /** Mentor id from the picker's selection — separate from the form so the
   *  picker's onChange handler doesn't have to mirror it back into form state. */
  mentorId: string
  /** True when a promo code was typed. Decides whether to validate it. */
  promoApplied: boolean
  /** True when `session_start` would resolve to the past. Used by status preview only —
   *  we don't gate the date field, the form accepts both past and future dates. */
}

export function validateRecordSessionForm(
  input: RecordSessionValidationInput,
): RecordSessionFormErrors[] {
  const errors: RecordSessionFormErrors[] = []
  const { form, mentorId } = input

  if (!mentorId) {
    errors.push({ field: 'mentorId', message: 'Pick a mentor.' })
  }

  const emailTrim = form.menteeEmail.trim()
  if (!emailTrim) {
    errors.push({ field: 'menteeEmail', message: 'Mentee email is required.' })
  } else if (emailTrim.length < EMAIL_MIN || emailTrim.length > EMAIL_MAX) {
    errors.push({
      field: 'menteeEmail',
      message: `Email must be between ${EMAIL_MIN} and ${EMAIL_MAX} characters.`,
    })
  } else if (!validateEmail(emailTrim)) {
    errors.push({ field: 'menteeEmail', message: 'Enter a valid email address.' })
  }

  const nameTrim = form.menteeFullName.trim()
  if (!nameTrim) {
    errors.push({ field: 'menteeFullName', message: 'Mentee full name is required.' })
  } else if (nameTrim.length < NAME_MIN) {
    errors.push({ field: 'menteeFullName', message: `Name must be at least ${NAME_MIN} characters.` })
  } else if (nameTrim.length > NAME_MAX) {
    errors.push({ field: 'menteeFullName', message: `Name must be at most ${NAME_MAX} characters.` })
  }

  if (!form.sessionDate) {
    errors.push({ field: 'sessionDate', message: 'Session date is required.' })
  }
  if (!form.sessionStartTime) {
    errors.push({ field: 'sessionStartTime', message: 'Session start time is required.' })
  }
  if (!form.sessionEndTime) {
    errors.push({ field: 'sessionEndTime', message: 'Session end time is required.' })
  }

  // `session_end > session_start` — only checkable when all three pieces are present.
  if (form.sessionDate && form.sessionStartTime && form.sessionEndTime) {
    const start = combineDateTime(form.sessionDate, form.sessionStartTime)
    const end = combineDateTime(form.sessionDate, form.sessionEndTime)
    if (start !== null && end !== null && end <= start) {
      errors.push({
        field: 'sessionEndTime',
        message: 'Session end must be after session start.',
      })
    }
  }

  const goalsTrim = form.goals.trim()
  if (!goalsTrim) {
    errors.push({ field: 'goals', message: 'Goals are required.' })
  } else if (goalsTrim.length < GOALS_MIN) {
    errors.push({
      field: 'goals',
      message: `Please add at least ${GOALS_MIN} characters of detail.`,
    })
  } else if (goalsTrim.length > GOALS_MAX) {
    errors.push({
      field: 'goals',
      message: `Please keep this under ${GOALS_MAX} characters.`,
    })
  }

  const priceTrim = form.agreedPrice.trim()
  if (!priceTrim) {
    errors.push({ field: 'agreedPrice', message: 'Agreed price is required.' })
  } else {
    const n = Number(priceTrim)
    if (!Number.isFinite(n)) {
      errors.push({ field: 'agreedPrice', message: 'Enter a number.' })
    } else if (n < AGREED_PRICE_MIN || n > AGREED_PRICE_MAX) {
      errors.push({
        field: 'agreedPrice',
        message: `Price must be between ${AGREED_PRICE_MIN} and ${AGREED_PRICE_MAX} NPR.`,
      })
    }
  }

  if (form.topic.length > TOPIC_MAX) {
    errors.push({
      field: 'topic',
      message: `Topic must be at most ${TOPIC_MAX} characters.`,
    })
  }
  if (form.currentSchool.length > SCHOOL_MAX) {
    errors.push({
      field: 'currentSchool',
      message: `School must be at most ${SCHOOL_MAX} characters.`,
    })
  }
  if (form.guardianPhone.length > GUARDIAN_PHONE_MAX) {
    errors.push({
      field: 'guardianPhone',
      message: `Guardian phone must be at most ${GUARDIAN_PHONE_MAX} characters.`,
    })
  }

  return errors
}

/**
 * Combine a "YYYY-MM-DD" date with an "HH:MM" time into a Date in the
 * browser's local timezone. Returns `null` when either piece is missing or
 * unparseable so callers can defer validation to the form-checker.
 */
export function combineDateTime(date: string, time: string): Date | null {
  if (!date || !time) return null
  const d = new Date(`${date}T${time}:00`)
  return Number.isNaN(d.getTime()) ? null : d
}

/** ISO 8601 datetime with timezone offset (matches Pydantic's "tz-aware" requirement). */
export function toIsoLocal(date: string, time: string): string | null {
  const combined = combineDateTime(date, time)
  return combined ? combined.toISOString() : null
}

/**
 * Derive the auto-status from `session_start` (past → 'completed', future →
 * 'confirmed'). Used by the preview block and the success-state copy. Uses
 * `Date.now()` so it's testable via stubbing if needed.
 */
export function derivedStatusFromSessionStart(
  sessionStartIso: string,
  now: Date = new Date(),
): 'completed' | 'confirmed' {
  const start = new Date(sessionStartIso)
  if (Number.isNaN(start.getTime())) return 'confirmed'
  return start.getTime() <= now.getTime() ? 'completed' : 'confirmed'
}