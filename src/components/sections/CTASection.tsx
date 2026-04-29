import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedSection } from '@/components/common/AnimatedSection'
import { SectionContainer } from '@/components/common/SectionContainer'

export function CTASection() {
  return (
    <SectionContainer id="book" className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
      <AnimatedSection>
        <div className="mx-auto max-w-3xl rounded-2xl bg-card p-8 text-center shadow-lg md:p-12 lg:p-16">
          <h2 className="mb-4 font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Ready to Take the First Step?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Book your confidential counselling session today and start your journey towards better
            mental health and well-being.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="#book">
              <Button size="lg" className="group w-full sm:w-auto">
                Book Your Session Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Contact Us
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            No commitment required • 100% confidential • Flexible scheduling
          </p>
        </div>
      </AnimatedSection>
    </SectionContainer>
  )
}
