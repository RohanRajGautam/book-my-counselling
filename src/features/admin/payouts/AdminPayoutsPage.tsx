'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Banknote,
  CalendarSearch,
  ListChecks,
  RefreshCcw,
} from 'lucide-react'

import { AdminStatCard } from '../analytics/components/AdminStatCard'
import { AdminMentorPagination } from '../mentors/components/AdminMentorPagination'
import { AdminPageHeader } from '../layout/AdminPageHeader'
import { formatNPR } from '../lib/format'

import { AdminPayoutCreateModal } from './components/AdminPayoutCreateModal'
import { AdminPayoutDetail } from './components/AdminPayoutDetail'
import { AdminPayoutHistoryCard } from './components/AdminPayoutHistoryCard'
import { AdminPayoutHistoryFiltersBar } from './components/AdminPayoutHistoryFiltersBar'
import { AdminPayoutOwedSummaryRow } from './components/AdminPayoutOwedSummary'
import { AdminPayoutPreviewModal } from './components/AdminPayoutPreviewModal'
import {
  useOwed,
  usePayoutsList,
} from './hooks/useAdminPayouts'
import {
  findPayoutHistoryTab,
  PAYOUT_HISTORY_TABS,
  type PayoutHistoryTabSpec,
} from './lib/payoutBadges'
import type { OwedPerMentorSummary, PayoutResponse } from './types/payouts.types'

/**
 * Convert a `YYYY-MM-DD` value from a native `<input type="date">` to
 * an inclusive UTC ISO datetime the API expects. Mirrors the helper in
 * `AdminAnalyticsPage` so we don't need to hoist it just for this.
 */
function utcIsoFromDateInput(value: string, edge: 'start' | 'end'): string | undefined {
  if (!value) return undefined
  const time = edge === 'start' ? 'T00:00:00Z' : 'T23:59:59Z'
  return new Date(`${value}${time}`).toISOString()
}

