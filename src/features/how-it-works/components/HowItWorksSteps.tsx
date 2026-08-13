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
    <section id="process" className="bg-[#f8f9ff]">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-0 lg:pt-24 lg:pb-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-headline)] text-3xl leading-[1.05] font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Three Steps to Mastery
          </h2>
          <p className="mt-4 text-base leading-7 font-medium text-slate-500 sm:text-lg">
            Our ecosystem is designed for precision. No clutter, just direct paths to growth.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-3 lg:gap-8">
          {steps.map((step) => {
            const Icon = step.icon

            return (
              <article
                key={step.title}
                className="flex flex-col rounded-[24px] bg-white p-6 ring-1 ring-slate-200/70 sm:p-8"
              >
                <div className="flex size-12 items-center justify-center rounded-[24px] bg-[#e6eeff] text-[var(--brand-blue)]">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-6 font-[family-name:var(--font-headline)] text-xl font-extrabold tracking-tight text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-3 flex-1 text-base leading-7 text-[#434655]">{step.description}</p>
                <Link
                  href={step.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-blue)] transition-colors hover:text-[var(--brand-blue-hover)]"
                >
                  {step.action}
                  <ArrowRight className="size-4" />
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
