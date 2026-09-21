'use client'

import { useMemo, useState } from 'react'
import { Banknote, CalendarSearch, Sparkles, UserCheck, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'

import { AdminPageHeader } from '../layout/AdminPageHeader'
import { useAdminStats, useMentorOnboardingStats } from './hooks/useAdminStats'
import {
  useAdminRevenue,
  useAdminRevenueAll,
  type UseAdminRevenueParams,
} from './hooks/useAdminRevenue'
import { fillBreakdownGaps, formatCoverageWindow } from './lib/dateRanges'
import { formatNPR, formatNPRCompact } from '../lib/format'
import type { AdminRevenue, PresetRevenuePeriod, RevenuePeriod } from '../types/admin.types'

import { AdminStatCard } from './components/AdminStatCard'
import { AdminRevenueChart } from './components/AdminRevenueChart'
import { AdminRevenuePeriodSelector } from './components/AdminRevenuePeriodSelector'
import { AdminCustomRangeForm } from './components/AdminCustomRangeForm'
import { AdminQuickActions } from './components/AdminQuickActions'
import { AdminRecentBookingsCard } from './components/AdminRecentBookingsCard'
import { AdminMentorOnboardingChart } from './components/AdminMentorOnboardingChart'

/** Convert a `YYYY-MM-DD` from a native `<input type="date">` to the ISO datetime the API expects. */
function utcIsoFromDateInput(value: string, edge: 'start' | 'end'): string | undefined {
  if (!value) return undefined
  // start-of-day UTC for `From`, end-of-day UTC for `To` so that the
  // inclusive end bound catches transactions paid throughout the picked day.
  const time = edge === 'start' ? 'T00:00:00Z' : 'T23:59:59Z'
  return new Date(`${value}${time}`).toISOString()
}

/** Subtract `days - 1` from `YYYY-MM-DD` so the returned range spans exactly that many days inclusive. */
function shiftIsoDay(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() - (days - 1))
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<RevenuePeriod>('weekly')
  const [onboardingWindow, setOnboardingWindow] = useState<'weekly' | 'monthly'>(
    'weekly',
  )
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  // Bundled fetch: one round-trip loads weekly + monthly + yearly so the
  // period selector switches instantly without re-hitting the server.
  const { data: revenueAll, isLoading: revenueAllLoading } = useAdminRevenueAll()

  // Custom range uses its own request (the bundled endpoint doesn't accept dates).
  // Fetch fires the moment the admin sets an end date — if they haven't picked
  // a start yet, we default it to (end - 7 days) so the chart isn't blank
  // while the admin is mid-pick.
  const customParams: UseAdminRevenueParams | null = useMemo(() => {
    if (period !== 'custom') return null
    if (!customEnd) return null
    const effectiveStart = customStart || shiftIsoDay(customEnd, 7)
    return {
      period: 'custom',
      startDate: utcIsoFromDateInput(effectiveStart, 'start'),
      endDate: utcIsoFromDateInput(customEnd, 'end'),
    }
  }, [period, customStart, customEnd])

  const { data: customRevenue, isFetching: customFetching } = useAdminRevenue({
    period: 'custom',
    startDate: customParams?.startDate,
    endDate: customParams?.endDate,
  })

  // Pick the active AdminRevenue based on the selected period.
  const activeRevenue: AdminRevenue | undefined = useMemo(() => {
    if (period === 'custom') {
      return customRevenue && 'period' in customRevenue
        ? (customRevenue as AdminRevenue)
        : undefined
    }
    if (!revenueAll) return undefined
    return revenueAll[period as PresetRevenuePeriod]
  }, [period, revenueAll, customRevenue])

  const isLoading =
    period === 'custom' ? customFetching && !activeRevenue : revenueAllLoading && !activeRevenue

  const filledData = useMemo(() => {
    if (!activeRevenue) return undefined
    return fillBreakdownGaps(
      activeRevenue.breakdown,
      activeRevenue.period,
      activeRevenue.start_date,
      activeRevenue.end_date
    )
  }, [activeRevenue])

  const { data: stats, isLoading: statsLoading } = useAdminStats()
  const { data: onboarding, isLoading: onboardingLoading } = useMentorOnboardingStats()

  const totalRevenue = Number(stats?.total_revenue ?? 0)
  const isFreshData = !statsLoading && !revenueAllLoading
  const coverageLabel = activeRevenue
    ? formatCoverageWindow(activeRevenue.start_date, activeRevenue.end_date, activeRevenue.period)
    : null

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:space-y-10 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Analytics Overview"
          subtitle="Real-time insights into your platform's performance."
          action={
            <span className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Live data
            </span>
          }
        />

        {/* ── Lifetime platform totals ─────────────────────────── */}
        <section aria-label="Platform totals" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            icon={<Banknote size={20} strokeWidth={2.2} />}
            label="Total Revenue"
            value={formatNPRCompact(totalRevenue)}
            tone="blue"
            helper={isFreshData ? 'Lifetime, NPR' : 'Loading…'}
            loading={statsLoading}
          />
          <AdminStatCard
            icon={<UserCheck size={20} strokeWidth={2.2} />}
            label="Total Mentors"
            value={(stats?.total_mentors ?? 0).toLocaleString('en-US')}
            tone="emerald"
            helper="Lifetime active"
            loading={statsLoading}
          />
          <AdminStatCard
            icon={<CalendarSearch size={20} strokeWidth={2.2} />}
            label="Today's bookings"
            value={(stats?.todays_bookings ?? 0).toLocaleString('en-US')}
            tone="amber"
            helper="Today"
            loading={statsLoading}
          />
          <AdminStatCard
            icon={<UserPlus size={20} strokeWidth={2.2} />}
            label="Today’s onboarded mentors"
            value={(stats?.todays_onboarded_mentors ?? 0).toLocaleString('en-US')}
            tone="emerald"
            helper="Today"
            loading={statsLoading}
          />
        </section>

        {/* ── Revenue trends ────────────────────────────────────── */}
        <section
          aria-label="Revenue trends"
          className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-8"
        >
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-1">
              <h2 className="font-headline text-base font-extrabold text-slate-950 sm:text-lg">
                Revenue Trends
              </h2>
              <p className="text-xs font-medium text-slate-500">
                {coverageLabel ? (
                  <>
                    <span className="font-bold text-slate-700">{coverageLabel}</span>
                    {' · '}
                    {formatNPR(Number(activeRevenue?.total_revenue ?? 0))}
                    {' · '}
                    {activeRevenue?.total_paid_bookings ?? 0} paid bookings
                  </>
                ) : (
                  'Pick a period to load revenue.'
                )}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
              <AdminRevenuePeriodSelector value={period} onChange={setPeriod} />
            </div>

            {period === 'custom' ? (
              <div className="mt-4">
                <AdminCustomRangeForm
                  startDate={customStart}
                  endDate={customEnd}
                  onStartChange={setCustomStart}
                  onEndChange={setCustomEnd}
                />
              </div>
            ) : null}

            <div className="mt-5">
              <AdminRevenueChart
                data={filledData}
                isLoading={isLoading}
                totalRevenue={activeRevenue ? Number(activeRevenue.total_revenue) : 0}
                totalBookings={activeRevenue?.total_paid_bookings ?? 0}
              />
            </div>
          </div>

          <aside className="space-y-6">
            <AdminQuickActions />
            <AdminSparklesCard />
          </aside>
        </section>

        {/* ── Mentor onboarding ─────────────────────────────── */}
        <section
          aria-label="Mentor onboarding"
          className="rounded-2xl bg-white p-5 shadow-sm sm:p-6"
        >
          <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="font-headline text-base font-extrabold text-slate-950 sm:text-lg">
                Mentor onboarding
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Approved mentor profiles by calendar window. Bucketed by
                <span className="font-bold text-slate-700"> is_verified=true</span>
                {' '}+ <span className="font-bold text-slate-700">created_at</span>.
              </p>
            </div>
            <OnboardingWindowToggle
              value={onboardingWindow}
              onChange={setOnboardingWindow}
            />
          </header>

          <div className="mt-5">
            {onboardingWindow === 'weekly' ? (
              <AdminMentorOnboardingChart
                title="Approved last 7 days"
                subtitle="Last 7 UTC days · last point is today"
                data={
                  onboarding
                    ? onboarding.weekly.map((w) => ({
                        xLabel: formatWeekday(w.date),
                        rawLabel: w.date,
                        count: w.count,
                      }))
                    : undefined
                }
                isLoading={onboardingLoading}
              />
            ) : (
              <AdminMentorOnboardingChart
                title="Approved last 12 months"
                subtitle="Current UTC month + previous 11"
                data={
                  onboarding
                    ? onboarding.monthly.map((m) => ({
                        xLabel: formatMonthAbbr(m.month),
                        rawLabel: m.month,
                        count: m.count,
                      }))
                    : undefined
                }
                isLoading={onboardingLoading}
              />
            )}
          </div>
        </section>

        <AdminRecentBookingsCard />
      </div>
    </div>
  )
}

