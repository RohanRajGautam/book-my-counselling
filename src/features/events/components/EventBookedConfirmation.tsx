import { CheckCircle2 } from 'lucide-react'

import { formatEventDate } from '../lib/events.utils'

interface EventBookedConfirmationProps {
 eventTitle: string
 eventDate: string
}

/** Success state shown after a booking returns 201. */
export function EventBookedConfirmation({ eventTitle, eventDate }: EventBookedConfirmationProps) {
 return (
 <div className="rounded-[22px] border border-[#d9e3f6] bg-gradient-to-br from-white via-[#f8f9ff] to-[#eef4ff] p-6 shadow-[0_18px_50px_rgba(0,74,198,0.12)] sm:p-8">
 <div className="grid size-12 place-items-center rounded-[22px] bg-[#004ac6] text-white shadow-[0_18px_36px_rgba(0,74,198,0.22)]">
 <CheckCircle2 className="size-6" aria-hidden="true" />
 </div>
 <h3 className="mt-5 font-headline text-2xl font-extrabold tracking-tight text-slate-900">
 You&apos;re booked!
 </h3>
 <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">
 We&apos;ll see you for <strong>{eventTitle}</strong> on{' '}
 <strong>{formatEventDate(eventDate)}</strong>. Keep an eye on your inbox for the venue
 details and what to bring.
 </p>
 <p className="mt-3 text-xs font-semibold text-[#004ac6]">
 See you on {formatEventDate(eventDate)}.
 </p>
 </div>
 )
}
