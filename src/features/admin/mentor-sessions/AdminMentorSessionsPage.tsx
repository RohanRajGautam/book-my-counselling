'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertTriangle, ArrowLeft, CalendarX2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { AdminPageHeader } from '../layout/AdminPageHeader'
import { AdminMentorPagination } from '../mentors/components/AdminMentorPagination'
import { MentorPickerCombobox } from '../mentors/_shared/MentorPickerCombobox'
import { useMentorProfileFromAdminListCache } from '../mentors/hooks/useAdminMentors'
import { AdminBookingCard } from '../bookings/components/AdminBookingCard'
import { httpStatus, errorDetail } from '../lib/apiError'
import {
  AdminBookingStatus,
  AdminMentorPickerOption,
  AdminPaymentStatus,
  MentorSessionSort,
} from '../types/admin.types'
import { useMentorSessionSummary, useMentorSessions } from './hooks/useMentorSessions'
import { dateFromBound, dateToBound } from './lib/mentorSessionFilters'
import { AdminMentorSessionFiltersBar } from './components/AdminMentorSessionFiltersBar'
import { AdminMentorSessionSummaryCards } from './components/AdminMentorSessionSummaryCards'

export interface AdminMentorSessionsPageProps {
  /** The `MentorProfile.id` (NOT the user id). */
  mentorId: string
}

function BackToMentorsButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-xl border-slate-300 bg-white px-4 py-6 text-slate-700 hover:bg-slate-50"
      nativeButton={false}
      render={<Link href="/admin/mentors" />}
    >
      <ArrowLeft className="size-3.5" /> Back to mentors
    </Button>
  )
}

/**
 * One mentor's platform sessions — every booking the mentor has, with the
 * counts an admin needs to spot the ones nobody closed out.
 *
 * There is no `GET /admin/mentors/{id}` endpoint, so the mentor's name comes
 * from the `?name=` query param the mentor list writes, then from the mentor
 * list cache, then from the first row. The id stays the source of truth.
 */
