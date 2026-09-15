import { Quote } from 'lucide-react'

import type { EventResponse } from '../types/events.types'

interface EventAboutSectionProps {
 event: EventResponse
}

/** Longer "About" copy. Renders only when the event has body content. */
export function EventAboutSection({ event }: EventAboutSectionProps) {
 if (!event.about) return null
 return (
 <section className="mx-auto w-full max-w-[1350px] px-5 py-12 sm:px-8 sm:py-16">
 <div className="mx-auto grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
 <div className="lg:sticky lg:top-28">
 <span
 aria-hidden="true"
 className="block h-1 w-12 rounded-full bg-gradient-to-r from-[#004ac6] to-[#6cf8bb]"
 />
 <p className="mt-5 text-xs font-extrabold tracking-[0.16em] text-[#004ac6] uppercase">
 About this event
 </p>
 <h2 className="font-headline mt-2 text-3xl leading-[1.05] font-extrabold tracking-tight text-slate-900 sm:text-4xl">
 The story behind the gathering.
 </h2>
 <Quote className="mt-6 hidden size-10 text-[#004ac6]/15 lg:block" aria-hidden="true" />
 </div>
 <div className="prose prose-slate max-w-none text-base leading-8 text-slate-700 sm:text-lg sm:leading-9">
 {event.about.split(/\n\n+/).map((paragraph, idx) => (
 <p key={idx} className="mb-5 last:mb-0">
 {paragraph}
 </p>
 ))}
 </div>
 </div>
 </section>
 )
}