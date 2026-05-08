import { Database } from 'lucide-react'
import { PrivacySectionHeading } from './PrivacySectionHeading'

const usageSteps = [
  {
    title: 'Personalization of Mentorship',
    description:
      'We process your professional aspirations and current challenges to match you with compatible mentors. This curation process is designed to improve the quality of your counselling sessions.',
  },
  {
    title: 'Service Excellence',
    description:
      'De-identified usage patterns are analyzed to improve platform performance, develop new academic resources, and ensure the reliability of video-conferencing systems.',
  },
  {
    title: 'Legal Compliance',
    description:
      'We use data to detect and prevent fraudulent transactions, manage our tax obligations, and comply with lawful judicial or regulatory requirements.',
  },
]

export function PrivacyDataUsage() {
  return (
    <section id="usage" className="scroll-mt-28">
      <PrivacySectionHeading
        icon={<Database className="h-5 w-5" />}
        iconClassName="bg-[#1155d9] text-white"
        title="How We Use Your Data"
      />
      <div className="mt-8 space-y-8">
        {usageSteps.map((step, index) => (
          <article key={step.title} className="grid gap-4 sm:grid-cols-[56px_minmax(0,1fr)]">
            <div className="font-[family-name:var(--font-headline)] text-3xl font-extrabold text-[#dbe4f7]">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-headline)] text-base font-extrabold text-[#121c2a]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#5b6070]">{step.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
