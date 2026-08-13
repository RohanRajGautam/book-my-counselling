import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { HOME_PILLARS } from '../lib/home.constants'

export function ThreePillarsSection() {
  return (
    <section className="px-6 py-14 sm:px-8 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c9d7f4] bg-white px-4 py-2 text-xs font-extrabold tracking-[0.12em] text-[#003ea8] uppercase shadow-[0_14px_40px_rgba(18,28,42,0.07)]">
            <span aria-hidden="true">🎯</span>
            Tailored Advisory
          </div>
          <h2 className="mt-6 font-[family-name:var(--font-headline)] text-3xl leading-[1.05] font-extrabold tracking-tight text-[#121c2a] sm:text-4xl lg:text-5xl">
            The Right Guidance, At The Right Time.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#434655] sm:text-lg">
            Select your current stage to find verified mentors who have already walked your path.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {HOME_PILLARS.map((pillar) => (
            <article
              key={pillar.headline}
              className="group flex h-full flex-col rounded-3xl bg-white p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-[#e5edf9] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(15,23,42,0.10)] hover:ring-[#004ac6]/35 sm:p-8"
            >
              <h3 className="font-[family-name:var(--font-headline)] text-2xl leading-[1.15] font-extrabold text-[#121c2a]">
                {pillar.headline}
              </h3>
              <p className="mt-4 text-[15px] leading-7 text-[#434655]">{pillar.body}</p>
              <div className="mt-6 rounded-2xl bg-[#eff4ff] px-5 py-4 text-sm leading-6 font-semibold text-[#003ea8]">
                {pillar.stat}
              </div>
              <Link
                href={pillar.href}
                className="mt-auto inline-flex items-center gap-1.5 pt-7 text-sm font-extrabold tracking-[0.04em] text-[#004ac6] uppercase transition hover:gap-2.5 hover:text-[#003fa8]"
              >
                {pillar.cta}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}