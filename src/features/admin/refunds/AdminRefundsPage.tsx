'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { AdminPageHeader } from '../layout/AdminPageHeader'
import { useAdminRefunds } from './hooks/useAdminRefunds'
import { findRefundTab } from './lib/refundBadges'
import { AdminRefundTabFilter } from './components/AdminRefundTabFilter'
import { AdminRefundCard } from './components/AdminRefundCard'
import { AdminMentorPagination } from '../mentors/components/AdminMentorPagination'

export function AdminRefundsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams?.get('tab') ?? undefined
  const tab = findRefundTab(tabParam ?? 'requested')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useAdminRefunds(tab.status, page)
  const refunds = data?.items ?? []

  const handleTabChange = (next: typeof tab.id) => {
    setPage(1)
    const params = new URLSearchParams(searchParams?.toString())
    params.set('tab', next)
    router.replace(`/admin/refunds?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Refunds"
          subtitle="Review, approve, reject, and mark refunds as processed."
          action={
            <span className="hidden self-start rounded-full bg-amber-50 px-3 py-1.5 text-xs font-extrabold text-amber-700 sm:inline-flex">
              {data?.total ?? 0} {tab.label.toLowerCase()}
            </span>
          }
        />

        <AdminRefundTabFilter value={tab.id} onChange={handleTabChange} />

        <section aria-label="Refund queue" className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-white" />
              ))}
            </div>
          ) : refunds.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-400">{tab.emptyMsg}</p>
            </div>
          ) : (
            refunds.map((r) => <AdminRefundCard key={r.id} refund={r} />)
          )}
        </section>

        {data ? (
          <AdminMentorPagination
            page={data.page}
            totalPages={data.total_pages}
            total={data.total}
            itemLabel="refunds"
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
