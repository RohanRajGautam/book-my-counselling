'use client'

import { useEffect, useState } from 'react'
import { Plus, ScrollText } from 'lucide-react'

import { AdminPageHeader } from '../layout/AdminPageHeader'
import { AdminMentorPagination } from '../mentors/components/AdminMentorPagination'
import { Button } from '@/components/ui/button'
import { OutsideSessionRow, OutsideSessionStatus } from '../types/admin.types'
import { useOutsideSessions } from './hooks/useOutsideSessions'
import { OutsideSessionsFiltersBar } from './components/OutsideSessionsFiltersBar'
import { OutsideSessionCard } from './components/OutsideSessionCard'
import { OutsideSessionsInfoCallout } from './components/OutsideSessionsInfoCallout'
import { OutsideSessionDetailModal } from './components/OutsideSessionDetailModal'
import { AdminCreateOutsideSessionModal } from './components/AdminCreateOutsideSessionModal'
import { AdminMarkCompleteOutsideSessionModal } from './components/AdminMarkCompleteOutsideSessionModal'

function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])
  return debounced
}

export function AdminOutsideSessionsPage() {
  const [q, setQ] = useState('')
  const debouncedQ = useDebouncedValue(q, 350)
  const [status, setStatus] = useState<OutsideSessionStatus | 'all'>('all')
  const [page, setPage] = useState(1)

  const [recordOpen, setRecordOpen] = useState(false)
  const [detailRow, setDetailRow] = useState<OutsideSessionRow | null>(null)
  const [markCompleteRow, setMarkCompleteRow] = useState<OutsideSessionRow | null>(
    null,
  )

  // Reset to page 1 on filter change — done during render (no cascading effect).
  const filtersSignature = `${debouncedQ}|${status}`
  const [prevFilters, setPrevFilters] = useState(filtersSignature)
  if (prevFilters !== filtersSignature) {
    setPrevFilters(filtersSignature)
    setPage(1)
  }

  const { data, isLoading, isFetching } = useOutsideSessions({
    q: debouncedQ.trim() || undefined,
    status: status === 'all' ? undefined : status,
    page,
  })

  const rows = data?.items ?? []
  const hasFilters = !!debouncedQ || status !== 'all'

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Outside Sessions"
          subtitle="Record sessions that happened (or will happen) outside the platform's booking page — offline payments, partner-sponsored sessions, free volunteer sessions, or any time the mentee didn't actually book through the website."
          action={
            <Button
              size="sm"
              className="gap-1.5 rounded-lg bg-[#0755d8] px-4 py-6 font-bold text-white shadow-sm hover:bg-blue-700"
              onClick={() => setRecordOpen(true)}
            >
              <Plus className="size-4" strokeWidth={2.6} />
              Record session
            </Button>
          }
        />

        <OutsideSessionsInfoCallout />

        <OutsideSessionsFiltersBar
          q={q}
          setQ={setQ}
          status={status}
          setStatus={setStatus}
        />

        <section
          aria-label="Outside sessions list"
          className={isFetching && !isLoading ? 'opacity-70 transition-opacity' : ''}
        >
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="h-5 w-48 rounded-md bg-slate-100" />
                      <div className="h-3 w-40 rounded-md bg-slate-100" />
                      <div className="h-3 w-32 rounded-md bg-slate-100" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="h-8 w-24 rounded-xl bg-slate-100" />
                      <div className="h-8 w-20 rounded-xl bg-slate-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <ScrollText className="mx-auto mb-3 size-8 text-slate-300" />
              <p className="text-sm font-semibold text-slate-400">
                {hasFilters
                  ? 'No outside sessions match these filters.'
                  : 'No outside sessions recorded yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((r) => (
                <OutsideSessionCard
                  key={r.id}
                  row={r}
                  onView={setDetailRow}
                  onMarkComplete={setMarkCompleteRow}
                />
              ))}
            </div>
          )}
        </section>

        {data ? (
          <AdminMentorPagination
            page={data.page}
            totalPages={data.total_pages}
            total={data.total}
            itemLabel="outside sessions"
            hasPrev={data.has_prev}
            hasNext={data.has_next}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => p + 1)}
          />
        ) : null}
      </div>

      <AdminCreateOutsideSessionModal
        open={recordOpen}
        onClose={() => setRecordOpen(false)}
      />

      <OutsideSessionDetailModal
        row={detailRow}
        onClose={() => setDetailRow(null)}
      />

      <AdminMarkCompleteOutsideSessionModal
        row={markCompleteRow}
        onClose={() => setMarkCompleteRow(null)}
        onCompleted={(updated) => {
          // If the detail modal happens to be open for this row, refresh it.
          if (detailRow && detailRow.id === updated.id) setDetailRow(updated)
        }}
      />
    </div>
  )
}