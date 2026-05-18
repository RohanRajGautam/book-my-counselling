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
    label: 'Academic Counselling',
    icon: GraduationCap,
  },
  {
    value: 'professional',
    label: 'Professional Coaching',
    icon: BriefcaseBusiness,
  },
]

export function ExploreMentorsHeader() {
  const { filters, updateFilter } = useFilters()

  return (
    <section className="px-5 pt-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="flex flex-col gap-5 rounded-[24px] py-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-headline)] text-4xl font-extrabold text-[#121c2a] md:text-[45px]">
            Explore <span className="text-[#0053db]">Expert Mentors</span>
          </h1>
          <p className="mt-4 max-w-[600px] text-base leading-8 font-medium text-[#5f6472]">
            Connect with world-class guides to navigate your academic journey or professional career
            path.
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label="Counselling type"
          className="grid w-full max-w-[330px] grid-cols-2 gap-1.5 rounded-xl bg-[#edf3ff] p-1.5 shadow-[inset_0_0_0_1px_rgba(0,83,219,0.08)]"
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
                  'flex min-h-10 items-center gap-2 rounded-lg px-2.5 py-2 text-left transition',
                  'focus-visible:ring-2 focus-visible:ring-[#0053db]/35 focus-visible:outline-none',
                  isSelected
                    ? 'bg-white text-[#121c2a] shadow-[0_8px_20px_rgba(18,28,42,0.07)]'
                    : 'text-[#434655] hover:bg-white/55'
                )}
              >
                <span
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-lg',
                    isSelected ? 'bg-[#0053db] text-white' : 'bg-white text-[#0053db]'
                  )}
                >
                  <Icon className="size-4" strokeWidth={2.5} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs leading-tight font-extrabold">{option.label}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
