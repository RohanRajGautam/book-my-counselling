'use client'

import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

interface AdminCreateEventHeaderProps {
  isSubmitting: boolean
  onSubmit: () => void
  /** Total number of validation errors across every section. */
  errorCount: number
}

export function AdminCreateEventHeader({
  isSubmitting,
  onSubmit,
  errorCount,
}: AdminCreateEventHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-1 text-xs font-bold tracking-wide text-[#004ac6] uppercase hover:text-[#003fa8]"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          All events
        </Link>
        <h1 className="mt-2 font-headline text-2xl leading-tight font-extrabold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
          New event
        </h1>
        <p className="mt-1 text-sm leading-6 font-medium text-slate-500 sm:text-base sm:leading-7">
          Fill out each section, then publish — bookings open the moment the event goes live.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {errorCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 ring-1 ring-red-100">
            {errorCount} issue{errorCount === 1 ? '' : 's'}
          </span>
        ) : null}
        <Button
          type="button"
          size="sm"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="gap-1.5 rounded-[22px] bg-[#0755d8] px-5 py-6 font-bold text-white shadow-sm hover:bg-blue-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Publishing…
            </>
          ) : (
            'Publish event'
          )}
        </Button>
      </div>
    </header>
  )
}
