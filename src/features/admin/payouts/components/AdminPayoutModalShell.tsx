'use client'

import { X } from 'lucide-react'

export interface AdminPayoutModalShellProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  onClose: () => void
  /**
   * Modal width. The default is the small refund-style card; detail
   * and create modals request `wide` so line-item tables fit.
   */
  size?: 'default' | 'wide'
  children: React.ReactNode
  /** Disables the close button + ESC dismissal — used while submitting. */
  busy?: boolean
}

/**
 * Centered white card with a slate backdrop. Mirrors `AdminRefundModalShell`
 * but adds a `wide` size and an optional subtitle/header section so the
 * detail and create modals can show payout metadata above the form body.
 */
export function AdminPayoutModalShell({
  title,
  subtitle,
  onClose,
  size = 'default',
  children,
  busy,
}: AdminPayoutModalShellProps) {
  const maxWidth = size === 'wide' ? 'max-w-3xl' : 'max-w-md'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <div className={`flex max-h-[90vh] w-full ${maxWidth} flex-col rounded-2xl bg-white shadow-2xl`}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="font-headline text-lg font-extrabold text-slate-950">{title}</h2>
            {subtitle ? (
              <div className="mt-1 text-sm font-medium text-slate-500">{subtitle}</div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="shrink-0 text-slate-400 hover:text-slate-700 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  )
}