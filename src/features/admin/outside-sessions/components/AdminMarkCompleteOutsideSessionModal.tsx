'use client'

import { useEffect } from 'react'
import { Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

import { OutsideSessionRow } from '../../types/admin.types'
import { formatDateTime } from '../../lib/format'
import { Button } from '@/components/ui/button'
import { useCompleteOutsideSession } from '../hooks/useOutsideSessions'

export interface AdminMarkCompleteOutsideSessionModalProps {
  row: OutsideSessionRow | null
  onClose: () => void
  onCompleted?: (row: OutsideSessionRow) => void
}

export function AdminMarkCompleteOutsideSessionModal({
  row,
  onClose,
  onCompleted,
}: AdminMarkCompleteOutsideSessionModalProps) {
  const { mutate, isPending } = useCompleteOutsideSession()

  useEffect(() => {
    if (!row) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [row, onClose])

  if (!row) return null

  const handleSubmit = () => {
    mutate(row.id, {
      onSuccess: (updated) => {
        toast.success('Marked complete. Review email sent.')
        onCompleted?.(updated)
        onClose()
      },
      onError: () => {
        toast.error('Failed to mark complete. Please try again.')
      },
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-3 py-6 sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mark-complete-outside-session-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div className="relative z-[1] flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
          <h2
            id="mark-complete-outside-session-title"
            className="font-headline text-lg font-extrabold tracking-tight text-slate-950 sm:text-xl"
          >
            Mark as completed?
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="space-y-3 px-4 py-4 sm:px-6">
          <p className="text-sm leading-6 text-slate-700">
            We&apos;ll email{' '}
            <span className="font-bold text-slate-900">{row.mentee_name}</span>{' '}
            a review link and bump their mentor&apos;s total_sessions by 1.
          </p>
          <dl className="grid gap-2 rounded-xl bg-slate-50 p-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <dt className="shrink-0 text-xs font-bold text-slate-500 uppercase">
                Mentor
              </dt>
              <dd className="min-w-0 text-right text-sm font-bold text-slate-900">
                {row.mentor_name}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="shrink-0 text-xs font-bold text-slate-500 uppercase">
                Mentee
              </dt>
              <dd className="min-w-0 text-right text-sm font-bold text-slate-900">
                {row.mentee_email}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="shrink-0 text-xs font-bold text-slate-500 uppercase">
                Session
              </dt>
              <dd className="min-w-0 text-right text-sm font-bold text-slate-900">
                {formatDateTime(row.session_start)}
              </dd>
            </div>
          </dl>
          <p className="text-[11px] leading-5 text-slate-500">
            The PATCH endpoint is idempotent — calling it on an
            already-completed session is a safe no-op.
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 bg-white px-4 pt-3 pb-3 sm:px-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="gap-1.5 rounded-xl bg-[#0755d8] text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" /> Marking…
              </>
            ) : (
              'Mark complete'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}