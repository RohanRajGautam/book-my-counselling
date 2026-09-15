// Validation for the create form, booking form, and event detail edits.
// Mirrors the backend's field caps so we surface errors inline before
// the round-trip. Each validator returns an array of field-level errors.

import { validateEmail } from '@/features/booking/lib/validation'

import type { ValidationError } from '@/features/booking/lib/validation'

export type { ValidationError }

export const EVENT_TITLE_MAX = 255
export const EVENT_DESCRIPTION_MAX = 2000
export const EVENT_ABOUT_MAX = 5000
export const EVENT_TIME_MAX = 50
export const EVENT_LOCATION_MAX = 500
export const EVENT_PARTNER_MAX = 255
export const EVENT_URL_MAX = 1000
export const EVENT_SPEAKER_NAME_MAX = 255
export const EVENT_SPEAKER_TITLE_MAX = 255
export const EVENT_SPEAKER_DESC_MAX = 2000
export const EVENT_TIMELINE_TIME_MAX = 50
export const EVENT_TIMELINE_TITLE_MAX = 255
export const EVENT_TIMELINE_DESC_MAX = 2000
export const EVENT_COMPANY_NAME_MAX = 255
export const EVENT_TESTIMONIAL_NAME_MAX = 255
export const EVENT_TESTIMONIAL_CONTENT_MAX = 5000
export const EVENT_BOOKING_NAME_MAX = 255
export const EVENT_BOOKING_PHONE_MAX = 50