export function AdminMentorSessionsPage({ mentorId }: AdminMentorSessionsPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nameParam = searchParams.get('name')

  const [status, setStatus] = useState<AdminBookingStatus | 'all'>('all')
  const [paymentStatus, setPaymentStatus] = useState<AdminPaymentStatus | 'all'>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sort, setSort] = useState<MentorSessionSort>('session')
  const [page, setPage] = useState(1)

  // Reset to page 1 whenever any filter changes. Doing this during render
  // (instead of in an effect) avoids a cascading re-render.
  const filtersSignature = `${status}|${paymentStatus}|${dateFrom}|${dateTo}|${sort}`
  const [prevFilters, setPrevFilters] = useState(filtersSignature)
  if (prevFilters !== filtersSignature) {
    setPrevFilters(filtersSignature)
    setPage(1)
  }

  const sessionsQuery = useMentorSessions({
    mentorId,
    status: status === 'all' ? undefined : status,
    paymentStatus: paymentStatus === 'all' ? undefined : paymentStatus,
    dateFrom: dateFrom ? dateFromBound(dateFrom) : undefined,
    dateTo: dateTo ? dateToBound(dateTo) : undefined,
    sort,
    page,
  })

  const summaryQuery = useMentorSessionSummary(mentorId)

  const rows = sessionsQuery.data?.items ?? []

  const cachedProfile = useMentorProfileFromAdminListCache(mentorId)

  const mentorName =
    nameParam || cachedProfile?.user.full_name || rows[0]?.mentor.full_name || mentorId.slice(0, 8)

  const pickerMentor = useMemo<AdminMentorPickerOption | undefined>(() => {
    if (!cachedProfile) return undefined
    return {
      id: cachedProfile.id,
      full_name: cachedProfile.user.full_name,
      email: cachedProfile.user.email,
      title: cachedProfile.title,
      mentor_share_pct: cachedProfile.mentor_share_pct,
      hourly_rate: cachedProfile.hourly_rate,
    }
  }, [cachedProfile])

  const error = sessionsQuery.error ?? summaryQuery.error
  const notFound = httpStatus(error) === 404
  const failed = !!error && !notFound

  const hasFilters =
    status !== 'all' ||
    paymentStatus !== 'all' ||
    dateFrom !== '' ||
    dateTo !== '' ||
    sort !== 'session'

  if (notFound) {
    return (
      <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
        <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <AdminPageHeader title="Mentor Sessions" action={<BackToMentorsButton />} />
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-8 text-center shadow-sm">
            <AlertTriangle className="mx-auto mb-3 size-8 text-amber-500" aria-hidden />
            <p className="font-headline text-lg font-extrabold text-amber-900">Mentor not found</p>
            <p className="mx-auto mt-1 max-w-md text-sm font-medium text-amber-800/90">
              This mentor may have been deleted, or the link points at an id that no longer exists.
            </p>
            <div className="mt-5">
              <Button
                size="sm"
                className="rounded-xl bg-[#0755d8] px-4 py-6 font-bold text-white shadow-sm hover:bg-blue-700"
                nativeButton={false}
                render={<Link href="/admin/mentors" />}
              >
                Back to mentors
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Mentor Sessions"
          subtitle={`${mentorName} — every session booked on the platform.`}
          action={<BackToMentorsButton />}
        />

        {failed ? (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/70 p-4 text-red-900 sm:p-5">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-500" aria-hidden />
            <div className="min-w-0 text-sm">
              <p className="font-extrabold">Couldn&apos;t load this mentor&apos;s sessions</p>
              <p className="mt-1 font-medium text-red-800/90">
                {errorDetail(error) ?? 'The server rejected the request. Try again in a moment.'}
              </p>
            </div>
          </div>
        ) : null}

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="grid items-start gap-3 sm:grid-cols-[minmax(0,320px)_1fr]">
            <MentorPickerCombobox
              value={mentorId}
              onChange={({ id, mentor: picked }) => {
                if (!id) {
                  router.push('/admin/mentors')
                  return
                }
                router.push(
                  `/admin/mentors/${id}/sessions?name=${encodeURIComponent(picked.full_name)}`,
                )
              }}
              initialMentor={pickerMentor}
              label="Mentor"
              required={false}
              inputId="admin-mentor-sessions-mentor"
              placeholder="Switch to another mentor…"
              clearLabel="Back to the mentors list"
            />
            <p className="self-end pb-1 text-xs font-medium text-slate-500 sm:pl-2">
              Showing every session for{' '}
              <span className="font-extrabold text-slate-800">{mentorName}</span>. Clear the picker
              above to go back to the list and open a different mentor.
            </p>
          </div>
        </div>

        <AdminMentorSessionSummaryCards
          summary={summaryQuery.data}
          loading={summaryQuery.isLoading}
        />

        <AdminMentorSessionFiltersBar
          status={status}
          setStatus={setStatus}
          paymentStatus={paymentStatus}
          setPaymentStatus={setPaymentStatus}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          sort={sort}
          setSort={setSort}
          onClear={() => {
            setStatus('all')
            setPaymentStatus('all')
            setDateFrom('')
            setDateTo('')
            setSort('session')
          }}
        />

        <section
          aria-label="Mentor sessions list"
          className={
            sessionsQuery.isFetching && !sessionsQuery.isLoading
              ? 'opacity-70 transition-opacity'
              : ''
          }
        >
          {sessionsQuery.isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="h-5 w-48 rounded-md bg-slate-100" />
                      <div className="h-3 w-40 rounded-md bg-slate-100" />
                      <div className="h-3 w-32 rounded-md bg-slate-100" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="h-8 w-28 rounded-xl bg-slate-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <CalendarX2 className="mx-auto mb-3 size-8 text-slate-300" />
              <p className="text-sm font-semibold text-slate-400">
                {failed
                  ? 'Sessions could not be loaded.'
                  : hasFilters
                    ? 'No sessions match these filters.'
                    : 'No platform sessions for this mentor yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((r) => (
                <AdminBookingCard key={r.id} booking={r} />
              ))}
            </div>
          )}
        </section>

        {sessionsQuery.data ? (
          <AdminMentorPagination
            page={sessionsQuery.data.page}
            totalPages={sessionsQuery.data.total_pages}
            total={sessionsQuery.data.total}
            itemLabel="sessions"
            hasPrev={sessionsQuery.data.has_prev}
            hasNext={sessionsQuery.data.has_next}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => p + 1)}
          />
        ) : null}
      </div>
    </div>
  )
}
