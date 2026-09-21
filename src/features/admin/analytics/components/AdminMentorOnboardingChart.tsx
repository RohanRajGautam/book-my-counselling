'use client'

import { useId } from 'react'
import {
  Area,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Skeleton } from '@/components/ui/skeleton'

const CHART_HEIGHT = 'h-[180px] sm:h-[200px]'

const LINE_STROKE = '#2563eb'
const DOT_FILL = '#2563eb'
const ACTIVE_DOT = '#1d4ed8'

export interface OnboardingBarPoint {
  /** Pre-formatted X-axis tick label (e.g. `Mon` or `Sep`). */
  xLabel: string
  /** Full bucket key for tooltips (e.g. `2026-09-21` or `2026-09`). */
  rawLabel: string
  count: number
}

export interface AdminMentorOnboardingChartProps {
  title: string
  subtitle?: string
  /** Units used in the "X approved · …" footer (e.g. `mentor` → "1 mentor"). */
  unit?: string
  data: OnboardingBarPoint[] | undefined
  isLoading: boolean
}

export function AdminMentorOnboardingChart({
  title,
  subtitle,
  unit = 'mentor',
  data,
  isLoading,
}: AdminMentorOnboardingChartProps) {
  // useId() guarantees a stable, unique gradient id per chart instance so two
  // side-by-side charts on the dashboard don't share a fill definition.
  const reactId = useId()
  const gradientId = `onboarding-fill-${reactId.replace(/:/g, '')}`

  if (isLoading || !data) {
    return (
      <div className="space-y-3 sm:space-y-4" aria-hidden>
        <Skeleton className="h-4 w-40 rounded bg-slate-100" />
        <Skeleton className="h-3 w-56 rounded bg-slate-100" />
        <div className={`${CHART_HEIGHT} rounded-xl bg-slate-50/60`}>
          <Skeleton className="h-full w-full rounded-xl bg-slate-100/70" />
        </div>
      </div>
    )
  }

  const total = data.reduce((sum, d) => sum + d.count, 0)
  const peak = data.reduce<OnboardingBarPoint>(
    (p, d) => (d.count > p.count ? d : p),
    { xLabel: '', rawLabel: '', count: 0 },
  )
  const hasPeak = peak.count > 0

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h3 className="font-headline text-sm font-extrabold text-slate-950 sm:text-base">
          {title}
        </h3>
        {subtitle ? (
          <p className="text-xs font-medium text-slate-500">{subtitle}</p>
        ) : null}
      </div>

      <div className={`mt-4 ${CHART_HEIGHT}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={LINE_STROKE} stopOpacity={0.28} />
                <stop offset="100%" stopColor={LINE_STROKE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="xLabel"
              tick={{
                fontSize: 11,
                fill: '#64748b',
                fontWeight: 600,
              }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              cursor={{
                stroke: '#94a3b8',
                strokeWidth: 1,
                strokeDasharray: '3 3',
              }}
              content={<OnboardingTooltip unit={unit} />}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="none"
              fill={`url(#${gradientId})`}
              isAnimationActive
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={LINE_STROKE}
              strokeWidth={2.5}
              strokeLinecap="round"
              dot={{
                r: 3,
                fill: DOT_FILL,
                strokeWidth: 2,
                stroke: '#fff',
              }}
              activeDot={{
                r: 5,
                fill: ACTIVE_DOT,
                strokeWidth: 2,
                stroke: '#fff',
              }}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-2 text-center text-xs font-medium text-slate-500">
        <span className="font-extrabold text-slate-700">
          {total.toLocaleString('en-US')} {unit}
          {total === 1 ? '' : 's'}
        </span>
        {' approved'}
        {hasPeak ? (
          <span className="text-slate-400">
            {' · peak on '}
            <span className="font-bold text-slate-700">{peak.xLabel}</span>
            {' '}
            ({peak.count.toLocaleString('en-US')})
          </span>
        ) : null}
        .
      </p>
    </div>
  )
}

function OnboardingTooltip({
  active,
  payload,
  unit,
}: {
  active?: boolean
  payload?: { payload: OnboardingBarPoint }[]
  unit: string
}) {
  if (!active || !payload || payload.length === 0) return null
  const entry = payload[0]?.payload
  if (!entry) return null
  return (
    <div className="min-w-[150px] rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl ring-1 ring-slate-900/5 sm:min-w-[170px] sm:p-3">
      <p className="text-[10px] font-extrabold tracking-[0.12em] text-slate-500 uppercase sm:text-[11px]">
        {entry.rawLabel}
      </p>
      <p className="mt-1 text-lg font-extrabold text-slate-950 sm:text-xl">
        {entry.count.toLocaleString('en-US')}
      </p>
      <p className="text-[10px] font-semibold text-slate-500 sm:text-[11px]">
        {unit}
        {entry.count === 1 ? '' : 's'} approved
      </p>
    </div>
  )
}