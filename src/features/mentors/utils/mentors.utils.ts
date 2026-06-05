import { FilterState } from '@/features/filters/types/filter.types'
import { Mentor } from '../types/mentors.types'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const SHORT_ID_LENGTH = 8

export function mapSort(filters: FilterState): {
  sort_by: 'rating' | 'reviews' | 'price' | 'created_at'
  sort_order: 'asc' | 'desc'
} {
  if (filters.sortBy === 'newest') {
    return { sort_by: 'created_at', sort_order: 'desc' }
  }

  if (filters.sortBy === 'reviews') {
    return { sort_by: 'reviews', sort_order: 'desc' }
  }

  if (filters.sortBy === 'price-low') {
    return { sort_by: 'price', sort_order: 'asc' }
  }

  if (filters.sortBy === 'price-high') {
    return { sort_by: 'price', sort_order: 'desc' }
  }

  return { sort_by: 'rating', sort_order: 'desc' }
}

export function normalizeSearchMentor(mentor: Mentor): Mentor {
  return {
    ...mentor,
    hourly_rate: Number(mentor.hourly_rate),
    tags: mentor.tags ?? [],
    industries: mentor.industries ?? [],
  }
}

export function isMentorId(value: string) {
  return UUID_PATTERN.test(value)
}

export function getMentorShortId(mentorId: string) {
  return mentorId.replaceAll('-', '').slice(0, SHORT_ID_LENGTH)
}

export function slugifyMentorName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getMentorProfileSlug(mentor: Pick<Mentor, 'id' | 'full_name'>) {
  const nameSlug = slugifyMentorName(mentor.full_name) || 'mentor'

  return `${nameSlug}-${getMentorShortId(mentor.id)}`
}

export function getMentorProfileHref(mentor: Pick<Mentor, 'id' | 'full_name'>) {
  return `/explore-mentors/${getMentorProfileSlug(mentor)}`
}

export function getMentorShortIdFromSlug(slugOrId: string) {
  if (isMentorId(slugOrId)) return null

  return slugOrId.split('-').at(-1)?.toLowerCase() ?? null
}

export function getMentorNameSearchFromSlug(slugOrId: string) {
  if (isMentorId(slugOrId)) return ''

  const parts = slugOrId.split('-')
  parts.pop()

  return parts.join(' ').trim()
}