function AdminSparklesCard() {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 p-5 text-white shadow-sm sm:p-6">
      <div className="inline-flex size-10 items-center justify-center rounded-xl bg-white/10">
        <Sparkles className="size-5 text-amber-300" />
      </div>
      <h2 className="font-headline mt-4 text-base font-extrabold sm:text-lg">Pro Tip</h2>
      <p className="mt-2 text-xs leading-5 text-slate-200 sm:text-sm">
        Featured mentors get{' '}
        <strong className="font-extrabold text-white">3× more profile views</strong>. Toggle a
        mentor&apos;s featured flag on the Mentors page to surface them on the public listing.
      </p>
    </section>
  )
}

const ONBOARDING_WINDOW_OPTIONS = [
  { id: 'weekly', label: 'Last 7 days' },
  { id: 'monthly', label: 'Last 12 months' },
] as const

type OnboardingWindow = (typeof ONBOARDING_WINDOW_OPTIONS)[number]['id']

function OnboardingWindowToggle({
  value,
  onChange,
}: {
  value: OnboardingWindow
  onChange: (next: OnboardingWindow) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="Onboarding window"
      className="inline-flex self-start rounded-2xl bg-slate-100 p-1 sm:self-auto"
    >
      {ONBOARDING_WINDOW_OPTIONS.map((opt) => {
        const active = opt.id === value
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={cn(
              'rounded-xl px-4 py-1.5 text-xs font-extrabold transition',
              active
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-800',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

/** "2026-09-21" → "Mon". Display-only — the bucketing is server-side. */
function formatWeekday(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    timeZone: 'UTC',
  })
}

/** "2026-09" → "Sep". Display-only — the bucketing is server-side. */
function formatMonthAbbr(yearMonth: string): string {
  const d = new Date(`${yearMonth}-01T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return yearMonth
  return d.toLocaleDateString(undefined, {
    month: 'short',
    timeZone: 'UTC',
  })
}
