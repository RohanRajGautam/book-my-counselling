import { RotateCcw, ShieldCheck } from 'lucide-react'

export function PrivacyHero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-14 pb-8 sm:px-8">
      <div className="relative overflow-hidden rounded-[24px] bg-[#eaf1ff] px-8 py-16 sm:px-14">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-6 inline-flex rounded-full bg-[#62f2ad] px-4 py-1.5 font-[family-name:var(--font-headline)] text-[10px] font-bold tracking-[0.16em] text-[#0b5b4c] uppercase">
            Transparency First
          </p>
          <h1 className="font-[family-name:var(--font-headline)] text-5xl font-extrabold tracking-tight text-[#121c2a] sm:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-[#434655]">
            At Book Your Counselling, your well-being and data security are our highest priorities.
            This policy outlines how we curate, protect, and handle your information with absolute
            integrity.
          </p>
          <p className="mt-8 flex items-center gap-3 text-sm font-medium text-[#434655]">
            <RotateCcw className="h-4 w-4 text-[#1155d9]" />
            Last Updated: July 15, 2026
          </p>
        </div>
        <ShieldCheck className="absolute right-8 bottom-8 h-32 w-32 text-[#121c2a]/10 sm:right-12" />
      </div>
    </section>
  )
}
