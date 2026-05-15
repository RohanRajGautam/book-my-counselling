'use client'

import { useFilters } from '@/features/filters/context/FilterContext'
import { MentorSearchBar } from '@/features/mentors/components/MentorSearchBar'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { type PointerEvent, useState } from 'react'
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Info,
  Sparkles,
  Users,
} from 'lucide-react'
import { FEATURED_EVENT } from '@/features/home/lib/featuredEvent'

export function HeroSection() {
  const { filters, updateFilter } = useFilters()
  const [isCardFlipped, setIsCardFlipped] = useState(false)
  const eventDetails = [
    { Icon: CalendarDays, title: 'Live session', label: 'Interactive format' },
    { Icon: Clock3, title: `${FEATURED_EVENT.durationMinutes} minutes`, label: 'Compact workshop' },
    { Icon: Users, title: `${FEATURED_EVENT.seats} seats`, label: 'Small cohort' },
  ]
  const router = useRouter()

  const handleSearchSubmit = () => {
    const resultsSection = document.getElementById('mentor-discovery')

    if (resultsSection) {
      resultsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  const handleCardTouchPress = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch') return

    const target = event.target as HTMLElement
    if (target.closest('button, a, input, select, textarea')) return

    setIsCardFlipped((current) => !current)
  }

  const handleSecureSpot = () => {
    router.push('/booking?role=guest')
  }

  return (
    <section className="relative isolate overflow-hidden px-5 pt-5 pb-14 sm:px-8 lg:pt-10 lg:pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#ffffff_0%,#f8f9ff_48%,#eef4ff_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-[linear-gradient(90deg,transparent,#b4c5ff,transparent)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(#d9e3f6_1px,transparent_1px),linear-gradient(90deg,#d9e3f6_1px,transparent_1px)] [mask-image:line[...]

      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-14 xl:gap-20">
        {/* LEFT CONTENT */}
        <div className="mx-auto w-full max-w-3xl text-center lg:mx-0 lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c9d7f4] bg-white/74 px-4 py-2 text-xs font-extrabold tracking-[0.12em] text-[#003ea8] uppercase shadow-[0_14px[...]
            <Sparkles className="size-4" aria-hidden="true" />
            1:1 Mentorship
          </div>

          <h1 className="mt-7 max-w-4xl font-[family-name:var(--font-headline)] text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.96] font-extrabold tracking-tight text-[#121c2a]">
            Your career journey,{' '}
            <span className="relative isolate inline-block text-[#004ac6]">
              curated
              <span className="absolute right-0 -bottom-0.5 left-0 -z-10 h-1.5 rounded-full bg-[#6cf8bb]/55" />
            </span>
            .
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#434655] sm:text-lg lg:mx-0">
            Connect with world-class mentors from industry giants and top universities to navigate
            your professional growth with precision.
          </p>

          <div className="mx-auto mt-9 max-w-2xl lg:mx-0">
            <MentorSearchBar
              value={filters.jobTitle ?? ''}
              onChange={(value) => updateFilter('jobTitle', value)}
              onSubmit={handleSearchSubmit}
            />
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="relative mx-auto w-full max-w-[630px] lg:mx-0 lg:justify-self-end">
          <div className="absolute top-4 right-4 z-20 hidden rounded-full bg-[#004ac6] px-4 py-2 text-[11px] font-extrabold tracking-[0.18em] text-white uppercase shadow-[0_18px_36px_rgba(0,74,19[...]
            Only {FEATURED_EVENT.seats} seats
          </div>
          <div
            className="group/card cursor-pointer touch-manipulation [perspective:1400px] overflow-auto"
            onMouseEnter={() => setIsCardFlipped(true)}
            onMouseLeave={() => setIsCardFlipped(false)}
            onPointerUp={handleCardTouchPress}
          >
            <div
              className={`relative grid transition-transform duration-700 [transform-style:preserve-3d] group-hover/card:[transform:rotateY(180deg)] ${isCardFlipped ? '[transform:rotateY(180deg)][...]`}
            >
              <div
                className={`col-start-1 row-start-1 h-full [backface-visibility:hidden] ${isCardFlipped ? 'pointer-events-none' : ''}
                  } group-hover/card:pointer-events-none`}
                aria-hidden={isCardFlipped}
              >
                <div className="relative h-full rounded-[1.6rem] border border-white/80 bg-white/86 p-2.5 shadow-[0_28px_70px_rgba(18,28,42,0.13)] ring-1 ring-[#d9e3f6]/80 backdrop-blur">
                  <div className="absolute inset-x-8 -bottom-6 -z-10 h-24 rounded-full bg-[#004ac6]/14 blur-3xl" />
                  <button
                    type="button"
                    onClick={() => setIsCardFlipped(true)}
                    className="absolute top-4 left-4 z-20 grid size-10 place-items-center rounded-full border border-white/80 bg-white/90 text-[#004ac6] shadow-[0_14px_32px_rgba(18,28,42,0.12)] text-size-[large]">
                    <span className="ml-[hidden[0...]][EnsureTS...