'use client'

import { useState } from 'react'
import { Loader2, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { RefundRequest } from '../../types/admin.types'
import { useMarkRefundProcessed } from '../hooks/useAdminRefunds'
import { AdminRefundModalShell } from './AdminRefundModalShell'

export interface AdminProcessRefundModalProps {
  refund: RefundRequest
  onClose: () => void
}

export function AdminProcessRefundModal({
  refund,
  onClose,
}: AdminProcessRefundModalProps) {
  const [reference, setReference] = useState('')
  const [notes, setNotes] = useState('')
  const { mutate, isPending } = useMarkRefundProcessed()
  const canSubmit = reference.trim().length > 0 && !isPending

  const handleSubmit = () => {
    if (!canSubmit) return
    mutate(
      { id: refund.id, reference: reference.trim(), notes: notes.trim() || undefined },
      {
        onSuccess: () => {
          toast.success('Refund marked as processed. Mentee notified.')
          onClose()
        },
        onError: () => toast.error('Failed to mark refund processed.'),
      },
    )
  }

  return (
    <AdminRefundModalShell title="Mark refund processed" onClose={onClose}>
      <p className="text-sm text-slate-500">
        After you&apos;ve reversed the payment in Fonepay&apos;s merchant
        portal, paste the Fonepay reference below. The booking will flip to{' '}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">refunded</code>{' '}
        and the mentee will receive a completion email.
      </p>
      <label className="mt-4 block">
        <span className="text-xs font-extrabold tracking-wide text-slate-500 uppercase">
          Fonepay refund reference
        </span>
        <input
          type="text"
          required
          autoFocus
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="e.g. FNP-REF-123456"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          disabled={isPending}
        />
      </label>
      <label className="mt-3 block">
        <span className="text-xs font-extrabold tracking-wide text-slate-500 uppercase">
          Internal note (optional)
        </span>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything to record about this refund"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          disabled={isPending}
        />
      </label>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RotateCcw className="size-4" />
          )}
          Mark processed
        </Button>
      </div>
    </AdminRefundModalShell>
  )
}
