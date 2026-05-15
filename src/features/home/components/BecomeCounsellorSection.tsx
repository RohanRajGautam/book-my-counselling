import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AnimatedSection } from '@/components/common/AnimatedSection'
import { SectionContainer } from '@/components/common/SectionContainer'

export function BecomeCounsellorSection() {
  return (
    <SectionContainer className="rounded-xl bg-[#004ac6] px-8 !py-10">
      <AnimatedSection>
        <div className="text-center">
          <h2 className="mb-6 font-[family-name:var(--font-headline)] text-xl font-bold tracking-tight text-white md:text-3xl lg:text-4xl">
            Are you a professional or looking to share your expertise?
          </h2>
          <p className="mx-auto mb-8 max-w-4xl text-base text-white md:text-lg lg:text-xl">
            Join our community of mentors, share your knowledge, and help shape careers. Inspire the
            next generation of leaders while earning and growing your professional network.
          </p>
          <Link href="/apply-counsellor">
            <Button
              size="lg"
              className="rounded-lg bg-white px-8 py-6 text-base font-semibold text-black shadow-lg transition-all duration-150 hover:shadow-[#004ac6]/20 active:scale-95 md:text-lg"
            >
              Apply to be a Counsellor
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </SectionContainer>
  )
}
