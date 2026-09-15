import Image from 'next/image'

import type { TestimonialResponse } from '../types/events.types'

interface EventTestimonialsListProps {
 testimonials: TestimonialResponse[]
}

export function EventTestimonialsList({ testimonials }: EventTestimonialsListProps) {
 if (testimonials.length === 0) return null

 return (
 <section className="mx-auto w-full max-w-[1350px] px-5 py-12 sm:px-8 sm:py-16">
 <div className="mx-auto grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
 <div className="lg:sticky lg:top-28">
 <span
 aria-hidden="true"
 className="block h-1 w-12 rounded-full bg-gradient-to-r from-[#004ac6] to-[#6cf8bb]"
 />
 <p className="mt-5 text-xs font-extrabold tracking-[0.16em] text-[#004ac6] uppercase">
 Reflections
 </p>
 <h2 className="font-headline mt-2 text-3xl leading-[1.05] font-extrabold tracking-tight text-slate-900 sm:text-4xl">
 What past attendees said.
 </h2>
 <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">
 Honest words from people who showed up, listened, and stayed late into the evening.
 </p>
 </div>

 <div className="grid gap-4 sm:grid-cols-2">
 {testimonials.map((t) => (
 <article
 key={t.id}
 className="flex h-full flex-col rounded-[22px] border border-slate-100 bg-white p-8 sm:p-9"
 >
 <blockquote className="text-base leading-[1.65] font-medium text-slate-800 sm:text-lg">
 &ldquo;{t.content}&rdquo;
 </blockquote>

 <div className="mt-auto flex items-center gap-4 pt-8">
 <div className="size-12 shrink-0 overflow-hidden rounded-full shadow-[0_8px_18px_rgba(15,23,42,0.14)] ring-1 ring-slate-100">
 {t.image_url ? (
 <Image
 src={t.image_url}
 alt={t.name}
 width={96}
 height={96}
 className="size-full object-cover"
 />
 ) : (
 <span className="grid size-full place-items-center bg-[#eef4ff] font-[family-name:var(--font-headline)] text-base font-extrabold text-[#004ac6]">
 {t.name.charAt(0).toUpperCase()}
 </span>
 )}
 </div>
 <div className="min-w-0">
 <p className="font-headline text-base font-extrabold text-slate-950">{t.name}</p>
 <p className="mt-1 truncate text-sm text-slate-500">Event attendee</p>
 </div>
 </div>
 </article>
 ))}
 </div>
 </div>
 </section>
 )
}