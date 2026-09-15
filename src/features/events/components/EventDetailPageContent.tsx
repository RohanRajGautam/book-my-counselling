'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { usePublicEvent } from '../hooks/useEvents'

import { EventCoverBanner, EventHero } from './EventDetailSections'
import { EventAboutSection } from './EventAboutSection'
import { EventBookingForm } from './EventBookingForm'
import { EventCompaniesStrip } from './EventCompaniesStrip'
import { EventGalleryGrid } from './EventGalleryGrid'
import { EventSpeakerCard } from './EventSpeakerCard'
import { EventTestimonialsList } from './EventTestimonialsList'
import { EventTimeline } from './EventTimeline'
import { EventYouTubeEmbed } from './EventYouTubeEmbed'

interface EventDetailPageContentProps {
 eventId: string
}

export function EventDetailPageContent({ eventId }: EventDetailPageContentProps) {
 const query = usePublicEvent(eventId)
 const event = query.data

 const sortedTimeline = useMemo(
 () => (event ? [...event.timeline_items].sort((a, b) => a.order_index - b.order_index) : []),
 [event]
 )
 const sortedGallery = useMemo(
 () => (event ? [...event.gallery_images].sort((a, b) => a.order_index - b.order_index) : []),
 [event]
 )
 const sortedCompanies = useMemo(
 () => (event ? [...event.companies].sort((a, b) => a.order_index - b.order_index) : []),
 [event]
 )

 if (query.isLoading) {
 return <EventDetailSkeleton />
 }

 if (query.isError || !event) {
 return <EventDetailNotFound />
 }

 const isBookable = !event.is_completed

 return (
 <main className="min-h-screen overflow-hidden bg-[#f7f8ff] pt-10 pb-20">
 <EventHero event={event} />

 <EventCoverBanner event={event} />

 <EventAboutSection event={event} />

 <EventSpeakerCard
 speaker={{
 speaker_name: event.speaker_name,
 speaker_title: event.speaker_title,
 speaker_description: event.speaker_description,
 speaker_image_url: event.speaker_image_url,
 }}
 />

 <EventTimeline items={sortedTimeline} />

 <EventYouTubeEmbed url={event.youtube_link} />

 <EventGalleryGrid images={sortedGallery} />

 <EventCompaniesStrip companies={sortedCompanies} />

 <EventTestimonialsList testimonials={event.testimonials} />

 {isBookable ? (
 <section id="reserve" className="mx-auto w-full max-w-[1350px] px-5 pt-12 pb-2 sm:px-8">
 <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
 <p className="text-xs font-extrabold tracking-[0.16em] text-[#004ac6] uppercase">
 Reserve your seat
 </p>
 <h2 className="font-headline mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
 Join us for {event.title}.
 </h2>
 <p className="mt-3 text-base leading-7 text-slate-600">
 Free to register — we&apos;ll send the details before the event.
 </p>
 </div>
 <div className="mx-auto mt-8 max-w-2xl">
 <EventBookingForm
 eventId={event.id}
 eventTitle={event.title}
 eventDate={event.event_date}
 />
 </div>
 </section>
 ) : null}
 </main>
 )
}

function EventDetailSkeleton() {
 return (
 <main className="min-h-screen bg-[#f7f8ff] pt-24 pb-20">
 <div className="mx-auto w-full max-w-[1350px] px-5 sm:px-8">
 <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
 <div className="space-y-4">
 <div className="h-6 w-32 animate-pulse rounded-full bg-[#eef4ff]" />
 <div className="h-12 w-3/4 animate-pulse rounded-[22px] bg-[#eef4ff]" />
 <div className="h-4 w-2/3 animate-pulse rounded-[22px] bg-[#eef4ff]" />
 <div className="h-4 w-1/2 animate-pulse rounded-[22px] bg-[#eef4ff]" />
 </div>
 <div className="aspect-[4/3] animate-pulse rounded-[22px] bg-[#eef4ff]" />
 </div>
 </div>
 </main>
 )
}

function EventDetailNotFound() {
 return (
 <main className="min-h-screen bg-[#f7f8ff] pt-24 pb-20">
 <div className="mx-auto flex w-full max-w-md flex-col items-center px-5 pt-16 text-center sm:px-8">
 <h1 className="font-headline text-3xl font-extrabold tracking-tight text-slate-900">
 Event not found
 </h1>
 <p className="mt-3 text-sm leading-7 text-slate-600">
 This event may have ended or the link is no longer active.
 </p>
 <Button
 nativeButton={false}
 render={<Link href="/events" />}
 className="mt-6 h-12 rounded-full bg-[#004ac6] px-6 font-bold text-white"
 >
 <ArrowLeft className="size-4" aria-hidden="true" />
 Browse all events
 </Button>
 </div>
 </main>
 )
}