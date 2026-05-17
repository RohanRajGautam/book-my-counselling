'use client'

import { useFilters } from '@/features/filters/context/FilterContext'
import { MentorSearchBar } from '@/features/mentors/components/MentorSearchBar'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { type PointerEvent, useState } from 'react'
import { ArrowUpRight, CalendarDays, Clock3, Info, Sparkles, Users } from 'lucide-react'
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
    router.push('/booking?isEvent=true')
  }

  return (
    <section className="relative isolate overflow-hidden px-5 pt-5 pb-14 sm:px-8 lg:pt-10 lg:pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#ffffff_0%,#f8f9ff_48%,#eef4ff_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-[linear-gradient(90deg,transparent,#b4c5ff,transparent)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(#d9e3f6_1px,transparent_1px),linear-gradient(90deg,#d9e3f6_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_72%)] [background-size:72px_72px] opacity-[0.34]" />

      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-14 xl:gap-20">
        {/* LEFT CONTENT */}
        <div className="mx-auto w-full max-w-3xl text-center lg:mx-0 lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c9d7f4] bg-white/74 px-4 py-2 text-xs font-extrabold tracking-[0.12em] text-[#003ea8] uppercase shadow-[0_14px_40px_rgba(18,28,42,0.07)] backdrop-blur">
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

          {/* <div className="mx-auto mt-9 grid max-w-2xl gap-3 text-left sm:grid-cols-3 lg:mx-0">
            {['Industry mentors', 'Focused guidance', 'Actionable next steps'].map((item) => (
              <div
                key={item}
                className="flex min-h-14 items-center gap-2 rounded-lg border border-[#d9e3f6] bg-white/72 px-4 text-sm font-bold text-[#27313f] shadow-[0_10px_26px_rgba(18,28,42,0.05)] backdrop-blur"
              >
                <CheckCircle2 className="size-4 shrink-0 text-[#004ac6]" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div> */}

          <div className="mx-auto mt-9 max-w-2xl lg:mx-0">
            <MentorSearchBar
              value={filters.jobTitle ?? ''}
              onChange={(value) => updateFilter('jobTitle', value)}
              onSubmit={handleSearchSubmit}
            />
          </div>

          {/* <div className="mx-auto mt-9 flex max-w-2xl gap-5 border-t border-[#d9e3f6] pt-6 sm:flex-row sm:items-center sm:justify-between lg:mx-0">
            {[
              ['1:1', 'Personal guidance'],
              ['100+', 'Curated mentor seats'],
              ['1000+', 'Booked sessions'],
            ].map(([value, label]) => (
              <div key={label} className="text-center sm:text-left">
                <p className="font-[family-name:var(--font-headline)] text-2xl font-extrabold tracking-tight text-[#121c2a]">
                  {value}
                </p>
                <p className="mt-1 text-xs font-bold tracking-[0.12em] text-[#737686] uppercase">
                  {label}
                </p>
              </div>
            ))}
          </div> */}
        </div>

        {/* RIGHT CARD */}
        <div className="relative mx-auto w-full max-w-[630px] lg:mx-0 lg:justify-self-end">
          <div
            className="hero-flip-scene cursor-pointer touch-manipulation"
            onMouseEnter={() => setIsCardFlipped(true)}
            onMouseLeave={() => setIsCardFlipped(false)}
            onPointerUp={handleCardTouchPress}
          >
            <div className={`hero-flip-card relative grid ${isCardFlipped ? 'is-flipped' : ''}`}>
              <div
                className={`hero-flip-face col-start-1 row-start-1 h-full ${
                  isCardFlipped ? 'pointer-events-none' : ''
                }`}
                aria-hidden={isCardFlipped}
              >
                <div className="relative h-full rounded-[1.6rem] border border-white/80 bg-white/86 p-2.5 shadow-[0_28px_70px_rgba(18,28,42,0.13)] ring-1 ring-[#d9e3f6]/80 backdrop-blur">
                  <div className="absolute inset-x-8 -bottom-6 -z-10 h-24 rounded-full bg-[#004ac6]/14 blur-3xl" />

                  <button
                    type="button"
                    onClick={() => setIsCardFlipped(true)}
                    className="absolute top-4 left-4 z-20 grid size-10 place-items-center rounded-full border border-white/80 bg-white/90 text-[#004ac6] shadow-[0_14px_32px_rgba(18,28,42,0.12)] transition hover:-translate-y-0.5 hover:bg-white focus:ring-3 focus:ring-[#004ac6]/20 focus:outline-none"
                    aria-label="View more event information"
                  >
                    <Info className="size-4" aria-hidden="true" />
                  </button>

                  <div className="absolute top-4 right-4 z-20 hidden rounded-full bg-[#004ac6] px-4 py-2 text-[11px] font-extrabold tracking-[0.18em] text-white uppercase shadow-[0_18px_36px_rgba(0,74,198,0.22)] sm:block">
                    Only {FEATURED_EVENT.seats} seats
                  </div>

                  <div className="overflow-hidden rounded-[1.2rem] bg-white">
                    <div className="relative min-h-[220px] overflow-hidden rounded-[1rem] bg-[linear-gradient(140deg,#eef4ff_0%,#dbe6ff_48%,#ffffff_100%)] sm:min-h-[250px]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(255,255,255,0.78),transparent_34%),linear-gradient(180deg,transparent_58%,rgba(255,255,255,0.62)_100%)]" />
                      <div className="absolute right-8 bottom-8 left-8 h-20 rounded-[50%] bg-white/72 blur-md" />

                      <Image
                        src={FEATURED_EVENT.guest.imageUrl}
                        alt={`${FEATURED_EVENT.guest.name} portrait`}
                        width={900}
                        height={1125}
                        priority
                        sizes="(min-width: 1024px) 420px, 90vw"
                        className="absolute right-0 bottom-0 h-[110%] w-full object-contain object-bottom drop-shadow-[0_22px_30px_rgba(18,28,42,0.2)]"
                      />

                      <div className="absolute bottom-0 flex h-14 w-full items-center justify-center bg-blue-700 px-3 text-center font-bold text-white">
                        <span className="text-balance">{FEATURED_EVENT.topic}</span>
                      </div>
                    </div>

                    <div className="px-4 pt-4 pb-4 sm:px-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="mb-2 text-[11px] font-extrabold tracking-[0.16em] text-[#737686] uppercase">
                            Exclusive Event
                          </p>

                          <h2 className="font-[family-name:var(--font-headline)] text-2xl font-extrabold tracking-tight text-[#121c2a] sm:text-[1.6rem]">
                            {FEATURED_EVENT.guest.name}
                          </h2>
                        </div>

                        <div className="rounded-xl border border-[#d9e3f6] bg-[#f8f9ff] px-4 py-3 text-left sm:text-right">
                          <p className="text-[10px] font-extrabold tracking-[0.18em] text-[#737686] uppercase">
                            Register at just
                          </p>

                          <p className="mt-1 font-[family-name:var(--font-headline)] text-xl font-extrabold tracking-tight text-[#121c2a]">
                            NPR {FEATURED_EVENT.pricePerSeat}/seat
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 border-t border-[#eff4ff] pt-4 text-sm text-[#121c2a]">
                        {FEATURED_EVENT.highlights.map((item) => (
                          <div
                            key={item}
                            className="flex items-center gap-3 rounded-lg bg-[#f8f9ff] px-3 py-1.5"
                          >
                            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#e6eeff]">
                              <span className="size-2 rounded-full bg-[#004ac6]" />
                            </span>
                            <span className="font-medium">{item}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleSecureSpot}
                        className="mt-4 flex h-10 w-full items-center justify-center gap-3 rounded-xl bg-[#004ac6] px-6 font-[family-name:var(--font-headline)] text-sm font-extrabold text-white shadow-[0_18px_34px_rgba(0,74,198,0.22)] transition hover:bg-[#003fa8] focus:ring-3 focus:ring-[#004ac6]/25 focus:outline-none active:translate-y-px"
                      >
                        Secure Spot
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`hero-flip-face hero-flip-face-back absolute inset-0 ${
                  isCardFlipped ? '' : 'pointer-events-none'
                }`}
                aria-hidden={!isCardFlipped}
              >
                <div className="relative h-full rounded-[1.6rem] border border-white/80 bg-white/86 p-2.5 shadow-[0_28px_70px_rgba(18,28,42,0.13)] ring-1 ring-[#d9e3f6]/80 backdrop-blur">
                  <div className="absolute inset-x-8 -bottom-6 -z-10 h-24 rounded-full bg-[#004ac6]/14 blur-3xl" />

                  <div className="relative flex h-full flex-col overflow-y-auto overscroll-contain rounded-[1.2rem] bg-white p-5 sm:p-6">
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,#eef4ff_0%,#ffffff_42%,#f8f9ff_100%)]" />
                    <div className="pointer-events-none absolute -top-24 right-10 size-56 rounded-full bg-[#dbe6ff]/70 blur-3xl" />

                    <div className="relative">
                      <p className="text-[11px] font-extrabold tracking-[0.16em] text-[#737686] uppercase">
                        Exclusive Guest
                      </p>
                      <h3 className="mt-3 font-[family-name:var(--font-headline)] text-2xl leading-tight font-extrabold tracking-tight text-[#121c2a] sm:text-[1.6rem]">
                        {FEATURED_EVENT.guest.name}
                      </h3>
                      <p className="mt-3 max-w-md text-sm leading-7 text-[#434655]">
                        {FEATURED_EVENT.bio}
                      </p>
                    </div>

                    <div className="relative mt-8 grid grid-cols-3 gap-2 sm:mt-5">
                      {eventDetails.map(({ Icon, title, label }) => (
                        <div
                          key={title}
                          className="rounded-xl border border-[#d9e3f6] bg-[#f8f9ff] p-3"
                        >
                          <Icon className="size-5 text-[#004ac6]" aria-hidden="true" />
                          <p className="mt-3 font-[family-name:var(--font-headline)] text-sm font-extrabold text-[#121c2a]">
                            {title}
                          </p>
                          <p className="mt-1 text-xs font-medium text-[#737686]">{label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="relative mt-auto pt-4">
                      <button
                        type="button"
                        onClick={handleSecureSpot}
                        className="mt-4 flex h-10 w-full items-center justify-center gap-3 rounded-xl bg-[#004ac6] px-6 font-[family-name:var(--font-headline)] text-sm font-extrabold text-white shadow-[0_18px_34px_rgba(0,74,198,0.22)] transition hover:bg-[#003fa8] focus:ring-3 focus:ring-[#004ac6]/25 focus:outline-none active:translate-y-px"
                      >
                        Secure Spot
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
