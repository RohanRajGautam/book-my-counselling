'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { BellRing, Loader2, UserCheck, UserPlus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { AdminPageHeader } from '../layout/AdminPageHeader'
import { useAdminMentors, useSendBulkReminder, useSendReminder } from './hooks/useAdminMentors'
import { ADMIN_MENTOR_TABS, findAdminMentorTab, type AdminMentorTabId } from './lib/filterConfig'
import { AdminMentorFilterTabs } from './components/AdminMentorFilterTabs'
import { AdminMentorSearchBar } from './components/AdminMentorSearchBar'
import { AdminMentorCard } from './components/AdminMentorCard'
import { AdminMentorPagination } from './components/AdminMentorPagination'

const VALID_TAB_IDS = ADMIN_MENTOR_TABS.map((t) => t.id) as readonly AdminMentorTabId[]

function isTabId(value: string | null): value is AdminMentorTabId {
  return !!value && (VALID_TAB_IDS as readonly string[]).includes(value)
}

function useDebouncedValue<T>(value: T, delayMs = 350): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])
  return debounced
}

function totalLabel(tabId: AdminMentorTabId, total: number): string {
  switch (tabId) {
    case 'pending':
      return `${total.toLocaleString('en-US')} awaiting review`
    case 'approved':
      return `${total.toLocaleString('en-US')} approved`
    case 'rejected':
      return `${total.toLocaleString('en-US')} rejected`
    case 'without_availability':
      return `${total.toLocaleString('en-US')} missing availability`
    case 'all':
    default:
      return `${total.toLocaleString('en-US')} total`
  }
}

export function AdminMentorsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams?.get('tab')
  const tabId: AdminMentorTabId = isTabId(tabParam) ? tabParam : 'all'
  const queryParam = searchParams?.get('q') ?? ''

  const [page, setPage] = useState(1)
  const [q, setQ] = useState(queryParam)
  const searchTerm = useDebouncedValue(q, 350).trim()

  // Mirror the settled search term into the URL so it survives the round-trip
  // to a mentor's edit page and back, the same way `tab` already does.
  useEffect(() => {
    if (searchTerm === queryParam) return
    const params = new URLSearchParams(searchParams?.toString())
    if (searchTerm) params.set('q', searchTerm)
    else params.delete('q')
    router.replace(`/admin/mentors?${params.toString()}`, { scroll: false })
  }, [searchTerm, queryParam, router, searchParams])

  // A narrowed result set almost never has as many pages, so a stale page
  // number would strand the admin on an empty view.
  const handleSearchChange = (next: string) => {
    setQ(next)
    setPage(1)
  }

  const activeTab = findAdminMentorTab(tabId)
  const { data, isLoading, isFetching, isPlaceholderData } = useAdminMentors(
    activeTab.filter,
    page,
    searchTerm || undefined
  )
  // `placeholderData: keepPreviousData` keeps the previous query's results
  // visible while a tab switch or page change is in flight — swap in a
  // skeleton instead so the admin doesn't see stale data from the wrong tab.
  const showSkeleton = isLoading || isPlaceholderData

  const { mutate: sendOne, isPending: sendingOne } = useSendReminder()
  const { mutate: sendAll, isPending: sendingAll } = useSendBulkReminder()

  const handleSendOne = (mentorId: string) => {
    sendOne(mentorId, {
      onSuccess: (res) => toast.success(res.message),
      onError: () => toast.error('Failed to send reminder.'),
    })
  }

  const handleSendAll = () => {
    sendAll(
      { isVerified: true },
      {
        onSuccess: (res) => toast.success(res.message),
        onError: () => toast.error('Failed to send bulk reminders.'),
      }
    )
  }

  const handleTabChange = (next: AdminMentorTabId) => {
    setPage(1)
    const params = new URLSearchParams(searchParams?.toString())
    params.set('tab', next)
    router.replace(`/admin/mentors?${params.toString()}`, { scroll: false })
  }

  const total = data?.total ?? 0
  const showRemindAll = tabId === 'without_availability'

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] min-w-0 space-y-6 overflow-x-hidden px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Mentor Management"
          subtitle="Review applications, approve mentors, feature the best, and nudge anyone missing availability."
          action={
            <>
              {showRemindAll && total > 0 ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 rounded-lg border-slate-300 bg-white px-4 py-6 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  disabled={sendingAll}
                  onClick={handleSendAll}
                >
                  {sendingAll ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <BellRing className="size-3.5" strokeWidth={2.4} />
                  )}
                  Remind all ({total.toLocaleString('en-US')})
                </Button>
              ) : null}
              <Button
                nativeButton={false}
                render={<Link href="/admin/mentors/new" />}
                className="gap-1.5 rounded-lg bg-[#0755d8] px-5 py-6 font-bold text-white shadow-sm hover:bg-blue-700"
              >
                <UserPlus className="size-4" strokeWidth={2.4} />
                Create mentor
              </Button>
            </>
          }
        />

        {/* Controls — tabs above, search below, in a single card so the
            whole "find a mentor" surface reads as one block. */}
        <div className="overflow-hidden rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200/60 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <AdminMentorFilterTabs value={tabId} onChange={handleTabChange} />
            <div className="hidden text-xs font-bold text-slate-500 sm:block">
              {data ? totalLabel(tabId, data.total) : null}
            </div>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3 sm:mt-4 sm:pt-4">
            <AdminMentorSearchBar value={q} onChange={handleSearchChange} />
          </div>
        </div>

        <section aria-label="Mentor list" className="space-y-3">
          {showSkeleton ? (
            <div className="space-y-3" aria-busy="true" aria-live="polite">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200/60 sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="size-14 shrink-0 rounded-full bg-slate-100 sm:size-16" />
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="h-5 w-40 rounded-md bg-slate-100" />
                        <div className="h-4 w-16 rounded-full bg-slate-100" />
                      </div>
                      <div className="h-3 w-56 rounded-md bg-slate-100" />
                      <div className="h-3 w-32 rounded-md bg-slate-100" />
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="h-16 rounded-lg bg-slate-100" />
                    <div className="h-16 rounded-lg bg-slate-100" />
                    <div className="h-16 rounded-lg bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : !data?.items.length ? (
            <div className="rounded-xl bg-white p-12 text-center shadow-sm">
              <UserCheck className="mx-auto mb-3 size-8 text-slate-300" />
              <p className="text-sm font-semibold text-slate-400">
                {searchTerm ? `No mentors match “${searchTerm}”.` : activeTab.emptyMsg}
              </p>
            </div>
          ) : (
            data.items.map((mentor) => (
              <AdminMentorCard
                key={mentor.id}
                mentor={mentor}
                tabId={tabId}
                onSendReminder={showRemindAll ? handleSendOne : undefined}
                sendingReminder={sendingOne}
              />
            ))
          )}
        </section>

        {!showSkeleton && data ? (
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

        {/* Background refetch in flight (placeholder data already shown above). */}
        {!showSkeleton && data && isFetching ? (
          <p className="text-center text-xs font-semibold text-slate-400">
            <Loader2 className="mr-1 inline size-3 animate-spin" />
            Refreshing…
          </p>
        ) : null}
      </div>
    </div>
  )
}
