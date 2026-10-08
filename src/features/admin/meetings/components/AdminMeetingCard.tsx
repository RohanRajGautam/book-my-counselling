'use client'

import { Copy, ExternalLink, Video, X as XIcon } from 'lucide-react'

import { AdminMeetingRow } from '@/features/meetings/types/meetings.types'
import { isMeetingMissing } from '@/features/meetings/types/meetings.types'
import { formatDateTime } from '@/features/admin/lib/format'

export function AdminMeetingCard({ row }: { row: AdminMeetingRow }) {
  const missing = isMeetingMissing(row)
  const handleCopy = async () => {
    if (!row.meeting_link) return
    try {
      await navigator.clipboard.writeText(row.meeting_link)
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
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold text-blue-700 uppercase">
              {row.status}
            </span>
            {row.payment_status === 'paid' ? (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 uppercase">
                Paid
              </span>
            ) : null}
            {missing ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-extrabold text-rose-700 uppercase">
                <XIcon className="size-3" />
                Missing link
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
          <p className="mt-2 font-mono text-[10px] uppercase text-slate-300">ID {row.id}</p>
        </div>

        {row.meeting_link && row.status !== 'cancelled' ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2 rounded-xl bg-blue-50 p-2 ring-1 ring-blue-100">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-[#0755d8] ring-1 ring-blue-100">
              <Video className="size-3.5" />
            </span>
            <button
              type="button"
              onClick={handleCopy}
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
      </div>
    </article>
  )
}