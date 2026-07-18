'use client'

import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BarChart3, Loader2 } from 'lucide-react'

import { FilledRevenuePoint } from '../lib/dateRanges'
import { formatNPRCompact } from '../../lib/format'

export interface AdminRevenueChartProps {
  data: FilledRevenuePoint[] | undefined
  isLoading: boolean
}

const BRAND_BLUE = '#2563eb'

export function AdminRevenueChart({ data, isLoading }: AdminRevenueChartProps) {
  const hasData = !!data && data.length > 0
  const hasRevenue = hasData && data.some((d) => d.revenue > 0)

  const { yTicks, yDomain } = useMemo(() => {
    if (!data || data.length === 0) {
      return { yTicks: [] as number[], yDomain: [0, 1] as [number, number] }
    }
    const maxRevenue = data.reduce((m, d) => (d.revenue > m ? d.revenue : m), 0)
    const yMax = niceCeil(Math.max(maxRevenue, 1))
    const ticks = buildYTicks(yMax)
    return { yTicks: ticks, yDomain: [0, yMax] as [number, number] }
  }, [data])

  return (
    <div className="relative">
      {isLoading ? (
        <div className="flex h-[260px] items-center justify-center sm:h-[320px]">
          <Loader2 className="size-7 animate-spin text-blue-600" />
        </div>
      ) : !hasData ? (
        <EmptyChartState
          title="No revenue data"
          subtitle="Try a different date range or check back after the next paid booking."
        />
      ) : (
        <div className="space-y-3">
          <div className="h-[260px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid
                  stroke="#e2e8f0"
                  strokeDasharray="3 6"
                  vertical={false}
                />
                <XAxis
                  dataKey="chartLabel"
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  minTickGap={8}
                />
                <YAxis
                  domain={yDomain}
                  ticks={yTicks}
                  tickFormatter={(v) => formatNPRCompact(Number(v))}
                  tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  width={72}
                />
                <Tooltip
                  cursor={{ stroke: '#2563eb', strokeDasharray: '4 4', strokeWidth: 1, opacity: 0.45 }}
                  content={<RevenueTooltip />}
                />
                <Bar
                  dataKey="revenue"
                  fill={BRAND_BLUE}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {!hasRevenue ? (
            <p className="text-center text-xs font-medium text-slate-400">
              No paid bookings in this range yet — start earning and the trend line will fill in.
            </p>
          ) : null}
        </div>
      )}
    </div>
  )
}

function RevenueTooltip({ active, payload }: {
  active?: boolean
  payload?: ReadonlyArray<{ payload: FilledRevenuePoint }>
}) {
  if (!active || !payload?.length) return null
  const entry = payload[0]?.payload
  if (!entry) return null
  const hasRevenue = entry.revenue > 0
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-[10px] font-extrabold tracking-[0.14em] text-slate-400 uppercase">
        {entry.chartLabel}
      </p>
      <p className={`mt-1 text-base font-extrabold ${hasRevenue ? 'text-slate-950' : 'text-slate-400'}`}>
        {hasRevenue ? formatNPRCompact(entry.revenue) : '—'}
      </p>
      <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
        {hasRevenue
          ? `${entry.booking_count} paid booking${entry.booking_count === 1 ? '' : 's'}`
          : 'No paid bookings in this bucket'}
      </p>
    </div>
  )
}

function EmptyChartState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 text-center sm:h-[320px]">
      <div className="flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
        <BarChart3 className="size-5 text-slate-400" />
      </div>
      <p className="mt-3 text-sm font-extrabold text-slate-700">{title}</p>
      <p className="mt-1 max-w-sm text-xs text-slate-500">{subtitle}</p>
    </div>
  )
}

function buildYTicks(ceiling: number): number[] {
  const step = niceStep(ceiling)
  const ticks: number[] = []
  for (let v = 0; v <= ceiling; v += step) ticks.push(v)
  return ticks
}

function niceStep(ceiling: number): number {
  if (ceiling <= 0) return 1
  const exponent = Math.floor(Math.log10(ceiling))
  const base = Math.pow(10, exponent)
  const ratio = ceiling / base
  if (ratio <= 2) return base / 2
  if (ratio <= 5) return base
  return base * 2
}

function niceCeil(value: number): number {
  if (value <= 0) return 1
  const step = niceStep(value)
  return Math.ceil(value / step) * step
}
