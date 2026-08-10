import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AnimatedSection } from '@/components/common/AnimatedSection'

export function BecomeCounsellorSection() {
  return (
    <section className="px-6 py-14 sm:px-8 sm:py-16">
      <AnimatedSection>
        <div className="mx-auto max-w-7xl rounded-3xl bg-[#004ac6] px-6 py-12 text-center sm:px-10 sm:py-14">
          <h2 className="mb-6 font-[family-name:var(--font-headline)] text-2xl leading-[1.05] font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Are you a professional or looking to share your expertise?
          </h2>
          <p className="mx-auto mb-8 max-w-4xl text-base text-white md:text-lg lg:text-xl">
            Join our community of mentors, share your knowledge, and help shape careers. Inspire the
            next generation of leaders while earning and growing your professional network.
          </p>
          <Link href="/mentor">
            <Button
              size="lg"
              className="rounded-full bg-white px-8 py-6 text-base font-semibold text-black shadow-lg transition-all duration-150 hover:shadow-[#004ac6]/20 active:scale-95 md:text-lg"
            >
              Apply to be a Counsellor
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </section>
  )
}
