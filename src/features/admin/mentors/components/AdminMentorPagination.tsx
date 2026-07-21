'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface AdminPaginationProps {
  page: number
  totalPages: number
  total?: number
  itemLabel: string
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

/**
 * Standard prev/next pagination row. Lives in the mentors folder for now
 * since the analytics dashboard doesn't paginate. If a second consumer
 * appears, this can be promoted to a shared `components/pagination/...`.
 */
export function AdminMentorPagination({
  page,
  totalPages,
  total,
  itemLabel,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: AdminPaginationProps) {
  if (totalPages <= 1) return null
  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <Button
        variant="outline"
        size="sm"
        className="rounded-xl"
        disabled={!hasPrev}
        onClick={onPrev}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </Button>
      <span className="text-sm font-semibold text-slate-600">
        {page} / {totalPages}
        {typeof total === 'number' ? ` · ${total} ${itemLabel}` : ''}
      </span>
      <Button
        variant="outline"
        size="sm"
        className="rounded-xl"
        disabled={!hasNext}
        onClick={onNext}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
