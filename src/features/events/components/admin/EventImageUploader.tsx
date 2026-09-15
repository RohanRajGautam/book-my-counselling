'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { ImagePlus, Loader2, Pencil, X } from 'lucide-react'

import { useUploadEventCover, useUploadEventImage } from '../../hooks/useEventUploads'
import { EVENT_FORM_INPUT_CLASS } from '../../lib/events.constants'
import { validateEventImageFile } from '../../lib/event-upload.utils'

interface BaseProps {
  /** Display label rendered above the preview. */
  label?: string
  /** Helper text under the label. */
  hint?: string
  /** Current image URL (already uploaded). */
  value: string | null
  /** Called with the new URL after a successful upload. */
  onChange: (url: string | null) => void
  /** Disable the upload button while a parent is busy. */
  disabled?: boolean
}

interface CoverUploaderProps extends BaseProps {
  variant: 'cover'
}

interface GenericImageUploaderProps extends BaseProps {
  variant: 'generic'
  /** Folder passed to /upload/event-image (e.g. events/speakers). */
  folder: string
}

type EventImageUploaderProps = CoverUploaderProps | GenericImageUploaderProps

/**
 * Single-image uploader used by the cover, speaker, testimonial, and company-logo
 * fields. Calls /upload/event-cover for variant="cover" and
 * /upload/event-image?folder=... otherwise. Always emits the resulting URL up
 * to the parent — the URL is what gets POSTed into the event payload later.
 */
export function EventImageUploader(props: EventImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const cover = useUploadEventCover()
  const generic = useUploadEventImage()
  const pending = props.variant === 'cover' ? cover.isPending : generic.isPending

  const handleFile = (file: File) => {
    const err = validateEventImageFile(file)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    if (props.variant === 'cover') {
      cover.mutate(file, {
        onSuccess: (url) => props.onChange(url),
        onError: () => setError('Upload failed. Please try again.'),
      })
    } else {
      generic.mutate(
        { file, folder: props.folder },
        {
          onSuccess: (url) => props.onChange(url),
        }
      )
    }
  }

  const handleRemove = () => {
    props.onChange(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const openPicker = () => {
    if (props.disabled || pending) return
    inputRef.current?.click()
  }

  const isCover = props.variant === 'cover'
  const aspectClass = isCover ? 'aspect-[16/9]' : 'aspect-square'
  const iconSize = isCover ? 'size-12' : 'size-10'

  return (
    <div className="space-y-2">
      {props.label ? (
        <div>
          <p className="text-xs font-extrabold tracking-wide text-slate-700 uppercase">
            {props.label}
          </p>
          {props.hint ? (
            <p className="mt-1 text-xs font-medium text-slate-500">{props.hint}</p>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={openPicker}
        disabled={props.disabled || pending}
        className={`group relative block w-full overflow-hidden rounded-[22px] border-2 border-dashed border-[#c9d7f4] bg-[#eef4ff] text-left transition hover:border-[#004ac6]/40 hover:bg-[#dbe6ff]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004ac6]/30 disabled:cursor-not-allowed disabled:opacity-60 ${aspectClass}`}
        aria-label={props.value ? 'Replace image' : 'Upload image'}
      >
        {props.value ? (
          <>
            <Image
              src={props.value}
              alt={props.label ?? 'Uploaded image'}
              fill
              sizes={isCover ? '320px' : '160px'}
              className="object-cover"
            />
            <span className="absolute inset-0 grid place-items-center bg-slate-900/0 transition group-hover:bg-slate-900/35">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-extrabold tracking-wide text-slate-800 opacity-0 uppercase shadow group-hover:opacity-100">
                <Pencil className="size-3.5" aria-hidden="true" />
                Replace
              </span>
            </span>
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation()
                handleRemove()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  e.stopPropagation()
                  handleRemove()
                }
              }}
              className="absolute top-2 right-2 grid size-8 cursor-pointer place-items-center rounded-full bg-white/95 text-slate-700 shadow-sm hover:bg-white"
              aria-label="Remove image"
            >
              <X className="size-4" />
            </span>
          </>
        ) : (
          <span className="absolute inset-0 grid place-items-center">
            <span className="flex flex-col items-center text-[#004ac6]/80">
              <span
                className={`grid place-items-center rounded-[22px] bg-white shadow ${iconSize}`}
              >
                <ImagePlus className="size-5" aria-hidden="true" />
              </span>
              <span className="mt-3 text-xs font-extrabold tracking-wide uppercase">
                {isCover ? 'Add a cover image' : 'Add image'}
              </span>
              <span className="mt-1 text-[10px] font-medium text-slate-500">
                Click to choose · JPG / PNG / WebP · 5 MB max
              </span>
            </span>
          </span>
        )}

        {pending ? (
          <span className="absolute inset-0 grid place-items-center bg-white/70 backdrop-blur-sm">
            <Loader2 className="size-5 animate-spin text-[#004ac6]" />
          </span>
        ) : null}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
        disabled={props.disabled || pending}
      />

      {error ? (
        <p className="text-xs font-semibold text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

// Re-export so admin event sections can use the same input style.
export { EVENT_FORM_INPUT_CLASS }
