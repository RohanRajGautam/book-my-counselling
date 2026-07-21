'use client'

import { useState } from 'react'
import { BarChart3, Loader2, TrendingUp } from 'lucide-react'

import { FilledRevenuePoint } from '../lib/dateRanges'
import { formatNPRCompact } from '../../lib/format'

export interface AdminRevenueChartProps {
  data: FilledRevenuePoint[] | undefined
  isLoading: boolean
  totalRevenue: number
  totalBookings: number
}

const CHART_HEIGHT = 'h-[220px] sm:h-[280px] lg:h-[320px]'

export function AdminRevenueChart({
  data,
  isLoading,
  totalRevenue,
  totalBookings,
}: AdminRevenueChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (isLoading) {
    return (
      <div className={`flex ${CHART_HEIGHT} items-center justify-center`}>
        <Loader2 className="size-7 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return <EmptyChartState />
  }

  const hasRevenue = data.some((d) => d.revenue > 0)
  const chartTotal = data.reduce((sum, d) => sum + d.revenue, 0)
  const maxRevenue = data.reduce((m, d) => Math.max(m, d.revenue), 0)
  const yMax = niceCeil(Math.max(maxRevenue, 1))
  const peakIndex = data.reduce(
    (peakIdx, d, i) => (d.revenue > data[peakIdx]!.revenue ? i : peakIdx),
    0,
  )

  return (
    <div className="space-y-3 sm:space-y-4">
      <ChartKpiRow
        totalRevenue={totalRevenue}
        totalBookings={totalBookings}
        peakLabel={hasRevenue ? data[peakIndex]?.chartLabel : null}
        peakValue={hasRevenue ? data[peakIndex]?.revenue ?? 0 : 0}
      />

      <div className="flex flex-col gap-2 sm:gap-3">
        <div className="flex items-stretch gap-2 sm:gap-3">
          <div className="hidden w-12 flex-col justify-between pt-1 text-right text-[10px] font-semibold text-slate-400 sm:flex sm:w-16">
            <span>{formatNPRCompact(yMax)}</span>
            <span>{formatNPRCompact(yMax / 2)}</span>
            <span>NPR 0</span>
          </div>

          <div className="relative min-w-0 flex-1">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex flex-col justify-between"
            >
              <div className="border-t border-dashed border-slate-200" />
              <div className="border-t border-dashed border-slate-200" />
              <div className="border-t border-slate-200" />
            </div>

            <div
              className={`relative flex ${CHART_HEIGHT} items-end gap-1 pb-1 sm:gap-1.5`}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {data.map((d, i) => {
                const heightPercent = yMax > 0 ? (d.revenue / yMax) * 100 : 0
                const isHovered = hoveredIndex === i
                const isDimmed = hoveredIndex !== null && !isHovered
                const isPeak = hasRevenue && i === peakIndex
                return (
                  <div
                    key={d.bucketStart}
                    className="group relative flex h-full min-w-0 flex-1 cursor-pointer flex-col justify-end"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onFocus={() => setHoveredIndex(i)}
                    onBlur={() => setHoveredIndex(null)}
                    onClick={() => setHoveredIndex((cur) => (cur === i ? null : i))}
                    tabIndex={0}
                    role="button"
                    aria-label={`${d.chartLabel}: ${d.booking_count} paid bookings`}
                  >
                    <div
                      className="bar-fill w-full rounded-t-md transition-[opacity,transform,filter] duration-200 ease-out"
                      style={{
                        height: `${heightPercent}%`,
                        opacity: isDimmed ? 0.35 : 1,
                        transform: isHovered ? 'scaleY(1.04)' : 'scaleY(1)',
                        transformOrigin: 'bottom',
                        filter: isHovered ? 'brightness(1.08)' : 'none',
                        animationDelay: `${i * 35}ms`,
                      }}
                    >
                      <div
                        className={`h-full w-full rounded-t-md ${
                          isPeak ? 'bg-blue-600' : 'bg-blue-500'
                        } ${isHovered || isPeak ? 'shadow-[0_4px_14px_-4px_rgba(37,99,235,0.5)]' : ''}`}
                      />
                    </div>
                    {isHovered ? (
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2">
                        <ChartTooltip entry={d} chartTotal={chartTotal} />
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3">
          <div className="hidden w-12 sm:block sm:w-16" aria-hidden />
          <div className="flex min-w-0 flex-1 gap-1 sm:gap-1.5">
            {data.map((d) => (
              <div
                key={d.bucketStart}
                className="min-w-0 flex-1 truncate text-center text-[10px] font-semibold text-slate-500 sm:text-[11px]"
              >
                {d.chartLabel}
              </div>
            ))}
          </div>
        </div>
      </div>

      {!hasRevenue ? (
        <p className="text-center text-xs font-medium text-slate-400">
          No paid bookings in this range yet — start earning and the trend line will fill in.
        </p>
      ) : null}

      <style jsx>{`
        @keyframes barRise {
          from {
            transform: scaleY(0);
            opacity: 0;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }
        .bar-fill {
          animation: barRise 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
          transform-origin: bottom;
        }
      `}</style>
    </div>
  )
}

function ChartKpiRow({
  totalRevenue,
  totalBookings,
  peakLabel,
  peakValue,
}: {
  totalRevenue: number
  totalBookings: number
  peakLabel: string | null | undefined
  peakValue: number
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
      <KpiCell
        label="Period revenue"
        value={formatNPRCompact(totalRevenue)}
        tone="blue"
      />
      <KpiCell
        label="Paid bookings"
        value={totalBookings.toLocaleString('en-US')}
        tone="emerald"
      />
      <KpiCell
        label={peakLabel ? `Best · ${peakLabel}` : 'Best bucket'}
        value={peakLabel ? formatNPRCompact(peakValue) : '—'}
        tone="amber"
        icon={peakLabel ? <TrendingUp className="size-3" /> : null}
      />
    </div>
  )
}

function KpiCell({
  label,
  value,
  tone,
  icon,
}: {
  label: string
  value: string
  tone: 'blue' | 'emerald' | 'amber'
  icon?: React.ReactNode
}) {
  const toneClasses = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-100 bg-amber-50 text-amber-700',
  }[tone]

  return (
    <div
      className={`flex min-w-0 flex-col gap-0.5 rounded-lg border px-2 py-2 sm:gap-1 sm:rounded-xl sm:px-3.5 sm:py-2.5 ${toneClasses}`}
    >
      <span className="inline-flex items-center gap-1 truncate text-[9px] font-extrabold tracking-[0.08em] uppercase sm:text-[10px] sm:tracking-[0.1em]">
        {icon}
        {label}
      </span>
      <span className="truncate text-sm font-extrabold text-slate-950 sm:text-base">
        {value}
      </span>
    </div>
  )
}

function ChartTooltip({
  entry,
  chartTotal,
}: {
  entry: FilledRevenuePoint
  chartTotal: number
}) {
  const hasRevenue = entry.revenue > 0
  const percent =
    hasRevenue && chartTotal > 0 ? (entry.revenue / chartTotal) * 100 : 0
  return (
    <div className="max-w-[calc(100vw-2rem)] min-w-[160px] rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl ring-1 ring-slate-900/5 sm:min-w-[180px] sm:p-3">
      <p className="text-[9px] font-extrabold tracking-[0.12em] text-slate-400 uppercase sm:text-[10px] sm:tracking-[0.14em]">
        {entry.chartLabel}
      </p>
      <p
        className={`mt-0.5 text-base font-extrabold sm:mt-1 sm:text-lg ${
          hasRevenue ? 'text-slate-950' : 'text-slate-400'
        }`}
      >
        {hasRevenue ? formatNPRCompact(entry.revenue) : '—'}
      </p>
      <p className="mt-0.5 text-[10px] font-semibold text-slate-500 sm:text-[11px]">
        {hasRevenue
          ? `${entry.booking_count} paid booking${entry.booking_count === 1 ? '' : 's'}`
          : 'No paid bookings in this bucket'}
      </p>
      {hasRevenue && percent > 0 ? (
        <div className="mt-1.5 flex items-center gap-1.5 sm:mt-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>
          <span className="text-[9px] font-bold text-slate-500 tabular-nums sm:text-[10px]">
            {percent.toFixed(1)}%
          </span>
        </div>
      ) : null}
    </div>
  )
}

function EmptyChartState() {
  return (
    <div className="flex h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 text-center sm:h-[280px] lg:h-[320px]">
      <div className="flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
        <BarChart3 className="size-5 text-slate-400" />
      </div>
      <p className="mt-3 text-sm font-extrabold text-slate-700">No revenue data</p>
      <p className="mt-1 max-w-sm text-xs text-slate-500">
        Try a different date range or check back after the next paid booking.
      </p>
    </div>
  )
}

function niceCeil(value: number): number {
  if (value <= 0) return 1
  return Math.ceil(value / niceStep(value)) * niceStep(value)
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
