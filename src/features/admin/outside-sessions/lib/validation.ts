// Form validation for the admin "outside sessions" form.
//
// Mirrors the backend's hard limits (Pydantic) — anything outside these is
// a 422. Returns the same `{ field, message }[]` shape used by
// `features/admin/bookings/lib/recordSessionValidation.ts` so the modal can
// drop errors straight into the inline-error slots.
//
// Key differences from the bookings on-behalf validator:
// - `cost` is a single Decimal (no original_price / discount split).
// - `mentor_share` and `platform_share` can be NEGATIVE — they're saved
//   verbatim and the backend does NOT verify a balance.
// - No `goals`, `topic`, `slot_id`, `package_id`, `current_school`,
//   `guardian_phone`, `preparation_notes` — outside sessions are
//   record-keeping only.
// - `promo_code` is free text — no server validation, no client validation.

import { validateEmail } from '@/features/booking/lib/validation'

export interface OutsideSessionFormErrors {
  field: string
  message: string
}

/**
 * Raw form state for the record-outside-session modal — every field is a
 * string so the inputs can be fully controlled. Parsing/validation happens
 * before submit.
 */
export interface OutsideSessionFormData {
  menteeEmail: string
  menteeFullName: string
  /** "YYYY-MM-DD" (HTML date input value). */
  sessionDate: string
  /** "HH:MM". */
  sessionStartTime: string
  sessionEndTime: string
  /** 0–100000. */
  cost: string
  /** -100000 to 100000. CAN BE NEGATIVE. */
  mentorShare: string
  /** -100000 to 100000. CAN BE NEGATIVE. */
  platformShare: string
  /** Free text — not validated server-side. */
  promoCode: string
  /** Internal-only notes. */
  notes: string
  /** IANA tz string, e.g. "Asia/Kathmandu". */
  menteeTimezone: string
}

/** Match the backend's hard limits. Anything outside these is a 422. */
export const NAME_MIN = 2
export const NAME_MAX = 255
export const EMAIL_MIN = 3
export const EMAIL_MAX = 255
export const MONEY_MIN = 0
export const MONEY_MAX = 100000
export const SHARE_MIN = -100000
export const SHARE_MAX = 100000
export const PROMO_MAX = 50

export interface OutsideSessionValidationInput {
  form: OutsideSessionFormData
  /** Mentor id from the picker's selection — kept separate so the picker's
   *  onChange handler doesn't have to mirror it back into form state. */
  mentorId: string
}

/** Numeric range check. Pushes an error onto `out` when the raw value is
 *  missing, non-numeric, or out of `[min, max]`. */
function pushNumberError(
  out: OutsideSessionFormErrors[],
  fieldName: string,
  raw: string,
  min: number,
  max: number,
  requiredLabel: string,
): void {
  const trimmed = raw.trim()
  if (!trimmed) {
    out.push({ field: fieldName, message: `${requiredLabel} is required.` })
    return
  }
  const n = Number(trimmed)
  if (!Number.isFinite(n)) {
    out.push({ field: fieldName, message: 'Enter a number.' })
    return
  }
  if (n < min || n > max) {
    out.push({
      field: fieldName,
      message: `Must be between ${min} and ${max}.`,
    })
  }
}

export function validateOutsideSessionForm(
  input: OutsideSessionValidationInput,
): OutsideSessionFormErrors[] {
  const errors: OutsideSessionFormErrors[] = []
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
    errors.push({
      field: 'menteeFullName',
      message: `Name must be at least ${NAME_MIN} characters.`,
    })
  } else if (nameTrim.length > NAME_MAX) {
    errors.push({
      field: 'menteeFullName',
      message: `Name must be at most ${NAME_MAX} characters.`,
    })
  }

  if (!form.sessionDate) {
    errors.push({ field: 'sessionDate', message: 'Session date is required.' })
  }
  if (!form.sessionStartTime) {
    errors.push({
      field: 'sessionStartTime',
      message: 'Session start time is required.',
    })
  }
  if (!form.sessionEndTime) {
    errors.push({ field: 'sessionEndTime', message: 'Session end time is required.' })
  }

  // `session_end > session_start` — only checkable when all three are present.
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

  pushNumberError(errors, 'cost', form.cost, MONEY_MIN, MONEY_MAX, 'Cost')
  pushNumberError(
    errors,
    'mentorShare',
    form.mentorShare,
    SHARE_MIN,
    SHARE_MAX,
    'Mentor share',
  )
  pushNumberError(
    errors,
    'platformShare',
    form.platformShare,
    SHARE_MIN,
    SHARE_MAX,
    'Platform share',
  )

  if (form.promoCode.length > PROMO_MAX) {
    errors.push({
      field: 'promoCode',
      message: `Promo code must be at most ${PROMO_MAX} characters.`,
    })
  }

  return errors
}

// ─── Date helpers ──────────────────────────────────────────────────────────

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
 * 'scheduled'). Used by the preview block and the success-state copy. The
 * backend mirrors this same logic server-side, so whatever this returns is
 * exactly what the saved row will say.
 *
 * Different from `bookings/lib/recordSessionValidation.ts`'s version: that
 * one returns `'confirmed'`. Outside sessions don't pass through `confirmed`.
 */
export function derivedStatusFromSessionStart(
  sessionStartIso: string,
  now: Date = new Date(),
): 'completed' | 'scheduled' {
  const start = new Date(sessionStartIso)
  if (Number.isNaN(start.getTime())) return 'scheduled'
  return start.getTime() <= now.getTime() ? 'completed' : 'scheduled'
}