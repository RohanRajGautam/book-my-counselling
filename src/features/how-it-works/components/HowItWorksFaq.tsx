'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FaqItem {
  id: string
  question: string
  answer: string
}

const faqItems: FaqItem[] = [
  {
    id: 'choose-mentor',
    question: 'How do I choose the right mentor for my goals?',
    answer:
      'Our filtering system helps you sort by industry, academic background, career focus, and practical availability. We recommend reviewing several profiles and reading each mentor philosophy before booking your best match.',
  },
  {
    id: 'online-sessions',
    question: 'Are the sessions conducted online?',
    answer:
      'Yes. Most sessions are conducted online so you can connect with the right mentor regardless of location. Session details are shared after booking confirmation.',
  },
  {
    id: 'reschedule',
    question: 'What happens if I need to reschedule?',
    answer:
      'You can reschedule from your booking details when the session is still within the allowed change window. If timing is tight, contact support so we can help coordinate with the mentor.',
  },
  {
    id: 'long-term-program',
    question: 'Can I book a long-term mentorship program?',
    answer:
      'Yes. You can begin with a single session and continue with the same mentor when their availability fits your goals. Longer mentorship plans can be arranged after the first consultation.',
  },
]

export function HowItWorksFaq() {
  const [openId, setOpenId] = useState(faqItems[0]?.id)

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? '' : id))
  }

  return (
    <section className="bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-headline)] text-3xl leading-[1.05] font-extrabold tracking-tight text-[#121c2a] sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base leading-7 font-medium text-slate-500 sm:text-lg">
            Everything you need to know about starting your journey with Book Your Counselling.
          </p>
        </div>

        <div className="mt-6 border-slate-200 sm:mt-8">
          {faqItems.map((item) => {
            const isOpen = openId === item.id

            return (
              <div key={item.id} className="border-slate-200">
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left font-[family-name:var(--font-headline)] text-lg leading-snug font-semibold tracking-tight text-[#121c2a] transition-colors hover:text-[#004ac6] sm:text-xl"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    strokeWidth={2.6}
                    className={cn(
                      'size-6 shrink-0 text-[#004ac6] transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>

                <div
                  className={cn(
                    'grid transition-[grid-template-rows] duration-200',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-6 text-base leading-7 font-normal text-slate-600">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
