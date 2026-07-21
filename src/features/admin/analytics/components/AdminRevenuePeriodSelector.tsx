'use client'

import { cn } from '@/lib/utils'
import type { RevenuePeriod } from '../../types/admin.types'

interface PeriodOption {
  id: RevenuePeriod
  label: string
}

const PERIOD_OPTIONS: readonly PeriodOption[] = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly' },
  { id: 'custom', label: 'Custom' },
] as const

export interface AdminRevenuePeriodSelectorProps {
  value: RevenuePeriod
  onChange: (next: RevenuePeriod) => void
  /** Optional pill that renders in the same row (e.g. the custom date inputs). */
  trailing?: React.ReactNode
}

/**
 * Pill-tab segmented control for the revenue chart's period filter.
 * Mirrors the picker pattern from the mentor-side earnings tab.
 */
export function AdminRevenuePeriodSelector({
  value,
  onChange,
  trailing,
}: AdminRevenuePeriodSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        role="tablist"
        aria-label="Revenue period"
        className="inline-flex rounded-2xl bg-slate-100 p-1"
      >
        {PERIOD_OPTIONS.map((opt) => {
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
      {trailing}
    </div>
  )
}
