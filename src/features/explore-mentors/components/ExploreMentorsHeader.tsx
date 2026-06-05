'use client'

import { useFilters } from '@/features/filters/context/FilterContext'

export function ExploreMentorsHeader() {
  const { filters } = useFilters()
  const isAcademic = filters.counselingType === 'academic'

  return (
    <section className="px-5 pt-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="rounded-[24px] py-5">
        <div>
          <h1 className="font-[family-name:var(--font-headline)] text-[clamp(2.4rem,5.5vw,3rem)] leading-tight font-extrabold text-[#121c2a]">
            {isAcademic ? (
              <>
                Explore Academic <span className="text-[#0053db]">Counseller</span>
              </>
            ) : (
              <>
                Explore Professional <span className="text-[#0053db]">Coach</span>
              </>
            )}
          </h1>
          <p className="mt-4 text-base leading-8 font-medium text-[#5f6472]">
            {isAcademic
              ? 'Connect with mentors who can guide your academic choices, study path, and next steps.'
              : 'Connect with mentors who can guide your career growth, role transitions, and professional decisions.'}
          </p>
        </div>
      </div>
    </section>
  )
}
