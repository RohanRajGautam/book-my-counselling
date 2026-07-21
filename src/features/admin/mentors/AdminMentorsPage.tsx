'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, UserCheck, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { AdminPageHeader } from '../layout/AdminPageHeader'
import { useAdminMentors } from './hooks/useAdminMentors'
import { ADMIN_MENTOR_TABS, findAdminMentorTab, type AdminMentorTabId } from './lib/filterConfig'
import { AdminMentorFilterTabs } from './components/AdminMentorFilterTabs'
import { AdminMentorCard } from './components/AdminMentorCard'
import { AdminMentorPagination } from './components/AdminMentorPagination'

const VALID_TAB_IDS = ADMIN_MENTOR_TABS.map((t) => t.id) as readonly AdminMentorTabId[]

function isTabId(value: string | null): value is AdminMentorTabId {
  return !!value && (VALID_TAB_IDS as readonly string[]).includes(value)
}

export function AdminMentorsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams?.get('tab')
  const tabId: AdminMentorTabId = isTabId(tabParam) ? tabParam : 'pending'

  const [page, setPage] = useState(1)
  const activeTab = findAdminMentorTab(tabId)
  const { data, isLoading, isFetching, isPlaceholderData } = useAdminMentors(activeTab.filter, page)
  // `placeholderData: keepPreviousData` keeps the previous query's results
  // visible while a tab switch or page change is in flight — swap in a
  // skeleton instead so the admin doesn't see stale data from the wrong tab.
  const showSkeleton = isLoading || isPlaceholderData

  const handleTabChange = (next: AdminMentorTabId) => {
    setPage(1)
    const params = new URLSearchParams(searchParams?.toString())
    params.set('tab', next)
    router.replace(`/admin/mentors?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Mentor Management"
          subtitle="Review applications, approve mentors, feature the best, and nudge anyone missing availability."
          action={
            <>
              <Button
                nativeButton={false}
                render={<Link href="/admin/mentors/new" />}
                className="gap-1.5 rounded-xl bg-[#0755d8] px-6 py-6 font-bold text-white shadow-sm hover:bg-blue-700"
              >
                <UserPlus className="size-4" strokeWidth={2.4} />
                Create mentor
              </Button>
              <span className="hidden self-start rounded-full bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700 sm:inline-flex">
                {data?.total ?? 0} mentors on this view
              </span>
            </>
          }
        />

        <div className="mt-2 sm:mt-3">
          <AdminMentorFilterTabs value={tabId} onChange={handleTabChange} />
        </div>

        <section aria-label="Mentor list" className="space-y-3">
          {showSkeleton ? (
            <div className="space-y-3" aria-busy="true" aria-live="polite">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-white" />
              ))}
            </div>
          ) : !data?.items.length ? (
            <div className="rounded-lg bg-white p-12 text-center shadow-sm">
              <UserCheck className="mx-auto mb-3 size-8 text-slate-300" />
              <p className="text-sm font-semibold text-slate-400">{activeTab.emptyMsg}</p>
            </div>
          ) : (
            data.items.map((mentor) => (
              <AdminMentorCard key={mentor.id} mentor={mentor} tabId={tabId} />
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
          <p className="text-center text-xs text-slate-400">
            <Loader2 className="mr-1 inline size-3 animate-spin" />
            Refreshing…
          </p>
        ) : null}
      </div>
    </div>
  )
}
