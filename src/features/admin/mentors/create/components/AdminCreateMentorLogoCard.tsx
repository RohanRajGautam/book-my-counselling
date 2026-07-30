'use client'

import { useEffect, useRef, useState } from 'react'
import { Building2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { ACCEPTED_AVATAR_MIME, MAX_AVATAR_BYTES, validateLogoFile } from '../lib/validation'

const ACCEPTED_LOGO_MIME = ACCEPTED_AVATAR_MIME
const MAX_LOGO_BYTES = MAX_AVATAR_BYTES

type Props = {
  /**
   * Existing company logo URL (used in edit mode). When provided, the card
   * shows this URL while no staged file is selected and no upload is in flight.
   */
  existingLogoUrl?: string | null
  /**
   * Staged file (used in create mode). When set, the card previews it via a
   * local blob URL. The parent submits it as part of the form.
   */
  companyLogoFile?: File | null
  /** Called when the user picks or clears a file (create mode). */
  onCompanyLogoChange?: (file: File | null) => void
  /**
   * When provided, a selected file is uploaded immediately via this callback
   * (edit mode). The `existingLogoUrl` shown above will refresh from the
   * upload response. While the promise is pending, the upload button shows a
   * spinner and is disabled. Mutually exclusive with `onCompanyLogoChange`.
   */
  onUpload?: (file: File) => Promise<void>
  companyName?: string | null
}

export function AdminCreateMentorLogoCard({
  existingLogoUrl = null,
  companyLogoFile = null,
  onCompanyLogoChange,
  onUpload,
  companyName = null,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  // Build a preview URL from the staged file. Cleanup runs when the file
  // changes or the component unmounts so the blob URL doesn't leak.
  useEffect(() => {
    if (!companyLogoFile) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(companyLogoFile)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [companyLogoFile])

  const resetInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const err = validateLogoFile(file)
    if (err) {
      toast.error(err)
      onCompanyLogoChange?.(null)
      resetInput()
      return
    }

    if (onUpload) {
      setUploading(true)
      void onUpload(file).finally(() => {
        setUploading(false)
        resetInput()
      })
      return
    }

    onCompanyLogoChange?.(file)
  }

  const handleClear = () => {
    onCompanyLogoChange?.(null)
    resetInput()
  }

  const displayUrl = previewUrl ?? existingLogoUrl ?? undefined
  const maxMb = (MAX_LOGO_BYTES / (1024 * 1024)).toFixed(0)
  const showClearButton = !onUpload && Boolean(companyLogoFile)

  return (
    <section className="rounded-[28px] bg-white p-5 text-center shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_LOGO_MIME.join(',')}
        className="sr-only"
        aria-label="Upload company logo"
        onChange={handleFileChange}
        disabled={uploading}
      />

      <div className="relative mx-auto size-36">
        {displayUrl ? (
          <div className="size-full overflow-hidden rounded-2xl border-[5px] border-blue-700 bg-white shadow-sm">
            <Image
              src={displayUrl}
              alt={companyName ? `${companyName} logo` : 'Company logo'}
              width={144}
              height={144}
              className="size-full object-contain"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex size-full items-center justify-center rounded-2xl border-[5px] border-blue-700 bg-[#eef4ff]">
            <Building2 className="size-12 text-blue-300" aria-hidden />
          </div>
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          aria-label="Upload company logo"
          className="absolute right-1 bottom-1 flex size-10 items-center justify-center rounded-full bg-blue-700 text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Building2 className="size-5" />
          )}
        </button>
      </div>

      <h2 className="font-headline mt-7 text-xl font-extrabold text-slate-950 sm:text-2xl">
        Company Logo
      </h2>
      <p className="mx-auto mt-2 max-w-44 text-sm leading-5 text-slate-500">
        Upload the mentor&apos;s company or institution logo. JPG, PNG or WebP, max {maxMb} MB.
      </p>

      <div className="mt-6 flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-12 w-full rounded-xl border-blue-700 font-bold text-blue-700 hover:bg-blue-50 disabled:opacity-60"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Uploading…
            </>
          ) : displayUrl ? (
            'Change Logo'
          ) : (
            'Upload Logo'
          )}
        </Button>
        {showClearButton ? (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-bold text-slate-500 transition hover:text-slate-700"
          >
            Remove logo
          </button>
        ) : null}
      </div>
    </section>
  )
}
