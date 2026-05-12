import Image from 'next/image'
import { Award, Users } from 'lucide-react'

export function SchoolToStartupHero() {
  return (
    <section className="mx-auto mb-6 grid w-full max-w-[1350px] items-center gap-12 px-6 md:grid-cols-[0.94fr_1.06fr] md:px-8 lg:gap-16">
      <div className="max-w-2xl">
        <span className="inline-flex items-center rounded-full bg-[#6ffbbe] px-5 py-2 text-sm font-semibold text-[#005236]">
          BYC Events
        </span>

        <h1 className="mt-4 max-w-xl font-[family-name:var(--font-headline)] text-4xl leading-[0.98] font-extrabold tracking-tight text-[#121c2a] sm:text-6xl md:text-[62px]">
          School to <span className="text-[#0053db]">Startup Series</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-8 text-[#434655]">
          The ultimate launchpad for student entrepreneurs. Turn your classroom ideas into scalable
          ventures through guided fluidity and expert mentorship.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <div className="inline-flex h-12 items-center gap-3 rounded-lg bg-[#eaf1ff] px-5 text-sm font-semibold text-[#27313f]">
            <Award className="size-4 text-[#0053db]" aria-hidden="true" />
            Prize Pool 1 Lakhs
          </div>
          <div className="inline-flex h-12 items-center gap-3 rounded-lg bg-[#eaf1ff] px-5 text-sm font-semibold text-[#27313f]">
            <Users className="size-4 text-[#0053db]" aria-hidden="true" />
            Entry Fee NPR 10000
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[620px]">
        <div className="relative aspect-[1.18] overflow-hidden rounded-2xl shadow-[0_28px_80px_rgba(18,28,42,0.18)]">
          <Image
            src="/school-to-startup/hero-meeting.jpg"
            alt="Student founders discussing a startup pitch in a meeting room"
            fill
            priority
            sizes="(min-width: 1024px) 620px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00306f]/45 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  )
}