function isValidUrl(value: string): boolean {
  if (!value.trim()) return true
  try {
    const u = new URL(value.trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

function pushIfBlank(
  errors: ValidationError[],
  value: string,
  field: string,
  label: string
): void {
  if (!value.trim()) {
    errors.push({ field, message: `${label} is required.` })
  }
}

function pushIfTooLong(
  errors: ValidationError[],
  value: string,
  field: string,
  label: string,
  max: number
): void {
  if (value.trim().length > max) {
    errors.push({ field, message: `${label} must be ${max} characters or fewer.` })
  }
}

// ── Create form ──────────────────────────────────────────────────────────

export interface EventFormSpeaker {
  name: string
  title: string
  description: string
  imageUrl: string
}

export interface EventFormTimelineRow {
  /** Stable key the section uses for React keys. Not part of the API payload. */
  id: string
  time: string
  title: string
  description: string
}

export interface EventFormGalleryRow {
  /** Stable key for React keys. Not part of the API payload. */
  id: string
  imageUrl: string
}

export interface EventFormCompanyRow {
  /** Stable key for React keys. Not part of the API payload. */
  id: string
  name: string
  logoUrl: string
}

export interface EventFormTestimonialRow {
  /** Stable key for React keys. Not part of the API payload. */
  id: string
  name: string
  content: string
  imageUrl: string
}

export interface EventCreateForm {
  title: string
  description: string
  about: string
  eventDate: string
  eventTime: string
  location: string
  partner: string
  coverImageUrl: string
  youtubeLink: string
  speaker: EventFormSpeaker
  timeline: EventFormTimelineRow[]
  gallery: EventFormGalleryRow[]
  companies: EventFormCompanyRow[]
  testimonials: EventFormTestimonialRow[]
}

export const EMPTY_EVENT_FORM: EventCreateForm = {
  title: '',
  description: '',
  about: '',
  eventDate: '',
  eventTime: '',
  location: '',
  partner: '',
  coverImageUrl: '',
  youtubeLink: '',
  speaker: { name: '', title: '', description: '', imageUrl: '' },
  timeline: [],
  gallery: [],
  companies: [],
  testimonials: [],
}

/**
 * Validate the full create form.
 * Returns errors in field-name form; section keys are exposed as `details`, `speaker`,
 * `timeline`, `gallery`, `companies`, `testimonials` so the wizard can attach each
 * error back to its tab.
 */
export function validateEventCreateForm(form: EventCreateForm): ValidationError[] {
  const errors: ValidationError[] = []

  const title = form.title.trim()
  pushIfBlank(errors, title, 'details.title', 'Title')
  pushIfTooLong(errors, title, 'details.title', 'Title', EVENT_TITLE_MAX)

  const description = form.description.trim()
  pushIfBlank(errors, description, 'details.description', 'Description')
  pushIfTooLong(errors, description, 'details.description', 'Description', EVENT_DESCRIPTION_MAX)

  pushIfTooLong(errors, form.about, 'details.about', 'About', EVENT_ABOUT_MAX)
  pushIfTooLong(errors, form.eventTime, 'details.eventTime', 'Event time', EVENT_TIME_MAX)
  pushIfTooLong(errors, form.location, 'details.location', 'Location', EVENT_LOCATION_MAX)
  pushIfTooLong(errors, form.partner, 'details.partner', 'Partner', EVENT_PARTNER_MAX)
  pushIfTooLong(errors, form.coverImageUrl, 'details.coverImageUrl', 'Cover image', EVENT_URL_MAX)

  const eventDate = form.eventDate.trim()
  pushIfBlank(errors, eventDate, 'details.eventDate', 'Event date')

  const youtubeLink = form.youtubeLink.trim()
  if (youtubeLink && !isValidUrl(youtubeLink)) {
    errors.push({
      field: 'details.youtubeLink',
      message: 'YouTube link must start with http:// or https://',
    })
  }

  // Speaker — all four optional, just enforce length caps.
  const speaker = form.speaker
  pushIfTooLong(errors, speaker.name, 'speaker.name', 'Speaker name', EVENT_SPEAKER_NAME_MAX)
  pushIfTooLong(errors, speaker.title, 'speaker.title', 'Speaker title', EVENT_SPEAKER_TITLE_MAX)
  pushIfTooLong(
    errors,
    speaker.description,
    'speaker.description',
    'Speaker description',
    EVENT_SPEAKER_DESC_MAX
  )
  pushIfTooLong(
    errors,
    speaker.imageUrl,
    'speaker.imageUrl',
    'Speaker image',
    EVENT_URL_MAX
  )
  // If speaker name is supplied, ask for at least one other identifying field.
  const hasAnySpeakerField =
    !!speaker.name.trim() ||
    !!speaker.title.trim() ||
    !!speaker.description.trim() ||
    !!speaker.imageUrl.trim()
  if (speaker.name.trim() && !speaker.title.trim() && !speaker.description.trim()) {
    errors.push({
      field: 'speaker.title',
      message: 'Add a speaker title or description.',
    })
  }
  // Suppress unused-warning when no speaker fields are filled (valid case).
  void hasAnySpeakerField

  // Timeline — at most length caps per row.
  form.timeline.forEach((row, idx) => {
    const time = row.time.trim()
    const t = row.title.trim()
    if (!time) {
      errors.push({ field: `timeline.${idx}.time`, message: 'Timeline time is required.' })
    } else if (time.length > EVENT_TIMELINE_TIME_MAX) {
      errors.push({
        field: `timeline.${idx}.time`,
        message: `Time must be ${EVENT_TIMELINE_TIME_MAX} characters or fewer.`,
      })
    }
    if (!t) {
      errors.push({ field: `timeline.${idx}.title`, message: 'Timeline title is required.' })
    } else if (t.length > EVENT_TIMELINE_TITLE_MAX) {
      errors.push({
        field: `timeline.${idx}.title`,
        message: `Title must be ${EVENT_TIMELINE_TITLE_MAX} characters or fewer.`,
      })
    }
    if (row.description.trim().length > EVENT_TIMELINE_DESC_MAX) {
      errors.push({
        field: `timeline.${idx}.description`,
        message: `Description must be ${EVENT_TIMELINE_DESC_MAX} characters or fewer.`,
      })
    }
  })

  // Gallery — every row needs an image_url.
  form.gallery.forEach((row, idx) => {
    if (!row.imageUrl.trim()) {
      errors.push({ field: `gallery.${idx}.imageUrl`, message: 'Image is required.' })
    } else if (row.imageUrl.length > EVENT_URL_MAX) {
      errors.push({
        field: `gallery.${idx}.imageUrl`,
        message: `Image URL must be ${EVENT_URL_MAX} characters or fewer.`,
      })
    }
  })

  // Companies — name + logo per row.
  form.companies.forEach((row, idx) => {
    const name = row.name.trim()
    if (!name) {
      errors.push({ field: `companies.${idx}.name`, message: 'Company name is required.' })
    } else if (name.length > EVENT_COMPANY_NAME_MAX) {
      errors.push({
        field: `companies.${idx}.name`,
        message: `Name must be ${EVENT_COMPANY_NAME_MAX} characters or fewer.`,
      })
    }
    if (!row.logoUrl.trim()) {
      errors.push({ field: `companies.${idx}.logoUrl`, message: 'Logo is required.' })
    } else if (row.logoUrl.length > EVENT_URL_MAX) {
      errors.push({
        field: `companies.${idx}.logoUrl`,
        message: `Logo URL must be ${EVENT_URL_MAX} characters or fewer.`,
      })
    }
  })

  // Testimonials — name + content per row.
  form.testimonials.forEach((row, idx) => {
    const name = row.name.trim()
    if (!name) {
      errors.push({ field: `testimonials.${idx}.name`, message: 'Name is required.' })
    } else if (name.length > EVENT_TESTIMONIAL_NAME_MAX) {
      errors.push({
        field: `testimonials.${idx}.name`,
        message: `Name must be ${EVENT_TESTIMONIAL_NAME_MAX} characters or fewer.`,
      })
    }
    const content = row.content.trim()
    if (!content) {
      errors.push({ field: `testimonials.${idx}.content`, message: 'Content is required.' })
    } else if (content.length > EVENT_TESTIMONIAL_CONTENT_MAX) {
      errors.push({
        field: `testimonials.${idx}.content`,
        message: `Content must be ${EVENT_TESTIMONIAL_CONTENT_MAX} characters or fewer.`,
      })
    }
    if (row.imageUrl.length > EVENT_URL_MAX) {
      errors.push({
        field: `testimonials.${idx}.imageUrl`,
        message: `Image URL must be ${EVENT_URL_MAX} characters or fewer.`,
      })
    }
  })

  return errors
}

// ── Public booking form ──────────────────────────────────────────────────

export interface EventBookingForm {
  name: string
  email: string
  phone: string
}

export const EMPTY_BOOKING_FORM: EventBookingForm = {
  name: '',
  email: '',
  phone: '',
}

export function validateEventBookingForm(form: EventBookingForm): ValidationError[] {
  const errors: ValidationError[] = []
  const name = form.name.trim()
  if (!name) {
    errors.push({ field: 'name', message: 'Name is required.' })
  } else if (name.length > EVENT_BOOKING_NAME_MAX) {
    errors.push({
      field: 'name',
      message: `Name must be ${EVENT_BOOKING_NAME_MAX} characters or fewer.`,
    })
  }
  const email = form.email.trim()
  if (!email) {
    errors.push({ field: 'email', message: 'Email is required.' })
  } else if (!validateEmail(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address.' })
  }
  const phone = form.phone.trim()
  if (phone.length > EVENT_BOOKING_PHONE_MAX) {
    errors.push({
      field: 'phone',
      message: `Phone must be ${EVENT_BOOKING_PHONE_MAX} characters or fewer.`,
    })
  }
  return errors
}

// ── Helpers shared with form components ─────────────────────────────────

export function formatFieldErrors(errors: ValidationError[]): string {
  return errors.map((e) => e.message).join(' ')
}

export function fieldHasError(errors: ValidationError[], field: string): boolean {
  return errors.some((e) => e.field === field)
}

/**
 * Extract a per-field error map keyed by dotted field path. Useful when the
 * wizard needs to attach errors back to nested rows in the timeline / gallery /
 * companies / testimonials sections.
 */
export function groupErrorsByField(errors: ValidationError[]): Record<string, string> {
  const out: Record<string, string> = {}
  for (const err of errors) {
    if (!(err.field in out)) out[err.field] = err.message
  }
  return out
}
