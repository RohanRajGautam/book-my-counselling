// Client-side validation for event image uploads. Mirrors the backend's
// 5 MB / JPEG+PNG+WEBP caps so we surface the error before the round-trip.

import type { EventImageFolder } from '../types/events.types'

export const MAX_EVENT_IMAGE_BYTES = 5 * 1024 * 1024
export const ACCEPTED_EVENT_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp'] as const

export function validateEventImageFile(file: File | null): string | null {
  if (!file) return null
  if (!(ACCEPTED_EVENT_IMAGE_MIME as readonly string[]).includes(file.type)) {
    return 'Image must be a JPG, PNG, or WebP file.'
  }
  if (file.size > MAX_EVENT_IMAGE_BYTES) {
    return 'Image must be smaller than 5 MB.'
  }
  return null
}

/** True if `folder` is one of the four buckets the backend accepts. */
export function isEventImageFolder(value: string): value is EventImageFolder {
  return (
    value === 'events/speakers' ||
    value === 'events/testimonials' ||
    value === 'events/companies' ||
    value === 'events/misc'
  )
}
