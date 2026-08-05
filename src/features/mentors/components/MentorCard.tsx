'use client'

import Image from 'next/image'
import { Building2, Check, Clock } from 'lucide-react'

import {
  COACH_FOR_FRESHERS_GROUP_TAG,
  COACH_FOR_FRESHERS_SERVICE_SLUGS,
  COACH_FOR_FRESHERS_SERVICE_TAGS,
  COACH_FOR_FRESHERS_TAG_LABELS,
} from '@/features/coach-for-freshers/types/coach-for-freshers.types'
import { displayTagName } from '@/features/mentors/utils/mentors.utils'

const COACH_FOR_FRESHERS_GROUP_LABEL = COACH_FOR_FRESHERS_TAG_LABELS[COACH_FOR_FRESHERS_GROUP_TAG]

// Mentor tags can arrive as raw slugs (e.g. "career-clarity-roadmap") or as the
// pre-resolved labels some callers pass through. The membership sets below
// include both forms so the context-based filter matches whichever the caller
// sent — without forcing every caller to normalize.
const CFF_SERVICE_VALUES = new Set<string>([
  ...COACH_FOR_FRESHERS_SERVICE_SLUGS,
  ...COACH_FOR_FRESHERS_SERVICE_TAGS.map((s) => s.label),
])

const CFF_GROUP_VALUES = new Set<string>(
  [COACH_FOR_FRESHERS_GROUP_TAG, COACH_FOR_FRESHERS_GROUP_LABEL].filter(
    (v): v is string => typeof v === 'string'
  )
)

interface PackageTier {
  duration_minutes: number
  price: number
}

interface MentorCardProps {
  name: string
  role: string
  company: string
  tags: string[]
  description?: string
  totalSessions?: number
  price: number
  packageTiers?: PackageTier[]
  imageUrl?: string | null
  /**
   * When set, takes precedence over `imageUrl` and is rendered in the avatar
   * slot. Use this to surface a mentor's company logo on listings and cards.
   */
  companyLogoUrl?: string | null
  verified?: boolean
  onClick?: () => void
  /**
   * Where the card is being shown. The card filters its tag list to match the
   * surrounding page so the CFF service tags only render in the Coach for
   * Freshers flow and never leak into the academic or home pages.
   * - `'coach-for-freshers'`: show only the CFF group + CFF service tags
   * - `'academic'`: hide the CFF group + CFF service tags
   * - omitted: hide only the CFF group tag (default — home page, etc.)
   */
  context?: 'academic' | 'coach-for-freshers'
}

export function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return initials || 'M'
}

function formatDisplayName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\b\p{L}/gu, (letter) => letter.toUpperCase())
}

function cleanCompanyName(company: string): string | null {
  const trimmed = company.trim()
  if (!trimmed) return null
  return trimmed
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/$/, '')
}

