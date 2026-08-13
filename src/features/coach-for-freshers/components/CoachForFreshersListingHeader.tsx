'use client'

import type { CoachForFreshersVariety } from '../types/coach-for-freshers.types'

import { useCoachForFreshersFilters } from '../context/CoachForFreshersFiltersContext'
import { useCoachForFreshers } from '../hooks/useCoachForFreshers'

export function CoachForFreshersListingHeader({ variety }: { variety: CoachForFreshersVariety }) {
  const { filters, currentPage } = useCoachForFreshersFilters()
  const { data } = useCoachForFreshers(variety, filters, currentPage)

  const total = data?.total ?? 0
  const shown = data?.items?.length ?? 0
  const ready = total > 0

  const words = variety.title.split(' ')
  const lastWord = words.at(-1) ?? variety.title
  const firstWords = words.length > 1 ? words.slice(0, -1).join(' ') : ''

  return (
    <section className="mt-8 bg-[#f8f9ff] px-6 pt-6 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div>
          <h1 className="font-[family-name:var(--font-headline)] text-[clamp(2.25rem,5vw,3rem)] leading-[1.05] font-extrabold text-[var(--foreground)]">
            {firstWords}
            {firstWords && ' '}
            <span className="text-[var(--brand-blue)]">{lastWord}</span>
          </h1>
          <p className="my-4 text-base leading-7 font-medium text-[var(--color-on-surface-variant)] sm:leading-8">
            {variety.subtitle}
          </p>
        </div>
        <div className="hidden shrink-0 self-start sm:self-start lg:inline-flex">
          <div className="inline-flex items-baseline gap-2 rounded-[24px] border border-[#c9d7f4] bg-white px-4 py-2.5 shadow-[0_10px_30px_-12px_rgba(18,28,42,0.12)]">
            <span className="font-[family-name:var(--font-headline)] text-xl leading-none font-extrabold text-[#004ac6]">
              {ready ? shown : '—'}
            </span>
            <span className="text-[11px] leading-none font-semibold tracking-[0.08em] text-[#737686] uppercase">
              of {ready ? total : '—'} mentors
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
