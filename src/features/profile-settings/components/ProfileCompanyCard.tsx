'use client'

import { useRef, useState } from 'react'
import { Building2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  ACCEPTED_AVATAR_MIME,
  MAX_AVATAR_BYTES,
} from '@/features/admin/mentors/create/lib/validation'

const ACCEPTED_LOGO_MIME = ACCEPTED_AVATAR_MIME
const MAX_LOGO_BYTES = MAX_AVATAR_BYTES

function validateLogoFile(file: File): string | null {
  if (!(ACCEPTED_LOGO_MIME as readonly string[]).includes(file.type)) {
    return 'Logo must be a JPG, PNG, or WebP image.'
  }
  if (file.size > MAX_LOGO_BYTES) {
    return 'Logo must be smaller than 5 MB.'
  }
  return null
}

type Props = {
  /** Existing company logo URL. The parent updates this on upload success so
   *  the card refreshes without waiting for the profile refetch. */
  existingLogoUrl?: string | null
  onUpload: (file: File) => Promise<void>
  companyName?: string | null
}

export function ProfileCompanyCard({
  existingLogoUrl = null,
  onUpload,
  companyName = null,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const resetInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const err = validateLogoFile(file)
    if (err) {
      toast.error(err)
      resetInput()
      return
    }
    setUploading(true)
    void onUpload(file).finally(() => {
      setUploading(false)
      resetInput()
    })
  }

  const displayUrl = existingLogoUrl ?? undefined
  const maxMb = (MAX_LOGO_BYTES / (1024 * 1024)).toFixed(0)

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
        Upload your company or institution logo. JPG, PNG or WebP, max {maxMb} MB.
      </p>

      <Button
        type="button"
        variant="outline"
        className="mt-6 h-12 w-full rounded-xl border-blue-700 font-bold text-blue-700 hover:bg-blue-50 disabled:opacity-60"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Uploading…
          </>
        ) : existingLogoUrl ? (
          'Change Logo'
        ) : (
          'Upload Logo'
        )}
      </Button>
    </section>
  )
}
