'use client'

import { cn } from '@/lib/utils'
import {
  ADMIN_MENTOR_TABS,
  type AdminMentorTabId,
} from '../lib/filterConfig'

export interface AdminMentorFilterTabsProps {
  value: AdminMentorTabId
  onChange: (next: AdminMentorTabId) => void
}

export function AdminMentorFilterTabs({ value, onChange }: AdminMentorFilterTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Mentor verification status"
      className="inline-flex flex-wrap rounded-full bg-slate-100 p-1"
    >
      {ADMIN_MENTOR_TABS.map((tab) => {
        const active = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              'rounded-full px-4 py-1.5 text-xs font-extrabold transition',
              active
                ? 'bg-white text-slate-950 shadow-sm'
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