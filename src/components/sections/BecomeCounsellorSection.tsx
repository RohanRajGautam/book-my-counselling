import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AnimatedSection } from '@/components/common/AnimatedSection'
import { SectionContainer } from '@/components/common/SectionContainer'

export function BecomeCounsellorSection() {
  return (
    <SectionContainer className="bg-[#D9F1FE] !py-10 px-8 rounded-xl">
      <AnimatedSection>
        <div className="text-center">
          <h2 className="mb-6 font-[family-name:var(--font-headline)] text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl lg:text-4xl">
            Are you a professional or looking to share your expertise?
          </h2>
          <p className="mb-8 text-base text-slate-600 dark:text-slate-400 md:text-lg lg:text-xl max-w-4xl mx-auto">
            Join our community of mentors, share your knowledge, and help shape careers. Inspire the next
            generation of leaders while earning and growing your professional network.
          </p>
          <Link href="/apply-counsellor">
            <Button 
              size="lg" 
              className="rounded-lg bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-8 py-6 text-base font-semibold shadow-lg transition-all duration-150 hover:shadow-[#004ac6]/20 active:scale-95 md:text-lg text-white"
            >
              Apply to be a Counsellor
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </SectionContainer>
  )
}
