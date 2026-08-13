import { BadgeCheck, Target } from 'lucide-react'

export function AboutVetting() {
  return (
    <section className="bg-white px-6 pt-16 pb-20 sm:px-8 lg:pt-24 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <h2 className="text-balance mt-5 font-[family-name:var(--font-headline)] text-3xl leading-[1.05] font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Proof Over Pedagogy: <span className="text-[var(--brand-blue)]">The BYC Standard</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-2 lg:gap-8">
          <article className="flex flex-col rounded-[24px] bg-white p-6 ring-1 ring-slate-200/70 sm:p-8">
            <div className="flex size-12 items-center justify-center rounded-[24px] bg-[#e6eeff] text-[var(--brand-blue)]">
              <Target className="size-5" />
            </div>
            <h3 className="mt-6 font-[family-name:var(--font-headline)] text-xl font-extrabold tracking-tight text-slate-950">
              Active Practitioners, Not Gurus
            </h3>
            <p className="mt-3 text-base leading-7 text-[#434655]">
              We don&apos;t do generic advice, and we don&apos;t do self-proclaimed gurus. When you
              book a session on BYC, you are speaking directly to active practitioners who have
              already navigated the path to excellence.
            </p>
          </article>

          <article className="flex flex-col rounded-[24px] bg-white p-6 ring-1 ring-slate-200/70 sm:p-8">
            <div className="flex size-12 items-center justify-center rounded-[24px] bg-[#e6eeff] text-[var(--brand-blue)]">
              <BadgeCheck className="size-5" />
            </div>
            <h3 className="mt-6 font-[family-name:var(--font-headline)] text-xl font-extrabold tracking-tight text-slate-950">
              Top 10% Only
            </h3>
            <p className="mt-3 text-base leading-7 text-[#434655]">
              To ensure the highest caliber of guidance, we enforce a strict, multi-step vetting
              process. We verify real-world experience, industry impact, and the ability to actually
              mentor. We reject the majority of applications so you only learn from the top 10% of
              industry leaders.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
