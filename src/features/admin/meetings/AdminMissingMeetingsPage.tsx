'use client'

import { useState } from 'react'
import { Copy, ExternalLink, Inbox, Loader2, RotateCw, X as XIcon } from 'lucide-react'
import { toast } from 'sonner'

import { AdminPageHeader } from '../layout/AdminPageHeader'
import { AdminMentorPagination } from '../mentors/components/AdminMentorPagination'
import {
  useAdminMissingMeetings,
  useRetryAdminMeeting,
} from '@/features/meetings/hooks/useMeetings'
import { AdminMeetingRow } from '@/features/meetings/types/meetings.types'
import { formatDateTime } from '@/features/admin/lib/format'
import { Button } from '@/components/ui/button'

function MissingMeetingCard({
  row,
  isRetrying,
  onRetry,
}: {
  row: AdminMeetingRow
  isRetrying: boolean
  onRetry: (bookingId: string) => void
}) {
  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  }

  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-headline text-base font-extrabold text-slate-950">
              {row.topic || 'Untitled session'}
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-extrabold text-rose-700 uppercase ring-1 ring-rose-100">
              <XIcon className="size-3" />
              Missing link
            </span>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold text-blue-700 uppercase">
              {row.status}
            </span>
            {row.payment_status === 'paid' ? (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 uppercase">
                Paid
              </span>
            ) : null}
            {row.meeting_attempts > 0 ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-600 uppercase">
                {row.meeting_attempts} attempts
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-slate-700">
            <span className="font-bold">{row.mentee_name || '(no name)'}</span>{' '}
            <span className="text-slate-400">·</span>{' '}
            <a
              href={`mailto:${row.mentee_email}`}
              className="text-blue-600 hover:underline"
            >
              {row.mentee_email}
            </a>
            <span className="text-slate-400"> with </span>
            <span className="font-bold">{row.mentor_name}</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">{formatDateTime(row.session_start)}</p>
          {row.meeting_error ? (
            <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700 ring-1 ring-rose-100">
              Last error: <span className="font-mono">{row.meeting_error}</span>
            </p>
          ) : null}
          {/* Defensive: if a retry has just landed and the row is still in
              the queue briefly, surface the new link so the admin can share
              it manually. */}
          {row.meeting_link ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-blue-50 p-2 ring-1 ring-blue-100">
              <button
                type="button"
                onClick={() => handleCopy(row.meeting_link!)}
                className="flex min-w-0 items-center gap-2 truncate text-left font-mono text-xs font-semibold text-slate-800"
                title="Copy meeting link"
              >
                <span className="min-w-0 truncate">{row.meeting_link}</span>
                <Copy className="size-3 shrink-0 text-blue-500" />
              </button>
              <a
                href={row.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center gap-1 rounded-lg bg-blue-600 px-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                Open
                <ExternalLink className="size-3" />
              </a>
            </div>
          ) : null}
          <p className="mt-2 font-mono text-[10px] uppercase text-slate-300">ID {row.id}</p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 rounded-xl border-blue-200 text-[#0755d8] hover:bg-blue-50"
            onClick={() => onRetry(row.id)}
            disabled={isRetrying}
          >
            {isRetrying ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RotateCw className="size-3.5" />
            )}
            Retry meeting
          </Button>
        </div>
      </div>
    </article>
  )
}

function MissingMeetingSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-5 w-48 rounded-md bg-slate-100" />
            <div className="h-4 w-20 rounded-full bg-slate-100" />
            <div className="h-4 w-16 rounded-full bg-slate-100" />
          </div>
          <div className="h-3 w-40 rounded-md bg-slate-100" />
          <div className="h-3 w-32 rounded-md bg-slate-100" />
        </div>
        <div className="h-8 w-32 rounded-xl bg-slate-100" />
      </div>
    </div>
  )
}

export function AdminMissingMeetingsPage() {
  const [page, setPage] = useState(1)
  const [retryingId, setRetryingId] = useState<string | null>(null)
  const { data, isLoading, isFetching } = useAdminMissingMeetings({ page, page_size: 50 })
  const retryMutation = useRetryAdminMeeting()
  const rows = data?.items ?? []

  const handleRetry = async (bookingId: string) => {
    setRetryingId(bookingId)
    try {
      const result = await retryMutation.mutateAsync(bookingId)
      // Server tells us whether it actually created a link. Surface the
      // human message verbatim — it's already friendly ("Meeting already
      // exists — no retry needed." / "Meeting link created.").
      toast.success(result.message)
    } catch {
      toast.error('Failed to retry meeting. Please try again.')
    } finally {
      setRetryingId(null)
    }
  }

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Missing meeting links"
          subtitle="Paid bookings that never got a Google Meet link — usually a Google outage during the booking flow. Hit Retry to re-attempt."
          action={
            <a
              href="/admin/meetings"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-blue-50 px-3 text-xs font-bold text-blue-700 ring-1 ring-blue-100 hover:bg-blue-100"
            >
              ← All meetings
            </a>
          }
        />

        <section
          aria-label="Missing meeting links list"
          className={isFetching && !isLoading ? 'opacity-70 transition-opacity' : ''}
        >
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <MissingMeetingSkeleton key={i} />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <Inbox className="mx-auto mb-3 size-8 text-slate-300" />
              <p className="text-sm font-semibold text-slate-400">
                Queue is empty — every paid session has its link.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((row) => (
                <MissingMeetingCard
                  key={row.id}
                  row={row}
                  isRetrying={retryingId === row.id}
                  onRetry={handleRetry}
                />
              ))}
            </div>
          )}
        </section>

        {data ? (
          <AdminMentorPagination
            page={data.page}
            totalPages={data.total_pages}
            total={data.total}
            itemLabel="missing meetings"
            hasPrev={data.has_prev}
            hasNext={data.has_next}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => p + 1)}
          />
        ) : null}
      </div>
    </div>
  )
}