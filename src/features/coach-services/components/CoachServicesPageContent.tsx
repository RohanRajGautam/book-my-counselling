'use client'

import { useState } from 'react'
import {
  ArrowUpDown,
  BriefcaseBusiness,
  Check,
  GraduationCap,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import {
  CoachServiceAudience,
  COACH_SERVICE_PAGES,
  STATIC_COACH_MENTORS,
} from '@/features/coach-services/lib/coach-services.constants'
import { FreshersCoachesPageContent } from '@/features/coach-services/components/FreshersCoachesPageContent'
import { MentorCard } from '@/features/mentors/components/MentorCard'

type CoachServicesPageContentProps = {
  audience: CoachServiceAudience
  serviceTag?: string
}

type CoachServicesSidebarProps = {
  audience: CoachServiceAudience
  selectedService: string
  availableThisWeek: boolean
  onServiceChange: (service: string) => void
  onAvailabilityChange: (available: boolean) => void
}

function CoachServicesSidebar({
  audience,
  selectedService,
  availableThisWeek,
  onServiceChange,
  onAvailabilityChange,
}: CoachServicesSidebarProps) {
  const page = COACH_SERVICE_PAGES[audience]
  const Icon = audience === 'freshers' ? GraduationCap : BriefcaseBusiness

  return (
    <aside className="h-full border-r border-gray-200 px-4 py-8 lg:sticky lg:top-[73px] lg:min-h-[calc(100vh-73px)]">
      <section className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b border-[#eef2f7] px-5 py-4">
          <div className="flex min-w-0 items-center gap-2">
            <Icon className="shrink-0 text-blue-700" />
            <h3 className="text-sm leading-tight font-extrabold text-[#111827]">{page.navLabel}</h3>
          </div>
        </div>

        <div className="py-2">
          {page.services.map((service) => (
            <button
              key={service}
              type="button"
              onClick={() => onServiceChange(selectedService === service ? '' : service)}
              aria-pressed={selectedService === service}
              className={`mx-2 my-1.5 flex min-h-[52px] w-[calc(100%-1rem)] items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-extrabold transition ${
                selectedService === service
                  ? 'bg-[#4b63e9] text-white ring-1 ring-[#cfe0ff] ring-inset'
                  : 'text-[#4b5563] hover:bg-[#f8fbff] hover:text-[#111827]'
              }`}
            >
              <span
                className={`flex size-5 shrink-0 items-center justify-center rounded-md ring-1 ring-inset ${
                  selectedService === service
                    ? 'bg-[#0053db] text-white ring-[#0053db]'
                    : 'bg-white ring-[#cfd9ea]'
                }`}
              >
                {selectedService === service && <Check className="size-3.5" strokeWidth={3.5} />}
              </span>
              <span className="min-w-0 flex-1">{service}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="my-4 text-[11px] font-extrabold tracking-wider text-[#434655] uppercase">
          Availability
        </h3>
        <label className="flex cursor-pointer items-center gap-3 rounded-[18px] bg-white p-4 text-sm font-semibold text-[#434655] shadow-sm ring-1 ring-[#dfe7f5] ring-inset">
          <input
            type="checkbox"
            checked={availableThisWeek}
            onChange={(event) => onAvailabilityChange(event.target.checked)}
            className="size-4 border-0 bg-white text-[#0053db] shadow-sm ring-1 ring-[#e2e8f0] ring-inset focus:ring-2 focus:ring-[#0053db]/20"
          />
          <span>This Week</span>
        </label>
      </section>
    </aside>
  )
}

function ProfessionalCoachServicesPageContent({ audience }: CoachServicesPageContentProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [availableThisWeek, setAvailableThisWeek] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const page = COACH_SERVICE_PAGES[audience]
  const searchText = searchQuery.trim().toLowerCase()
  const filteredMentors = STATIC_COACH_MENTORS.filter((mentor) => {
    if (mentor.audience !== audience) return false
    if (selectedService && !mentor.services.includes(selectedService)) return false
    if (availableThisWeek && !mentor.availableThisWeek) return false
    if (!searchText) return true

    return [mentor.name, mentor.role, mentor.company, ...mentor.services]
      .join(' ')
      .toLowerCase()
      .includes(searchText)
  }).sort((firstMentor, secondMentor) => {
    if (sortBy === 'reviews') return secondMentor.reviews - firstMentor.reviews
    if (sortBy === 'sessions') return secondMentor.totalSessions - firstMentor.totalSessions

    return secondMentor.rating - firstMentor.rating
  })

  return (
    <div className="mx-auto grid min-h-screen max-w-[1350px] grid-cols-1 bg-[#f8f9ff] lg:grid-cols-[280px_minmax(0,1fr)]">
      <div className="hidden lg:block">
        <CoachServicesSidebar
          audience={audience}
          selectedService={selectedService}
          availableThisWeek={availableThisWeek}
          onServiceChange={setSelectedService}
          onAvailabilityChange={setAvailableThisWeek}
        />
      </div>

      <div>
        <section className="px-5 pt-8 sm:px-6 lg:px-8 xl:px-10">
          <div className="rounded-[24px] py-5">
            <h1 className="font-[family-name:var(--font-headline)] text-[clamp(2.4rem,5.5vw,3rem)] leading-tight font-extrabold text-[#121c2a]">
              {page.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 font-medium text-[#5f6472]">
              {page.subtitle}
            </p>
          </div>
        </section>

        <section className="px-5 py-4 sm:px-6 sm:py-0 lg:px-8 xl:px-10">
          <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center">
            <div className="flex h-16 min-w-0 flex-1 items-center rounded-2xl border border-gray-100 bg-white px-4 ring-1 ring-[#eff4ff] ring-inset">
              <Search className="mr-3 size-6 text-[#0053db]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name, service, or company..."
                className="h-full min-w-0 flex-1 bg-transparent text-base font-semibold text-[#121c2a] outline-none placeholder:text-[#b5bbc8]"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 ring-1 ring-[#eff4ff] ring-inset xl:flex-none">
                <ArrowUpDown className="size-5 shrink-0 text-[#0053db]" />
                <span className="text-sm font-extrabold text-[#434655]">Sort</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-10 min-w-0 rounded-xl bg-[#f8f9ff] px-3 text-sm font-extrabold text-[#121c2a] ring-1 ring-[#eff4ff] transition outline-none ring-inset focus:ring-2 focus:ring-[#0053db]/30 xl:min-w-[160px]"
                >
                  <option value="rating">Top rated</option>
                  <option value="reviews">Most reviewed</option>
                  <option value="sessions">Most sessions</option>
                </select>
              </label>

              <button
                type="button"
                onClick={() => setShowMobileFilters(true)}
                className="inline-flex h-14 shrink-0 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-extrabold text-[#0053db] shadow-[0_12px_30px_rgba(18,28,42,0.04)] ring-1 ring-[#eff4ff] ring-inset lg:hidden"
              >
                <SlidersHorizontal className="size-4" />
                Filters
              </button>
            </div>
          </div>

          {filteredMentors.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredMentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  name={mentor.name}
                  role={mentor.role}
                  company={mentor.company}
                  tags={mentor.services}
                  rating={mentor.rating}
                  reviews={mentor.reviews}
                  totalSessions={mentor.totalSessions}
                  price={mentor.packageTiers[0]?.price ?? 0}
                  packageTiers={mentor.packageTiers}
                  imageUrl={null}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[320px] items-center justify-center rounded-[24px] bg-white p-10 text-center shadow-[0_16px_40px_rgba(18,28,42,0.04)] ring-1 ring-[#eff4ff] ring-inset">
              <div>
                <p className="text-xl font-extrabold text-[#121c2a]">No coaches found</p>
                <p className="mt-2 font-medium text-[#5f6472]">
                  Try clearing the service filter or changing your search.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#27313f]/40 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
            aria-label="Close filters"
          />
          <div className="absolute inset-y-0 left-0 w-[min(20rem,calc(100vw-2rem))] overflow-y-auto bg-[#eff4ff] shadow-[18px_0_42px_rgba(18,28,42,0.18)]">
            <div className="flex items-center justify-end px-5 pt-4">
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="flex size-10 items-center justify-center rounded-full bg-white text-[#434655]"
                aria-label="Close filters"
              >
                <X className="size-5" />
              </button>
            </div>
            <CoachServicesSidebar
              audience={audience}
              selectedService={selectedService}
              availableThisWeek={availableThisWeek}
              onServiceChange={setSelectedService}
              onAvailabilityChange={setAvailableThisWeek}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export function CoachServicesPageContent({ audience, serviceTag }: CoachServicesPageContentProps) {
  if (audience === 'freshers') {
    return <FreshersCoachesPageContent serviceTag={serviceTag} />
  }

  return <ProfessionalCoachServicesPageContent audience={audience} />
}
