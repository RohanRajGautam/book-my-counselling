import Image from 'next/image'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'

import type { EventResponse } from '../types/events.types'

interface EventSpeakerCardProps {
 speaker: Pick<
 EventResponse,
 | 'speaker_name'
 | 'speaker_title'
 | 'speaker_description'
 | 'speaker_image_url'
 | 'speaker_linkedin_url'
 >
}

/** Featured speaker block. Renders only when at least a name or image exists. */
export function EventSpeakerCard({ speaker }: EventSpeakerCardProps) {
 const {
 speaker_name,
 speaker_title,
 speaker_description,
 speaker_image_url,
 speaker_linkedin_url,
 } = speaker
 if (!speaker_name && !speaker_image_url) return null

 return (
 <section className="mx-auto w-full max-w-[1350px] px-5 py-6 sm:px-8">
 <div className="relative overflow-hidden rounded-[22px] border border-[#d9e3f6] bg-gradient-to-br from-white via-[#f8f9ff] to-[#eef4ff] p-6 shadow-[0_24px_60px_rgba(0,74,198,0.10)] sm:p-10">
 <div
 aria-hidden="true"
 className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-gradient-to-br from-[#6cf8bb]/30 via-[#dbe6ff]/40 to-transparent blur-3xl"
 />
 <div
 aria-hidden="true"
 className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-gradient-to-tr from-[#004ac6]/10 via-transparent to-transparent blur-3xl"
 />

 <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:gap-10 sm:text-left">
 <div className="relative size-32 shrink-0 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#eef4ff] via-[#dbe6ff] to-white shadow-[0_18px_40px_rgba(0,74,198,0.16)] ring-2 ring-white sm:size-40">
 {speaker_image_url ? (
 <Image
 src={speaker_image_url}
 alt={speaker_name ?? 'Featured speaker'}
 fill
 sizes="(min-width: 640px) 160px, 128px"
 className="object-cover"
 />
 ) : (
 <span className="font-headline absolute inset-0 grid place-items-center text-5xl font-extrabold text-[#004ac6]/40">
 {(speaker_name ?? '?').charAt(0).toUpperCase()}
 </span>
 )}
 </div>

 <div className="min-w-0 flex-1">
 <p className="inline-flex items-center gap-1.5 rounded-full border border-[#c9d7f4] bg-white/80 px-3 py-1 text-[11px] font-extrabold tracking-[0.16em] text-[#004ac6] uppercase shadow-[0_8px_20px_rgba(18,28,42,0.06)] backdrop-blur">
 <Sparkles className="size-3" aria-hidden="true" />
 Featured speaker
 </p>
 {speaker_name ? (
 <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
 <h3 className="font-headline text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
 {speaker_name}
 </h3>
 {speaker_linkedin_url ? (
 <Link
 href={speaker_linkedin_url}
 target="_blank"
 rel="noopener noreferrer"
 aria-label={`View ${speaker_name ?? 'speaker'} on LinkedIn`}
 className="inline-flex size-9 items-center justify-center rounded-full bg-[#e6eeff] text-[#0a66c2] transition hover:bg-[#0a66c2] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004ac6]/30"
 >
 <FaLinkedin className="size-4" aria-hidden="true" />
 </Link>
 ) : null}
 </div>
 ) : null}
 {speaker_title ? (
 <p className="mt-1.5 text-sm font-bold text-[#004ac6] sm:text-base">{speaker_title}</p>
 ) : null}
 {speaker_description ? (
 <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base sm:leading-8">
 {speaker_description}
 </p>
 ) : null}
 </div>
 </div>
 </div>
 </section>
 )
}