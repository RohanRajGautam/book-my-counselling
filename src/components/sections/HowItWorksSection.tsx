import { AnimatedSection } from '@/components/common/AnimatedSection'
import { SectionContainer } from '@/components/common/SectionContainer'
import { HOW_IT_WORKS_STEPS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function HowItWorksSection() {
  return (
    <SectionContainer id="how-it-works">
      <AnimatedSection className="mb-12 text-center">
        <h2 className="mb-4 font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          How It Works
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Getting started with professional counselling is simple. Follow these four easy steps to
          begin your journey.
        </p>
      </AnimatedSection>

      <div className="relative">
        {/* Connection Line - Hidden on mobile */}
        <div className="absolute left-8 top-0 hidden h-full w-0.5 bg-border md:block lg:left-1/2" />

        <div className="space-y-12">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <AnimatedSection
              key={step.step}
              delay={index * 0.15}
              className={cn(
                'relative grid grid-cols-1 gap-8 md:grid-cols-2',
                index % 2 === 0 ? 'lg:grid-cols-[1fr,auto,1fr]' : 'lg:grid-cols-[1fr,auto,1fr]'
              )}
            >
              {/* Step Number Circle */}
              <div
                className={cn(
                  'order-2 hidden lg:flex',
                  index % 2 === 0 ? 'lg:order-2' : 'lg:order-2'
                )}
              >
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-primary text-2xl font-bold text-primary-foreground">
                  {step.step}
                </div>
              </div>

              {/* Content - Left side on even, right on odd */}
              <div
                className={cn(
                  'flex flex-col',
                  index % 2 === 0
                    ? 'lg:order-1 lg:items-end lg:text-right'
                    : 'lg:order-3 lg:items-start lg:text-left'
                )}
              >
                <div className="flex items-start gap-4 md:gap-0 md:block">
                  {/* Mobile Step Number */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground md:hidden">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="mb-2 text-2xl font-bold">{step.title}</h3>
                    <p className="max-w-md text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>

              {/* Empty space for alternating layout */}
              <div
                className={cn(
                  'hidden lg:block',
                  index % 2 === 0 ? 'lg:order-3' : 'lg:order-1'
                )}
              />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </SectionContainer>
  )
}
