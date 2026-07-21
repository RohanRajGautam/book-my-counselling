'use client'

import { cn } from '@/lib/utils'
import { REFUND_TABS, type RefundTab } from '../lib/refundBadges'

export interface AdminRefundTabFilterProps {
  value: RefundTab['id']
  onChange: (next: RefundTab['id']) => void
}

export function AdminRefundTabFilter({ value, onChange }: AdminRefundTabFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Refund status"
      className="flex flex-wrap gap-1 rounded-2xl bg-white p-1 shadow-sm"
    >
      {REFUND_TABS.map((tab) => {
        const active = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              'min-w-[5.5rem] flex-1 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-extrabold transition',
              active
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800',
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
