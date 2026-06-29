'use client'

import { useRef, useState } from 'react'
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import { FreshersCoachBookingModal } from '@/features/coach-services/components/FreshersCoachBookingModal'
import {
  FRESHERS_COACHES_PER_PAGE,
  FreshersCoachSort,
} from '@/features/coach-services/api/freshers-coaches.api'
import { useFreshersCoaches } from '@/features/coach-services/hooks/useFreshersCoaches'
import { useCounselingCategories } from '@/features/categories/hooks/useCounselingCategories'
import { MentorCardWithPackages } from '@/features/mentors/components/MentorCardWithPackages'
import {
  COACH_SERVICE_PAGES,
  getFreshersServiceLabels,
} from '@/features/coach-services/lib/coach-services.constants'

const FRESHERS_CATEGORY_NAMES = ['IT', 'Management', 'General']
const SEARCH_DEBOUNCE_MS = 300

const SORT_OPTIONS: { value: FreshersCoachSort; label: string }[] = [
  { value: 'rating', label: 'Top rated' },
  { value: 'reviews', label: 'Most reviewed' },
  { value: 'years_of_experience', label: 'Most experienced' },
  { value: 'price', label: 'Price: low to high' },
]

type FreshersCoachesSidebarProps = {
  categories: string[]
  selectedCategory: string
  availableThisWeek: boolean
  onCategoryChange: (category: string) => void
  onAvailabilityChange: (available: boolean) => void
}

