'use client'

import {
  useAppendGalleryImage,
  useDeleteGalleryImage,
  useUpdateGalleryImage,
} from '../../hooks/useAdminEventNested'
import type { GalleryImageResponse } from '../../types/events.types'

import { EventGalleryUploader } from './EventGalleryUploader'

interface AdminEventGalleryTabProps {
  eventId: string
  images: GalleryImageResponse[]
}

export function AdminEventGalleryTab({ eventId, images }: AdminEventGalleryTabProps) {
  const sorted = [...images].sort((a, b) => a.order_index - b.order_index)
  const remove = useDeleteGalleryImage(eventId)
  const update = useUpdateGalleryImage(eventId)
  const append = useAppendGalleryImage(eventId)

  // The uploader is fully controlled by `sorted.map(...)`. Its onChange fires
  // for three different operations; diff against the previous list to dispatch
  // each to the right mutation:
  //   - URL in `next` but not in `sorted`  → newly uploaded → append
  //   - Existing URL whose index changed   → reordered → update
  //   - URL in `sorted` but not in `next`  → removed → delete
  const handleChange = (next: string[]) => {
    const knownUrls = new Set(sorted.map((img) => img.image_url))
    const nextUrls = new Set(next)

    next.forEach((url, idx) => {
      if (!knownUrls.has(url)) {
        append.mutate({ image_url: url, order_index: idx })
        return
      }
      const row = sorted.find((img) => img.image_url === url)
      if (row && row.order_index !== idx) {
        update.mutate({ imageId: row.id, payload: { order_index: idx } })
      }
    })

    sorted.forEach((row) => {
      if (!nextUrls.has(row.image_url)) {
        remove.mutate(row.id)
      }
    })
  }

  return (
    <section className="rounded-[22px] border border-[#d9e3f6] bg-white p-5 shadow-sm sm:p-6">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-headline text-lg font-extrabold tracking-tight text-slate-900">
            Photo gallery
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Use arrows to reorder, X to remove. Click the empty tile to add new images.
          </p>
        </div>
      </header>

      <EventGalleryUploader
        value={sorted.map((img) => img.image_url)}
        onChange={handleChange}
      />

      <p className="mt-3 text-xs font-medium text-slate-500">
        Use the arrow buttons on each image to reorder — order_index is saved on the backend.
      </p>
    </section>
  )
}
