'use client'

import type { StudyAbroadCountry } from '@/features/study-abroad/types/study-abroad.types'
import { STUDY_ABROAD_COUNTRIES } from '@/features/study-abroad/lib/study-abroad.constants'

type StudyAbroadSidebarProps = {
  selectedCountries: StudyAbroadCountry[]
  onCountryToggle: (country: StudyAbroadCountry) => void
  onClear: () => void
}

export function StudyAbroadSidebar({
  selectedCountries,
  onCountryToggle,
  onClear,
}: StudyAbroadSidebarProps) {
  return (
    <aside className="h-full border-r border-gray-200 px-4 py-8 lg:sticky lg:top-[73px] lg:min-h-[calc(100vh-73px)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        {selectedCountries.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-[#0053db] shadow-sm ring-1 ring-[#dfe7f5] ring-inset"
          >
            Clear
          </button>
        )}
      </div>

      <section>
        <h3 className="mb-4 text-[11px] font-extrabold tracking-wider text-[#434655] uppercase">
          Destination country
        </h3>
        <div className="space-y-3">
          {STUDY_ABROAD_COUNTRIES.map((country) => (
            <label
              key={country.value}
              className="flex cursor-pointer items-center gap-3 rounded-[18px] bg-white p-4 text-sm font-semibold text-[#434655] shadow-sm ring-1 ring-[#dfe7f5] transition ring-inset hover:ring-[#b4c5ff]"
            >
              <input
                type="checkbox"
                checked={selectedCountries.includes(country.value)}
                onChange={() => onCountryToggle(country.value)}
                className="size-4 border-0 bg-white text-[#0053db] shadow-sm ring-1 ring-[#e2e8f0] ring-inset focus:ring-2 focus:ring-[#0053db]/20"
              />
              <span>{country.label}</span>
            </label>
          ))}
        </div>
      </section>
    </aside>
  )
}
