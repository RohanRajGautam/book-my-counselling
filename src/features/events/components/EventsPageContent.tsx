import { CalendarDays, Clock3, Users } from 'lucide-react'
import { EventCard, type EventCardDetails } from '@/features/events/components/EventCard'

const eventStats = [
  { Icon: CalendarDays, title: 'Live session', label: 'Interactive format' },
  { Icon: Clock3, title: '60 minutes', label: 'Compact workshop' },
  { Icon: Users, title: 'Limited seats', label: 'Small cohort' },
]

const events: EventCardDetails[] = [
  {
    guestName: 'Ashwin Neupane',
    imageUrl: '/home/ashwin.png',
    topic: 'AI skills for SEE and +2 Appeared Students',
    seats: 100,
    pricePerSeat: 100,
    highlights: [
      '5+ Years of Industry Experience in Digital Marketing',
      'Founder, Unlocked AI',
      'AI and Marketing Content Creator',
    ],
  },
  {
    guestName: 'Ashwin Neupane',
    imageUrl: '/home/ashwin.png',
    topic: 'Career clarity after SEE and +2',
    seats: 80,
    pricePerSeat: 100,
    highlights: [
      'Practical career decision frameworks',
      'Live Q&A with mentor guidance',
      'Designed for students and guardians',
    ],
  },
  {
    guestName: 'Ashwin Neupane',
    imageUrl: '/home/ashwin.png',
    topic: 'Build your first AI productivity system',
    seats: 75,
    pricePerSeat: 150,
    highlights: [
      'Prompting workflows for study and work',
      'Hands-on AI tool walkthrough',
      'Templates to keep using after class',
    ],
  },
  {
    guestName: 'Ashwin Neupane',
    imageUrl: '/home/ashwin.png',
    topic: 'Content creation for beginners',
    seats: 90,
    pricePerSeat: 100,
    highlights: [
      'Plan content without overthinking',
      'Short-form content basics',
      'Simple posting and review routine',
    ],
  },
  {
    guestName: 'Ashwin Neupane',
    imageUrl: '/home/ashwin.png',
    topic: 'Digital marketing starter workshop',
    seats: 100,
    pricePerSeat: 200,
    highlights: [
      'Marketing funnels explained simply',
      'Beginner-friendly campaign structure',
      'Real examples from digital brands',
    ],
  },
  {
    guestName: 'Ashwin Neupane',
    imageUrl: '/home/ashwin.png',
    topic: 'Student portfolio building session',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Turn projects into portfolio stories',
      'Showcase skills with clear proof',
      'Review checklist for first portfolio',
    ],
  },
]

export function EventsPageContent() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8ff] pt-15 pb-20 ">
      <section className="relative isolate px-5 py-12 sm:px-8 lg:py-16">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#ffffff_0%,#f8f9ff_48%,#eef4ff_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-[linear-gradient(90deg,transparent,#b4c5ff,transparent)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(#d9e3f6_1px,transparent_1px),linear-gradient(90deg,#d9e3f6_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_72%)] [background-size:72px_72px] opacity-[0.34]" />

        <div className="mx-auto w-full max-w-[1280px]">
          <div className="">
            <p className="inline-flex rounded-full border border-[#c9d7f4] bg-white/74 px-4 py-2 text-xs font-extrabold tracking-[0.12em] text-[#003ea8] uppercase shadow-[0_14px_40px_rgba(18,28,42,0.07)] backdrop-blur">
              Events
            </p>

            <h1 className="mt-7 font-[family-name:var(--font-headline)] text-[clamp(2.35rem,5.2vw,4.25rem)] leading-[0.98] font-extrabold tracking-tight text-[#121c2a]">
              Learn live with focused mentor-led sessions.
            </h1>

            <p className="mt-6  text-base leading-8 text-[#434655] sm:text-lg">
              Browse upcoming workshops and cohort sessions from Book Your Counselling, built for
              practical guidance from people already doing the work.
            </p>
          </div>

          {/* <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:max-w-3xl">
            {eventStats.map(({ Icon, title, label }) => (
              <div
                key={title}
                className="rounded-xl border border-[#d9e3f6] bg-white/78 p-4 shadow-[0_12px_28px_rgba(18,28,42,0.06)] backdrop-blur"
              >
                <Icon className="size-5 text-[#004ac6]" aria-hidden="true" />
                <p className="mt-3 font-[family-name:var(--font-headline)] text-sm font-extrabold text-[#121c2a]">
                  {title}
                </p>
                <p className="mt-1 text-xs font-medium text-[#737686]">{label}</p>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      <section className="px-5 pb-4 sm:px-8">
        <div className="mx-auto grid w-full max-w-[1280px] gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.topic} event={event} />
          ))}
        </div>
      </section>
    </main>
  )
}
