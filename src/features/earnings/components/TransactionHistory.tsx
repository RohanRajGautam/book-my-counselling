'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useMentorEarnings } from '@/features/mentor-dashboard/hooks/useMentorBookings'
import { MentorEarningRow } from '@/features/mentor-dashboard/types/mentor-dashboard.types'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Money fields arrive pre-formatted and server-quantized. Prefix only —
// never parseFloat and re-round.
function formatMoney(value: string): string {
  return `NPR ${value}`
}

function isZeroAmount(value: string): boolean {
  return /^0(?:\.0+)?$/.test(value)
}

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-300 text-emerald-900',
  'bg-amber-200 text-amber-900',
  'bg-rose-100 text-rose-700',
  'bg-purple-100 text-purple-700',
]

const PAGE_SIZE = 10
// 4 columns on desktop: date, mentee, topic/package (+optional promo detail),
// your earning.
const GRID_COLS = 'md:grid-cols-[100px_minmax(0,1fr)_minmax(160px,220px)_120px]'

function TransactionRow({ row, index }: { row: MentorEarningRow; index: number }) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length]
  const initials = getInitials(row.mentee.full_name)
  const date = formatDate(row.session_start)
  const topic = row.topic ?? row.package?.title ?? 'Session'
  const hasPromo = !isZeroAmount(row.discount_amount) || row.promo_code !== null
  const yourEarning = formatMoney(row.mentor_earning)

  return (
    <article
      className={`grid gap-3 border-b border-slate-100 px-4 py-5 last:border-b-0 sm:px-5 md:min-h-20 md:items-center md:gap-4 md:px-7 ${GRID_COLS}`}
    >
      <p className="text-sm leading-5 font-semibold text-slate-800 md:max-w-24">{date}</p>
      <div className="flex min-w-0 items-center gap-4">
        <span
          className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold ${color}`}
        >
          {initials}
        </span>
        <p className="font-headline truncate text-base leading-5 font-extrabold text-slate-950">
          {row.mentee.full_name}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 overflow-hidden">
        <span className="w-fit truncate rounded-full bg-blue-100 px-4 py-2 text-center text-xs leading-4 font-bold text-blue-900">
          {topic.length > 22 ? topic.slice(0, 22) + '…' : topic}
        </span>
        {hasPromo && (
          <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-amber-900 uppercase">
            Promo
          </span>
        )}
      </div>
      <p className="text-base font-extrabold text-slate-950 md:text-right">{yourEarning}</p>
    </article>
  )
}

export function TransactionHistory() {
  const [page, setPage] = useState(1)
  // Default view is paid + non-cancelled — rows sum to /me/stats.total_earnings.
  const { data, isLoading } = useMentorEarnings({ page, page_size: PAGE_SIZE })
  const rows = data?.items ?? []

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm sm:rounded-3xl">
      <div className="flex items-center justify-between gap-3 bg-[#f4f7ff] px-4 py-5 sm:px-7 sm:py-7">
        <h2 className="font-headline text-lg font-extrabold text-slate-950 sm:text-xl">
          Transaction History
        </h2>
        {data && <span className="text-sm font-semibold text-slate-500">{data.total} total</span>}
      </div>

      <div
        className={`hidden border-b border-slate-200 px-7 py-5 text-xs font-extrabold tracking-[0.14em] text-slate-600 uppercase md:grid ${GRID_COLS}`}
      >
        <span>Date</span>
        <span>Student Name</span>
        <span>Topic / Package</span>
        <span className="text-right">Your earning</span>
      </div>

      {isLoading ? (
        <div>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`grid animate-pulse gap-3 border-b border-slate-100 px-4 py-5 last:border-b-0 sm:px-5 md:min-h-20 md:items-center md:gap-4 md:px-7 ${GRID_COLS}`}
            >
              <div className="h-4 w-16 rounded-md bg-slate-100 md:max-w-24" />
              <div className="flex items-center gap-4">
                <div className="size-7 shrink-0 rounded-full bg-slate-100" />
                <div className="h-4 w-40 rounded-md bg-slate-100" />
              </div>
              <div className="h-6 w-32 rounded-full bg-slate-100" />
              <div className="ml-auto h-4 w-20 rounded-md bg-slate-100 md:ml-0" />
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="px-7 py-8 text-sm text-slate-500">No sessions yet.</p>
      ) : (
        <div>
          {rows.map((row, index) => (
            <TransactionRow key={row.booking_id} row={row} index={index} />
          ))}
        </div>
      )}

      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-center gap-3 border-t border-slate-100 px-7 py-5">
          <Button
            variant="outline"
            size="sm"
            disabled={!data.has_prev}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm font-semibold text-slate-600">
            {data.page} / {data.total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!data.has_next}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  )
}
