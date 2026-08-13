import { Sparkles } from 'lucide-react'
import Image from 'next/image'

export function AboutHero() {
  return (
    <section className="relative isolate mt-[-25px] overflow-hidden bg-white px-6 pt-16 pb-20 sm:px-8 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#ffffff_0%,#f8f9ff_48%,#eef4ff_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-[linear-gradient(90deg,transparent,#b4c5ff,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(#d9e3f6_1px,transparent_1px),linear-gradient(90deg,#d9e3f6_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_72%)] [background-size:72px_72px] opacity-30"
      />
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c9d7f4] bg-white/74 px-4 py-2 text-xs font-extrabold tracking-[0.12em] text-[#003ea8] uppercase shadow-[0_14px_40px_rgba(18,28,42,0.07)] backdrop-blur">
            <Sparkles className="size-4" aria-hidden="true" />
            Our Philosophy
          </div>
          <h1 className="mt-5 font-[family-name:var(--font-headline)] text-3xl leading-[1.05] font-extrabold tracking-tight text-balance text-slate-950 sm:text-4xl lg:text-6xl">
            Redefining the <span className="text-[var(--brand-blue)]">Mentorship</span> Landscape.
          </h1>
          <p className="mt-5 text-base leading-7 font-medium text-slate-500 sm:text-lg">
            At Book Your Counselling, we believe that the distance between academic potential and
            career excellence should not be determined by geography or network, but by ambition.
          </p>
        </div>
        <div className="relative">
          <Image
            src="/about/about-hero.png"
            alt="Book Your Counselling team"
            width={1080}
            height={760}
            priority
            className="h-[280px] w-full rounded-lg object-cover shadow-[0_22px_45px_rgba(18,28,42,0.12)] sm:h-[380px] lg:h-[460px]"
          />
        </div>
      </div>
    </section>
  )
}
