import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export interface EventCardDetails {
  guestName?: string
  guestDesc: string
  imageUrl?: string
  topic: string
  highlights: string[]
  seats: number
  pricePerSeat: number
}

interface EventCardProps {
  event: EventCardDetails
}

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="relative h-full rounded-[1.6rem] border border-white/80 bg-white/86 p-2.5 shadow-[0_28px_70px_rgba(18,28,42,0.1)] ring-1 ring-[#d9e3f6]/80 backdrop-blur">
      <div className="absolute inset-x-8 -bottom-6 -z-10 h-24 rounded-full bg-[#004ac6]/14 blur-3xl" />

      {/* <div className="absolute top-4 right-4 z-20 hidden rounded-full bg-[#004ac6] px-4 py-2 text-[11px] font-extrabold tracking-[0.18em] text-white uppercase shadow-[0_18px_36px_rgba(0,74,198,0.22)] sm:block">
        Only {event.seats} seats
      </div> */}

      <div className="flex h-full flex-col overflow-hidden rounded-[1.2rem] bg-white">
        <div className="relative min-h-[220px] overflow-hidden rounded-[1rem] bg-[linear-gradient(140deg,#eef4ff_0%,#dbe6ff_48%,#ffffff_100%)] sm:min-h-[250px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(255,255,255,0.78),transparent_34%),linear-gradient(180deg,transparent_58%,rgba(255,255,255,0.62)_100%)]" />
          <div className="absolute right-8 bottom-8 left-8 h-20 rounded-[50%] bg-white/72 blur-md" />
          {event.imageUrl && (
            <Image
              src={event.imageUrl}
              alt={`${event.guestName} portrait`}
              width={900}
              height={1125}
              sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 90vw"
              className="absolute right-0 bottom-0 h-[110%] w-full object-contain object-bottom drop-shadow-[0_22px_30px_rgba(18,28,42,0.2)]"
            />
          )}

          <div className="absolute bottom-0 flex h-12 w-full items-center justify-center bg-blue-700 px-3 text-center font-bold text-white">
            <span className="text-balance">{event.topic}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-4 pt-4 pb-4 sm:px-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-2 text-[11px] font-extrabold tracking-[0.16em] text-[#737686] uppercase">
                Exclusive Event
              </p>

              <h2 className="font-[family-name:var(--font-headline)] text-2xl font-extrabold tracking-tight text-[#121c2a] sm:text-[1.4rem]">
                {event.guestName}
              </h2>
            </div>

            <div className="rounded-xl border border-[#d9e3f6] bg-[#f8f9ff] px-4 py-3 text-center">
              <p className="text-[10px] font-extrabold tracking-[0.18em] text-[#737686] uppercase">
                Registration
              </p>

              <p className="mt-1 font-[family-name:var(--font-headline)] text-lg font-extrabold tracking-tight text-[#121c2a]">
                FREE
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-2 border-t border-[#eff4ff] pt-4 text-sm text-[#121c2a]">
            {event.highlights.map((item) => (
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

          <Link
            href={{
              pathname: '/event-booking',
              query: {
                guestName: event.guestName,
                guestDesc: event.guestDesc,
                imageUrl: event.imageUrl,
                topic: event.topic,
              },
            }}
            className="mt-6 flex h-10 w-full items-center justify-center gap-3 rounded-xl bg-[#004ac6] px-6 font-[family-name:var(--font-headline)] text-sm font-extrabold text-white shadow-[0_18px_34px_rgba(0,74,198,0.22)] transition hover:bg-[#003fa8] focus:ring-3 focus:ring-[#004ac6]/25 focus:outline-none active:translate-y-px"
          >
            Secure Spot
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
