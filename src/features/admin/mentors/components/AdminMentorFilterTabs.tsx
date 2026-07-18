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
      className="flex flex-wrap gap-1 rounded-2xl bg-white p-1 shadow-sm"
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
              'flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-extrabold transition',
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
