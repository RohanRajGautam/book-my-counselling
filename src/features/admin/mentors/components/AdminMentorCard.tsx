'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import {
  Banknote,
  Bell,
  Building2,
  CalendarClock,
  Check,
  ChevronDown,
  Globe,
  GraduationCap,
  Link2,
  MessageSquare,
  Pencil,
  RotateCcw,
  Sparkles,
  Star,
  Stethoscope,
  X,
  Zap,
  ZapOff,
} from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { useFeatureMentor, useRejectMentor, useVerifyMentor } from '../hooks/useAdminMentors'
import { AdminMentorProfile } from '../../types/admin.types'
import { getInitials } from '../../lib/format'
import { type AdminMentorTabId } from '../lib/filterConfig'

export interface AdminMentorCardProps {
  mentor: AdminMentorProfile
  tabId: AdminMentorTabId
  /** When set, renders a "Remind" button in the action footer that calls back with this mentor's id. */
  onSendReminder?: (mentorId: string) => void
  /** Disables the per-card Remind button while a reminder request is in flight. */
  sendingReminder?: boolean
}

function joinedLabel(iso: string): string {
  const d = new Date(iso)
  const month = d.toLocaleString('en-US', { month: 'short' })
  return `Joined ${month} ${d.getFullYear()}`
}

