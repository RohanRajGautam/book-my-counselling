'use client'

import { Sparkles } from 'lucide-react'

import { usePastEvents, useUpcomingEvents } from '../hooks/useEvents'
import { EVENT_PAGE_SIZE } from '../lib/events.constants'

import { EventCard } from './EventCard'
import { EventCardSkeletonGrid } from './EventCardSkeleton'
import { EventsEmptyState } from './EventsEmptyState'

export function EventsListingPageContent() {
  const upcomingQuery = useUpcomingEvents(1, EVENT_PAGE_SIZE)
  const pastQuery = usePastEvents(1, EVENT_PAGE_SIZE)

  const isLoading = upcomingQuery.isLoading || pastQuery.isLoading
  const upcomingItems = upcomingQuery.data?.items ?? []
  const pastItems = pastQuery.data?.items ?? []

  // Upcoming first (so bookable events sit on top), then past as a recap.
  // Within each band the API already sorts by date — upcoming asc, past desc.
  const combined = [...upcomingItems, ...pastItems]
  const upcomingCount = upcomingItems.length
  const pastCount = pastItems.length

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8ff] pt-18 pb-20 lg:pt-16">
      {/* Hero */}
      <section className="relative isolate px-4 pt-6 pb-12 sm:px-8 sm:pt-8 lg:pt-8 lg:pb-16">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#ffffff_0%,#f8f9ff_48%,#eef4ff_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-[linear-gradient(90deg,transparent,#b4c5ff,transparent)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(#d9e3f6_1px,transparent_1px),linear-gradient(90deg,#d9e3f6_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_72%)] [background-size:72px_72px] opacity-[0.32]" />

        <div className="mx-auto w-full max-w-[1280px]">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[#c9d7f4] bg-white/74 px-3.5 py-1.5 text-[11px] font-extrabold tracking-[0.12em] text-[#003ea8] uppercase shadow-[0_14px_40px_rgba(18,28,42,0.07)] backdrop-blur sm:gap-1.5 sm:px-4 sm:py-2 sm:text-xs">
            <Sparkles className="size-3.5" aria-hidden="true" />
            BYC Events
          </p>
          <h1 className="font-headline mt-6 text-[clamp(1.75rem,7vw,4rem)] leading-[1.02] font-extrabold tracking-[-0.02em] text-balance text-slate-900 sm:mt-7">
            Real conversations.
            <br />
            Real connections.
          </h1>
          <p className="mt-4 max-w-6xl text-sm leading-7 text-slate-600 sm:mt-5 sm:text-base sm:leading-8">
            Intimate gatherings, fireside chats, and meetups across Kathmandu and beyond. Find your
            next room of curious minds — and book a seat before they fill up.
          </p>
        </div>
      </section>

      {/* Unified grid — upcoming first, then past, with a status tag on each card */}
      <section className="px-4 pt-4 pb-8 sm:px-6 sm:pt-8 sm:pb-10 lg:px-8">
        <div className="mx-auto w-full max-w-[1280px]">
          {!isLoading && combined.length > 0 ? (
            <div className="mb-5 flex flex-wrap items-center justify-end gap-2 sm:mb-6">
              {upcomingCount > 0 ? (
                <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-[#d9e3f6] bg-white/80 px-3 py-1 text-[11px] font-extrabold tracking-[0.12em] text-[#004ac6] uppercase shadow-sm sm:text-xs">
                  <span className="size-1.5 rounded-full bg-[#004ac6]" aria-hidden="true" />
                  {upcomingCount.toLocaleString('en-US')} upcoming
                </span>
              ) : null}
              {pastCount > 0 ? (
                <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-extrabold tracking-[0.12em] text-slate-600 uppercase shadow-sm sm:text-xs">
                  <span className="size-1.5 rounded-full bg-slate-400" aria-hidden="true" />
                  {pastCount.toLocaleString('en-US')} past
                </span>
              ) : null}
            </div>
          ) : null}

          {isLoading ? (
            <EventCardSkeletonGrid count={6} />
          ) : combined.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {combined.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <EventsEmptyState variant="upcoming" />
          )}
        </div>
      </section>
    </main>
  )
}