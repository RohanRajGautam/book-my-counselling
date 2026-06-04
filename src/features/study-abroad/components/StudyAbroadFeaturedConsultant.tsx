'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
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
      <article className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm sm:rounded-[2rem] lg:shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
        <div className="grid gap-6 md:grid-cols-[auto_1fr] lg:grid-cols-[240px_1fr_300px] lg:items-center">
          <div className="flex items-start gap-4 md:block md:w-full md:max-w-[200px] lg:max-w-[240px]">
            <div className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-inner md:w-full md:rounded-2xl">
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
              <div className="mb-1.5 flex flex-wrap gap-1">
                <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[9px] font-bold tracking-wide text-blue-700 uppercase">
                  Exclusive Webinar
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-headline)] text-xl font-black tracking-tight text-slate-900">
                {formatDisplayName(consultant.name)}
              </h2>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                  <GraduationCap className="size-3.5 text-blue-600" />
                  {consultant.universityName}
                </span>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="hidden md:mb-4 md:flex md:flex-wrap md:gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold tracking-wide text-blue-700 uppercase">
                Exclusive Webinar
              </span>
            </div>

            <h2 className="hidden font-[family-name:var(--font-headline)] text-3xl font-black tracking-tight text-slate-900 md:block lg:text-4xl">
              {formatDisplayName(consultant.name)}
            </h2>

            <div className="hidden md:mt-4 md:flex md:flex-wrap md:gap-x-5 md:gap-y-2 md:text-sm md:font-semibold md:text-slate-500">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="size-4 text-blue-600" />
                {consultant.universityName}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-blue-600" />
                {locationLabel}
              </span>
            </div>

            <p className="text-base leading-relaxed font-bold text-slate-800 md:mt-4 md:text-lg">
              {consultant.profileType === 'student' ? consultant.program : consultant.headline}
            </p>

            <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500 md:hidden">
              <MapPin className="size-3.5 text-blue-600" />
              {locationLabel}
            </div>

            {consultant.bio && (
              <p className="mt-3 text-sm leading-relaxed text-slate-600 md:max-w-2xl md:text-slate-500">
                {consultant.bio}
              </p>
            )}

            {consultant.research && (
              <p className="mt-3 text-sm leading-relaxed text-slate-600 md:max-w-2xl md:text-slate-500">
                {consultant.research}
              </p>
            )}
          </div>

          {/* Right Action Sidebar */}
          <div className="flex flex-col rounded-xl border border-slate-200/60 bg-slate-50 p-4 md:col-span-2 lg:col-span-1 lg:p-6">
            <div className="mb-2 flex items-center justify-between lg:mb-4">
              <span className="text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase">
                Main Topic
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase">
                <Video className="size-3" /> Live Event
              </span>
            </div>

            <h3 className="text-base leading-snug font-extrabold text-slate-900 sm:text-lg">
              How difficult is student life in USA?
            </h3>

            <div className="mt-4 space-y-2 lg:mt-6">
              <div className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-left">
                <span className="flex items-center gap-2.5 text-sm font-bold text-emerald-700">
                  <CheckCircle2 className="size-4 shrink-0" />
                  The Bright Side
                </span>
              </div>

              <div className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-left">
                <span className="flex items-center gap-2.5 text-sm font-bold text-orange-700">
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
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#004ac6] px-4 text-sm font-extrabold text-white shadow-[0_14px_28px_rgba(0,74,198,0.2)] transition hover:bg-[#003fa8] focus-visible:ring-3 focus-visible:ring-[#004ac6]/25 focus-visible:outline-none active:translate-y-px"
              >
                <CalendarDays className="size-4" />
                Reserve Webinar Seat
              </Link>
            )}
          </div>
        </div>
      </article>
    </section>
  )
}
