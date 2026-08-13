import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function BecomeCounsellorSection() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#004ac6] px-6 py-16 text-center shadow-[0_30px_80px_-20px_rgba(0,74,198,0.45)] sm:px-12 lg:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -left-24 size-80 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -bottom-32 size-96 rounded-full bg-[#2563eb]/40 blur-3xl"
        />

        <div className="relative z-10">
          <h2 className="font-[family-name:var(--font-headline)] text-3xl leading-[1.05] font-extrabold tracking-tight text-white sm:text-4xl lg:text-6xl">
            Your experience is their <span className="block sm:inline">blueprint.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 font-medium text-white/85 sm:text-lg sm:leading-9">
            Join our community of elite mentors. Guide the next generation of professionals while
            expanding your own network and influence.
          </p>
          <Link
            href="/mentor"
            className="mt-10 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-bold tracking-tight text-[#004ac6] transition-colors hover:bg-white/90 sm:text-base"
          >
            Apply to be a Mentor
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
