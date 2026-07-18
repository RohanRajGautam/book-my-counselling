'use client'

import {
  Check,
  RotateCcw,
  Star,
  X,
} from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  useFeatureMentor,
  useRejectMentor,
  useVerifyMentor,
} from '../hooks/useAdminMentors'
import { AdminMentorProfile } from '../../types/admin.types'
import { getInitials } from '../../lib/format'
import { type AdminMentorTabId } from '../lib/filterConfig'

export interface AdminMentorCardProps {
  mentor: AdminMentorProfile
  tabId: AdminMentorTabId
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
          toast.success(
            `${mentor.user.full_name} ${next ? 'featured' : 'unfeatured'}.`,
          ),
        onError: () => toast.error('Failed to update featured status.'),
      },
    )
  }

  return (
    <article className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center">
      {/* Identity */}
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <Avatar className="size-12 shrink-0">
          <AvatarImage src={mentor.user.avatar_url ?? undefined} alt={mentor.user.full_name} />
          <AvatarFallback className="bg-blue-100 font-bold text-blue-700">
            {getInitials(mentor.user.full_name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-headline text-base font-extrabold text-slate-950">
              {mentor.user.full_name}
            </p>
            <MentorStatusBadge mentor={mentor} />
            {mentor.is_featured ? <FeaturedBadge /> : null}
          </div>
          <p className="mt-0.5 truncate text-sm text-slate-500">
            {mentor.title}
            {mentor.company ? ` · ${mentor.company}` : ''}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            NPR {mentor.hourly_rate}/hr · {mentor.years_of_experience} yrs ·{' '}
            {mentor.is_professional_counselor && 'Professional'}
            {mentor.is_professional_counselor && mentor.is_academic_counselor && ' & '}
            {mentor.is_academic_counselor && 'Academic'}
          </p>
          {mentor.bio ? (
            <p className="mt-1 line-clamp-1 text-xs text-slate-400">{mentor.bio}</p>
          ) : null}
          {mentor.tags.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {mentor.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 flex-wrap gap-2">
        {!mentor.is_verified ? (
          <Button
            size="sm"
            className="gap-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
            disabled={isActing}
            onClick={handleVerify}
          >
            <Check className="size-3.5" />
            Approve
          </Button>
        ) : null}

        {!mentor.is_rejected ? (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
            disabled={isActing}
            onClick={handleReject}
          >
            <X className="size-3.5" />
            {mentor.is_verified ? 'Revoke' : 'Reject'}
          </Button>
        ) : null}

        {tabId === 'rejected' && mentor.is_rejected ? (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
            disabled={isActing}
            onClick={handleVerify}
          >
            <RotateCcw className="size-3.5" />
            Re-approve
          </Button>
        ) : null}

        {mentor.is_verified ? (
          <Button
            size="sm"
            variant="outline"
            className={`gap-1.5 rounded-xl ${
              mentor.is_featured
                ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            onClick={handleFeature}
          >
            <Star className="size-3.5" />
            {mentor.is_featured ? 'Unfeature' : 'Feature'}
          </Button>
        ) : null}
      </div>
    </article>
  )
}

function MentorStatusBadge({ mentor }: { mentor: AdminMentorProfile }) {
  if (mentor.is_verified) {
    return (
      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
        APPROVED
      </span>
    )
  }
  if (mentor.is_rejected) {
    return (
      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-extrabold text-red-600">
        REJECTED
      </span>
    )
  }
  return (
    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-700">
      PENDING
    </span>
  )
}

function FeaturedBadge() {
  return (
    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-700">
      FEATURED
    </span>
  )
}
