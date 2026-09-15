import Link from 'next/link'
import { Inbox, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface AdminEventBookingsTabProps {
  eventId: string
  bookingCount?: number
}

/**
 * Bookings tab body — the actual paginated inbox lives at
 * /admin/events/[id]/bookings, so this tab just nudges admins there and
 * surfaces a count badge when the parent already loaded the booking total.
 */
export function AdminEventBookingsTab({ eventId, bookingCount }: AdminEventBookingsTabProps) {
  return (
    <section className="rounded-[22px] border border-[#d9e3f6] bg-white p-5 shadow-sm sm:p-6">
      <header className="mb-5 flex items-start gap-3">
        <div className="grid size-10 place-items-center rounded-[22px] bg-[#e6eeff] text-[#004ac6]">
          <Inbox className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-headline text-lg font-extrabold tracking-tight text-slate-900">
            Booking inbox
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Every seat booked on this event lands in a dedicated inbox — copy emails,
            deep-link with mailto, and track who&apos;s coming.
          </p>
          {typeof bookingCount === 'number' ? (
            <p className="mt-2 text-xs font-bold text-slate-700">
              {bookingCount.toLocaleString('en-US')} booking
              {bookingCount === 1 ? '' : 's'} so far
            </p>
          ) : null}
        </div>
      </header>
      <Button
        nativeButton={false}
        render={<Link href={`/admin/events/${eventId}/bookings`} />}
        className="gap-1.5 rounded-[22px] bg-[#0755d8] px-5 py-3 font-bold text-white hover:bg-blue-700"
      >
        Open inbox
        <ExternalLink className="size-4" aria-hidden="true" />
      </Button>
    </section>
  )
}
