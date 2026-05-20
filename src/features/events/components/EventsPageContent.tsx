import { CalendarDays, Clock3, Users } from 'lucide-react'
import { EventCard, type EventCardDetails } from '@/features/events/components/EventCard'

const eventStats = [
  { Icon: CalendarDays, title: 'Live session', label: 'Interactive format' },
  { Icon: Clock3, title: '60 minutes', label: 'Compact workshop' },
  { Icon: Users, title: 'Limited seats', label: 'Small cohort' },
]

const events: EventCardDetails[] = [
  {
    guestName: 'Samrat Adhikari',
    guestDesc: 'Founder/Content Creator - Katha Creation',
    imageUrl: '/events/samrat.png',
    topic: 'Career in Content Creation',
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
    guestDesc: 'Digital Marketing and AI Content Creator',
    imageUrl: '/home/ashwin.png',
    topic: 'AI Skill for +2 appeared students',
    seats: 80,
    pricePerSeat: 100,
    highlights: [
      'Practical career decision frameworks',
      'Live Q&A with mentor guidance',
      'Designed for students and guardians',
    ],
  },

  {
    guestName: 'Nischal Karki',
    guestDesc: 'Content Creator',
    imageUrl: '/events/nischal.png',
    topic: 'Career in Content Creation',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Turn projects into portfolio stories',
      'Showcase skills with clear proof',
      'Review checklist for first portfolio',
    ],
  },
  {
    guestName: 'Dr. Sameer Mani Dixit',
    guestDesc: 'Scientist/ Founder, The Fab Show',
    imageUrl: '/events/drsameer.png',
    topic: 'Career in Bio Technology',
    seats: 75,
    pricePerSeat: 150,
    highlights: [
      'Prompting workflows for study and work',
      'Hands-on AI tool walkthrough',
      'Templates to keep using after class',
    ],
  },
  {
    guestName: 'Kamala Shrestha',
    guestDesc: 'The First Beautician of Nepal',
    imageUrl: '/events/kamala.png',
    topic: 'Career in Beautician',
    seats: 90,
    pricePerSeat: 100,
    highlights: [
      'Plan content without overthinking',
      'Short-form content basics',
      'Simple posting and review routine',
    ],
  },
  {
    guestName: 'Colonel. Deepchandra KC',
    guestDesc: 'Colonel, Nepal Army',
    imageUrl: '/events/colonel.png',
    topic: 'Career in Nepal Army',
    seats: 100,
    pricePerSeat: 200,
    highlights: [
      'Marketing funnels explained simply',
      'Beginner-friendly campaign structure',
      'Real examples from digital brands',
    ],
  },
  {
    guestName: 'Prayas Poudel',
    guestDesc: 'Principal AI Engineer at Leapfrog Technology',
    imageUrl: '/events/prayash.png',
    topic: 'Career in Software Engineering using AI',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Turn projects into portfolio stories',
      'Showcase skills with clear proof',
      'Review checklist for first portfolio',
    ],
  },
  {
    guestName: 'Dr. Renuka Banjara',
    guestDesc: 'General Physician',
    imageUrl: '/events/drrenuka.png',
    topic: 'Career in MBBS',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Turn projects into portfolio stories',
      'Showcase skills with clear proof',
      'Review checklist for first portfolio',
    ],
  },
  {
    guestName: 'Kieran Kunwor',
    guestDesc: 'First Officer/PilotSummit Air',
    imageUrl: '/events/kieran.png',
    topic: 'Career in Pilot',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Turn projects into portfolio stories',
      'Showcase skills with clear proof',
      'Review checklist for first portfolio',
    ],
  },
  {
    guestName: 'Arpan Thapa',
    guestDesc: 'Aircraft Maintenance Technician at Buddha Air',
    imageUrl: '/events/arpan.png',
    topic: 'Career in Mechanical Engineering',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Turn projects into portfolio stories',
      'Showcase skills with clear proof',
      'Review checklist for first portfolio',
    ],
  },
  {
    guestName: 'Inspector Sudip Adhikari ',
    guestDesc: 'APF, Nepal Police',
    imageUrl: '/events/inspsudip.png',
    topic: 'Career in Armed Police Force',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Turn projects into portfolio stories',
      'Showcase skills with clear proof',
      'Review checklist for first portfolio',
    ],
  },
  {
    guestName: 'Dr. Manisha Rokaya',
    guestDesc: 'Dental Surgeon at Manab Dental Home',
    imageUrl: '/events/drmanisha.png',
    topic: 'Career in Dentistry',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Turn projects into portfolio stories',
      'Showcase skills with clear proof',
      'Review checklist for first portfolio',
    ],
  },
  {
    guestName: 'Krijan Gautam',
    guestDesc: 'HR Manager',
    imageUrl: '/events/krijan.png',
    topic: 'Career in HR',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Turn projects into portfolio stories',
      'Showcase skills with clear proof',
      'Review checklist for first portfolio',
    ],
  },
  {
    guestName: 'Bibek Mani Acharya',
    guestDesc: 'Founder - Charging Station Nepal',
    imageUrl: '/events/bibek.png',
    topic: 'Career in Product Enterpreneurship',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Turn projects into portfolio stories',
      'Showcase skills with clear proof',
      'Review checklist for first portfolio',
    ],
  },
  {
    guestName: 'Mandira Shrestha ',
    guestDesc: "Registered nurse at Kanti Children's Hospital",
    imageUrl: '/events/mandira.png',
    topic: 'Career in Nursing',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Turn projects into portfolio stories',
      'Showcase skills with clear proof',
      'Review checklist for first portfolio',
    ],
  },
  {
    guestName: 'Subigya Ojha',
    guestDesc: 'Project Manager at Webpoint Technology',
    imageUrl: '/events/subigya.png',
    topic: 'Career in Computer Engineering',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Turn projects into portfolio stories',
      'Showcase skills with clear proof',
      'Review checklist for first portfolio',
    ],
  },
  {
    guestName: 'Chandra Sekhar Neupane',
    guestDesc: 'Electronics Engineer/ Senior Developer - Webpoint Technology',
    imageUrl: '/events/chandra.png',
    topic: 'Career in Electronics Engineering',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Turn projects into portfolio stories',
      'Showcase skills with clear proof',
      'Review checklist for first portfolio',
    ],
  },
  {
    guestName: 'Nabin',
    guestDesc: 'Civil Engineer at Smart Builder Nepal',
    imageUrl: '/events/nabin.png',
    topic: 'Career in IT Project Management',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Turn projects into portfolio stories',
      'Showcase skills with clear proof',
      'Review checklist for first portfolio',
    ],
  },

  {
    guestName: 'Sarthak KC',
    guestDesc: 'Ground Handling at Summit Air',
    imageUrl: '/events/sarthak.png',
    topic: 'Career in Aviation',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Turn projects into portfolio stories',
      'Showcase skills with clear proof',
      'Review checklist for first portfolio',
    ],
  },

  {
    guestName: 'Aashutosh Paudel',
    guestDesc: 'Principal Mobile App Developer at Webpoint Technology',
    imageUrl: '/events/aashutosh.png',
    topic: 'Career in Mobile Development',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Turn projects into portfolio stories',
      'Showcase skills with clear proof',
      'Review checklist for first portfolio',
    ],
  },
  {
    guestName: 'Renuka Shiwakoti',
    guestDesc: 'Sr. Technical Writer',
    imageUrl: '/events/renuka.png',
    topic: 'Career in Technical Writing',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Turn projects into portfolio stories',
      'Showcase skills with clear proof',
      'Review checklist for first portfolio',
    ],
  },
  {
    guestName: 'Bhupin Baral',
    guestDesc: 'AI Engineer at Fusemachines',
    imageUrl: '/events/bhupin.png',
    topic: 'Career in Robotics and Machine Learning',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Turn projects into portfolio stories',
      'Showcase skills with clear proof',
      'Review checklist for first portfolio',
    ],
  },
  {
    guestName: 'Balaram Parajuli, FCA',
    guestDesc: 'Chartered Accountant at B.R. Parajuli and Associates',
    imageUrl: '/events/balaram.png',
    topic: 'Career in Chartered Accountancy ',
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
    <main className="min-h-screen overflow-hidden bg-[#f7f8ff] pt-15 pb-20">
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

            <p className="mt-6 text-base leading-8 text-[#434655] sm:text-lg">
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
            <EventCard key={`${event.guestName}-${event.topic}`} event={event} />
          ))}
        </div>
      </section>
    </main>
  )
}
