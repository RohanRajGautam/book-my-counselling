import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AnimatedSection } from '@/components/common/AnimatedSection'
import { SectionContainer } from '@/components/common/SectionContainer'

export function BecomeCounsellorSection() {
  return (
    <SectionContainer className="rounded-xl bg-[#D9F1FE] px-8 !py-10">
      <AnimatedSection>
        <div className="text-center">
          <h2 className="mb-6 font-[family-name:var(--font-headline)] text-xl font-bold tracking-tight text-slate-900 md:text-3xl lg:text-4xl dark:text-slate-100">
            Are you a professional or looking to share your expertise?
          </h2>
          <p className="mx-auto mb-8 max-w-4xl text-base text-slate-600 md:text-lg lg:text-xl dark:text-slate-400">
            Join our community of mentors, share your knowledge, and help shape careers. Inspire the
            next generation of leaders while earning and growing your professional network.
          </p>
          <Link href="/apply-counsellor">
            <Button
              size="lg"
              className="rounded-lg bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-8 py-6 text-base font-semibold text-white shadow-lg transition-all duration-150 hover:shadow-[#004ac6]/20 active:scale-95 md:text-lg"
            >
              Apply to be a Counsellor
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </SectionContainer>
  )
}
