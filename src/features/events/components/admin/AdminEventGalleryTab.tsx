'use client'

import Image from 'next/image'
import { Loader2, Trash2 } from 'lucide-react'

import {
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

  const handleReorder = (next: string[]) => {
    // Reorder on the server: PATCH each row whose order changed.
    next.forEach((url, idx) => {
      const row = sorted.find((img) => img.image_url === url)
      if (row && row.order_index !== idx) {
        update.mutate({ imageId: row.id, payload: { order_index: idx } })
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

      {sorted.length === 0 ? (
        <div className="rounded-[22px] border border-dashed border-[#c9d7f4] bg-[#f8f9ff] p-8 text-center">
          <p className="text-sm font-bold text-slate-700">No images yet.</p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Drop in highlights from the event — the gallery shows up on the public detail page.
          </p>
        </div>
      ) : (
        <EventGalleryUploader
          value={sorted.map((img) => img.image_url)}
          onChange={handleReorder}
        />
      )}

      {/* Render removal controls in a separate row so they don't conflict with the uploader's reorder UI. */}
      {sorted.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {sorted.map((img, idx) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-[22px] border border-[#d9e3f6] bg-slate-100"
            >
              <Image
                src={img.image_url}
                alt={`Gallery image ${idx + 1}`}
                fill
                sizes="(min-width: 640px) 200px, 45vw"
                className="object-cover"
              />
              <span className="absolute top-2 left-2 grid size-7 place-items-center rounded-full bg-white/90 text-xs font-extrabold text-slate-700 shadow">
                {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => remove.mutate(img.id)}
                disabled={remove.isPending}
                className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-white/90 text-red-700 shadow hover:bg-white"
                aria-label={`Remove image ${idx + 1}`}
              >
                {remove.isPending && remove.variables === img.id ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <p className="mt-3 text-xs font-medium text-slate-500">
        Use the arrow buttons on each image to reorder — order_index is saved on the backend.
      </p>
    </section>
  )
}
