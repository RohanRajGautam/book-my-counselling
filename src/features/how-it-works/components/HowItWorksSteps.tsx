import Link from 'next/link'
import { ArrowRight, CalendarDays, Search, Sparkles, type LucideIcon } from 'lucide-react'

interface HowItWorksStep {
  title: string
  description: string
  action: string
  href: string
  icon: LucideIcon
}

const steps: HowItWorksStep[] = [
  {
    title: '1. Discover',
    description:
      'Search for experienced mentors based on your target career, academic background, and the specific challenges you want to solve.',
    action: 'Learn about filters',
    href: '/#search',
    icon: Search,
  },
  {
    title: '2. Connect',
    description:
      'Book a personalized 1:1 session that fits your schedule. The platform handles the details so you can focus on the conversation.',
    action: 'View scheduling rules',
    href: '/booking',
    icon: CalendarDays,
  },
  {
    title: '3. Grow',
    description:
      'Receive expert guidance and practical next steps. Turn each session into a clear roadmap for your academic or professional growth.',
    action: 'Explore growth tracks',
    href: '/#search',
    icon: Sparkles,
  },
]

export function HowItWorksSteps() {
  return (
    <section id="process" className="bg-[#eef4ff] px-6 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1350px] px-8 py-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-headline)] text-3xl font-extrabold tracking-tight text-[#121c2a] sm:text-4xl">
            Three Steps to Mastery
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#434655] sm:text-base">
            Our ecosystem is designed for precision. No clutter, just direct paths to growth.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon

            return (
              <article
                key={step.title}
                className="flex min-h-[312px] flex-col rounded-[24px] bg-white p-8 shadow-[0_18px_40px_rgba(18,28,42,0.04)] sm:p-10"
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#dfe9ff] text-[#004ac6]">
                  <Icon className="h-6 w-6" strokeWidth={2.4} />
                </div>
                <h3 className="font-[family-name:var(--font-headline)] text-2xl font-medium tracking-tight text-[#121c2a]">
                  {step.title}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-6 text-[#434655]">{step.description}</p>
                <Link
                  href={step.href}
                  className="mt-6 inline-flex items-center gap-2 font-[family-name:var(--font-headline)] text-sm font-bold text-[#004ac6] transition-colors hover:text-[#2563eb]"
                >
                  {step.action}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
