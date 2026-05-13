import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const bookings = [
  {
    initials: 'AS',
    name: 'Alex Stratten',
    subject: 'Computer Science Major • Career Pivot',
    time: 'Today, 2:00 PM',
    duration: '45 min session',
    action: 'Join',
    isPrimary: true,
  },
  {
    initials: 'MJ',
    name: 'Maria Jenkins',
    subject: 'Pre-Med • Resume Review',
    time: 'Tomorrow, 10:30 AM',
    duration: '30 min session',
    action: 'Details',
  },
  {
    initials: 'MJ',
    name: 'Maria Jenkins',
    subject: 'Pre-Med • Resume Review',
    time: 'Tomorrow, 10:30 AM',
    duration: '30 min session',
    action: 'Details',
  },
  {
    initials: 'MJ',
    name: 'Maria Jenkins',
    subject: 'Pre-Med • Resume Review',
    time: 'Tomorrow, 10:30 AM',
    duration: '30 min session',
    action: 'Details',
  },
  {
    initials: 'MJ',
    name: 'Maria Jenkins',
    subject: 'Pre-Med • Resume Review',
    time: 'Tomorrow, 10:30 AM',
    duration: '30 min session',
    action: 'Details',
  },
  {
    initials: 'MJ',
    name: 'Maria Jenkins',
    subject: 'Pre-Med • Resume Review',
    time: 'Tomorrow, 10:30 AM',
    duration: '30 min session',
    action: 'Details',
  },
]

export function MySessionsPage() {
  return (
    <div className="min-h-svh bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto grid w-full max-w-[1180px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-11">
        <section className="min-w-0">
          <div className="mb-9 flex items-center justify-between gap-4">
            <h1 className="font-headline text-2xl font-extrabold text-slate-950">
              Upcoming Bookings
            </h1>
            <a href="#" className="text-sm font-extrabold text-blue-700 hover:text-blue-900">
              View All
            </a>
          </div>

          <div className="space-y-5">
            {bookings.map((booking, index) => (
              <SessionCard key={`${booking.initials}-${index}`} {...booking} />
            ))}
          </div>
        </section>

        <aside>
          <ShareProfileCard />
        </aside>
      </div>
    </div>
  )
}

function SessionCard({
  initials,
  name,
  subject,
  time,
  duration,
  action,
  isPrimary = false,
}: {
  initials: string
  name: string
  subject: string
  time: string
  duration: string
  action: string
  isPrimary?: boolean
}) {
  return (
    <article className="grid min-h-[132px] gap-5 rounded-[24px] bg-white px-7 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.04)] md:grid-cols-[minmax(0,1fr)_175px_116px] md:items-center">
      <div className="flex min-w-0 items-center gap-5">
        <Avatar className="size-[54px] shrink-0">
          <AvatarFallback className="bg-blue-100 text-base font-extrabold text-blue-700">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h2 className="font-headline text-xl font-extrabold leading-tight text-slate-950">
            {name}
          </h2>
          <p className="mt-2 max-w-[250px] text-base leading-6 text-slate-500">{subject}</p>
        </div>
      </div>

      <div className="text-left md:text-center">
        <p className="text-base font-extrabold text-slate-950">{time}</p>
        <p className="mt-1 text-sm font-medium text-slate-500">{duration}</p>
      </div>

      <Button
        variant={isPrimary ? 'default' : 'outline'}
        className={
          isPrimary
            ? 'h-10 rounded-2xl bg-blue-100 px-7 font-extrabold text-blue-700 hover:bg-blue-200'
            : 'h-11 rounded-2xl border-slate-100 bg-slate-50 px-7 font-extrabold text-blue-700 hover:bg-blue-50'
        }
      >
        {action}
      </Button>
    </article>
  )
}

function ShareProfileCard() {
  return (
    <section className="rounded-[28px] bg-[#243247] p-9 text-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <h2 className="font-headline text-xl font-extrabold">Share your profile</h2>
      <p className="mt-4 max-w-[220px] text-base leading-6 text-slate-200">
        For maximum visibility, share your profile on your social medias.
      </p>
      <Button className="mt-8 h-11 w-[172px] rounded-2xl bg-white font-extrabold text-slate-950 hover:bg-blue-50">
        Share Now
      </Button>
    </section>
  )
}
