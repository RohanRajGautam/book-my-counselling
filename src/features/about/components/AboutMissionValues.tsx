import type { ReactNode } from 'react'
import { Eye, GraduationCap, Zap } from 'lucide-react'

export function AboutMissionValues() {
  return (
    <section className="bg-white px-6 pt-16 pb-20 sm:px-8 lg:pt-24 lg:pb-28">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-12 lg:gap-8">
        <article className="relative overflow-hidden rounded-[24px] bg-[var(--brand-blue)] px-8 py-10 text-white sm:px-10 sm:py-12 lg:col-span-8">
          <div className="relative z-10 max-w-xl">
            <p className="text-[11px] font-extrabold tracking-[0.1em] text-white/80 uppercase">
              Our Mission
            </p>
            <p className="mt-5 text-xl leading-8 font-medium sm:text-2xl sm:leading-9">
              To democratize access to world-class mentorship, ensuring every student has the
              navigation tools to reach the pinnacle of their chosen field.
            </p>
          </div>
        </article>

        <ValueCard
          icon={<Zap className="size-5" />}
          iconClassName="bg-[#e6eeff] text-[var(--brand-blue)]"
          className="lg:col-span-4"
          title="Empowerment"
          description="We do not just give answers; we provide the intellectual framework for students and professionals to find their own path."
        />

        <ValueCard
          icon={<Eye className="size-5" />}
          iconClassName="bg-[#e6eeff] text-[var(--brand-blue)]"
          className="lg:col-span-4"
          title="Transparency"
          description="Clear feedback, honest evaluations, and a commitment to radical truth in career counseling."
        />

        <article className="flex flex-col gap-5 rounded-[24px] bg-[var(--brand-blue-surface)] p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8 lg:col-span-8">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-[24px] bg-white text-[var(--brand-blue)]">
            <GraduationCap className="size-7" />
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-headline)] text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
              Academic Rigor
            </h3>
            <p className="mt-3 text-base leading-7 text-[#434655]">
              Each mentors are vetted through a BYC's standard to ensure the highest quality of 1:1.
              Through this we make mentorship fair and impactful. guidance.
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}

function ValueCard({
  icon,
  iconClassName,
  className,
  title,
  description,
}: {
  icon: ReactNode
  iconClassName: string
  className?: string
  title: string
  description: string
}) {
  return (
    <article
      className={`rounded-[24px] bg-white p-6 ring-1 ring-slate-200/70 sm:p-8 ${className ?? ''}`}
    >
      <div className={`flex size-12 items-center justify-center rounded-[24px] ${iconClassName}`}>
        {icon}
      </div>
      <h3 className="mt-6 font-[family-name:var(--font-headline)] text-xl font-extrabold tracking-tight text-slate-950">
        {title}
      </h3>
      <p className="mt-3 text-base leading-7 text-[#434655]">{description}</p>
    </article>
  )
}
