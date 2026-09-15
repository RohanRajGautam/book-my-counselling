import type { TimelineItemResponse } from '../types/events.types'

interface EventTimelineProps {
 items: TimelineItemResponse[]
}

export function EventTimeline({ items }: EventTimelineProps) {
 if (items.length === 0) return null

 return (
 <section className="mx-auto w-full max-w-[1350px] px-5 py-12 sm:px-8 sm:py-16">
 <div className="mx-auto grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
 <div className="lg:sticky lg:top-28">
 <span
 aria-hidden="true"
 className="block h-1 w-12 rounded-full bg-gradient-to-r from-[#004ac6] to-[#6cf8bb]"
 />
 <p className="mt-5 text-xs font-extrabold tracking-[0.16em] text-[#004ac6] uppercase">
 The run of show
 </p>
 <h2 className="font-headline mt-2 text-3xl leading-[1.05] font-extrabold tracking-tight text-slate-900 sm:text-4xl">
 Event timeline.
 </h2>
 <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">
 Here&apos;s how the evening flows — settle in, grab a coffee, and let the conversations
 unfold.
 </p>
 </div>

 <ol className="relative">
 {/* Vertical line — spans the full list, sits behind the dots. */}
 <span
 aria-hidden="true"
 className="absolute top-3 bottom-3 left-[7px] w-px bg-gradient-to-b from-[#c9d7f4] via-[#dbe6ff] to-[#c9d7f4]"
 />

 {items.map((item) => (
 <li
 key={item.id}
 className="relative pb-8 pl-8 last:pb-0 sm:pb-10 sm:pl-10"
 >
 <span
 aria-hidden="true"
 className="absolute top-1.5 left-0 grid size-3.5 place-items-center rounded-full bg-white shadow-[0_4px_10px_rgba(0,74,198,0.18)] ring-4 ring-[#eef4ff]"
 >
 <span className="size-2 rounded-full bg-[#004ac6]" />
 </span>

 <p className="inline-flex items-center rounded-full bg-[#eef4ff] px-2.5 py-1 text-[11px] font-extrabold tracking-[0.16em] text-[#004ac6] uppercase">
 {item.time}
 </p>
 <h3 className="font-headline mt-2 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
 {item.title}
 </h3>
 {item.description ? (
 <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
 {item.description}
 </p>
 ) : null}
 </li>
 ))}
 </ol>
 </div>
 </section>
 )
}