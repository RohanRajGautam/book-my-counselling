'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Check, Clock, MapPin, Sparkles, X } from 'lucide-react'

import { STUDY_ABROAD_COUNTRIES } from '@/features/study-abroad/lib/study-abroad.constants'
import type {
  StudyAbroadConsultant,
  StudyAbroadPackage,
} from '@/features/study-abroad/types/study-abroad.types'
import { cn } from '@/lib/utils'

type StudyAbroadConsultantModalProps = {
  consultant: StudyAbroadConsultant | null
  onClose: () => void
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return initials || 'C'
}

function formatDisplayName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) =>
      part === part.toUpperCase() && /\p{L}/u.test(part)
        ? part
        : part.toLowerCase().replace(/^\p{L}/u, (letter) => letter.toUpperCase())
    )
    .join(' ')
}

function getPackageTitle(item: StudyAbroadPackage) {
  if (item.durationMinutes <= 30) return 'Quick Guidance'
  if (item.durationMinutes <= 60) return 'Full Consultation'
  return 'Deep Planning'
}

export function StudyAbroadConsultantModal({
  consultant,
  onClose,
}: StudyAbroadConsultantModalProps) {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState<{
    consultantId: string
    durationMinutes: number
  } | null>(null)

  useEffect(() => {
    if (!consultant) {
      return undefined
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [consultant, onClose])

  if (!consultant) {
    return null
  }

  const country = STUDY_ABROAD_COUNTRIES.find((item) => item.value === consultant.country)
  const packages = [...consultant.packages].sort((a, b) => a.durationMinutes - b.durationMinutes)
  const locationLabel = [consultant.city, country?.label].filter(Boolean).join(', ')
  const primaryTitle =
    consultant.profileType === 'student'
      ? (consultant.universityName ?? consultant.program ?? locationLabel)
      : (consultant.position ?? consultant.companyName ?? locationLabel)
  const primarySubtitle =
    consultant.profileType === 'student'
      ? consultant.universityName
        ? consultant.program
        : undefined
      : consultant.position
        ? consultant.companyName
        : undefined
  const hasEmployeeEducation =
    consultant.profileType === 'employee' &&
    (Boolean(consultant.universityName) || Boolean(consultant.program))
  const highlights = consultant.highlights ?? []

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#27313f]/40 backdrop-blur-[12px] sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="custom-scrollbar relative grid h-[94vh] w-full max-w-5xl touch-pan-y grid-cols-1 gap-4 overflow-y-auto overscroll-contain rounded-t-[24px] rounded-b-none bg-[#f8f9ff] p-4 pt-5 pb-28 shadow-[0_16px_48px_rgba(18,28,42,0.12)] sm:h-auto sm:max-h-[90vh] sm:gap-5 sm:rounded-[24px] sm:p-6 sm:pb-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]"
        style={{ WebkitOverflowScrolling: 'touch' }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="sticky top-0 right-0 z-[60] ml-auto -mb-11 flex size-11 items-center justify-center rounded-full bg-white/95 text-[#434655] shadow-[0_8px_20px_rgba(18,28,42,0.14)] transition-colors hover:bg-[#dee9fc] focus-visible:ring-3 focus-visible:ring-[#0053db]/30 focus-visible:outline-none sm:absolute sm:top-5 sm:right-5 sm:ml-0 sm:mb-0"
          aria-label="Close consultant details"
        >
          <X className="size-6" />
        </button>

        <div className="flex flex-col gap-4 sm:gap-5">
          <section className="relative flex flex-col items-center overflow-hidden rounded-[20px] bg-white p-5 text-center shadow-[0_8px_24px_rgba(18,28,42,0.04)] sm:rounded-[24px] sm:p-7">
            <div className="absolute top-0 left-0 h-24 w-full rounded-t-[20px] bg-[#eff4ff] sm:h-28 sm:rounded-t-[24px]" />
            <div className="relative z-10">
              <div className="relative mx-auto mb-4 size-24 rounded-full ring-4 ring-white ring-offset-4 ring-offset-[#0053db]/10 sm:mb-5 sm:size-28">
                <div className="relative flex size-full items-center justify-center overflow-hidden rounded-full bg-[#e6eeff] text-4xl font-extrabold text-[#004ac6] sm:text-5xl">
                  <Image
                    src={consultant.imageUrl}
                    alt={formatDisplayName(consultant.name)}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                  <span className="sr-only">{getInitials(consultant.name)}</span>
                </div>
                {consultant.verified && (
                  <div
                    className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full border-[3px] border-white bg-green-700 shadow-[0_8px_18px_rgba(0,83,219,0.24)] sm:size-8"
                    aria-label="Verified profile"
                    title="Verified profile"
                  >
                    <Check className="size-3.5 text-white sm:size-4" strokeWidth={4} aria-hidden="true" />
                  </div>
                )}
              </div>

              <h2 className="font-[family-name:var(--font-headline)] text-xl font-extrabold tracking-tight text-[#121c2a] break-words sm:text-2xl lg:text-3xl">
                {formatDisplayName(consultant.name)}
              </h2>

              <div className="mt-4 grid gap-2.5 rounded-[16px] bg-[#f8f9ff] p-3.5 text-left ring-1 ring-[#eff4ff] ring-inset sm:mt-5 sm:gap-3 sm:rounded-[20px] sm:p-4">
                <p className="flex items-center gap-2 text-sm font-extrabold text-[#121c2a]">
                  <MapPin className="size-4 text-[#0053db]" />
                  {country?.label}
                </p>
                {consultant.city && (
                  <p className="pl-6 text-sm font-semibold text-[#434655]">{consultant.city}</p>
                )}
              </div>
            </div>
          </section>

          <div className="rounded-[20px] bg-white p-3 shadow-[0_8px_24px_rgba(18,28,42,0.04)] sm:rounded-[24px]">
            <button
              type="button"
              disabled={selectedPackage?.consultantId !== consultant.id}
              onClick={() => {
                if (selectedPackage?.consultantId !== consultant.id) return
                router.push(
                  `/study-abroad/booking?consultantId=${consultant.id}&duration=${selectedPackage.durationMinutes}`
                )
              }}
              className="flex min-h-[48px] w-full items-center justify-center rounded-[14px] bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-5 py-3 text-center font-[family-name:var(--font-headline)] text-sm font-bold text-white shadow-lg shadow-[#004ac6]/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:scale-100 sm:rounded-[18px] sm:px-8 sm:text-base"
            >
              {selectedPackage?.consultantId === consultant.id
                ? 'Continue Booking'
                : 'Choose a Package'}
            </button>
          </div>
        </div>

        <section className="flex flex-col gap-4 sm:gap-5">
          <div className="rounded-[20px] bg-white p-5 shadow-[0_8px_24px_rgba(18,28,42,0.04)] sm:rounded-[24px] sm:p-6 lg:p-7">
            <p className="text-[11px] font-extrabold tracking-wider text-[#737686] uppercase">
              {consultant.profileType === 'student' ? 'Student' : 'Employee'}
            </p>

            {consultant.profileType === 'student' ? (
              <>
                <h3 className="mt-2 font-[family-name:var(--font-headline)] text-lg font-extrabold text-[#121c2a] break-words sm:mt-3 sm:text-2xl">
                  {consultant.headline ?? primaryTitle}
                </h3>
                {primarySubtitle && (
                  <p className="mt-2 text-sm leading-7 font-medium break-words text-[#434655] sm:text-base sm:leading-7">
                    {primarySubtitle}
                  </p>
                )}
              </>
            ) : (
              <>
                <h3 className="mt-2 font-[family-name:var(--font-headline)] text-lg font-extrabold text-[#121c2a] break-words sm:mt-3 sm:text-2xl">
                  {primaryTitle}
                </h3>
                {primarySubtitle && (
                  <p className="mt-2 text-sm leading-7 font-medium break-words text-[#434655] sm:text-base sm:leading-7">
                    {primarySubtitle}
                  </p>
                )}
                {hasEmployeeEducation && (
                  <div className="mt-4 rounded-2xl bg-[#f8f9ff] p-3.5 sm:mt-5 sm:p-4">
                    <p className="text-[11px] font-extrabold tracking-wider text-[#737686] uppercase">
                      Education
                    </p>
                    {consultant.universityName && (
                      <p className="mt-2 font-[family-name:var(--font-headline)] text-base font-extrabold text-[#121c2a] break-words sm:text-lg">
                        {consultant.universityName}
                      </p>
                    )}
                    {consultant.program && (
                      <p className="mt-1 text-sm leading-6 font-medium text-[#434655]">
                        {consultant.program}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {consultant.bio && (
              <p className="mt-4 border-t border-[#dfe7f5] pt-4 text-sm leading-7 font-medium text-[#434655] sm:mt-5 sm:pt-5 sm:text-base sm:leading-8">
                {consultant.bio}
              </p>
            )}

            {highlights.length > 0 && (
              <div className="mt-4 rounded-[16px] bg-[#f8f9ff] p-3.5 ring-1 ring-[#eff4ff] ring-inset sm:mt-5 sm:rounded-[20px] sm:p-4">
                <p className="mb-2.5 flex items-center gap-2 text-[11px] font-extrabold tracking-wider text-[#737686] uppercase sm:mb-3">
                  <Sparkles className="size-4 text-[#0053db]" />
                  Good topics to ask about
                </p>
                <ul className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                  {highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex gap-2.5 text-sm leading-6 font-semibold text-[#434655] sm:gap-3"
                    >
                      <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#ebfff5] text-[#00714d]">
                        <Check className="size-3.5" strokeWidth={4} />
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="rounded-[20px] bg-white p-5 shadow-[0_8px_24px_rgba(18,28,42,0.04)] sm:rounded-[24px] sm:p-6">
            <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-[family-name:var(--font-headline)] text-base font-bold text-[#121c2a] sm:text-xl">
                  Session Packages
                </h3>
                <p className="mt-0.5 text-xs font-medium text-[#737686] sm:mt-1 sm:text-sm">
                  Choose the consultation length that fits your question.
                </p>
              </div>
              <span className="w-fit rounded-full bg-[#e6eeff] px-3 py-1 text-[11px] font-extrabold text-[#004ac6] sm:py-1.5 sm:text-xs">
                Choose one
              </span>
            </div>

            <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
              {packages.map((item) => {
                const isSelected =
                  selectedPackage?.consultantId === consultant.id &&
                  selectedPackage.durationMinutes === item.durationMinutes

                return (
                  <button
                    key={`${consultant.id}-${item.durationMinutes}`}
                    type="button"
                    onClick={() =>
                      setSelectedPackage((current) =>
                        current?.consultantId === consultant.id &&
                        current.durationMinutes === item.durationMinutes
                          ? null
                          : {
                              consultantId: consultant.id,
                              durationMinutes: item.durationMinutes,
                            }
                      )
                    }
                    className={cn(
                      'relative overflow-hidden rounded-[18px] p-4 text-left shadow-[0_8px_24px_rgba(18,28,42,0.04)] ring-1 transition-all ring-inset sm:rounded-[24px] sm:p-5',
                      'focus-visible:ring-3 focus-visible:ring-[#0053db]/30 focus-visible:outline-none',
                      isSelected
                        ? 'bg-[#004ac6] text-white ring-[#004ac6]'
                        : 'bg-[#f8f9ff] ring-[#eff4ff] hover:bg-[#eff4ff]/70'
                    )}
                  >
                    {item.durationMinutes === 60 && (
                      <span
                        className={cn(
                          'absolute top-0 right-0 rounded-tr-[18px] rounded-bl-[10px] px-2.5 py-0.5 text-[10px] font-bold sm:rounded-tr-[24px] sm:rounded-bl-[12px] sm:px-3 sm:py-1',
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#6cf8bb] text-[#00714d]'
                        )}
                      >
                        Popular
                      </span>
                    )}
                    <h4
                      className={cn(
                        'font-[family-name:var(--font-headline)] text-base font-bold sm:text-lg',
                        isSelected ? 'text-white' : 'text-[#121c2a]'
                      )}
                    >
                      {getPackageTitle(item)}
                    </h4>
                    <p
                      className={cn(
                        'mt-1.5 flex items-center gap-1.5 text-xs font-semibold sm:mt-2 sm:text-sm',
                        isSelected ? 'text-white/80' : 'text-[#434655]'
                      )}
                    >
                      <Clock className="size-4" />
                      {item.durationMinutes} minutes
                    </p>
                    <p
                      className={cn(
                        'mt-4 font-[family-name:var(--font-headline)] text-xl font-extrabold sm:mt-5 sm:text-2xl',
                        isSelected ? 'text-white' : 'text-[#004ac6]'
                      )}
                    >
                      NPR {item.price.toLocaleString()}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
