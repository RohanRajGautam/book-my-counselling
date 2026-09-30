// Slim speaker summary — returned on list cards where description/linkedin
// would inflate payloads. Sorted by order_index ascending.
export interface EventSpeakerSummary {
  id: string
  name: string
  title: string | null
  image_url: string | null
}

// Shape of an Event as it appears on list cards (no nested collections).
export interface EventSummaryResponse {
  id: string
  slug: string
  title: string
  description: string
  event_date: string
  event_time: string | null
  location: string | null
  partner: string | null
  cover_image_url: string | null
  youtube_link: string | null
  form_link: string | null
  // Legacy single-speaker fields — still populated by the service from
  // speakers[0] when the admin used the old create form. New code should
  // read `speakers[]` below instead.
  speaker_name: string | null
  speaker_image_url: string | null
  speaker_linkedin_url: string | null
  // Authoritative multi-speaker list. Empty when the event has no speakers.
  speakers: EventSpeakerSummary[]
  is_completed: boolean
  created_at: string
  updated_at: string
}

// Full event detail — includes nested collections and the admin that completed it.
export interface EventCompletedBySummary {
  id: string
  full_name: string | null
  email: string | null
}

export interface TimelineItemResponse {
  id: string
  time: string
  title: string
  description: string | null
  order_index: number
  created_at: string
}

export interface GalleryImageResponse {
  id: string
  image_url: string
  order_index: number
  created_at: string
}

export interface CompanyResponse {
  id: string
  name: string
  logo_url: string
  order_index: number
  created_at: string
}

export interface TestimonialResponse {
  id: string
  name: string
  content: string
  image_url: string | null
  created_at: string
}

// Full speaker detail — returned on /events/{id}, /events/by-slug/{slug},
// and the admin detail endpoint.
export interface EventSpeakerResponse {
  id: string
  name: string
  title: string | null
  description: string | null
  image_url: string | null
  linkedin_url: string | null
  order_index: number
  created_at: string
}

export interface EventResponse {
  id: string
  slug: string
  title: string
  description: string
  about: string | null
  event_date: string
  event_time: string | null
  location: string | null
  partner: string | null
  cover_image_url: string | null
  youtube_link: string | null
  form_link: string | null
  // Legacy single-speaker fields — denormalized cache of speakers[0]. Kept
  // on the wire for backwards-compatible reads; new code should ignore them
  // in favour of `speakers[]` below.
  speaker_name: string | null
  speaker_title: string | null
  speaker_description: string | null
  speaker_image_url: string | null
  speaker_linkedin_url: string | null
  // Authoritative multi-speaker list, sorted by order_index ascending.
  speakers: EventSpeakerResponse[]
  is_completed: boolean
  completed_at: string | null
  completed_by_user_id: string | null
  completed_by: EventCompletedBySummary | null
  timeline_items: TimelineItemResponse[]
  gallery_images: GalleryImageResponse[]
  companies: CompanyResponse[]
  testimonials: TestimonialResponse[]
  created_at: string
  updated_at: string
}

// ── Inputs (used on create / patch / nested writes) ─────────────────────

export interface TimelineItemInput {
  time: string
  title: string
  description?: string | null
  order_index: number
}

export interface GalleryImageInput {
  image_url: string
  order_index: number
}

export interface CompanyInput {
  name: string
  logo_url: string
  order_index: number
}

export interface TestimonialInput {
  name: string
  content: string
  image_url?: string | null
}

// Speaker create input — sent to POST /events/admin (nested) or
// POST /events/admin/{event_id}/speakers.
export interface EventSpeakerInput {
  name: string
  title?: string | null
  description?: string | null
  image_url?: string | null
  linkedin_url?: string | null
  order_index: number
}

// Speaker PATCH input — every field optional. To clear a string field,
// send null. Order_index can be set to renumber.
export type EventSpeakerUpdate = {
  name?: string
  title?: string | null
  description?: string | null
  image_url?: string | null
  linkedin_url?: string | null
  order_index?: number
}

export interface EventCreatePayload {
  slug: string
  title: string
  description: string
  event_date: string
  about?: string | null
  event_time?: string | null
  location?: string | null
  partner?: string | null
  cover_image_url?: string | null
  youtube_link?: string | null
  form_link?: string | null
  // Multi-speaker array. When supplied, replaces any speakers the admin
  // would have materialised from the legacy speaker_* fields. Omit to
  // send no speakers; send [] to explicitly create an event with none.
  speakers?: EventSpeakerInput[]
  timeline_items?: TimelineItemInput[]
  gallery_images?: GalleryImageInput[]
  companies?: CompanyInput[]
  testimonials?: TestimonialInput[]
}

// PATCH accepts every field as optional. Same shape, all optional.
export type EventUpdatePayload = {
  [K in keyof EventCreatePayload]?: EventCreatePayload[K] | null
}

// ── Bookings ─────────────────────────────────────────────────────────────

export interface EventBookingResponse {
  id: string
  event_id: string
  name: string
  email: string
  phone: string | null
  created_at: string
}

export interface EventBookingCreate {
  name: string
  email: string
  phone?: string | null
}

// ── Validation errors (422 envelope) ─────────────────────────────────────

export interface EventValidationItem {
  field: string
  message: string
  type?: string
}

// ── Folders for /upload/event-image ──────────────────────────────────────

export const EVENT_IMAGE_FOLDERS = [
  'events/speakers',
  'events/testimonials',
  'events/companies',
  'events/misc',
] as const

export type EventImageFolder = (typeof EVENT_IMAGE_FOLDERS)[number]
