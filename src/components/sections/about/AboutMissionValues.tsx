import type { ReactNode } from 'react'
import { Eye, GraduationCap, Sparkles, Zap } from 'lucide-react'

export function AboutMissionValues() {
  return (
    <section className="bg-[#f7f8ff]">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-20 sm:px-8 md:py-24 lg:grid-cols-12">
        <div className="relative overflow-hidden rounded-[28px] bg-[#1155d9] px-8 py-12 text-white shadow-[0_22px_45px_rgba(17,85,217,0.18)] sm:px-12 lg:col-span-8">
          <div className="relative z-10 max-w-2xl">
            <h2 className="font-[family-name:var(--font-headline)] text-3xl font-extrabold tracking-tight">
              Our Mission
            </h2>
            <p className="mt-7 text-2xl font-medium leading-10 text-white/92">
              To democratize access to world-class mentorship, ensuring every student has the
              navigation tools to reach the pinnacle of their chosen field.
            </p>
          </div>
          <Sparkles className="absolute -bottom-5 right-2 h-28 w-28 rotate-12 text-white/12" />
        </div>

        <ValueCard
          icon={<Zap className="h-6 w-6" />}
          iconClassName="bg-[#62f2ad] text-[#0b5b4c]"
          className="lg:col-span-4"
          title="Empowerment"
          description="We do not just give answers; we provide the intellectual framework for students to find their own path."
        />

        <ValueCard
          icon={<Eye className="h-6 w-6" />}
          iconClassName="bg-[#e6eeff] text-[#1155d9]"
          className="lg:col-span-4"
          title="Transparency"
          description="Clear feedback, honest evaluations, and a commitment to radical truth in career counseling."
        />

        <div className="flex flex-col gap-7 rounded-[28px] bg-[#dce9ff] px-8 py-11 sm:flex-row sm:items-center sm:px-10 lg:col-span-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-[#1155d9] shadow-[0_12px_26px_rgba(18,28,42,0.08)]">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-headline)] text-2xl font-extrabold tracking-tight text-[#121c2a]">
              Academic Rigor
            </h3>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-[#434655]">
              Every mentor and program is vetted through a double-blind academic standard to ensure
              the highest quality of pedagogical guidance.
            </p>
          </div>
        </div>
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
      className={`rounded-[28px] bg-white px-8 py-10 shadow-[0_18px_42px_rgba(18,28,42,0.06)] ${className ?? ''}`}
    >
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconClassName}`}>
        {icon}
      </div>
      <h3 className="mt-8 font-[family-name:var(--font-headline)] text-xl font-extrabold tracking-tight text-[#121c2a]">
        {title}
      </h3>
      <p className="mt-4 text-base leading-7 text-[#434655]">{description}</p>
    </article>
  )
}