export function AdminPayoutsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams?.get('tab') ?? null
  const tab: PayoutHistoryTabSpec = findPayoutHistoryTab(tabParam)

  // ── History filters ────────────────────────────────────────────────────
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [historyPage, setHistoryPage] = useState(1)

  // Reset to page 1 when filters change.
  useEffect(() => {
    setHistoryPage(1)
  }, [tab.status, startDate, endDate])

  const {
    data: history,
    isLoading: historyLoading,
    isFetching: historyFetching,
    refetch: refetchHistory,
  } = usePayoutsList({
    page: historyPage,
    page_size: 20,
    status: tab.status,
    start_date: startDate ? utcIsoFromDateInput(startDate, 'start') : undefined,
    end_date: endDate ? utcIsoFromDateInput(endDate, 'end') : undefined,
  })

  const { data: owed, isLoading: owedLoading, refetch: refetchOwed } = useOwed()

  // ── Modal state ────────────────────────────────────────────────────────
  const [createMentor, setCreateMentor] = useState<OwedPerMentorSummary | null>(null)
  const [previewMentor, setPreviewMentor] = useState<OwedPerMentorSummary | null>(null)
  const [detailPayout, setDetailPayout] = useState<PayoutResponse | null>(null)

  const handleTabChange = (next: PayoutHistoryTabSpec['id']) => {
    setHistoryPage(1)
    const params = new URLSearchParams(searchParams?.toString())
    if (next === 'all') {
      params.delete('tab')
    } else {
      params.set('tab', next)
    }
    const qs = params.toString()
    router.replace(`/admin/payouts${qs ? `?${qs}` : ''}`, { scroll: false })
  }

  const handlePreview = (mentor: OwedPerMentorSummary) => setPreviewMentor(mentor)
  const handleCreate = (mentor: OwedPerMentorSummary) => setCreateMentor(mentor)

  const perMentor = owed?.per_mentor ?? []
  const grandTotal = Number(owed?.total_owed_all_mentors ?? 0)
  const eligibleCount = owed?.total_eligible_bookings ?? 0
  const totalHistory = history?.total ?? 0

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:space-y-10 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Mentor Payouts"
          subtitle="Track what we owe mentors, disburse funds, and audit the ledger."
          action={
            <div className="flex shrink-0 items-center gap-3">
              <span className="hidden self-start rounded-full bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700 sm:inline-flex">
                {eligibleCount} eligible · {totalHistory} in history
              </span>
              <button
                type="button"
                onClick={() => {
                  void refetchOwed()
                  void refetchHistory()
                }}
                className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 active:scale-[0.96]"
                aria-label="Refresh"
                title="Refresh"
              >
                <RefreshCcw className="size-4" />
              </button>
            </div>
          }
        />

        {/* ── Owed summary ─────────────────────────────────────────── */}
        <section
          aria-label="What we owe"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <AdminStatCard
            icon={<Banknote size={20} strokeWidth={2.2} />}
            label="Total Owed"
            value={owedLoading ? 'NPR …' : formatNPR(grandTotal)}
            tone="blue"
            helper={
              owedLoading
                ? 'Loading…'
                : grandTotal > 0
                  ? `${perMentor.length} mentor${perMentor.length === 1 ? '' : 's'} pending`
                  : 'All caught up'
            }
            loading={owedLoading}
          />
          <AdminStatCard
            icon={<CalendarSearch size={20} strokeWidth={2.2} />}
            label="Eligible Bookings"
            value={eligibleCount.toLocaleString('en-US')}
            tone="amber"
            helper="Paid + completed"
            loading={owedLoading}
          />
          <AdminStatCard
            icon={<ListChecks size={20} strokeWidth={2.2} />}
            label="Pending Payouts"
            value={(
              history?.items.filter((p) => p.status === 'pending').length ?? 0
            ).toLocaleString('en-US')}
            tone="emerald"
            helper={`${totalHistory} total in history`}
          />
          <AdminStatCard
            icon={<Banknote size={20} strokeWidth={2.2} />}
            label="Paid Out"
            value={formatNPR(
              (history?.items ?? [])
                .filter((p) => p.status === 'paid')
                .reduce((acc, p) => acc + Number(p.total_amount), 0),
            )}
            tone="slate"
            helper="This page's results"
          />
        </section>

        {/* ── Per-mentor list ──────────────────────────────────────── */}
        <section aria-label="Per-mentor owed" className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-headline text-lg font-extrabold text-slate-950 sm:text-xl">
                Per-mentor owed
              </h2>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                Biggest owed first. Click <span className="font-bold text-slate-700">Preview</span>{' '}
                to inspect the eligible bookings, or{' '}
                <span className="font-bold text-slate-700">Create payout</span> to start the
                disbursement flow.
              </p>
            </div>
          </div>

          {owedLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="size-9 rounded-xl bg-slate-100" />
                        <div className="h-5 w-40 rounded-md bg-slate-100" />
                      </div>
                      <div className="h-3 w-56 rounded-md bg-slate-100" />
                    </div>
                    <div className="h-9 w-32 rounded-xl bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : perMentor.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-400">
                Nothing owed — every mentor with completed bookings has been paid out.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {perMentor.map((m) => (
                <AdminPayoutOwedSummaryRow
                  key={m.mentor_id}
                  mentor={m}
                  onCreate={handleCreate}
                  onPreview={handlePreview}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── History ──────────────────────────────────────────────── */}
        <section aria-label="Payout history" className="space-y-3">
          <div>
            <h2 className="font-headline text-lg font-extrabold text-slate-950 sm:text-xl">
              Payout history
            </h2>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Every payout you&apos;ve created. Click a row for the full audit trail.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Payout status"
            className="flex flex-wrap gap-1 rounded-2xl bg-white p-1 shadow-sm"
          >
            {PAYOUT_HISTORY_TABS.map((t) => {
              const active = t.id === tab.id
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleTabChange(t.id)}
                  className={`min-w-[5.5rem] flex-1 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-extrabold transition ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              )
            })}
          </div>

          <AdminPayoutHistoryFiltersBar
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            status={tab.status}
          />

          <div
            aria-label="History list"
            className={historyFetching && !historyLoading ? 'opacity-70 transition-opacity' : ''}
          >
            {historyLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="h-5 w-32 rounded-md bg-slate-100" />
                          <div className="h-4 w-16 rounded-full bg-slate-100" />
                        </div>
                        <div className="h-3 w-56 rounded-md bg-slate-100" />
                      </div>
                      <div className="h-9 w-20 rounded-xl bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (history?.items ?? []).length === 0 ? (
              <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
                <p className="text-sm font-semibold text-slate-400">{tab.emptyMsg}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(history?.items ?? []).map((p) => (
                  <AdminPayoutHistoryCard
                    key={p.id}
                    payout={p}
                    onOpen={(payout) => setDetailPayout(payout)}
                  />
                ))}
              </div>
            )}
          </div>

          {history ? (
            <AdminMentorPagination
              page={history.page}
              totalPages={history.total_pages}
              total={history.total}
              itemLabel="payouts"
              hasPrev={history.has_prev}
              hasNext={history.has_next}
              onPrev={() => setHistoryPage((p) => Math.max(1, p - 1))}
              onNext={() => setHistoryPage((p) => p + 1)}
            />
          ) : null}
        </section>
      </div>

      {previewMentor ? (
        <AdminPayoutPreviewModal
          key={previewMentor.mentor_id}
          mentor={previewMentor}
          onClose={() => setPreviewMentor(null)}
          onCreate={() => {
            setCreateMentor(previewMentor)
            setPreviewMentor(null)
          }}
        />
      ) : null}

      {createMentor ? (
        <AdminPayoutCreateModal
          key={createMentor.mentor_id}
          mentor={createMentor}
          onClose={() => setCreateMentor(null)}
          onCreated={() => {
            // After create, the new payout shows up in history; just
            // refresh the view.
          }}
        />
      ) : null}

      {detailPayout ? (
        <AdminPayoutDetail
          key={detailPayout.id}
          payoutId={detailPayout.id}
          onClose={() => setDetailPayout(null)}
        />
      ) : null}
    </div>
  )
}