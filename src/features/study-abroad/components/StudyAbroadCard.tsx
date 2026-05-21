'use client'

import { Check, Clock, MapPin, Briefcase, GraduationCap } from 'lucide-react'
import type { StudyAbroadConsultant } from '@/features/study-abroad/types/study-abroad.types'
import { STUDY_ABROAD_COUNTRIES } from '@/features/study-abroad/lib/study-abroad.constants'

type StudyAbroadCardProps = {
  consultant: StudyAbroadConsultant
  onBook: (consultant: StudyAbroadConsultant) => void
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'C'
  )
}

function formatDisplayName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\b\p{L}/gu, (letter) => letter.toUpperCase())
}

export function StudyAbroadCard({ consultant, onBook }: StudyAbroadCardProps) {
  const country = STUDY_ABROAD_COUNTRIES.find((item) => item.value === consultant.country)
  const isStudent = consultant.profileType === 'student'

  // Always slice to 3 elements, empty slots will be handled cleanly by grid layout
  const sortedPackages = [...consultant.packages]
    .sort((a, b) => a.durationMinutes - b.durationMinutes)
    .slice(0, 3)

  return (
    <article className="group flex min-h-[400px] w-full max-w-sm flex-col rounded-2xl border border-[#eef2f8] bg-white p-5 shadow-[0_16px_32px_rgba(18,28,42,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(18,28,42,0.07)]">
      {/* Header Profile Section */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative shrink-0">
          <div className="flex size-16 items-center justify-center rounded-full border-2 border-[#0053db] bg-[#e6eeff] text-lg font-black text-[#004ac6] shadow-[0_0_0_4px_#f3f7ff]">
            {getInitials(consultant.name)}
          </div>
          {consultant.verified && (
            <div
              className="absolute -right-0.5 -bottom-0.5 flex size-5 items-center justify-center rounded-full border-2 border-white bg-[#00714d]"
              aria-hidden="true"
            >
              <Check className="size-3 text-white" strokeWidth={4} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 font-[family-name:var(--font-headline)] text-base font-extrabold tracking-tight text-[#121c2a] transition-colors duration-200 group-hover:text-[#004ac6]">
            {formatDisplayName(consultant.name)}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#62667a]">
            <MapPin className="size-3.5 shrink-0 text-[#0053db]" />
            <span className="truncate">
              {consultant.city}, {country?.label}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Details Area */}
      <div className="mb-4 flex flex-1 flex-col rounded-xl border border-[#eff4ff] bg-[#f8f9ff] p-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5">
            {isStudent ? (
              <GraduationCap className="size-4 text-[#0053db]" />
            ) : (
              <Briefcase className="size-3.5 text-[#0053db]" />
            )}
            <span className="text-[10px] font-bold tracking-wider text-[#737686] uppercase">
              {isStudent ? 'Student' : 'Employee'}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="line-clamp-1 font-[family-name:var(--font-headline)] text-sm font-extrabold text-[#121c2a]">
                {isStudent ? consultant.universityName : consultant.position}
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed font-medium text-[#434655]">
                {isStudent ? consultant.program : consultant.companyName}
              </p>
            </div>

            {!isStudent && (
              <div className="border-t border-[#dfe7f5]/60 pt-2.5">
                <p className="line-clamp-1 font-[family-name:var(--font-headline)] text-sm font-extrabold text-[#121c2a]">
                  {consultant.universityName}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs font-medium text-[#434655]">
                  {consultant.program}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info & Button Area */}
      <div className="mt-auto border-t border-[#dfe7f5] pt-4">
        <section aria-label="Session Packages Area">
          <h4 className="sr-only">Session Packages</h4>
          <p className="mb-2 text-[10px] font-bold tracking-wider text-[#737686] uppercase">
            Available Packages
          </p>

          <div className="mb-4 grid grid-cols-3 gap-2">
            {sortedPackages.map((item) => (
              <div
                key={`${consultant.id}-${item.durationMinutes}`}
                className="flex flex-col items-center justify-center rounded-lg border border-[#e1ecff] bg-[#f3f7ff] p-2 text-center"
              >
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#62667a]">
                  <Clock className="size-3 text-[#0053db]" />
                  {item.durationMinutes}m
                </span>
                <span className="mt-1 font-[family-name:var(--font-headline)] text-xs font-black text-[#121c2a]">
                  Rs {item.price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={() => onBook(consultant)}
          className="flex h-10 w-full items-center justify-center rounded-xl bg-[#1f5bdc] px-4 text-sm font-bold text-white shadow-[0_8px_16px_rgba(31,91,220,0.15)] transition-all duration-200 hover:bg-[#004ac6] hover:shadow-[0_12px_20px_rgba(31,91,220,0.25)] focus-visible:ring-2 focus-visible:ring-[#0053db]/40 focus-visible:outline-none active:scale-[0.98]"
        >
          Book a Consultation
        </button>
      </div>
    </article>
  )
}
