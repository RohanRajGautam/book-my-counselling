import { youtubeEmbedUrl } from '../lib/events.utils'

interface EventYouTubeEmbedProps {
 url: string | null
}

/** Renders a responsive 16:9 embed. Returns null when the URL isn't a YouTube link. */
export function EventYouTubeEmbed({ url }: EventYouTubeEmbedProps) {
 const embed = youtubeEmbedUrl(url)
 if (!embed) return null
 return (
 <section className="mx-auto w-full max-w-[1350px] px-5 py-12 sm:px-8 sm:py-16">
 <div className="mx-auto grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
 <div className="lg:sticky lg:top-28">
 <span
 aria-hidden="true"
 className="block h-1 w-12 rounded-full bg-gradient-to-r from-[#004ac6] to-[#6cf8bb]"
 />
 <p className="mt-5 text-xs font-extrabold tracking-[0.16em] text-[#004ac6] uppercase">
 Watch
 </p>
 <h2 className="font-headline mt-2 text-3xl leading-[1.05] font-extrabold tracking-tight text-slate-900 sm:text-4xl">
 See what to expect.
 </h2>
 <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">
 A short clip from a past session — the kind of room you&apos;ll be walking into.
 </p>
 </div>
 <div className="overflow-hidden rounded-[22px] border border-[#d9e3f6] bg-slate-900 shadow-[0_28px_70px_rgba(18,28,42,0.20)]">
 <div className="relative aspect-video">
 <iframe
 src={embed}
 title="Event video"
 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
 allowFullScreen
 className="absolute inset-0 size-full"
 />
 </div>
 </div>
 </div>
 </section>
 )
}