import {
  ALLOWED_REQUEST_DURATIONS,
  type AvailabilityRequestDuration,
} from '../types/availability-requests.types'

// Shared field-validation helpers used by the request form. Mirrors the
// hand-rolled pattern in `features/booking/lib/validation.ts`.

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

export function validateRequestMessage(message: string): boolean {
  return message.trim().length <= 2000
}

export function isAllowedDuration(duration: number): duration is AvailabilityRequestDuration {
  return (ALLOWED_REQUEST_DURATIONS as readonly number[]).includes(duration)
}

// ── Date/time helpers ─────────────────────────────────────────────────────

/**
 * Convert a `<input type="datetime-local">` value (e.g. "2026-08-01T15:00") to
 * a `Date` in the visitor's local timezone. Returns `null` if the input is empty
 * or malformed. The form then derives the timezone-aware ISO string from the
 * returned Date so the visitor's offset is preserved on the wire.
 */
export function datetimeLocalToDate(value: string): Date | null {
  if (!value) return null
  // Naive parsing — datetime-local has no offset; treat as local time.
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed
}

/**
 * True when the supplied Date is strictly in the future. Used both client-side
 * (so we don't submit garbage) and to interpret the 400 error from the backend.
 */
export function isFutureDate(date: Date, now: Date = new Date()): boolean {
  return date.getTime() > now.getTime()
}
