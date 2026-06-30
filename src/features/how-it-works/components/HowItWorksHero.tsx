import Link from 'next/link'
import Image from 'next/image'

export function HowItWorksHero() {
  return (
    <section className="relative mx-auto flex min-h-[540px] max-w-[1350px] flex-col px-6 py-14 sm:px-8 md:py-20 lg:flex-row lg:items-center lg:gap-10 lg:px-8">
      <div className="relative z-10 max-w-xl lg:w-[88%]">
        <p className="mb-5 font-[family-name:var(--font-headline)] text-[11px] font-semibold tracking-[0.28em] text-[#0b55db] uppercase">
          The Path to Clarity
        </p>
        <h1 className="font-[family-name:var(--font-headline)] text-4xl leading-[0.98] font-extrabold tracking-tight text-[#121c2a] sm:text-6xl md:text-[62px]">
          Guided Fluidity in <span className="block text-[#004ac6]">Career Success.</span>
        </h1>
        <p className="mt-8 max-w-[480px] leading-7 text-[#434655]">
          Navigate the complexities of your academic and professional journey with high-end
          mentorship. We&apos;ve streamlined the connection between ambition and experience.
        </p>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/academic-counsellor"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-7 font-[family-name:var(--font-headline)] text-sm font-bold text-white shadow-[0_16px_32px_rgba(0,74,198,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(0,74,198,0.28)] active:translate-y-0"
          >
            Explore Mentors
          </Link>
          <a
            href="#process"
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#dbe4f7] bg-white/35 px-7 font-[family-name:var(--font-headline)] text-sm font-bold text-[#004ac6] transition-all hover:border-[#b9caf0] hover:bg-white/60 active:scale-[0.99]"
          >
            Watch how it workss
          </a>
        </div>
      </div>

      <Image
        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1080&q=85"
        alt="Mentor guiding students during a laptop discussion"
        width={1080}
        height={760}
        priority
        className="h-[300px] w-full rounded-[12px] object-cover shadow-[0_22px_45px_rgba(18,28,42,0.22)] sm:h-[440px]"
      />
    </section>
  )
}
