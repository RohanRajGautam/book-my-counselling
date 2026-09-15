import { CalendarDays, Sparkles } from 'lucide-react'

interface EventsEmptyStateProps {
  /** "upcoming" or "past" — controls the icon and copy. */
  variant: 'upcoming' | 'past'
}

export function EventsEmptyState({ variant }: EventsEmptyStateProps) {
  const isUpcoming = variant === 'upcoming'
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-[22px] border border-[#d9e3f6]/70 bg-white/80 px-6 py-12 text-center shadow-[0_18px_50px_rgba(18,28,42,0.06)] backdrop-blur">
      <div className="grid size-14 place-items-center rounded-[22px] bg-[#e6eeff] text-[#004ac6]">
        {isUpcoming ? (
          <Sparkles className="size-7" aria-hidden="true" />
        ) : (
          <CalendarDays className="size-7" aria-hidden="true" />
        )}
      </div>
      <h3 className="mt-5 font-headline text-xl font-extrabold tracking-tight text-slate-900">
        {isUpcoming ? 'No upcoming events yet' : 'No past events to show'}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {isUpcoming
          ? 'New gatherings and fireside chats are announced here first. Follow us on social to hear about the next one.'
          : 'Once events wrap, photos and takeaways will land here.'}
      </p>
    </div>
  )
}
