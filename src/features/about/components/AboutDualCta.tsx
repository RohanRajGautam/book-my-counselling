import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function AboutDualCta() {
  return (
    <section className="bg-white px-6 pt-16 pb-20 sm:px-8 lg:pt-24 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-[family-name:var(--font-headline)] text-3xl leading-[1.05] font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            What is your <span className="text-[var(--brand-blue)]">next move?</span>
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-8">
          <article className="flex flex-col rounded-[24px] bg-white p-8 ring-1 ring-slate-200/70 sm:p-10">
            <h3 className="font-[family-name:var(--font-headline)] text-2xl font-extrabold tracking-tight text-slate-950">
              Find Your Path
            </h3>
            <p className="mt-3 text-base leading-7 text-[#434655]">
              Stop guessing. Connect with a vetted mentor and get the exact blueprint for your
              career.
            </p>
            <Link
              href="/academic-counsellor"
              className="mt-8 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full bg-[var(--brand-blue)] px-7 text-sm font-bold text-white transition-colors hover:bg-[var(--brand-blue-hover)]"
            >
              Explore Mentors
              <ArrowRight className="size-4" />
            </Link>
          </article>

          <article className="flex flex-col rounded-[24px] bg-[var(--brand-blue-surface)] p-8 ring-1 ring-slate-200/70 sm:p-10">
            <h3 className="font-[family-name:var(--font-headline)] text-2xl font-extrabold tracking-tight text-slate-950">
              Shape the Next Generation
            </h3>
            <p className="mt-3 text-base leading-7 text-[#434655]">
              Your experience is their blueprint. Join our exclusive community of industry leaders.
            </p>
            <Link
              href="/mentor"
              className="mt-8 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full border border-[var(--brand-blue)] bg-white px-7 text-sm font-bold text-[var(--brand-blue)] transition-colors hover:bg-white/80"
            >
              Apply as a Mentor
              <ArrowRight className="size-4" />
            </Link>
          </article>
        </div>
      </div>
    </section>
  )
}
