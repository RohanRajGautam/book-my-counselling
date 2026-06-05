'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  GraduationCap,
  MapPin,
  Video,
} from 'lucide-react'

import { STUDY_ABROAD_COUNTRIES } from '@/features/study-abroad/lib/study-abroad.constants'
import type { StudyAbroadConsultant } from '@/features/study-abroad/types/study-abroad.types'

type StudyAbroadFeaturedConsultantProps = {
  consultant: StudyAbroadConsultant
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

export function StudyAbroadFeaturedConsultant({ consultant }: StudyAbroadFeaturedConsultantProps) {
  const country = STUDY_ABROAD_COUNTRIES.find((item) => item.value === consultant.country)
  const locationLabel = [consultant.city, country?.label].filter(Boolean).join(', ')
  const bookingDuration = consultant.packages
    .map((item) => item.durationMinutes)
    .sort((a, b) => a - b)[0]

  return (
    <section className="px-4 pb-4 sm:px-6 lg:px-8">
      <article className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm sm:rounded-[2rem] sm:px-6 lg:shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-2 gap-y-2 border-b border-slate-100 pb-4 text-xs font-bold sm:gap-x-3">
          <span className="inline-flex shrink-0 items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[10px] tracking-wide text-blue-700 uppercase sm:rounded-lg sm:px-2.5 sm:py-1 sm:text-[11px]">
            Exclusive Webinar
          </span>

          <div className="flex items-center gap-4">
            <span className="inline-flex shrink-0 items-center gap-1.5 text-amber-700">
              <CalendarDays className="size-3.5 text-amber-600 sm:size-4" />
              Friday, June 12
            </span>
            <span className="font-medium text-slate-300">•</span>
            <span className="inline-flex shrink-0 items-center gap-1.5 text-slate-600">
              <Clock className="size-3.5 text-slate-400 sm:size-4" />
              7:00 PM - 8:00 PM
            </span>
          </div>
        </div>

        <div className="grid gap-5 lg:items-center lg:gap-6 xl:grid-cols-[200px_1fr_300px]">
          <div className="flex items-center gap-4 md:block md:w-full md:max-w-[200px] lg:max-w-full">
            <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-inner sm:w-20 md:w-full md:rounded-2xl">
              <Image
                src={consultant.imageUrl}
                alt={formatDisplayName(consultant.name)}
                fill
                sizes="(min-width: 1024px) 240px, (min-width: 768px) 200px, 80px"
                className="object-cover"
                priority
              />
            </div>

            <div className="min-w-0 flex-1 md:hidden">
              <h2 className="font-[family-name:var(--font-headline)] text-lg font-black tracking-tight text-slate-900 sm:text-xl">
                {formatDisplayName(consultant.name)}
              </h2>
              <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1 truncate">
                  <GraduationCap className="size-3.5 shrink-0 text-blue-600" />
                  <span className="truncate">{consultant.universityName}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Desktop/Tablet Middle Column */}
          <div className="min-w-0">
            <h2 className="hidden font-[family-name:var(--font-headline)] text-2xl font-black tracking-tight text-slate-900 md:block lg:text-3xl xl:text-4xl">
              {formatDisplayName(consultant.name)}
            </h2>

            <div className="hidden md:mt-3 md:flex md:flex-wrap md:gap-x-4 md:gap-y-1.5 md:text-xs md:font-semibold md:text-slate-500 lg:text-sm">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="size-4 text-blue-600" />
                {consultant.universityName}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-blue-600" />
                {locationLabel}
              </span>
            </div>

            <p className="text-sm leading-snug font-bold text-slate-800 md:mt-3 md:text-base lg:text-lg">
              {consultant.profileType === 'student' ? consultant.program : consultant.headline}
            </p>

            <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-slate-500 md:hidden">
              <MapPin className="size-3.5 shrink-0 text-blue-600" />
              <span className="truncate">{locationLabel}</span>
            </div>

            {consultant.bio && (
              <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm md:max-w-2xl md:text-slate-500">
                {consultant.bio}
              </p>
            )}

            {consultant.research && (
              <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm md:max-w-2xl md:text-slate-500">
                {consultant.research}
              </p>
            )}
          </div>

          {/* Right Action Sidebar Card */}
          <div className="flex flex-col rounded-xl border border-slate-200/60 bg-slate-50 p-4 md:col-span-2 lg:col-span-1 lg:p-5 xl:p-6">
            <div className="mb-2 flex items-center justify-between lg:mb-3">
              <span className="text-[9px] font-black tracking-[0.15em] text-slate-400 uppercase sm:text-[10px]">
                Main Topic
              </span>
              <span className="flex items-center gap-1 text-[9px] font-bold text-blue-600 uppercase sm:text-[10px]">
                <Video className="size-3" /> Live Event
              </span>
            </div>

            <h3 className="text-sm leading-snug font-extrabold text-slate-900 sm:text-base md:text-lg">
              How difficult is student life in USA?
            </h3>

            <div className="mt-3 space-y-2 lg:mt-4">
              <div className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 text-left sm:p-3">
                <span className="flex items-center gap-2 text-xs font-bold text-emerald-700 sm:gap-2.5 sm:text-sm">
                  <CheckCircle2 className="size-4 shrink-0" />
                  The Bright Side
                </span>
              </div>

              <div className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 text-left sm:p-3">
                <span className="flex items-center gap-2 text-xs font-bold text-orange-700 sm:gap-2.5 sm:text-sm">
                  <AlertTriangle className="size-4 shrink-0" />
                  The Challenges
                </span>
              </div>
            </div>

            {bookingDuration && (
              <Link
                href={{
                  pathname: '/study-abroad/booking',
                  query: {
                    consultantId: consultant.id,
                    duration: bookingDuration,
                  },
                }}
                className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#004ac6] px-4 text-xs font-extrabold text-white shadow-[0_10px_20px_rgba(0,74,198,0.15)] transition hover:bg-[#003fa8] focus-visible:ring-3 focus-visible:ring-[#004ac6]/25 focus-visible:outline-none active:translate-y-px sm:mt-4 sm:h-11 sm:text-sm"
              >
                <CalendarDays className="size-4 shrink-0" />
                Reserve Webinar Seat
              </Link>
            )}
          </div>
        </div>
      </article>
    </section>
  )
}
