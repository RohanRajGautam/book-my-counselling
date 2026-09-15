import Image from 'next/image'
import type { LucideIcon } from 'lucide-react'
import { CalendarDays, Clock, MapPin, Sparkles } from 'lucide-react'

import { formatEventDate } from '../lib/events.utils'
import type { EventResponse } from '../types/events.types'

interface EventHeroProps {
 event: EventResponse
}

/**
 * Hero block at the top of the detail page. Single centered column with a
 * consistent vertical rhythm — eyebrow pill, headline, description, then a
 * single inline meta row showing date / time / location.
 */
export function EventHero({ event }: EventHeroProps) {
 const date = formatEventDate(event.event_date)
 const hasTime = Boolean(event.event_time)
 const hasLocation = Boolean(event.location)

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

 <div className="mx-auto w-full max-w-[1350px] px-5 pt-18 pb-14 sm:px-8 sm:pt-16 sm:pb-15 lg:pt-24">
 <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
 {event.partner ? (
 <span className="inline-flex max-w-[260px] items-center gap-1.5 rounded-full border border-[#c9d7f4] bg-white/74 px-3 py-1.5 text-[11px] leading-snug font-extrabold tracking-[0.12em] text-balance text-[#003ea8] uppercase backdrop-blur sm:max-w-none sm:gap-1.5 sm:px-4 sm:py-2 sm:text-xs">
 <Sparkles className="size-3.5 shrink-0" aria-hidden="true" />
 <span>
 <span className="hidden sm:inline">Presented with </span>
 <span className="sm:hidden">With </span>
 {event.partner}
 </span>
 </span>
 ) : (
 <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c9d7f4] bg-white/74 px-3 py-1.5 text-[11px] font-extrabold tracking-[0.12em] text-[#003ea8] uppercase backdrop-blur sm:px-4 sm:py-2 sm:text-xs">
 <Sparkles className="size-3.5" aria-hidden="true" />
 BYC Event
 </span>
 )}

 <h1 className="font-headline mt-6 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] font-extrabold tracking-tight text-slate-900 sm:mt-7">
 {event.title}
 </h1>

 <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:mt-6 sm:text-lg sm:leading-8">
 {event.description}
 </p>

 <MetaLine
 date={date}
 time={event.event_time}
 location={event.location}
 hasTime={hasTime}
 hasLocation={hasLocation}
 />
 </div>
 </div>
 </section>
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
 <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:mt-10">
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

interface EventCoverBannerProps {
 event: EventResponse
}

/** Full-bleed cover image banner — sits below the text hero. */
export function EventCoverBanner({ event }: EventCoverBannerProps) {
 if (!event.cover_image_url) return null

 return (
 <section className="mx-auto w-full max-w-[1350px] px-5 pb-8 sm:px-8">
 <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[22px] border border-[#d9e3f6] bg-gradient-to-br from-[#eef4ff] via-[#dbe6ff] to-white sm:aspect-[21/9]">
 <Image
 src={event.cover_image_url}
 alt={event.title}
 fill
 priority
 sizes="(min-width: 1280px) 1280px, 90vw"
 className="object-cover"
 />
 <div
 aria-hidden="true"
 className="absolute inset-0 bg-gradient-to-tr from-[#004ac6]/20 via-transparent to-transparent"
 />
 </div>
 </section>
 )
}
