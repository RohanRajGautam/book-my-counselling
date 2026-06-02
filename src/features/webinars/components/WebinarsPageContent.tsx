import { WebinarCard } from '@/features/webinars/components/WebinarCard'
import { webinars } from '@/features/webinars/lib/webinars.constants'

export function WebinarsPageContent() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8ff] pt-15 pb-20">
      <section className="relative isolate px-5 py-12 sm:px-8 lg:py-12">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#ffffff_0%,#f8f9ff_48%,#eef4ff_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-[linear-gradient(90deg,transparent,#b4c5ff,transparent)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(#d9e3f6_1px,transparent_1px),linear-gradient(90deg,#d9e3f6_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_72%)] [background-size:72px_72px] opacity-[0.34]" />

        <div className="mx-auto w-full max-w-[1280px]">
          <p className="inline-flex rounded-full border border-[#c9d7f4] bg-white/74 px-4 py-2 text-xs font-extrabold tracking-[0.12em] text-[#003ea8] uppercase shadow-[0_14px_40px_rgba(18,28,42,0.07)] backdrop-blur">
            Webinars
          </p>

          <h1 className="mt-7 font-[family-name:var(--font-headline)] text-[clamp(2.35rem,5.2vw,4.25rem)] leading-[0.98] font-extrabold tracking-tight text-[#121c2a]">
            Free training webinars
          </h1>

          {/* <p className="mt-6 max-w-3xl text-base leading-8 text-[#434655] sm:text-lg">
            Join focused live sessions designed to help students build practical creative and AI
            skills with expert guidance.
          </p> */}
        </div>
      </section>

      <section className="px-5 pb-4 sm:px-8">
        <div className="mx-auto grid w-full max-w-[1280px] gap-6 md:grid-cols-2 xl:grid-cols-3">
          {webinars.map((webinar) => (
            <WebinarCard key={webinar.slug} webinar={webinar} />
          ))}
        </div>
      </section>
    </main>
  )
}
