'use client'

import { cn } from '@/lib/utils'

import {
  ADMIN_EVENT_DETAIL_TABS,
  type AdminEventDetailTabId,
} from '../../lib/events.constants'

interface AdminEventDetailTabsProps {
  value: AdminEventDetailTabId
  onChange: (next: AdminEventDetailTabId) => void
}

export function AdminEventDetailTabs({ value, onChange }: AdminEventDetailTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Event sections"
      className="flex w-full max-w-full flex-nowrap gap-1 overflow-x-auto rounded-[22px] bg-slate-100 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {ADMIN_EVENT_DETAIL_TABS.map((tab) => {
        const active = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              'shrink-0 whitespace-nowrap rounded-[22px] px-4 py-1.5 text-xs font-extrabold tracking-wide uppercase transition',
              active
                ? 'bg-white text-slate-950 shadow-sm ring-1 ring-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
