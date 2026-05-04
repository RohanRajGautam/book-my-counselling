import Image from 'next/image'
import { Award, BadgeCheck, Star } from 'lucide-react'
import { mentorsDatabase } from '@/lib/mockData'

interface MentorPreview {
  name: string
  imageUrl: string
  rotationClassName: string
}

interface VerificationPoint {
  title: string
  description: string
  icon: typeof BadgeCheck
}

const mentorPreviews: MentorPreview[] = [
  {
    name: 'Dr. Sarah Jensen',
    imageUrl: mentorsDatabase[0]?.imageUrl ?? '',
    rotationClassName: 'lg:-rotate-1',
  },
  {
    name: 'James Chen',
    imageUrl: mentorsDatabase[1]?.imageUrl ?? '',
    rotationClassName: 'lg:rotate-2',
  },
]

const verificationPoints: VerificationPoint[] = [
  {
    title: 'Academic Validation',
    description:
      'Every mentor undergoes a rigorous review of their academic credentials and professional history.',
    icon: BadgeCheck,
  },
  {
    title: 'Mentorship Interview',
    description:
      'We interview each candidate to ensure they bring the empathy, clarity, and communication skills students need.',
    icon: Award,
  },
  {
    title: 'Ongoing Excellence',
    description:
      'Session quality and student feedback are continuously monitored so our standards remain consistently high.',
    icon: Star,
  },
]

export function VerifiedMentorSection() {
  return (
    <section className="bg-[#f7f8ff] px-6 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-8 py-4 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div className="flex flex-col gap-6 sm:flex-row lg:pt-16">
          {mentorPreviews.map((mentor) => (
            <article
              key={mentor.name}
              className={`w-full rounded-[24px] bg-white p-3 shadow-[0_18px_42px_rgba(18,28,42,0.06)] sm:max-w-[260px] ${mentor.rotationClassName}`}
            >
              <div className="relative h-40 overflow-hidden rounded-[14px] bg-[#eef4ff] sm:h-48">
                {mentor.imageUrl ? (
                  <Image
                    src={mentor.imageUrl}
                    alt={`${mentor.name}, verified mentor`}
                    fill
                    sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 100vw"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="px-2 pt-4 pb-1">
                <h3 className="font-[family-name:var(--font-headline)] text-sm font-medium text-[#121c2a]">
                  {mentor.name}
                </h3>
                <span className="mt-1 inline-flex rounded-full bg-[#d6ffe9] px-3 py-1 text-xs font-bold text-[#22c77b]">
                  Verified Expert
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="max-w-2xl">
          <p className="mb-5 font-[family-name:var(--font-headline)] text-[11px] font-semibold tracking-[0.28em] text-[#00714d] uppercase">
            Trust by Design
          </p>

          <h2 className="max-w-lg font-[family-name:var(--font-headline)] text-4xl leading-tight font-medium tracking-tight text-[#121c2a] sm:text-5xl">
            The Verified Mentor Gold Standard
          </h2>

          <div className="mt-10 space-y-9">
            {verificationPoints.map((point) => {
              const Icon = point.icon

              return (
                <div key={point.title} className="flex gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d4faed] text-[#00714d]">
                    <Icon className="h-5 w-5" fill="currentColor" strokeWidth={2.2} />
                  </div>

                  <div>
                    <h3 className="font-[family-name:var(--font-headline)] text-lg font-bold text-[#121c2a]">
                      {point.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#434655]">
                      {point.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
