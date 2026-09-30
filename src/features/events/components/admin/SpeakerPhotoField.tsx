'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Camera, Loader2, Pencil, X } from 'lucide-react'

import { useUploadEventImage } from '../../hooks/useEventUploads'
import { validateEventImageFile } from '../../lib/event-upload.utils'

interface SpeakerPhotoFieldProps {
  /** Current photo URL — null when none has been uploaded yet. */
  value: string | null
  /** Speaker name — used for the alt text and the initials fallback. */
  name: string
  /** Called with the new URL after a successful upload (or `null` on remove). */
  onChange: (url: string | null) => void
  /** Optional label rendered above the field. Defaults to "Photo". */
  label?: string
  /** Optional helper text under the field. */
  hint?: string
  /** Disable the upload trigger while a parent is busy. */
  disabled?: boolean
  /** Hide the remove (X) badge — admin edits let the user replace but not delete. */
  allowRemove?: boolean
}

/**
 * Photo picker for a single speaker. Click anywhere on the avatar to upload
 * (or replace). The X badge in the top-right removes the photo. When the
 * photo is missing we fall back to the speaker's initial so the row still
 * looks intentional even before an upload.
 */
export function SpeakerPhotoField({
  value,
  name,
  onChange,
  label = 'Photo',
  hint,
  disabled,
  allowRemove = true,
}: SpeakerPhotoFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const upload = useUploadEventImage()
  const pending = upload.isPending
  // Keep a ref to the latest onChange so the async upload's onSuccess callback
  // always dispatches against the freshest draft. Without this, typing in a
  // sibling input between file selection and upload completion gets
  // overwritten — the captured onChange closure was built when the row was
  // still empty.
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  })
  const initials = (name.trim() || '?').charAt(0).toUpperCase()

  const openPicker = () => {
    if (disabled || pending) return
    setError(null)
    inputRef.current?.click()
  }

  const handleFile = (file: File) => {
    const err = validateEventImageFile(file)
    if (err) {
      setError(err)
      return
    }
    upload.mutate(
      { file, folder: 'events/speakers' },
      {
        onSuccess: (url) => {
          onChangeRef.current(url)
          // Reset so re-selecting the same file later fires `change` again.
          if (inputRef.current) inputRef.current.value = ''
        },
        onError: () => setError('Upload failed. Please try again.'),
      }
    )
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      {label ? (
        <p className="text-xs font-extrabold tracking-wide text-slate-700 uppercase">{label}</p>
      ) : null}

      <button
        type="button"
        onClick={openPicker}
        disabled={disabled || pending}
        aria-label={value ? `Replace ${name}'s photo` : `Add a photo for ${name}`}
        className="group relative block aspect-square w-full max-w-[200px] overflow-hidden rounded-[22px] border-2 border-dashed border-[#c9d7f4] bg-gradient-to-br from-[#eef4ff] via-[#dbe6ff] to-white text-left shadow-sm transition hover:border-[#004ac6]/40 focus-visible:ring-2 focus-visible:ring-[#004ac6]/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {value ? (
          <>
            <Image
              src={value}
              alt={name || 'Speaker photo'}
              fill
              sizes="200px"
              className="object-cover"
            />
            <span className="absolute inset-0 grid place-items-center bg-slate-900/0 transition group-hover:bg-slate-900/40">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-extrabold tracking-wide text-slate-800 uppercase opacity-0 shadow group-hover:opacity-100">
                <Pencil className="size-3.5" aria-hidden="true" />
                Replace
              </span>
            </span>
            <span
              role="button"
              tabIndex={allowRemove ? 0 : -1}
              onClick={handleRemove}
              onKeyDown={(e) => {
                if (!allowRemove) return
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleRemove(e as unknown as React.MouseEvent)
                }
              }}
              className={`absolute top-2 right-2 grid size-8 cursor-pointer place-items-center rounded-full bg-white/95 text-slate-700 shadow-sm transition hover:bg-white ${
                allowRemove ? '' : 'hidden'
              }`}
              aria-label="Remove photo"
              aria-hidden={!allowRemove}
            >
              <X className="size-4" />
            </span>
          </>
        ) : (
          <span className="absolute inset-0 grid place-items-center">
            <span className="flex flex-col items-center text-[#004ac6]/70">
              <span className="font-headline text-4xl font-extrabold text-[#004ac6]/35">
                {initials}
              </span>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-[#004ac6] uppercase shadow-sm">
                <Camera className="size-3" aria-hidden="true" />
                Add photo
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
        disabled={disabled || pending}
      />

      {hint && !error ? <p className="text-xs font-medium text-slate-500">{hint}</p> : null}

      {error ? (
        <p className="text-xs font-semibold text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
