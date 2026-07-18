'use client'

import { useState } from 'react'
import { Bell, BellRing, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { AdminPageHeader } from '../layout/AdminPageHeader'
import {
  useMentorsWithoutAvailability,
  useSendBulkReminder,
  useSendReminder,
} from '../mentors/hooks/useAdminMentors'
import { AdminMentorPagination } from '../mentors/components/AdminMentorPagination'
import { AdminReminderCard } from './components/AdminReminderCard'

export function AdminRemindersPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useMentorsWithoutAvailability({
    isVerified: true,
    page,
  })
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
      },
    )
  }

  const mentors = data?.items ?? []
  const totalCount = data?.total ?? 0

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Availability Reminders"
          subtitle="Nudge verified mentors who haven&apos;t set upcoming availability."
          action={
            <Button
              size="sm"
              className="gap-1.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700"
              disabled={sendingAll || !totalCount}
              onClick={handleSendAll}
            >
              {sendingAll ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <BellRing className="size-3.5" />
              )}
              Remind all ({totalCount})
            </Button>
          }
        />

        <section className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-amber-50">
              <Bell className="size-5 text-amber-600" />
            </div>
            <div>
              <h2 className="font-headline text-base font-extrabold text-slate-950">
                Mentors Without Availability
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {totalCount} mentor{totalCount === 1 ? '' : 's'} haven&apos;t set
                upcoming slots.
              </p>
            </div>
          </div>
        </section>

        <section aria-label="Mentor reminder list" className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-white" />
              ))}
            </div>
          ) : mentors.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <div className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-emerald-50">
                <Bell className="size-5 text-emerald-600" />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-600">
                All verified mentors have set their availability
              </p>
              <p className="mt-1 text-xs text-slate-400">
                No one needs a reminder right now.
              </p>
            </div>
          ) : (
            mentors.map((mentor) => (
              <AdminReminderCard
                key={mentor.id}
                mentor={mentor}
                onSend={handleSendOne}
                submitting={sendingOne}
              />
            ))
          )}
        </section>

        {data ? (
          <AdminMentorPagination
            page={data.page}
            totalPages={data.total_pages}
            total={data.total}
            itemLabel="mentors"
            hasPrev={data.has_prev}
            hasNext={data.has_next}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => p + 1)}
          />
        ) : null}
      </div>
    </div>
  )
}
