'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

import { EventGalleryUploader } from '../EventGalleryUploader'

interface EventGallerySectionProps {
  value: string[]
  onChange: (next: string[]) => void
  errorsByIndex: Record<number, { imageUrl?: string }>
  /** Toggle to surface the picker — used to nudge the admin when they hit the section empty. */
  hint?: string
}

/**
 * Gallery section — wraps the multi-file uploader with a header + summary.
 * Adds a top-level "Add images" call-to-action that opens the file picker
 * even when the uploader's empty state is showing its own button.
 */
export function EventGallerySection({
  value,
  onChange,
  errorsByIndex,
  hint,
}: EventGallerySectionProps) {
  const triggerPicker = () => {
    const input = document.querySelector<HTMLInputElement>(
      'input[type="file"][accept*="image/webp"]'
    )
    input?.click()
  }

  return (
    <section className="rounded-[22px] border border-[#d9e3f6] bg-white p-5 shadow-sm sm:p-6">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-headline text-lg font-extrabold tracking-tight text-slate-900">
            Photo gallery
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {hint ?? 'Drop in highlights from past events, the venue, or speaker portraits.'}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={triggerPicker}
          className="gap-1.5 rounded-[22px] border-[#004ac6]/30 bg-[#e6eeff] font-bold text-[#004ac6] hover:bg-[#dbe6ff]"
        >
          <Plus className="size-3.5" strokeWidth={2.6} />
          Add images
        </Button>
      </header>

      <EventGalleryUploader value={value} onChange={onChange} />

      {Object.entries(errorsByIndex).map(([idx, errs]) => (
        <p
          key={idx}
          className="mt-1.5 text-xs font-semibold text-red-700"
          role="alert"
        >
          Image {Number(idx) + 1}: {errs.imageUrl}
        </p>
      ))}
    </section>
  )
}
