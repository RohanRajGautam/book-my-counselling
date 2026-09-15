'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { CalendarPlus, CalendarX, Loader2, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { AdminPageHeader } from '@/features/admin/layout/AdminPageHeader'

import { useAdminEvents } from '../../hooks/useAdminEvents'
import {
  ADMIN_EVENT_PAGE_SIZE,
  findAdminEventTab,
  type AdminEventTabId,
} from '../../lib/events.constants'

import { AdminEventFilterTabs } from './AdminEventFilterTabs'
import { AdminEventPagination } from './AdminEventPagination'
import { AdminEventRow } from './AdminEventRow'

const VALID_TAB_IDS = new Set<AdminEventTabId>(['all', 'upcoming', 'past'])

function isTabId(value: string | null): value is AdminEventTabId {
  return !!value && VALID_TAB_IDS.has(value as AdminEventTabId)
}

function totalLabel(tabId: AdminEventTabId, total: number): string {
  if (tabId === 'past') return `${total.toLocaleString('en-US')} past`
  if (tabId === 'upcoming') return `${total.toLocaleString('en-US')} upcoming`
  return `${total.toLocaleString('en-US')} total`
}

export function AdminEventsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams?.get('tab')
  const tabId: AdminEventTabId = isTabId(tabParam) ? tabParam : 'upcoming'

  // Page is derived from `?page=N`. Tab changes omit `page` so the URL
  // becomes `?tab=upcoming` and the parse yields 1 — no sync effect needed.
  const pageParam = Number(searchParams?.get('page') ?? '1')
  const page = Number.isFinite(pageParam) && pageParam >= 1 ? Math.floor(pageParam) : 1

  const activeTab = findAdminEventTab(tabId)
  const filter = activeTab.filter
  const { data, isLoading, isPlaceholderData, isFetching } = useAdminEvents(
    {
      isCompleted:
        'is_completed' in filter && typeof filter.is_completed === 'boolean'
          ? filter.is_completed
          : null,
    },
    page,
    ADMIN_EVENT_PAGE_SIZE
  )
  const showSkeleton = isLoading || isPlaceholderData

  const handleTabChange = (next: AdminEventTabId) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    params.set('tab', next)
    // Drop the page param so the URL re-parses to page 1.
    params.delete('page')
    router.replace(`/admin/events?${params.toString()}`, { scroll: false })
  }

  const handlePageChange = (next: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    params.set('page', String(next))
    router.replace(`/admin/events?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] min-w-0 space-y-6 overflow-x-hidden px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Events"
          subtitle="Publish upcoming gatherings, mark past events complete, and review bookings."
          action={
            <Button
              size="sm"
              nativeButton={false}
              render={<Link href="/admin/events/new" />}
              className="gap-1.5 rounded-[22px] bg-[#0755d8] px-5 py-6 font-bold text-white shadow-sm hover:bg-blue-700"
            >
              <CalendarPlus className="size-4" strokeWidth={2.4} />
              Create event
            </Button>
          }
        />

        <div className="overflow-hidden rounded-[22px] border border-[#d9e3f6] bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <AdminEventFilterTabs value={tabId} onChange={handleTabChange} />
            <div className="hidden text-xs font-bold text-slate-500 sm:block">
              {data ? totalLabel(tabId, data.total) : null}
            </div>
          </div>
        </div>

        <section aria-label="Event list" className="space-y-3">
          {showSkeleton ? (
            <div className="space-y-3" aria-busy="true" aria-live="polite">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-slate-200/60 sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="size-28 shrink-0 rounded-[22px] bg-slate-100" />
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="h-5 w-40 rounded-[22px] bg-slate-100" />
                        <div className="h-4 w-16 rounded-full bg-slate-100" />
                      </div>
                      <div className="h-3 w-56 rounded-[22px] bg-slate-100" />
                      <div className="h-3 w-32 rounded-[22px] bg-slate-100" />
                      <div className="h-3 w-full rounded-[22px] bg-slate-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !data?.items.length ? (
            <EmptyState tabId={tabId} />
          ) : (
            data.items.map((event) => <AdminEventRow key={event.id} event={event} />)
          )}
        </section>

        {!showSkeleton && data ? (
          <AdminEventPagination
            page={data.page}
            totalPages={data.total_pages}
            total={data.total}
            itemLabel="events"
            hasPrev={data.has_prev}
            hasNext={data.has_next}
            onPrev={() => handlePageChange(Math.max(1, page - 1))}
            onNext={() => handlePageChange(page + 1)}
          />
        ) : null}

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

function EmptyState({ tabId }: { tabId: AdminEventTabId }) {
  const isPast = tabId === 'past'
  return (
    <div className="rounded-[22px] bg-white p-12 text-center shadow-sm">
      {isPast ? (
        <CalendarX className="mx-auto mb-3 size-8 text-slate-300" aria-hidden="true" />
      ) : (
        <Sparkles className="mx-auto mb-3 size-8 text-slate-300" aria-hidden="true" />
      )}
      <p className="text-sm font-semibold text-slate-400">
        {isPast
          ? 'No past events yet — events show up here once an admin marks them complete.'
          : 'No upcoming events. Create the next one to start taking bookings.'}
      </p>
      {isPast ? null : (
        <Button
          size="sm"
          nativeButton={false}
          render={<Link href="/admin/events/new" />}
          className="mt-4 gap-1.5 rounded-[22px] bg-[#0755d8] font-bold text-white hover:bg-blue-700"
        >
          <CalendarPlus className="size-4" strokeWidth={2.4} />
          Create event
        </Button>
      )}
    </div>
  )
}
