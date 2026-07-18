'use client'

import { X } from 'lucide-react'

export interface AdminRefundModalShellProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

/**
 * Centered white card with a backdrop. Shared between reject/processed modals
 * so visual treatment stays consistent across the refunds page.
 */
export function AdminRefundModalShell({
  title,
  onClose,
  children,
}: AdminRefundModalShellProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-headline text-lg font-extrabold text-slate-950">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