export function MentorCard({
  name,
  role,
  company,
  tags,
  totalSessions,
  price,
  packageTiers,
  imageUrl,
  companyLogoUrl,
  verified = true,
  onClick,
  context,
}: MentorCardProps) {
  // Avatar slot always shows the user's avatar — the company logo is
  // surfaced as a small badge next to the company name below.
  const imageSrc = imageUrl?.trim() || null
  const hasCompanyLogo = Boolean(companyLogoUrl?.trim())
  const displayName = formatDisplayName(name)
  const initials = getInitials(name)
  const companyDisplay = cleanCompanyName(company)
  const cleanedTags = tags.map((tag) => tag.replace(/^#/, ''))

  const filteredTags = (() => {
    if (context === 'coach-for-freshers') {
      return cleanedTags.filter((tag) => CFF_GROUP_VALUES.has(tag) || CFF_SERVICE_VALUES.has(tag))
    }
    if (context === 'academic') {
      return cleanedTags.filter((tag) => !CFF_GROUP_VALUES.has(tag) && !CFF_SERVICE_VALUES.has(tag))
    }
    return cleanedTags.filter((tag) => !CFF_GROUP_VALUES.has(tag))
  })()

  const services = filteredTags
    .map((tag) => COACH_FOR_FRESHERS_TAG_LABELS[tag] ?? tag)
    .slice(0, 4)
    .map(displayTagName)

  // Show the 3 standard tiers if available, otherwise fall back to "Starting at"
  const hasTiers = packageTiers && packageTiers.length > 0
  const sortedTiers = hasTiers
    ? [...packageTiers].sort((a, b) => a.duration_minutes - b.duration_minutes).slice(0, 3)
    : null

  return (
    <article
      className="group flex h-full cursor-pointer flex-col rounded-2xl bg-white p-5 shadow-[0_16px_40px_rgba(18,28,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_46px_rgba(18,28,42,0.08)]"
      onClick={onClick}
    >
      <div className="mb-4 flex h-[80px] items-center gap-4">
        <div className="relative shrink-0">
          <div className="size-[78px] rounded-full border-[3px] border-[var(--color-surface-tint)] bg-white p-1 shadow-[0_0_0_6px_#f3f7ff]">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={`${displayName} profile`}
                width={78}
                height={78}
                className="size-full rounded-full object-cover"
              />
            ) : (
              <div
                aria-label={`${displayName} profile initials`}
                className="flex size-full items-center justify-center rounded-full bg-[var(--brand-blue-soft)] text-xl font-extrabold text-[var(--brand-blue)]"
              >
                {initials}
              </div>
            )}
          </div>
          {verified && (
            <div className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full border-2 border-white bg-[var(--color-secondary)]">
              <Check className="size-4 text-white" strokeWidth={4} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-[family-name:var(--font-headline)] text-lg leading-6 font-extrabold tracking-tight text-[var(--foreground)] transition group-hover:text-[var(--brand-blue)]">
            {displayName}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-5 font-medium text-[var(--color-on-surface-variant)]">
            {role}
          </p>
        </div>
      </div>

      {companyDisplay && (
        <div className="mb-4 flex h-[28px] items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[var(--color-surface-container-high)] bg-white">
            {hasCompanyLogo ? (
              <Image
                src={companyLogoUrl as string}
                alt={companyDisplay}
                width={28}
                height={28}
                className="size-full object-contain"
                unoptimized
              />
            ) : (
              <Building2 className="size-4 text-[var(--color-outline)]" aria-hidden />
            )}
          </div>
          <span className="line-clamp-1 text-sm font-bold text-[var(--color-on-surface-variant)]">
            {companyDisplay}
          </span>
        </div>
      )}

      <div className="mb-4">
        <p className="mb-2 text-[11px] font-extrabold tracking-wider text-[var(--color-outline)] uppercase">
          Services offered
        </p>
        <div className="flex min-h-[30px] flex-wrap gap-2">
          {services.length > 0 ? (
            <>
              {services.slice(0, 3).map((service) => (
                <span
                  key={service}
                  className="max-w-full truncate rounded-full bg-[var(--brand-blue-soft)] px-3 py-1.5 text-xs font-extrabold text-[var(--brand-blue)]"
                >
                  {service}
                </span>
              ))}

              {services.length > 3 && (
                <span className="rounded-full bg-[var(--brand-blue-soft)] px-3 py-1.5 text-xs font-extrabold text-[var(--brand-blue)]">
                  +{services.length - 3} more
                </span>
              )}
            </>
          ) : (
            <span className="rounded-full bg-[var(--brand-blue-soft)] px-3 py-1.5 text-xs font-extrabold text-[var(--brand-blue)]">
              Mentorship
            </span>
          )}
        </div>
      </div>

      <div className="flex-1" />

      <div className="mb-4 flex h-[24px] items-center gap-2">
        <span
          className={`text-sm font-medium text-[var(--color-outline)] ${
            typeof totalSessions === 'number' ? '' : 'invisible'
          }`}
        >
          {typeof totalSessions === 'number' ? `${totalSessions} total sessions` : '0 total sessions'}
        </span>
      </div>

      <div className="border-t border-[var(--color-surface-container-high)] pt-4">
        <div className="min-h-[88px]">
          {sortedTiers ? (
            <>
              <p className="mb-2 text-[11px] font-extrabold tracking-wider text-[var(--color-outline)] uppercase">
                Session packages
              </p>
              <div className="mb-4 flex gap-2">
                {sortedTiers.map((tier, index) => (
                  <div
                    key={`${tier.duration_minutes}-${tier.price}-${index}`}
                    className="flex flex-1 flex-col rounded-xl bg-[var(--brand-blue-surface)] px-2 py-2.5"
                  >
                    <span className="flex items-center gap-1 text-[10px] font-extrabold text-[var(--color-outline)]">
                      <Clock className="size-3" />
                      {tier.duration_minutes}m
                    </span>
                    <span className="mt-1 font-[family-name:var(--font-headline)] text-xs font-extrabold text-[var(--foreground)]">
                      NPR {Math.round(tier.price).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mb-4">
              <p className="text-xs font-extrabold tracking-widest text-[var(--color-outline)] uppercase">
                Starting at
              </p>
              <p className="font-[family-name:var(--font-headline)] text-xl font-extrabold text-[var(--foreground)]">
                NPR {Math.round(price).toLocaleString()}
              </p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onClick?.()
          }}
          className="h-11 w-full shrink-0 rounded-xl bg-[var(--brand-blue)] px-5 text-sm font-extrabold text-white shadow-[0_10px_20px_rgba(0,83,219,0.22)] transition hover:bg-[var(--brand-blue-hover)]"
        >
          Book Session
        </button>
      </div>
    </article>
  )
}
