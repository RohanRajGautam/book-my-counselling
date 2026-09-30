import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'

import type { EventResponse, EventSpeakerResponse } from '../types/events.types'

interface EventSpeakerCardProps {
  speakers: EventResponse['speakers']
}

/**
 * Speakers block on the public event detail page.
 *
 * - 0 speakers → renders nothing (don't render an empty section header).
 * - 1 speaker → single hero card (large photo + name + title + description + LinkedIn).
 * - 2+ speakers → horizontally-scrolling carousel on mobile, responsive grid on
 *   desktop. Clicking a card on desktop opens a modal with the full bio and
 *   LinkedIn link.
 */
export function EventSpeakerCard({ speakers }: EventSpeakerCardProps) {
  const sorted = useMemo(
    () => [...speakers].sort((a, b) => a.order_index - b.order_index),
    [speakers]
  )

  const [activeId, setActiveId] = useState<string | null>(null)

  if (sorted.length === 0) return null

  if (sorted.length === 1) {
    return (
      <section className="mx-auto w-full max-w-[1350px] px-5 py-6 sm:px-8">
        <SoloHero speaker={sorted[0]!} />
      </section>
    )
  }

  const active = activeId ? (sorted.find((s) => s.id === activeId) ?? null) : null

  return (
    <>
      <section className="mx-auto w-full max-w-[1350px] px-5 py-6 sm:px-8">
        <header className="mb-8 flex flex-col items-center gap-1 px-1 text-center sm:px-0">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[#c9d7f4] bg-white/80 px-3 py-1 text-[11px] font-extrabold tracking-[0.16em] text-[#004ac6] uppercase shadow-[0_8px_20px_rgba(18,28,42,0.06)]">
            <Sparkles className="size-3" aria-hidden="true" />
            Speakers
          </p>
          <h2 className="font-headline mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            The voices on stage
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
            Tap a speaker to read their bio.
          </p>
        </header>

        {/* Mobile: horizontal carousel. Desktop (sm+): responsive grid. */}
        <ol
          className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:justify-items-center sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-3 xl:grid-cols-4"
          aria-label="Event speakers"
        >
          {sorted.map((speaker) => (
            <li
              key={speaker.id}
              className="shrink-0 basis-[78%] snap-start sm:w-full sm:max-w-xs sm:basis-auto"
            >
              <SpeakerTile speaker={speaker} onOpen={() => setActiveId(speaker.id)} />
            </li>
          ))}
        </ol>
      </section>

      {active ? <SpeakerBioModal speaker={active} onClose={() => setActiveId(null)} /> : null}
    </>
  )
}

// ── Single-speaker hero card ────────────────────────────────────────────

function SoloHero({ speaker }: { speaker: EventSpeakerResponse }) {
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-[#d9e3f6] bg-gradient-to-br from-white via-[#f8f9ff] to-[#eef4ff] p-6 shadow-[0_24px_60px_rgba(0,74,198,0.10)] sm:p-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-gradient-to-br from-[#6cf8bb]/30 via-[#dbe6ff]/40 to-transparent blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-gradient-to-tr from-[#004ac6]/10 via-transparent to-transparent blur-3xl"
      />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <div className="relative size-32 shrink-0 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#eef4ff] via-[#dbe6ff] to-white shadow-[0_18px_40px_rgba(0,74,198,0.16)] ring-2 ring-white sm:size-40">
          {speaker.image_url ? (
            <Image
              src={speaker.image_url}
              alt={speaker.name}
              fill
              sizes="(min-width: 640px) 160px, 128px"
              className="object-cover"
            />
          ) : (
            <span className="font-headline absolute inset-0 grid place-items-center text-5xl font-extrabold text-[#004ac6]/40">
              {speaker.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[#c9d7f4] bg-white/80 px-3 py-1 text-[11px] font-extrabold tracking-[0.16em] text-[#004ac6] uppercase shadow-[0_8px_20px_rgba(18,28,42,0.06)] backdrop-blur">
            <Sparkles className="size-3" aria-hidden="true" />
            Featured speaker
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <h3 className="font-headline text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {speaker.name}
            </h3>
            {speaker.linkedin_url ? (
              <Link
                href={speaker.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${speaker.name} on LinkedIn`}
                className="inline-flex size-9 items-center justify-center rounded-full bg-[#e6eeff] text-[#0a66c2] transition hover:bg-[#0a66c2] hover:text-white focus-visible:ring-2 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none"
              >
                <FaLinkedin className="size-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
          {speaker.title ? (
            <p className="mt-1.5 text-sm font-bold text-[#004ac6] sm:text-base">{speaker.title}</p>
          ) : null}
          {speaker.description ? (
            <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base sm:leading-8">
              {speaker.description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

// ── Multi-speaker grid/carousel tile ────────────────────────────────────

function SpeakerTile({ speaker, onOpen }: { speaker: EventSpeakerResponse; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex h-full w-full flex-col items-center gap-3 rounded-[22px] border border-[#d9e3f6] bg-white p-5 text-center shadow-[0_18px_50px_rgba(18,28,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(0,74,198,0.16)] focus-visible:ring-2 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none sm:items-center sm:p-6"
      aria-label={`Read bio of ${speaker.name}`}
    >
      <div className="relative size-24 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#eef4ff] via-[#dbe6ff] to-white shadow-[0_12px_28px_rgba(0,74,198,0.10)] ring-2 ring-white sm:size-28">
        {speaker.image_url ? (
          <Image
            src={speaker.image_url}
            alt={speaker.name}
            fill
            sizes="(min-width: 640px) 112px, 96px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <span className="font-headline absolute inset-0 grid place-items-center text-3xl font-extrabold text-[#004ac6]/40">
            {speaker.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-center gap-2">
          <h3 className="font-headline text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
            {speaker.name}
          </h3>
          {speaker.linkedin_url ? (
            <span
              aria-hidden="true"
              className="inline-flex size-5 items-center justify-center rounded-full bg-[#e6eeff] text-[#0a66c2]"
            >
              <FaLinkedin className="size-3" />
            </span>
          ) : null}
        </div>
        {speaker.title ? (
          <p className="mt-0.5 text-xs font-bold text-[#004ac6] sm:text-sm">{speaker.title}</p>
        ) : null}
      </div>
    </button>
  )
}

// ── Bio modal (desktop click target; also used on mobile for full bio) ──

function SpeakerBioModal({
  speaker,
  onClose,
}: {
  speaker: EventSpeakerResponse
  onClose: () => void
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${speaker.name} bio`}
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 px-4 pt-12 pb-0 backdrop-blur-sm sm:items-center sm:py-12"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-t-[28px] bg-white shadow-2xl ring-1 ring-slate-200/70 sm:rounded-[22px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow ring-1 ring-slate-200/70 transition hover:bg-white"
        >
          <X className="size-4" />
        </button>

        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-[#eef4ff] via-[#dbe6ff] to-white">
          {speaker.image_url ? (
            <Image
              src={speaker.image_url}
              alt={speaker.name}
              fill
              sizes="(min-width: 640px) 448px, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="font-headline absolute inset-0 grid place-items-center text-7xl font-extrabold text-[#004ac6]/30">
              {speaker.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 via-black/10 to-transparent"
          />
          <div className="absolute right-4 bottom-3 left-4 text-white drop-shadow-md">
            <p className="text-[11px] font-extrabold tracking-[0.16em] uppercase opacity-90">
              Speaker
            </p>
            <h3 className="font-headline mt-1 text-2xl font-extrabold tracking-tight">
              {speaker.name}
            </h3>
            {speaker.title ? (
              <p className="mt-1 text-sm font-bold text-white/95">{speaker.title}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          {speaker.description ? (
            <p className="text-sm leading-7 text-slate-700 sm:text-base sm:leading-8">
              {speaker.description}
            </p>
          ) : (
            <p className="text-sm text-slate-500 italic">
              Bio coming soon — check back closer to the event.
            </p>
          )}

          {speaker.linkedin_url ? (
            <Link
              href={speaker.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#0a66c2] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#0a55a8] focus-visible:ring-2 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none"
            >
              <FaLinkedin className="size-4" aria-hidden />
              Connect on LinkedIn
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  )
}
