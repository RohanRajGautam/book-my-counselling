'use client'

import { useState } from 'react'
import { Loader2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { AdminRefundModalShell } from './AdminRefundModalShell'

export interface AdminRejectRefundModalProps {
  onClose: () => void
  onSubmit: (notes: string) => void
  submitting: boolean
}

export function AdminRejectRefundModal({
  onClose,
  onSubmit,
  submitting,
}: AdminRejectRefundModalProps) {
  const [notes, setNotes] = useState('')

  return (
    <AdminRefundModalShell title="Reject refund" onClose={onClose}>
      <p className="text-sm text-slate-500">
        The mentee will be notified by email. A short reason helps reduce
        follow-up support tickets.
      </p>
      <textarea
        className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        rows={3}
        placeholder="Reason (will be shown to mentee, optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={submitting}
      />
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          className="gap-1.5 bg-red-600 text-white hover:bg-red-700"
          onClick={() => onSubmit(notes.trim())}
          disabled={submitting}
        >
          {submitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <X className="size-4" />
          )}
          Reject refund
        </Button>
      </div>
    </AdminRefundModalShell>
  )
}
