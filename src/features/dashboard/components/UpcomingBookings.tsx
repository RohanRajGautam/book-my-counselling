import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function UpcomingBookings() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
          Upcoming Bookings
        </h2>
        <Link href="#" className="text-sm font-bold text-blue-700 hover:text-blue-900">
          View All
        </Link>
      </div>

      <div className="space-y-4">
        <BookingCard
          initials="AS"
          name="Alex Stratten"
          subject="Computer Science Major • Career Pivot"
          time="Today, 2:00 PM"
          duration="45 min session"
          action="Join"
          isPrimary
        />
        <BookingCard
          initials="MJ"
          name="Maria Jenkins"
          subject="Pre-Med • Resume Review"
          time="Tomorrow, 10:30 AM"
          duration="30 min session"
          action="Details"
        />
      </div>
    </section>
  );
}

function BookingCard({
  initials,
  name,
  subject,
  time,
  duration,
  action,
  isPrimary = false,
}: {
  initials: string;
  name: string;
  subject: string;
  time: string;
  duration: string;
  action: string;
  isPrimary?: boolean;
}) {
  return (
    <article className="grid gap-5 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:rounded-3xl sm:p-6">
      <div className="flex min-w-0 items-center gap-4">
        <Avatar className="size-11">
          <AvatarFallback className="bg-blue-100 text-sm font-bold text-blue-700">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h3 className="font-headline text-base font-bold text-slate-950">{name}</h3>
          <p className="mt-1 text-sm leading-5 text-slate-500">{subject}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between sm:justify-end sm:gap-6">
        <div className="text-left sm:text-right">
          <p className="text-sm font-bold text-slate-950">{time}</p>
          <p className="mt-1 text-xs font-medium text-slate-500">{duration}</p>
        </div>
        <Button
          variant={isPrimary ? "default" : "outline"}
          className={
            isPrimary
              ? "h-9 min-w-20 rounded-full bg-blue-100 px-5 font-bold text-blue-700 hover:bg-blue-200"
              : "h-9 min-w-20 rounded-full border-slate-100 bg-slate-50 px-5 font-bold text-blue-700 hover:bg-blue-50"
          }
        >
          {action}
        </Button>
      </div>
    </article>
  );
}
