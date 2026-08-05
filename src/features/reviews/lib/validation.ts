import type { ValidationError } from '@/features/booking/lib/validation'

export interface ReviewFormData {
  rating: number
  comment: string
}

// Server is the source of truth for comment length — this is a soft cap so the
// UI can warn early, but the 422 from POST is the authoritative signal.
export const REVIEW_COMMENT_MAX = 2000

// Trims and normalises a comment for submission: empty-after-trim → null.
export function normalizeReviewComment(input: string): string | null {
  const trimmed = input.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function validateReviewForm(form: ReviewFormData): ValidationError[] {
  const errors: ValidationError[] = []
  if (!Number.isInteger(form.rating) || form.rating < 1 || form.rating > 5) {
    errors.push({ field: 'rating', message: 'Please choose a rating from 1 to 5 stars.' })
  }
  if (form.comment.length > REVIEW_COMMENT_MAX) {
    errors.push({
      field: 'comment',
      message: `Comments are limited to ${REVIEW_COMMENT_MAX} characters.`,
    })
  }
  return errors
}