function FreshersCoachesSidebar({
  categories,
  selectedCategory,
  availableThisWeek,
  onCategoryChange,
  onAvailabilityChange,
}: FreshersCoachesSidebarProps) {
  return (
    <aside className="h-full border-r border-gray-200 px-4 py-8 lg:sticky lg:top-[73px] lg:min-h-[calc(100vh-73px)]">
      <section className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b border-[#eef2f7] px-5 py-4">
          <div className="flex min-w-0 items-center gap-2">
            <GraduationCap className="shrink-0 text-blue-700" />
            <h3 className="text-sm leading-tight font-extrabold text-[#111827]">
              Coach for Freshers
            </h3>
          </div>
        </div>

        <div className="py-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(selectedCategory === category ? '' : category)}
              aria-pressed={selectedCategory === category}
              className={`mx-2 my-1.5 flex min-h-[52px] w-[calc(100%-1rem)] items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-extrabold transition ${
                selectedCategory === category
                  ? 'bg-[#4b63e9] text-white ring-1 ring-[#cfe0ff] ring-inset'
                  : 'text-[#4b5563] hover:bg-[#f8fbff] hover:text-[#111827]'
              }`}
            >
              <span
                className={`flex size-5 shrink-0 items-center justify-center rounded-md ring-1 ring-inset ${
                  selectedCategory === category
                    ? 'bg-[#0053db] text-white ring-[#0053db]'
                    : 'bg-white ring-[#cfd9ea]'
                }`}
              >
                {selectedCategory === category && <Check className="size-3.5" strokeWidth={3.5} />}
              </span>
              <span className="min-w-0 flex-1">{category}</span>
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

type FreshersCoachesPageContentProps = {
  serviceTag?: string
}

export function FreshersCoachesPageContent({ serviceTag }: FreshersCoachesPageContentProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [availableThisWeek, setAvailableThisWeek] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [keyword, setKeyword] = useState('')
  const [sortBy, setSortBy] = useState<FreshersCoachSort>('rating')
  const [page, setPage] = useState(1)
  const [activeMentorId, setActiveMentorId] = useState<string | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pageConfig = COACH_SERVICE_PAGES.freshers

  const { data: categoryData = [] } = useCounselingCategories('professional')
  const categories = categoryData
    .map((category) => category.name)
    .filter((name) => FRESHERS_CATEGORY_NAMES.includes(name))
  const visibleCategories = categories.length > 0 ? categories : FRESHERS_CATEGORY_NAMES

  const { data, isLoading, isFetching, isError } = useFreshersCoaches({
    keyword,
    category: selectedCategory,
    serviceTag,
    availableThisWeek,
    sortBy,
    page,
  })

  const mentors = data?.items ?? []
  const totalPages = data?.total_pages ?? 1

  const handleSearchChange = (value: string) => {
    setSearchInput(value)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setKeyword(value)
      setPage(1)
    }, SEARCH_DEBOUNCE_MS)
  }

  const handleSearchSubmit = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    setKeyword(searchInput)
    setPage(1)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setPage(1)
  }

  const handleAvailabilityChange = (available: boolean) => {
    setAvailableThisWeek(available)
    setPage(1)
  }

  const handleSortChange = (value: FreshersCoachSort) => {
    setSortBy(value)
    setPage(1)
  }

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    document
      .getElementById('freshers-coach-results')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) pages.push(pageNumber)
      return pages
    }

    pages.push(1)
    if (page > 3) pages.push('...')

    for (
      let pageNumber = Math.max(2, page - 1);
      pageNumber <= Math.min(totalPages - 1, page + 1);
      pageNumber += 1
    ) {
      pages.push(pageNumber)
    }

    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)

    return pages
  }

  return (
    <div
      id="freshers-coaches"
      className="mx-auto grid min-h-screen max-w-[1350px] grid-cols-1 bg-[#f8f9ff] lg:grid-cols-[280px_minmax(0,1fr)]"
    >
      <div className="hidden lg:block">
        <FreshersCoachesSidebar
          categories={visibleCategories}
          selectedCategory={selectedCategory}
          availableThisWeek={availableThisWeek}
          onCategoryChange={handleCategoryChange}
          onAvailabilityChange={handleAvailabilityChange}
        />
      </div>

      <div>
        <section className="px-5 pt-8 sm:px-6 lg:px-8 xl:px-10">
          <div className="rounded-[24px] py-5">
            <h1 className="font-[family-name:var(--font-headline)] text-[clamp(2.4rem,5.5vw,3rem)] leading-tight font-extrabold text-[#121c2a]">
              {pageConfig.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 font-medium text-[#5f6472]">
              {pageConfig.subtitle}
            </p>
          </div>
        </section>

        <section id="freshers-coach-results" className="px-5 py-4 sm:px-6 sm:py-0 lg:px-8 xl:px-10 mb-10">
          <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center">
            <div className="flex h-16 min-w-0 flex-1 items-center rounded-2xl border border-gray-100 bg-white px-4 ring-1 ring-[#eff4ff] ring-inset">
              <Search className="mr-3 size-6 text-[#0053db]" />
              <input
                type="search"
                value={searchInput}
                onChange={(event) => handleSearchChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSearchSubmit()
                }}
                placeholder="Search by name, role, or company..."
                className="h-full min-w-0 flex-1 bg-transparent text-base font-semibold text-[#121c2a] outline-none placeholder:text-[#b5bbc8]"
              />
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="ml-2 h-10 rounded-xl bg-[#0053db] px-7 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(0,83,219,0.22)] transition hover:bg-[#003fa8]"
              >
                Search
              </button>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 ring-1 ring-[#eff4ff] ring-inset xl:flex-none">
                <ArrowUpDown className="size-5 shrink-0 text-[#0053db]" />
                <span className="text-sm font-extrabold text-[#434655]">Sort</span>
                <span className="relative min-w-0 flex-1 xl:flex-none">
                  <select
                    value={sortBy}
                    onChange={(event) => handleSortChange(event.target.value as FreshersCoachSort)}
                    className="h-10 w-full min-w-0 appearance-none rounded-xl bg-[#f8f9ff] px-3 pr-9 text-sm font-extrabold text-[#121c2a] ring-1 ring-[#eff4ff] transition outline-none ring-inset focus:ring-2 focus:ring-[#0053db]/30 xl:min-w-[180px]"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#0053db]" />
                </span>
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

          {isError ? (
            <div className="flex min-h-[360px] items-center justify-center rounded-[24px] bg-white p-12 text-center shadow-[0_16px_40px_rgba(18,28,42,0.04)] ring-1 ring-[#eff4ff] ring-inset">
              <div>
                <p className="mb-2 text-xl font-extrabold text-[#121c2a]">Unable to load coaches</p>
                <p className="font-medium text-[#5f6472]">Please try again in a moment.</p>
              </div>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: Math.min(FRESHERS_COACHES_PER_PAGE, 9) }).map((_, index) => (
                <div
                  key={index}
                  className="h-[390px] animate-pulse rounded-[20px] bg-white shadow-[0_16px_40px_rgba(18,28,42,0.04)]"
                />
              ))}
            </div>
          ) : mentors.length > 0 ? (
            <div
              className={`grid grid-cols-1 gap-6 transition-opacity md:grid-cols-2 xl:grid-cols-3 ${
                isFetching ? 'opacity-60' : 'opacity-100'
              }`}
            >
              {mentors.map((mentor) => {
                const serviceLabels = getFreshersServiceLabels(mentor.tags)

                return (
                  <MentorCardWithPackages
                    key={mentor.id}
                    mentorId={mentor.id}
                    name={mentor.full_name}
                    role={mentor.title}
                    company={mentor.company ?? ''}
                    tags={
                      serviceLabels.length
                        ? serviceLabels
                        : mentor.professional_categories?.length
                          ? mentor.professional_categories
                          : (mentor.industries ?? [])
                    }
                    rating={mentor.average_rating}
                    reviews={mentor.total_reviews}
                    description={`${mentor.title} with ${mentor.total_sessions} sessions`}
                    fallbackPrice={Number(mentor.hourly_rate)}
                    imageUrl={mentor.avatar_url}
                    verified={mentor.is_verified}
                    onClick={() => setActiveMentorId(mentor.id)}
                  />
                )
              })}
            </div>
          ) : (
            <div className="flex min-h-[360px] items-center justify-center rounded-[24px] bg-white p-12 text-center shadow-[0_16px_40px_rgba(18,28,42,0.04)] ring-1 ring-[#eff4ff] ring-inset">
              <div>
                <p className="mb-2 text-xl font-extrabold text-[#121c2a]">No coaches found</p>
                <p className="font-medium text-[#5f6472]">
                  Try a different category or search term.
                </p>
              </div>
            </div>
          )}

          {!isLoading && !isError && totalPages > 1 && (
            <div className="my-12 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || isFetching}
                className="flex size-11 items-center justify-center rounded-full bg-white text-[#434655] shadow-[0_10px_24px_rgba(18,28,42,0.05)] transition hover:bg-[#f7faff] disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-5" />
              </button>

              {getPageNumbers().map((pageNumber, index) => (
                <button
                  key={`${pageNumber}-${index}`}
                  type="button"
                  onClick={() => typeof pageNumber === 'number' && handlePageChange(pageNumber)}
                  disabled={pageNumber === '...' || isFetching}
                  className={`flex size-11 items-center justify-center rounded-full text-sm font-extrabold transition ${
                    pageNumber === page
                      ? 'bg-[#0053db] text-white shadow-[0_10px_22px_rgba(0,83,219,0.22)]'
                      : 'bg-white text-[#434655] shadow-[0_10px_24px_rgba(18,28,42,0.05)] hover:bg-[#f7faff]'
                  } disabled:cursor-default disabled:opacity-60`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages || isFetching}
                className="flex size-11 items-center justify-center rounded-full bg-white text-[#434655] shadow-[0_10px_24px_rgba(18,28,42,0.05)] transition hover:bg-[#f7faff] disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="Next page"
              >
                <ChevronRight className="size-5" />
              </button>
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
            <FreshersCoachesSidebar
              categories={visibleCategories}
              selectedCategory={selectedCategory}
              availableThisWeek={availableThisWeek}
              onCategoryChange={(category) => {
                handleCategoryChange(category)
                setShowMobileFilters(false)
              }}
              onAvailabilityChange={handleAvailabilityChange}
            />
          </div>
        </div>
      )}

      <FreshersCoachBookingModal
        key={activeMentorId ?? 'closed'}
        mentorId={activeMentorId}
        onClose={() => setActiveMentorId(null)}
      />
    </div>
  )
}
