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

      {/* Upcoming */}
      {isLoading ? (
        <Section
          title="Upcoming events"
          subtitle="Curated gatherings you can still book."
          content={<EventCardSkeletonGrid count={6} />}
        />
      ) : upcomingItems.length > 0 ? (
        <Section
          title="Upcoming events"
          subtitle="Curated gatherings you can still book."
          countLabel={`${upcomingItems.length.toLocaleString('en-US')} upcoming`}
          content={
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {upcomingItems.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          }
        />
      ) : null}

      {/* Past */}
      {isLoading ? (
        <Section
          title="Past events"
          subtitle="Recap of moments that already happened."
          content={<EventCardSkeletonGrid count={6} />}
        />
      ) : pastItems.length > 0 ? (
        <Section
          title="Past events"
          subtitle="Recap of moments that already happened."
          countLabel={`${pastItems.length.toLocaleString('en-US')} past`}
          content={
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {pastItems.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          }
        />
      ) : null}

      {/* Empty fallback — only when both queries have settled with zero rows. */}
      {!isLoading && upcomingItems.length === 0 && pastItems.length === 0 ? (
        <section className="px-4 pb-6 sm:px-6 sm:pb-8 lg:px-8">
          <div className="mx-auto w-full max-w-[1280px]">
            <EventsEmptyState variant="upcoming" />
          </div>
        </section>
      ) : null}

      {/* CTA */}
      {/* <section className="px-5 pt-8 pb-12 sm:px-8">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center rounded-[22px] border border-[#d9e3f6] bg-gradient-to-br from-white via-[#f8f9ff] to-[#eef4ff] px-6 py-12 text-center shadow-[0_18px_50px_rgba(18,28,42,0.06)] sm:px-12">
          <h2 className="font-headline text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Want to be part of the next one?
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            New events drop here first. Follow along on LinkedIn, or reach out if you&apos;d like to
            bring an event to your city.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/mentors" />}
              className="rounded-full bg-[#004ac6] px-6 py-3 font-bold text-white shadow-[0_18px_36px_rgba(0,74,198,0.22)] hover:bg-[#003fa8]"
            >
              Explore mentors
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <Link
                  href="https://www.linkedin.com/company/book-your-counselling/"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              className="rounded-full border-slate-300 px-6 py-3 font-bold text-slate-700 hover:border-[#004ac6]/40 hover:text-[#004ac6]"
            >
              <Link2 className="size-4" aria-hidden="true" />
              Follow on LinkedIn
            </Button>
          </div>
        </div>
      </section> */}
    </main>
  )
}

interface SectionProps {
  title: string
  subtitle: string
  countLabel?: string
  content: React.ReactNode
}

function Section({ title, subtitle, countLabel, content }: SectionProps) {
  return (
    <section className="px-4 pt-8 pb-8 sm:px-6 sm:pt-12 sm:pb-10 lg:px-8">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h2 className="font-headline text-xl font-extrabold tracking-tight text-balance text-slate-900 sm:text-3xl">
              {title}
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>
          </div>
          {countLabel ? (
            <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-[#d9e3f6] bg-white/80 px-3 py-1 text-[11px] font-extrabold tracking-[0.12em] text-[#004ac6] uppercase shadow-sm sm:text-xs">
              <span className="size-1.5 rounded-full bg-[#004ac6]" aria-hidden="true" />
              {countLabel}
            </span>
          ) : null}
        </div>
        <div className="mt-6">{content}</div>
      </div>
    </section>
  )
}
