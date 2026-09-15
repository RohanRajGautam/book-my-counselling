'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

import type { GalleryImageResponse } from '../types/events.types'

interface EventGalleryGridProps {
 images: GalleryImageResponse[]
}

export function EventGalleryGrid({ images }: EventGalleryGridProps) {
 const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
 if (images.length === 0) return null

 const close = () => setLightboxIdx(null)
 const next = () =>
 setLightboxIdx((idx) => (idx === null ? null : (idx + 1) % images.length))
 const prev = () =>
 setLightboxIdx((idx) => (idx === null ? null : (idx - 1 + images.length) % images.length))

 return (
 <section className="mx-auto w-full max-w-[1350px] px-5 py-12 sm:px-8 sm:py-16">
 <div className="mx-auto grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
 <div className="lg:sticky lg:top-28">
 <span
 aria-hidden="true"
 className="block h-1 w-12 rounded-full bg-gradient-to-r from-[#004ac6] to-[#6cf8bb]"
 />
 <p className="mt-5 text-xs font-extrabold tracking-[0.16em] text-[#004ac6] uppercase">
 Moments from the room
 </p>
 <h2 className="font-headline mt-2 text-3xl leading-[1.05] font-extrabold tracking-tight text-slate-900 sm:text-4xl">
 Gallery.
 </h2>
 <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">
 Click any photo to view it full-size. A small taste of what the gathering looked like.
 </p>
 </div>

 <div>
 <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
 {images.map((img, idx) => (
 <button
 key={img.id}
 type="button"
 onClick={() => setLightboxIdx(idx)}
 className="group relative aspect-square overflow-hidden rounded-[22px] border border-[#d9e3f6] bg-slate-100 shadow-[0_10px_30px_rgba(18,28,42,0.06)]"
 aria-label={`Open image ${idx + 1}`}
 >
 <Image
 src={img.image_url}
 alt={`Gallery image ${idx + 1}`}
 fill
 sizes="(min-width: 1024px) 28vw, (min-width: 640px) 30vw, 45vw"
 className="object-cover"
 />
 </button>
 ))}
 </div>

 {lightboxIdx !== null ? (
 <div
 className="fixed inset-0 z-50 grid place-items-center bg-slate-950/88 p-4 backdrop-blur-sm"
 onClick={close}
 role="dialog"
 aria-modal="true"
 aria-label="Image viewer"
 >
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation()
 close()
 }}
 className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white/15 text-white"
 aria-label="Close"
 >
 <X className="size-5" />
 </button>
 {images.length > 1 ? (
 <>
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation()
 prev()
 }}
 className="absolute left-4 grid size-12 place-items-center rounded-full bg-white/15 text-white sm:left-8"
 aria-label="Previous image"
 >
 <ChevronLeft className="size-6" />
 </button>
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation()
 next()
 }}
 className="absolute right-4 grid size-12 place-items-center rounded-full bg-white/15 text-white sm:right-8"
 aria-label="Next image"
 >
 <ChevronRight className="size-6" />
 </button>
 </>
 ) : null}

 <div
 className="relative max-h-[88vh] max-w-[92vw] overflow-hidden rounded-[22px] bg-slate-950"
 onClick={(e) => e.stopPropagation()}
 >
 {(() => {
 const active = images[lightboxIdx]
 if (!active) return null
 return (
 <Image
 src={active.image_url}
 alt={`Gallery image ${lightboxIdx + 1}`}
 width={1600}
 height={1000}
 className="max-h-[88vh] w-auto object-contain"
 sizes="92vw"
 />
 )
 })()}
 </div>
 </div>
 ) : null}
 </div>
 </div>
 </section>
 )
}