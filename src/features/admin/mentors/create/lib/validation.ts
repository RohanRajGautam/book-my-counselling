import { validateEmail } from '@/features/booking/lib/validation'

import type { ValidationError } from '@/features/booking/lib/validation'

export type CreateMentorForm = {
  email: string
  fullName: string
  avatarFile: File | null
  companyLogoFile: File | null
  title: string
  company: string
  yearsOfExperience: string
  hourlyRate: string
  bio: string
  linkedinUrl: string
  websiteUrl: string
  calendlyLink: string
  isProfessionalCounselor: boolean
  isAcademicCounselor: boolean
  subcategoryIds: string[]
  professionalCategories: { category_id: string; subcategory_ids: string[] }[]
  coachingServices: string[]
  academicTags: string[]
  industryIds: string[]
}

export type { ValidationError }

function isValidUrl(value: string): boolean {
  if (!value.trim()) return true
  try {
    const u = new URL(value.trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export const MAX_AVATAR_BYTES = 5 * 1024 * 1024
export const ACCEPTED_AVATAR_MIME = ['image/jpeg', 'image/png', 'image/webp'] as const

export function validateAvatarFile(file: File | null): string | null {
  if (!file) return null
  if (!(ACCEPTED_AVATAR_MIME as readonly string[]).includes(file.type)) {
    return 'Avatar must be a JPG, PNG, or WebP image.'
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return 'Avatar must be smaller than 5 MB.'
  }
  return null
}

export function validateLogoFile(file: File | null): string | null {
  if (!file) return null
  if (!(ACCEPTED_AVATAR_MIME as readonly string[]).includes(file.type)) {
    return 'Logo must be a JPG, PNG, or WebP image.'
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return 'Logo must be smaller than 5 MB.'
  }
  return null
}

export function validateCreateMentorForm(form: CreateMentorForm): ValidationError[] {
  const errors: ValidationError[] = []

  const email = form.email.trim()
  if (!email) {
    errors.push({ field: 'email', message: 'Email is required.' })
  } else if (!validateEmail(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address.' })
  }

  const fullName = form.fullName.trim()
  if (!fullName) {
    errors.push({ field: 'fullName', message: 'Full name is required.' })
  } else if (fullName.length < 2) {
    errors.push({ field: 'fullName', message: 'Name must be at least 2 characters.' })
  }

  const avatarError = validateAvatarFile(form.avatarFile)
  if (avatarError) errors.push({ field: 'avatar', message: avatarError })

  const logoError = validateLogoFile(form.companyLogoFile)
  if (logoError) errors.push({ field: 'companyLogo', message: logoError })

  const title = form.title.trim()
  if (!title) {
    errors.push({ field: 'title', message: 'Professional title is required.' })
  }

  const yearsTrim = form.yearsOfExperience.trim()
  if (yearsTrim) {
    const yearsNum = Number(yearsTrim)
    if (!Number.isFinite(yearsNum) || yearsNum < 0 || !Number.isInteger(yearsNum)) {
      errors.push({
        field: 'yearsOfExperience',
        message: 'Years of experience must be a non-negative whole number.',
      })
    }
  }

  const rateTrim = form.hourlyRate.trim()
  if (!rateTrim) {
    errors.push({ field: 'hourlyRate', message: 'Hourly rate is required.' })
  } else {
    const rate = Number(rateTrim)
    if (!Number.isFinite(rate) || rate <= 0) {
      errors.push({ field: 'hourlyRate', message: 'Hourly rate must be a positive number.' })
    }
  }

  if (!form.isAcademicCounselor && !form.isProfessionalCounselor) {
    errors.push({
      field: 'counsellingType',
      message: 'Choose at least one counselling type (Academic or Professional).',
    })
  }
  if (form.isAcademicCounselor && form.subcategoryIds.length === 0) {
    errors.push({
      field: 'subcategoryIds',
      message: 'Pick at least one academic field.',
    })
  }
  if (form.isProfessionalCounselor && form.coachingServices.length === 0) {
    errors.push({
      field: 'coachingServices',
      message: 'Pick at least one professional service.',
    })
  }

  if (!isValidUrl(form.linkedinUrl)) {
    errors.push({
      field: 'linkedinUrl',
      message: 'LinkedIn URL must start with http:// or https://',
    })
  }
  if (!isValidUrl(form.websiteUrl)) {
    errors.push({ field: 'websiteUrl', message: 'Website URL must start with http:// or https://' })
  }
  if (!isValidUrl(form.calendlyLink)) {
    errors.push({
      field: 'calendlyLink',
      message: 'Calendly URL must start with http:// or https://',
    })
  }

  return errors
}

/** Maximum hourly rate allowed by the admin profile endpoint. */
export const MAX_HOURLY_RATE = 10000
/** Maximum years of experience accepted by the admin profile endpoint. */
export const MAX_YEARS_OF_EXPERIENCE = 60

export type UpdateMentorForm = {
  fullName: string
  title: string
  company: string
  yearsOfExperience: string
  hourlyRate: string
  mentorSharePct: string
  bio: string
  linkedinUrl: string
  websiteUrl: string
  calendlyLink: string
  isProfessionalCounselor: boolean
  isAcademicCounselor: boolean
  subcategoryIds: string[]
  professionalCategories: { category_id: string; subcategory_ids: string[] }[]
  coachingServices: string[]
  academicTags: string[]
  industryIds: string[]
}

/**
 * Edit-flow validation. Email, role, status, avatar, and booking preferences
 * are intentionally not checked here — they're either immutable here or owned
 * by dedicated endpoints.
 */
export function validateUpdateMentorForm(form: UpdateMentorForm): ValidationError[] {
  const errors: ValidationError[] = []

  const fullName = form.fullName.trim()
  if (!fullName) {
    errors.push({ field: 'fullName', message: 'Full name is required.' })
  } else if (fullName.length < 2) {
    errors.push({ field: 'fullName', message: 'Name must be at least 2 characters.' })
  }

  const title = form.title.trim()
  if (!title) {
    errors.push({ field: 'title', message: 'Professional title is required.' })
  } else if (title.length > 120) {
    errors.push({ field: 'title', message: 'Title must be 120 characters or fewer.' })
  }

  const yearsTrim = form.yearsOfExperience.trim()
  if (yearsTrim) {
    const yearsNum = Number(yearsTrim)
    if (
      !Number.isFinite(yearsNum) ||
      yearsNum < 0 ||
      !Number.isInteger(yearsNum) ||
      yearsNum > MAX_YEARS_OF_EXPERIENCE
    ) {
      errors.push({
        field: 'yearsOfExperience',
        message: `Years must be a whole number between 0 and ${MAX_YEARS_OF_EXPERIENCE}.`,
      })
    }
  }

  const rateTrim = form.hourlyRate.trim()
  if (!rateTrim) {
    errors.push({ field: 'hourlyRate', message: 'Hourly rate is required.' })
  } else {
    const rate = Number(rateTrim)
    if (!Number.isFinite(rate) || rate <= 0 || rate > MAX_HOURLY_RATE) {
      errors.push({
        field: 'hourlyRate',
        message: `Hourly rate must be between 0 and ${MAX_HOURLY_RATE} NPR.`,
      })
    }
  }

  const shareTrim = form.mentorSharePct.trim()
  if (!shareTrim) {
    errors.push({ field: 'mentorSharePct', message: 'Mentor share is required.' })
  } else {
    const share = Number(shareTrim)
    if (!Number.isFinite(share) || share < 0 || share > 100) {
      errors.push({
        field: 'mentorSharePct',
        message: 'Mentor share must be between 0 and 100.',
      })
    }
  }

  if (!form.isAcademicCounselor && !form.isProfessionalCounselor) {
    errors.push({
      field: 'counsellingType',
      message: 'Choose at least one counselling type (Academic or Professional).',
    })
  }
  if (form.isAcademicCounselor && form.subcategoryIds.length === 0) {
    errors.push({ field: 'subcategoryIds', message: 'Pick at least one academic field.' })
  }
  if (form.isProfessionalCounselor && form.coachingServices.length === 0) {
    errors.push({ field: 'coachingServices', message: 'Pick at least one professional service.' })
  }

  if (!isValidUrl(form.linkedinUrl)) {
    errors.push({
      field: 'linkedinUrl',
      message: 'LinkedIn URL must start with http:// or https://',
    })
  }
  if (!isValidUrl(form.websiteUrl)) {
    errors.push({
      field: 'websiteUrl',
      message: 'Website URL must start with http:// or https://',
    })
  }
  if (!isValidUrl(form.calendlyLink)) {
    errors.push({
      field: 'calendlyLink',
      message: 'Calendly URL must start with http:// or https://',
    })
  }

  return errors
}

export function formatFieldErrors(errors: ValidationError[]): string {
  return errors.map((e) => e.message).join(' ')
}

export function fieldHasError(errors: ValidationError[], field: string): boolean {
  return errors.some((e) => e.field === field)
}
