'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, UserCheck } from 'lucide-react'

import { AdminPageHeader } from '../layout/AdminPageHeader'
import { useAdminMentors } from './hooks/useAdminMentors'
import {
  ADMIN_MENTOR_TABS,
  findAdminMentorTab,
  type AdminMentorTabId,
} from './lib/filterConfig'
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
  const { data, isLoading } = useAdminMentors(activeTab.filter, page)

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
            <span className="hidden self-start rounded-full bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700 sm:inline-flex">
              {data?.total ?? 0} mentors on this view
            </span>
          }
        />

        <AdminMentorFilterTabs value={tabId} onChange={handleTabChange} />

        <section aria-label="Mentor list" className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-white" />
              ))}
            </div>
          ) : !data?.items.length ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <UserCheck className="mx-auto mb-3 size-8 text-slate-300" />
              <p className="text-sm font-semibold text-slate-400">{activeTab.emptyMsg}</p>
            </div>
          ) : (
            data.items.map((mentor) => (
              <AdminMentorCard key={mentor.id} mentor={mentor} tabId={tabId} />
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

        {/* Data fetch in flight; show subtle inline indicator. */}
        {data && isLoading ? (
          <p className="text-center text-xs text-slate-400">
            <Loader2 className="mr-1 inline size-3 animate-spin" />
            Refreshing…
          </p>
        ) : null}
      </div>
    </div>
  )
}