export function AdminMentorCard({ mentor, tabId, onSendReminder, sendingReminder }: AdminMentorCardProps) {
  const { mutate: verify, isPending: verifying } = useVerifyMentor()
  const { mutate: reject, isPending: rejecting } = useRejectMentor()
  const { mutate: feature } = useFeatureMentor()
  const isActing = verifying || rejecting

  const handleVerify = () => {
    verify(mentor.id, {
      onSuccess: () => toast.success(`${mentor.user.full_name} approved.`),
      onError: () => toast.error('Failed to approve mentor.'),
    })
  }
  const handleReject = () => {
    reject(mentor.id, {
      onSuccess: () => toast.success(`${mentor.user.full_name} rejected.`),
      onError: () => toast.error('Failed to reject mentor.'),
    })
  }
  const handleFeature = () => {
    const next = !mentor.is_featured
    feature(
      { id: mentor.id, featured: next },
      {
        onSuccess: () =>
          toast.success(`${mentor.user.full_name} ${next ? 'featured' : 'unfeatured'}.`),
        onError: () => toast.error('Failed to update featured status.'),
      }
    )
  }
  const handleRemind = () => {
    onSendReminder?.(mentor.id)
  }

  const hourlyRate = Number(mentor.hourly_rate)
  const avatarUrl = mentor.user.avatar_url ?? null
  const companyLogoUrl = mentor.company_logo_url ?? null

  const hasSpecialties =
    mentor.is_professional_counselor ||
    mentor.is_academic_counselor ||
    mentor.industries.length > 0 ||
    mentor.subcategories.length > 0
  const hasTagsOrLinks =
    mentor.tags.length > 0 ||
    !!mentor.linkedin_url ||
    !!mentor.website_url ||
    !!mentor.calendly_link

  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200/60">
      {/* ── Body: identity, KPIs, chips, bio ─────────────────── */}
      <div className="p-5 sm:p-6">
        {/* Identity */}
        <div className="flex items-start gap-4">
          <Avatar className="size-14 shrink-0 shadow-sm ring-2 ring-white sm:size-16">
            <AvatarImage src={avatarUrl ?? undefined} alt={mentor.user.full_name} />
            <AvatarFallback className="bg-blue-50 text-base font-extrabold text-blue-700 sm:text-lg">
              {getInitials(mentor.user.full_name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-headline text-base font-extrabold text-slate-950 sm:text-lg">
                {mentor.user.full_name}
              </h3>
              <MentorStatusBadge mentor={mentor} />
              {mentor.is_featured ? <FeaturedBadge /> : null}
            </div>

            {(mentor.title || mentor.company) && (
              <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-600 sm:text-sm">
                {mentor.title ? <span className="truncate">{mentor.title}</span> : null}
                {mentor.title && mentor.company ? (
                  <span className="text-slate-300" aria-hidden>
                    ·
                  </span>
                ) : null}
                {mentor.company ? (
                  <>
                    {companyLogoUrl ? (
                      <span className="flex size-4 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-slate-200 bg-white">
                        <Image
                          src={companyLogoUrl}
                          alt={mentor.company ?? 'Company logo'}
                          width={16}
                          height={16}
                          className="size-full object-contain"
                          unoptimized
                        />
                      </span>
                    ) : (
                      <Building2 className="size-3.5 shrink-0 text-slate-400" aria-hidden />
                    )}
                    <span className="truncate">{mentor.company}</span>
                  </>
                ) : null}
              </p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-slate-500 sm:text-xs">
              {mentor.years_of_experience > 0 ? (
                <>
                  <span>{mentor.years_of_experience} yrs experience</span>
                  <span className="text-slate-300" aria-hidden>
                    ·
                  </span>
                </>
              ) : null}
              <span>{joinedLabel(mentor.created_at)}</span>
            </div>
          </div>
        </div>

        {/* KPI strip */}
        <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <KpiTile
            icon={<Star className="size-3 fill-amber-500 stroke-amber-500" strokeWidth={2.4} />}
            label="Rating"
            value={mentor.total_reviews > 0 ? mentor.average_rating.toFixed(1) : '—'}
          />
          <KpiTile
            icon={<MessageSquare className="size-3" strokeWidth={2.4} />}
            label="Reviews"
            value={mentor.total_reviews.toLocaleString('en-US')}
          />
          <KpiTile
            icon={<CalendarClock className="size-3" strokeWidth={2.4} />}
            label="Sessions"
            value={mentor.total_sessions.toLocaleString('en-US')}
          />
          <KpiTile
            icon={<Banknote className="size-3" strokeWidth={2.4} />}
            label="Rate"
            value={`NPR ${hourlyRate.toLocaleString('en-US')}/hr`}
          />
        </dl>

        {/* Specialties */}
        {hasSpecialties ? (
          <div className="mt-4 flex min-w-0 flex-wrap items-center gap-1.5">
            {mentor.is_professional_counselor ? (
              <DataChip icon={Stethoscope} label="Professional" tone="blue" />
            ) : null}
            {mentor.is_academic_counselor ? (
              <DataChip icon={GraduationCap} label="Academic" tone="purple" />
            ) : null}
            <BookingModeChip mentor={mentor} />
            {mentor.is_accepting_bookings ? (
              <DataChip icon={Zap} label="Accepting" tone="emerald" />
            ) : (
              <DataChip icon={ZapOff} label="Paused" tone="slate" />
            )}
            {mentor.industries.map((i) => (
              <DataChip key={`i-${i.id}`} icon={Sparkles} label={i.name} tone="sky" />
            ))}
            {mentor.subcategories.map((s) => (
              <DataChip key={`s-${s.id}`} label={s.name} tone="amber" />
            ))}
          </div>
        ) : null}

        {/* Tags + external links */}
        {hasTagsOrLinks ? (
          <div className="mt-2 flex min-w-0 flex-wrap items-center gap-1.5">
            {mentor.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600"
              >
                #{tag.name}
              </span>
            ))}
            {mentor.linkedin_url ? (
              <ExternalChip href={mentor.linkedin_url} icon={Link2} label="LinkedIn" />
            ) : null}
            {mentor.website_url ? (
              <ExternalChip href={mentor.website_url} icon={Globe} label="Website" />
            ) : null}
            {mentor.calendly_link ? (
              <ExternalChip href={mentor.calendly_link} icon={CalendarClock} label="Calendly" />
            ) : null}
          </div>
        ) : null}

        {/* Bio */}
        {mentor.bio ? <BioBlock bio={mentor.bio} /> : null}
      </div>

      {/* ── Actions footer ────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3 sm:px-6">
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 rounded-lg border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          nativeButton={false}
          render={<Link href={`/admin/mentors/${mentor.user_id}/edit`} />}
          aria-label={`Edit ${mentor.user.full_name}`}
        >
          <Pencil className="size-3.5" strokeWidth={2.4} />
          Edit
        </Button>
        {!mentor.is_verified && !mentor.is_rejected ? (
          <Button
            size="sm"
            className="gap-1.5 rounded-lg bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
            disabled={isActing}
            onClick={handleVerify}
          >
            <Check className="size-3.5" strokeWidth={2.4} />
            Approve
          </Button>
        ) : null}
        {!mentor.is_rejected ? (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 rounded-lg border-red-300 bg-white text-red-700 hover:border-red-400 hover:bg-red-50 hover:text-red-800"
            disabled={isActing}
            onClick={handleReject}
          >
            <X className="size-3.5" strokeWidth={2.4} />
            {mentor.is_verified ? 'Revoke' : 'Reject'}
          </Button>
        ) : null}
        {tabId === 'rejected' && mentor.is_rejected ? (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 rounded-lg border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            disabled={isActing}
            onClick={handleVerify}
          >
            <RotateCcw className="size-3.5" strokeWidth={2.4} />
            Re-approve
          </Button>
        ) : null}
        {mentor.is_verified ? (
          <Button
            size="sm"
            variant="outline"
            className={cn(
              'gap-1.5 rounded-lg bg-white',
              mentor.is_featured
                ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            )}
            onClick={handleFeature}
          >
            <Star
              className={cn(
                'size-3.5',
                mentor.is_featured ? 'fill-amber-500 stroke-amber-500' : ''
              )}
              strokeWidth={2.4}
            />
            {mentor.is_featured ? 'Featured' : 'Feature'}
          </Button>
        ) : null}
        {onSendReminder ? (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 rounded-lg border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            disabled={sendingReminder}
            onClick={handleRemind}
            aria-label={`Send availability reminder to ${mentor.user.full_name}`}
          >
            <Bell className="size-3.5" strokeWidth={2.4} />
            Remind
          </Button>
        ) : null}
      </div>
    </article>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────

function KpiTile({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-lg bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200/60">
      <dt className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.12em] text-slate-500 uppercase">
        {icon}
        {label}
      </dt>
      <dd className="text-sm font-extrabold text-slate-950">{value}</dd>
    </div>
  )
}

function DataChip({
  icon: Icon,
  label,
  tone,
}: {
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  tone: 'blue' | 'emerald' | 'amber' | 'slate' | 'purple' | 'sky'
}) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-800 ring-amber-100',
    slate: 'bg-slate-100 text-slate-700 ring-slate-200',
    purple: 'bg-purple-50 text-purple-700 ring-purple-100',
    sky: 'bg-sky-50 text-sky-700 ring-sky-100',
  }[tone]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ring-1 ring-inset',
        tones
      )}
    >
      {Icon ? <Icon className="size-3 shrink-0" strokeWidth={2.4} /> : null}
      {label}
    </span>
  )
}

function BookingModeChip({ mentor }: { mentor: AdminMentorProfile }) {
  if (mentor.booking_mode === 'instant') {
    return (
      <DataChip
        icon={Zap}
        label={mentor.requires_24h_approval ? 'Instant · 24h review' : 'Instant booking'}
        tone="emerald"
      />
    )
  }
  return <DataChip icon={CalendarClock} label="Approval required" tone="amber" />
}

function MentorStatusBadge({ mentor }: { mentor: AdminMentorProfile }) {
  if (mentor.is_verified) {
    return (
      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-emerald-700 uppercase">
        Approved
      </span>
    )
  }
  if (mentor.is_rejected) {
    return (
      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-red-600 uppercase">
        Rejected
      </span>
    )
  }
  return (
    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-amber-700 uppercase">
      Pending
    </span>
  )
}

function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-amber-700 uppercase">
      <Star className="size-3 fill-amber-500 stroke-amber-500" strokeWidth={2.4} />
      Featured
    </span>
  )
}

function ExternalChip({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-0.5 text-[11px] font-extrabold text-slate-600 ring-1 ring-slate-200/60 transition hover:bg-slate-100"
    >
      <Icon className="size-3 shrink-0" strokeWidth={2.4} />
      {label}
    </Link>
  )
}

function BioBlock({ bio }: { bio: string }) {
  const [expanded, setExpanded] = useState(false)
  // Cheap heuristic: short bios never need a toggle — the clamp on the
  // rendered element does the real work visually.
  const showToggle = bio.length > 100

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      <p
        className={cn(
          'text-xs leading-5 break-words text-slate-600 sm:text-sm sm:leading-6',
          !expanded && showToggle && 'line-clamp-2'
        )}
      >
        {bio}
      </p>
      {showToggle ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-2 inline-flex items-center gap-1 text-[11px] font-extrabold tracking-wide text-blue-700 uppercase hover:text-blue-800"
        >
          {expanded ? 'See less' : 'See more'}
          <ChevronDown
            className={cn('size-3 transition-transform', expanded && 'rotate-180')}
            strokeWidth={2.6}
          />
        </button>
      ) : null}
    </div>
  )
}