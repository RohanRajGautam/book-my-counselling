import { Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function HowItWorksHero() {
  return (
    <section className="relative isolate mt-[-25px] bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-12 pb-16 sm:px-0 sm:pt-14 sm:pb-20 lg:grid-cols-2 lg:gap-16 lg:pt-16 lg:pb-24">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c9d7f4] bg-white/74 px-4 py-2 text-xs font-extrabold tracking-[0.12em] text-[#003ea8] uppercase shadow-[0_14px_40px_rgba(18,28,42,0.07)] backdrop-blur">
            <Sparkles className="size-4" aria-hidden="true" />
            The Path to Clarity
          </div>
          <h1 className="mt-5 font-[family-name:var(--font-headline)] text-3xl leading-[1.05] font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-6xl">
            Guided Fluidity in <span className="text-[var(--brand-blue)]">Career Success.</span>
          </h1>
          <p className="mt-5 text-base leading-7 font-medium text-slate-500 sm:text-lg">
            Navigate the complexities of your academic and professional journey with high-end
            mentorship. We&apos;ve streamlined the connection between ambition and experience.
          </p>
          <Link
            href="/academic-counsellor"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-[24px] bg-[var(--brand-blue)] px-7 font-[family-name:var(--font-headline)] text-sm font-bold text-white transition-colors hover:bg-[var(--brand-blue-hover)]"
          >
            Explore Mentors
          </Link>
        </div>
        <div className="relative">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1080&q=85"
            alt="Mentor guiding students during a laptop discussion"
            width={1080}
            height={760}
            priority
            className="h-[280px] w-full rounded-[24px] object-cover shadow-[0_22px_45px_rgba(18,28,42,0.12)] sm:h-[380px] lg:h-[460px]"
          />
        </div>
      </div>
    </section>
  )
}
