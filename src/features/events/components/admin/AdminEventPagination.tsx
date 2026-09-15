'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface AdminEventPaginationProps {
  page: number
  totalPages: number
  total: number
  itemLabel: string
  hasPrev: boolean
  hasNext: boolean
  onPrev: () => void
  onNext: () => void
}

export function AdminEventPagination({
  page,
  totalPages,
  total,
  itemLabel,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}: AdminEventPaginationProps) {
  if (totalPages <= 1) return null
  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <Button
        variant="outline"
        size="sm"
        className="rounded-[22px]"
        disabled={!hasPrev}
        onClick={onPrev}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </Button>
      <span className="text-sm font-semibold text-slate-600">
        {page} / {totalPages} · {total.toLocaleString('en-US')} {itemLabel}
      </span>
      <Button
        variant="outline"
        size="sm"
        className="rounded-[22px]"
        disabled={!hasNext}
        onClick={onNext}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
