'use client'

import { useState } from 'react'
import { Bell, BellRing, ChevronLeft, ChevronRight, Loader2, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  useMentorsWithoutAvailability,
  useSendReminder,
  useSendBulkReminder,
} from '../hooks/useAdminMentors'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function AvailabilityReminderPanel() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useMentorsWithoutAvailability({ isVerified: true, page })
  const { mutate: sendOne, isPending: sendingOne } = useSendReminder()
  const { mutate: sendAll, isPending: sendingAll } = useSendBulkReminder()

  const handleSendOne = (mentorId: string) => {
    sendOne(mentorId, {
      onSuccess: (res) => toast.success(res.message),
    })
  }

  const handleSendAll = () => {
    sendAll(
      { isVerified: true },
      {
        onSuccess: (res) => toast.success(res.message),
      }
    )
  }

  return (
    <div className="mt-6 space-y-5">
      {/* Header row */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex size-10 items-center justify-center rounded-xl bg-amber-50">
            <Bell className="size-5 text-amber-600" />
          </div>
          <div>
            <h2 className="font-headline text-base font-extrabold text-slate-950">
              Mentors Without Availability
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {data?.total ?? '—'} mentor{data?.total !== 1 ? 's ' : ' '} haven&apos;t set upcoming
              slots
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Bulk remind */}
          <Button
            size="sm"
            className="gap-1.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700"
            disabled={sendingAll || !data?.total}
            onClick={handleSendAll}
          >
            {sendingAll ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <BellRing className="size-3.5" />
            )}
            Remind all ({data?.total ?? 0})
          </Button>
        </div>
      </div>

      {/* Mentor list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : !data?.items.length ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <div className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-emerald-50">
            <Bell className="size-5 text-emerald-600" />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-600">
            All mentors have set their availability
          </p>
          <p className="mt-1 text-xs text-slate-400">No one needs a reminder right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.items.map((mentor) => (
            <article
              key={mentor.id}
              className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <Avatar className="size-12 shrink-0">
                  <AvatarImage src={mentor.user.avatar_url ?? undefined} />
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
                  disabled={sendingOne}
                  onClick={() => handleSendOne(mentor.id)}
                >
                  <Mail className="size-3.5" />
                  Send reminder
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            disabled={!data.has_prev}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm font-semibold text-slate-600">
            {data.page} / {data.total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            disabled={!data.has_next}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
