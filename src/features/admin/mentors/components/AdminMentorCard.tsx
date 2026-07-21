'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Banknote,
  CalendarClock,
  Check,
  ChevronDown,
  Globe,
  GraduationCap,
  Link2,
  Mail,
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
}

function joinedLabel(iso: string): string {
  const d = new Date(iso)
  const month = d.toLocaleString('en-US', { month: 'short' })
  return `joined ${month} ${d.getFullYear()}`
}

export function AdminMentorCard({ mentor, tabId }: AdminMentorCardProps) {
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

  const hourlyRate = Number(mentor.hourly_rate)
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
    <article className="max-w-5xl rounded-lg border border-slate-200/80 bg-white p-4">
      {/* ── Top row: identity + actions ──────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <Avatar className="size-12 shrink-0 shadow-sm sm:size-14">
          <AvatarImage src={mentor.user.avatar_url ?? undefined} alt={mentor.user.full_name} />
          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-50 text-sm font-extrabold text-blue-700">
            {getInitials(mentor.user.full_name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-headline min-w-0 text-base font-extrabold text-slate-950 sm:text-lg">
              {mentor.user.full_name}
            </h3>
            <MentorStatusBadge mentor={mentor} />
            {mentor.is_featured ? <FeaturedBadge /> : null}
          </div>

          {(mentor.title || mentor.company) && (
            <p className="mt-0.5 truncate text-xs font-semibold text-slate-600 sm:text-sm">
              {mentor.title}
              {mentor.company ? (
                <>
                  <span className="px-1 text-slate-300">·</span>
                  <span>{mentor.company}</span>
                </>
              ) : null}
            </p>
          )}

          <a
            href={`mailto:${mentor.user.email}`}
            className="mt-1 inline-flex min-w-0 items-center gap-1 text-[11px] font-semibold text-slate-500 transition hover:text-blue-700 sm:text-xs"
            title={`Email ${mentor.user.email}`}
          >
            <Mail className="size-3 shrink-0" strokeWidth={2.4} />
            <span className="truncate">{mentor.user.email}</span>
          </a>

          <p className="mt-0.5 text-[11px] font-medium text-slate-400">
            {joinedLabel(mentor.created_at)}
          </p>
        </div>

        {/* Actions — at all widths they sit to the right of identity
            but stack vertically on sm+ and flow horizontally on mobile.
            `sm:flex-col sm:items-end` keeps them as a tight column without
            forcing a fixed cross-axis width that would squeeze identity. */}
        <div className="flex flex-wrap items-center gap-1.5 sm:flex-col sm:items-end sm:gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50"
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
              className="gap-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
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
              className="gap-1.5 rounded-xl border-red-300 bg-white text-red-700 hover:border-red-400 hover:bg-red-50 hover:text-red-800"
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
              className="gap-1.5 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50"
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
                'gap-1.5 rounded-xl',
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
        </div>
      </div>

      {/* ── KPI strip ─────────────────────────────────────────── */}
      <div className="mt-4 grid grid-cols-2 gap-1.5 sm:mt-5 sm:grid-cols-4 sm:gap-2">
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
      </div>

      {/* ── Chip cluster ─────────────────────────────────────── */}
      {hasSpecialties ? (
        <div className="mt-3 flex min-w-0 flex-wrap items-center gap-1.5 sm:mt-4">
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

      {/* ── Tags + external links ─────────────────────────────── */}
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

      {/* ── Bio (collapsible) ─────────────────────────────────── */}
      {mentor.bio ? <BioBlock bio={mentor.bio} /> : null}
    </article>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────

function KpiTile({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 rounded-lg bg-slate-50 px-2.5 py-1.5 sm:px-3 sm:py-2">
      <span className="inline-flex items-center gap-1 truncate text-[9px] font-extrabold tracking-[0.1em] text-slate-500 uppercase sm:text-[10px]">
        {icon}
        {label}
      </span>
      <span className="truncate text-[12px] font-extrabold text-slate-950 sm:text-[13px]">
        {value}
      </span>
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
        // max-w-full + truncation on long names so a single chip never
        // overflows the row when its label is unusually long.
        'inline-flex max-w-full items-center gap-1 truncate rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ring-1 ring-inset',
        tones
      )}
    >
      {Icon ? <Icon className="size-3 shrink-0" strokeWidth={2.4} /> : null}
      <span className="truncate">{label}</span>
    </span>
  )
}

function BookingModeChip({ mentor }: { mentor: AdminMentorProfile }) {
  if (mentor.booking_mode === 'instant') {
    return (
      <DataChip
        icon={Zap}
        label={mentor.requires_24h_approval ? 'Instant · 24h' : 'Instant booking'}
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
    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-amber-700 uppercase">
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
      className="inline-flex max-w-full items-center gap-1 truncate rounded-full bg-slate-50 px-2.5 py-0.5 text-[11px] font-extrabold text-slate-600 transition hover:bg-slate-100"
    >
      <Icon className="size-3 shrink-0" strokeWidth={2.4} />
      <span className="truncate">{label}</span>
    </Link>
  )
}

function BioBlock({ bio }: { bio: string }) {
  const [expanded, setExpanded] = useState(false)
  // Cheap heuristic: short bios never need a toggle — the clamp on the
  // rendered element does the real work visually.
  const showToggle = bio.length > 100

  return (
    <div className="mt-3 sm:mt-4">
      <p
        className={cn(
          'text-[12px] leading-5 break-words text-slate-600 sm:text-[13px] sm:leading-6',
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
          className="mt-1 inline-flex items-center gap-1 text-[11px] font-extrabold tracking-wide text-blue-700 uppercase hover:text-blue-800"
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
