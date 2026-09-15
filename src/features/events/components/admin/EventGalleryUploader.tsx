'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ImagePlus, Loader2, X } from 'lucide-react'

import { useUploadEventGallery } from '../../hooks/useEventUploads'
import { validateEventImageFile } from '../../lib/event-upload.utils'

interface EventGalleryUploaderProps {
  value: string[]
  onChange: (next: string[]) => void
  disabled?: boolean
}

/**
 * Multi-file gallery uploader. Drops the selected files into one POST against
 * /upload/event-gallery, then maps the returned URLs onto the row list in
 * input order. Reorder with up/down arrow buttons.
 */
export function EventGalleryUploader({ value, onChange, disabled }: EventGalleryUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const upload = useUploadEventGallery()

  const handleFiles = (files: File[]) => {
    const rejected: string[] = []
    const accepted: File[] = []
    for (const file of files) {
      const err = validateEventImageFile(file)
      if (err) rejected.push(`${file.name}: ${err}`)
      else accepted.push(file)
    }
    if (rejected.length > 0) {
      setError(rejected.join('\n'))
      return
    }
    setError(null)
    if (accepted.length === 0) return

    upload.mutate(accepted, {
      onSuccess: (urls) => {
        if (urls.length > 0) onChange([...value, ...urls])
      },
      onError: () => setError('Upload failed. Please try again.'),
    })
  }

  const removeAt = (idx: number) => {
    const next = value.filter((_, i) => i !== idx)
    onChange(next)
  }

  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir
    if (target < 0 || target >= value.length) return
    const next = [...value]
    const a = next[idx]
    const b = next[target]
    if (a === undefined || b === undefined) return
    next[idx] = b
    next[target] = a
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? [])
          if (files.length > 0) handleFiles(files)
          e.target.value = ''
        }}
        disabled={disabled || upload.isPending}
      />

      {value.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || upload.isPending}
          className="grid w-full place-items-center rounded-[22px] border-2 border-dashed border-[#c9d7f4] bg-[#eef4ff] py-10 text-[#004ac6] transition hover:bg-[#dbe6ff]/60"
        >
          <div className="flex flex-col items-center">
            <div className="grid size-12 place-items-center rounded-[22px] bg-white shadow">
              <ImagePlus className="size-5" aria-hidden="true" />
            </div>
            <p className="mt-3 text-sm font-extrabold tracking-tight">
              Drop in event photos
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Click to choose multiple files · JPG / PNG / WebP · 5 MB each
            </p>
          </div>
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="group relative aspect-square overflow-hidden rounded-[22px] border border-[#d9e3f6] bg-slate-100 shadow-sm"
            >
              <Image
                src={url}
                alt={`Gallery image ${idx + 1}`}
                fill
                sizes="(min-width: 640px) 200px, 45vw"
                className="object-cover"
              />

              <div className="absolute inset-x-2 top-2 flex items-center justify-between gap-1">
                <span className="grid size-7 place-items-center rounded-full bg-white/90 text-xs font-extrabold text-slate-700 shadow">
                  {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeAt(idx)}
                  className="grid size-7 place-items-center rounded-full bg-white/90 text-red-700 shadow hover:bg-white"
                  aria-label={`Remove image ${idx + 1}`}
                >
                  <X className="size-3.5" />
                </button>
              </div>

              <div className="absolute right-2 bottom-2 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className="grid size-7 place-items-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white disabled:opacity-40"
                  aria-label={`Move image ${idx + 1} up`}
                >
                  <ArrowUp className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(idx, 1)}
                  disabled={idx === value.length - 1}
                  className="grid size-7 place-items-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white disabled:opacity-40"
                  aria-label={`Move image ${idx + 1} down`}
                >
                  <ArrowDown className="size-3.5" />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || upload.isPending}
            className="grid aspect-square place-items-center rounded-[22px] border-2 border-dashed border-[#c9d7f4] bg-[#eef4ff] text-[#004ac6] transition hover:bg-[#dbe6ff]/60"
          >
            <div className="flex flex-col items-center">
              <ImagePlus className="size-5" aria-hidden="true" />
              <span className="mt-1 text-xs font-bold">Add more</span>
            </div>
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-slate-500">
          {value.length === 0
            ? 'No images yet.'
            : `${value.length} image${value.length === 1 ? '' : 's'} · use arrows to reorder.`}
        </p>
        {upload.isPending ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#004ac6]">
            <Loader2 className="size-3 animate-spin" /> Uploading…
          </span>
        ) : null}
      </div>

      {error ? (
        <p className="text-xs font-semibold whitespace-pre-line text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
