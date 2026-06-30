'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowUpRight, Sparkles, X } from 'lucide-react'

import {
  COACH_FOR_FRESHERS_VARIETIES,
  type CoachForFreshersVarietySlug,
} from '@/features/coach-for-freshers/types/coach-for-freshers.types'

type SearchCrossLinkBannerProps = {
  targetCategory: 'academic' | 'cff'
  count: number
  query: string
  cffVariety?: CoachForFreshersVarietySlug
}

export function SearchCrossLinkBanner({
  targetCategory,
  count,
  query,
  cffVariety,
}: SearchCrossLinkBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  if (!query.trim()) return null

  const targetHref =
    targetCategory === 'academic'
      ? `/academic-counsellor?q=${encodeURIComponent(query)}`
      : `/coach-for-freshers/${cffVariety ?? 'career-clarity-roadmap'}?q=${encodeURIComponent(query)}`

  const targetLabel =
    targetCategory === 'academic' ? 'academic counsellors' : 'coaches for freshers'

  const varietyLabel =
    targetCategory === 'cff' && cffVariety
      ? COACH_FOR_FRESHERS_VARIETIES[cffVariety].navLabel
      : null

  return (
    <div
      role="status"
      className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#c9d7f4] bg-gradient-to-br from-[#eff4ff] via-white to-white p-3.5 shadow-[0_8px_20px_rgba(0,74,198,0.08)] sm:flex-nowrap"
    >
      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#004ac6] to-[#2563eb] text-white shadow-[0_8px_18px_rgba(0,74,198,0.28)]">
        <Sparkles className="size-5" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1 text-sm leading-6">
        <span className="font-extrabold text-[#121c2a]">{count}</span>
        <span className="text-[#434655]">
          {' '}
          {targetLabel} also match{' '}
          <span className="font-semibold text-[#27313f]">“{query}”</span>
          {varietyLabel ? (
            <span className="text-[#737686]"> · {varietyLabel}</span>
          ) : null}
        </span>
      </div>

      <Link
        href={targetHref}
        className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-[#004ac6] ring-1 ring-[#c9d7f4] transition-colors hover:bg-[#dee9fc]"
      >
        View them
        <ArrowUpRight className="size-3.5" aria-hidden="true" />
      </Link>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="grid size-8 shrink-0 place-items-center rounded-full text-[#737686] transition-colors hover:bg-white hover:text-[#27313f]"
        aria-label="Dismiss"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}
