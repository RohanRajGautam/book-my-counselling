import Image from 'next/image'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowUpRight,
  CalendarCheck2,
  CalendarDays,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

import { formatEventDate } from '../lib/events.utils'
import type { EventResponse } from '../types/events.types'

interface EventHeroProps {
  event: EventResponse
  /**
   * If the event has an external registration form, this is the URL the
   * hero's "Save your seat" button opens in a new tab. Otherwise the
   * button scrolls to `reserveAnchor` (the in-page booking form section).
   */
  externalFormHref: string | null
  /** Anchor the in-page "Save your seat" button scrolls to. */
  reserveAnchor: string
}

/**
 * Hero block at the top of the detail page. Two-column layout on desktop:
 * the left column carries the breadcrumb (replacing the old BYC Event
 * pill), title, description, meta pills and the Save-your-seat CTA; the
 * right column shows the cover image in full (`object-contain`) so nothing
 * is cropped regardless of aspect ratio.
 */
export function EventHero({ event, externalFormHref, reserveAnchor }: EventHeroProps) {
  const date = formatEventDate(event.event_date)
  const hasTime = Boolean(event.event_time)
  const hasLocation = Boolean(event.location)
  const isBookable = !event.is_completed

  return (
    <section className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#ffffff_0%,#f8f9ff_48%,#eef4ff_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-[linear-gradient(90deg,transparent,#b4c5ff,transparent)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(#d9e3f6_1px,transparent_1px),linear-gradient(90deg,#d9e3f6_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_72%)] [background-size:72px_72px] opacity-[0.32]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-[-8%] -z-10 size-[460px] rounded-full bg-gradient-to-br from-[#6cf8bb]/35 via-[#dbe6ff]/40 to-transparent blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 left-[-10%] -z-10 size-[520px] rounded-full bg-gradient-to-tr from-[#004ac6]/14 via-transparent to-transparent blur-3xl"
      />

      <div className="mx-auto w-full max-w-[1350px] px-5 pt-10 pb-14 sm:px-8 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14 xl:gap-16">
          <div className="order-2 flex flex-col items-start text-left lg:order-1">
            <HeroBreadcrumb eventTitle={event.title} />

            <h1 className="font-headline mt-6 text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] font-extrabold tracking-tight text-slate-900 sm:mt-7">
              {event.title}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-700 sm:mt-6 sm:text-lg sm:leading-8">
              {event.description}
            </p>

            <MetaLine
              date={date}
              time={event.event_time}
              location={event.location}
              hasTime={hasTime}
              hasLocation={hasLocation}
            />

            {isBookable ? (
              <SaveYourSeatCta externalFormHref={externalFormHref} reserveAnchor={reserveAnchor} />
            ) : (
              <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur sm:mt-10">
                <span className="size-1.5 rounded-full bg-slate-400" aria-hidden="true" />
                This event has ended
              </span>
            )}
          </div>

          <div className="order-1 lg:order-2">
            <CoverImage event={event} />
          </div>
        </div>
      </div>
    </section>
  )
}

interface HeroBreadcrumbProps {
  eventTitle: string
}

/**
 * Pill-shaped breadcrumb that sits where the old "BYC Event" / "Presented
 * with X" eyebrow used to live. The first crumb ("All events") is a link
 * back to the listing; the final crumb is the current event title.
 */
function HeroBreadcrumb({ eventTitle }: HeroBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="inline-flex max-w-full flex-wrap items-center gap-1.5 rounded-full border border-[#c9d7f4] bg-white/74 px-3 py-1.5 text-[11px] tracking-[0.12em] uppercase backdrop-blur sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
        <li>
          <Link
            href="/events"
            className="inline-flex items-center gap-1 font-extrabold text-[#003ea8] transition hover:text-[#004ac6]"
          >
            <Sparkles className="size-3.5 shrink-0" aria-hidden="true" />
            All events
          </Link>
        </li>
        <li aria-hidden="true" className="text-slate-300">
          <ChevronRight className="size-3.5 sm:size-4" />
        </li>
        <li className="line-clamp-1 max-w-[40ch] font-extrabold tracking-normal text-slate-700 normal-case">
          {eventTitle}
        </li>
      </ol>
    </nav>
  )
}

interface CoverImageProps {
  event: EventResponse
}

/**
 * Cover image rendered to the right of the hero text. Uses `object-contain`
 * inside a 4:3 frame so the entire image is always visible — nothing is
 * cropped no matter the source aspect ratio. The frame keeps a subtle
 * gradient background so portrait or square covers don't float on white.
 */
function CoverImage({ event }: CoverImageProps) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] border border-[#d9e3f6] bg-gradient-to-br from-[#eef4ff] via-[#dbe6ff] to-[#f7faff] shadow-[0_24px_60px_rgba(18,28,42,0.10)] sm:aspect-[5/4]">
      {event.cover_image_url ? (
        <Image
          src={event.cover_image_url}
          alt={event.title}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="rounded-[40px] object-contain p-3 sm:p-5"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-headline text-6xl font-extrabold tracking-tight text-[#004ac6]/30 sm:text-7xl">
            {event.title.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-[#004ac6]/5 ring-inset sm:rounded-[40px]"
      />
    </div>
  )
}

interface SaveYourSeatCtaProps {
  externalFormHref: string | null
  reserveAnchor: string
}

/**
 * Primary CTA in the hero. When the admin attached an external form
 * (Google Forms, Typeform, …) the button opens it in a new tab. Otherwise
 * it scrolls down to the booking form anchor without leaving the page.
 */
function SaveYourSeatCta({ externalFormHref, reserveAnchor }: SaveYourSeatCtaProps) {
  const baseClass =
    'mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-bold shadow-[0_18px_36px_rgba(0,74,198,0.22)] transition sm:mt-10'

  if (externalFormHref) {
    return (
      <Button
        nativeButton={false}
        render={<Link href={externalFormHref} target="_blank" rel="noopener noreferrer" />}
        className={`${baseClass} bg-[#004ac6] text-white hover:bg-[#003da8]`}
      >
        <CalendarCheck2 className="size-4" aria-hidden="true" />
        Save your seat
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </Button>
    )
  }

  return (
    <Button
      nativeButton={false}
      render={<Link href={reserveAnchor} aria-label="Jump to the seat booking form" />}
      className={`${baseClass} bg-[#004ac6] text-white hover:bg-[#003da8]`}
    >
      <CalendarCheck2 className="size-4" aria-hidden="true" />
      Save your seat
    </Button>
  )
}

interface MetaLineProps {
  date: string
  time: string | null
  location: string | null
  hasTime: boolean
  hasLocation: boolean
}

/**
 * Inline meta row — one pill per piece of info (date, time, venue) so every
 * item sits in its own consistent badge. Wraps freely on narrow screens.
 */
function MetaLine({ date, time, location, hasTime, hasLocation }: MetaLineProps) {
  return (
    <div className="mt-7 flex flex-wrap items-center gap-2.5 sm:mt-8">
      <MetaPill icon={CalendarDays} label={date} />
      {hasTime && time ? <MetaPill icon={Clock} label={time} /> : null}
      {hasLocation && location ? <MetaPill icon={MapPin} label={location} /> : null}
    </div>
  )
}

function MetaPill({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#d9e3f6] bg-white/85 px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur">
      <Icon className="size-4 shrink-0 text-[#004ac6]" aria-hidden="true" />
      <span className="break-words">{label}</span>
    </span>
  )
}
