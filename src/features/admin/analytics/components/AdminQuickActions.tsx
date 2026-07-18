'use client'

import Link from 'next/link'
import { ArrowRight, ListChecks, Plus, ShieldAlert } from 'lucide-react'

interface QuickAction {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  iconBg: string
  iconColor: string
}

const ACTIONS: QuickAction[] = [
  {
    href: '/admin/mentors?tab=pending',
    icon: <Plus className="size-5" />,
    title: 'Review applications',
    description: 'Approve new mentors awaiting verification.',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-700',
  },
  {
    href: '/admin/refunds?tab=requested',
    icon: <ShieldAlert className="size-5" />,
    title: 'Process refunds',
    description: 'Resolve refund requests waiting on you.',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-700',
  },
  {
    href: '/admin/reminders',
    icon: <ListChecks className="size-5" />,
    title: 'Nudge mentors',
    description: 'Send availability reminders in one click.',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-700',
  },
]

export function AdminQuickActions() {
  return (
    <section
      aria-labelledby="admin-quick-actions-heading"
      className="rounded-2xl bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="admin-quick-actions-heading"
            className="font-headline text-base font-extrabold text-slate-950 sm:text-lg"
          >
            Quick Actions
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Common admin tasks, one click away.
          </p>
        </div>
      </div>
      <ul className="mt-5 space-y-3">
        {ACTIONS.map((action) => (
          <li key={action.href}>
            <Link
              href={action.href}
              className="group/action flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-[0_6px_18px_rgba(7,85,216,0.08)]"
            >
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${action.iconBg} ${action.iconColor}`}
              >
                {action.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-slate-950">{action.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{action.description}</p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-slate-300 transition group-hover/action:translate-x-0.5 group-hover/action:text-blue-600" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
