'use client'

import { BriefcaseBusiness, GraduationCap } from 'lucide-react'

import { useFilters } from '@/features/filters/context/FilterContext'
import { CounselingType } from '@/features/filters/types/filter.types'
import { cn } from '@/lib/utils'

const COUNSELING_OPTIONS: {
  value: CounselingType
  label: string
  icon: typeof GraduationCap
}[] = [
  {
    value: 'academic',
    label: 'Academic counselling',
    icon: GraduationCap,
  },
  {
    value: 'professional',
    label: 'Professional coaching',
    icon: BriefcaseBusiness,
  },
]

export function ExploreMentorsHeader() {
  const { filters, updateFilter } = useFilters()

  return (
    <section className="px-5 pt-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="flex flex-col items-center gap-6 rounded-[24px] p-5 sm:p-6 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-headline)] text-4xl font-extrabold text-[#121c2a] md:text-[48px]">
            Explore <span className="text-[#0053db]">Expert Mentors</span>
          </h1>
          <p className="mt-4 max-w-[590px] text-base leading-8 font-medium text-[#5f6472]">
            Connect with world-class guides to navigate your academic journey or professional career
            path.
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label="Counselling type"
          className="grid w-full max-w-[380px] grid-cols-1 gap-2 rounded-2xl bg-[#edf3ff] p-2 shadow-[inset_0_0_0_1px_rgba(0,83,219,0.08)] sm:grid-cols-2"
        >
          {COUNSELING_OPTIONS.map((option) => {
            const Icon = option.icon
            const isSelected = filters.counselingType === option.value

            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => updateFilter('counselingType', option.value)}
                className={cn(
                  'flex h-[48px] items-center gap-3 rounded-xl px-4 py-3 text-left transition',
                  'focus-visible:ring-2 focus-visible:ring-[#0053db]/35 focus-visible:outline-none',
                  isSelected
                    ? 'bg-white text-[#121c2a] shadow-[0_10px_28px_rgba(18,28,42,0.08)]'
                    : 'text-[#434655] hover:bg-white/55'
                )}
              >
                <span
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-xl',
                    isSelected ? 'bg-[#0053db] text-white' : 'bg-white text-[#0053db]'
                  )}
                >
                  <Icon className="size-5" strokeWidth={2.5} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-extrabold">{option.label}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
