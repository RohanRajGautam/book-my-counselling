'use client'

import { Mail } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { AdminMentorProfile } from '../../types/admin.types'
import { getInitials } from '../../lib/format'

export interface AdminReminderCardProps {
  mentor: AdminMentorProfile
  onSend: (mentorId: string) => void
  submitting: boolean
}

export function AdminReminderCard({ mentor, onSend, submitting }: AdminReminderCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Avatar className="size-12 shrink-0">
          <AvatarImage src={mentor.user.avatar_url ?? undefined} alt={mentor.user.full_name} />
          <AvatarFallback className="bg-blue-100 font-bold text-blue-700">
            {getInitials(mentor.user.full_name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-headline text-base font-extrabold text-slate-950">
              {mentor.user.full_name}
            </p>
            {mentor.is_verified ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                VERIFIED
              </span>
            ) : (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-700">
                UNVERIFIED
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-sm text-slate-500">
            {mentor.title}
            {mentor.company ? ` · ${mentor.company}` : ''}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            NPR {mentor.hourly_rate}/hr · {mentor.years_of_experience} yrs
          </p>
        </div>
      </div>

      <div className="shrink-0">
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 rounded-xl border-amber-200 text-amber-700 hover:bg-amber-50"
          disabled={submitting}
          onClick={() => onSend(mentor.id)}
        >
          <Mail className="size-3.5" />
          Send reminder
        </Button>
      </div>
    </article>
  )
}
