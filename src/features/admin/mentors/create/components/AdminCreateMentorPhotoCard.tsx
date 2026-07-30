'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, Loader2, Lock } from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ACCEPTED_AVATAR_MIME, MAX_AVATAR_BYTES, validateAvatarFile } from '../lib/validation'

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

type Props = {
  avatarFile: File | null
  fullName: string
  onAvatarChange: (file: File | null) => void
  /** Existing avatar URL shown when no new preview is staged (used by edit mode). */
  existingAvatarUrl?: string | null
  /**
   * When true, hide upload controls and show a read-only badge explaining that
   * avatar edits aren't available in the admin edit flow yet.
   */
  readOnly?: boolean
  /**
   * When provided, a selected file is uploaded immediately via this callback
   * instead of being staged for a later form submit. While the promise is
   * pending, the camera button and "Upload Photo" button show a spinner and
   * are disabled. Use this for flows where the avatar is its own mutation,
   * not part of the surrounding form.
   */
  onUpload?: (file: File) => Promise<void>
}

export function AdminCreateMentorPhotoCard({
  avatarFile,
  fullName,
  onAvatarChange,
  existingAvatarUrl = null,
  readOnly = false,
  onUpload,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!avatarFile) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(avatarFile)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [avatarFile])

  const resetInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return
    const file = e.target.files?.[0]
    if (!file) return
    const err = validateAvatarFile(file)
    if (err) {
      toast.error(err)
      onAvatarChange(null)
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

    onAvatarChange(file)
  }

  const displayUrl = previewUrl ?? existingAvatarUrl ?? undefined
  const initials = getInitials(fullName)
  const accept = ACCEPTED_AVATAR_MIME.join(',')
  const maxMb = (MAX_AVATAR_BYTES / (1024 * 1024)).toFixed(0)
  const isUploading = uploading

  return (
    <section className="rounded-[28px] bg-white p-5 text-center shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
      {!readOnly ? (
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="sr-only"
          aria-label="Upload mentor avatar"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      ) : null}

      <div className="relative mx-auto size-36">
        <Avatar className="size-36 border-[5px] border-blue-700">
          <AvatarImage src={displayUrl} alt={fullName || 'Avatar preview'} />
          <AvatarFallback className="bg-[#eef4ff] text-3xl font-extrabold text-blue-700">
            {initials || <Camera className="size-10 text-blue-300" />}
          </AvatarFallback>
        </Avatar>

        {!readOnly ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload profile photo"
            disabled={isUploading}
            className="absolute right-1 bottom-1 flex size-10 items-center justify-center rounded-full bg-blue-700 text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-60"
          >
            {isUploading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Camera className="size-5" />
            )}
          </button>
        ) : (
          <span
            aria-hidden
            className="absolute right-1 bottom-1 flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm"
          >
            <Lock className="size-4" strokeWidth={2.4} />
          </span>
        )}
      </div>

      <h2 className="font-headline mt-7 text-xl font-extrabold text-slate-950 sm:text-2xl">
        Profile Photo
      </h2>
      <p className="mx-auto mt-2 max-w-44 text-sm leading-5 text-slate-500">
        {readOnly
          ? 'Avatar editing is unavailable here. The current photo is shown for reference.'
          : `Upload a high-resolution headshot. JPG, PNG or WebP, max ${maxMb} MB.`}
      </p>

      {readOnly ? (
        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-600">
          <Lock className="size-3.5" strokeWidth={2.4} />
          Profile photos can&apos;t be changed from this screen yet.
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="mt-6 h-12 w-full rounded-xl border-blue-700 font-bold text-blue-700 hover:bg-blue-50 disabled:opacity-60"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Uploading…
            </>
          ) : avatarFile ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Change Photo
            </>
          ) : (
            'Upload Photo'
          )}
        </Button>
      )}
    </section>
  )
}
