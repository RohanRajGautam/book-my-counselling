'use client'

import { cn } from '@/lib/utils'

import {
  ADMIN_EVENT_CREATE_TABS,
  type AdminEventCreateTabId,
} from '../../lib/events.constants'

interface AdminCreateEventTabsProps {
  value: AdminEventCreateTabId
  onChange: (next: AdminEventCreateTabId) => void
  /** Field-level errors keyed by dotted field path. Drives the red dot. */
  errorsBySection: Record<AdminEventCreateTabId, number>
}

export function AdminCreateEventTabs({
  value,
  onChange,
  errorsBySection,
}: AdminCreateEventTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Event sections"
      className="flex w-full max-w-full flex-nowrap gap-1 overflow-x-auto rounded-[22px] bg-slate-100 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {ADMIN_EVENT_CREATE_TABS.map((tab) => {
        const active = tab.id === value
        const errorCount = errorsBySection[tab.id] ?? 0
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
            <span>{tab.label}</span>
            {errorCount > 0 ? (
              <span
                aria-label={`${errorCount} issue${errorCount === 1 ? '' : 's'}`}
                className="ml-2 inline-grid size-4 place-items-center rounded-full bg-red-600 text-[9px] font-extrabold text-white"
              >
                {errorCount}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
