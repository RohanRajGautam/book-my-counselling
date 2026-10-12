'use client'

import Link from 'next/link'
import { AlertTriangle, ArrowLeft, Pencil } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { AdminPageHeader } from '@/features/admin/layout/AdminPageHeader'
import { useMentorProfileFromAdminListCache } from '@/features/admin/mentors/hooks/useAdminMentors'
import { AdminAvailabilityManager } from '@/features/availability/components/AdminAvailabilityManager'

export interface AdminAvailabilityPageProps {
  /** The `MentorProfile.id` (NOT the user id). */
  mentorId: string
}

/**
 * Admin "Manage mentor availability" page. Mirrors the mentor's own
 * profile-settings availability card so the UX feels identical: same form
 * chrome, same slot-row visual, same empty + skeleton states. The admin-only
 * additions are bulk-select + bulk-delete on the slot list and a
 * "Skipped rows" panel that surfaces conflicts from the bulk-create call.
 */
export function AdminAvailabilityPage({ mentorId }: AdminAvailabilityPageProps) {
  const mentor = useMentorProfileFromAdminListCache(mentorId)

  // Direct-URL access without a prior mentor list visit lands us without
  // mentor context. We don't issue a separate mentor-fetch request — the
  // availability endpoint will 404 if the id is invalid, and the manager
  // already handles an empty slot list gracefully. For the header we show a
  // generic title and a "Back to mentors" CTA so the admin can re-enter via
  // the list and pick up cache.
  const mentorDisplayName = mentor?.user.full_name ?? 'this mentor'

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] min-w-0 space-y-6 overflow-x-hidden px-3 py-5 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Manage mentor availability"
          subtitle={
            mentor
              ? `Set or remove available time slots on behalf of ${mentorDisplayName}.`
              : 'Set or remove available time slots on behalf of a mentor.'
          }
          action={
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-slate-300 bg-white px-4 py-6 text-slate-700 hover:bg-slate-50"
              nativeButton={false}
              render={<Link href="/admin/mentors" />}
            >
              <ArrowLeft className="size-3.5" /> Back to mentors
            </Button>
          }
        />

        {!mentor ? (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-amber-900 sm:p-5">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
            <div className="min-w-0 text-sm">
              <p className="font-extrabold">Mentor not in cache</p>
              <p className="mt-1 font-medium text-amber-800/90">
                Open this mentor from the mentors list so we can show their name in the confirmation
                messages. You can still create and delete slots below.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200/60 bg-white px-3 py-2 shadow-sm sm:px-4">
            <p className="text-xs font-medium text-slate-500">
              Managing slots for{' '}
              <span className="font-bold text-slate-700">{mentor.user.full_name}</span>
              <span className="ml-1 text-slate-400">
                ({mentor.title} · {mentor.user.email})
              </span>
            </p>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 rounded-lg border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              nativeButton={false}
              render={<Link href={`/admin/mentors/${mentor.id}/edit`} />}
            >
              <Pencil className="size-3.5" strokeWidth={2.4} />
              Edit mentor profile
            </Button>
          </div>
        )}

        <AdminAvailabilityManager mentorId={mentorId} />
      </div>
    </div>
  )
}
