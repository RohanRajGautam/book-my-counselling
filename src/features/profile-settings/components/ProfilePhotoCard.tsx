'use client'

import { useRef, useState } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useMentorProfile } from '@/features/mentor-dashboard/hooks/useMentorProfile'
import { uploadAvatar } from '@/features/mentor-dashboard/api/mentor-dashboard.api'
import { useQueryClient } from '@tanstack/react-query'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function ProfilePhotoCard() {
  const { data: profile } = useMentorProfile()
  const queryClient = useQueryClient()
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const displayName = profile?.user?.full_name ?? ''
  const initials = getInitials(displayName)
  const avatarUrl = profile?.user?.avatar_url ?? null

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5 MB.')
      return
    }

    setUploading(true)
    try {
      await uploadAvatar(file)
      // Invalidate both caches so the new avatar_url propagates everywhere
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      await queryClient.invalidateQueries({ queryKey: ['mentor', 'profile', 'me'] })
      toast.success('Profile photo updated.')
    } catch {
      toast.error('Failed to upload photo. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <section className="rounded-2xl bg-white p-5 text-center shadow-sm sm:rounded-3xl sm:p-7">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        aria-label="Upload profile photo"
        onChange={handleFileChange}
      />

      {/* Avatar preview */}
      <div className="relative mx-auto size-36">
        <Avatar className="size-36 border-[5px] border-blue-700">
          <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
          <AvatarFallback className="bg-[#eef4ff] text-3xl font-extrabold text-blue-700">
            {initials || <Camera className="size-10 text-blue-300" />}
          </AvatarFallback>
        </Avatar>

        {/* Camera overlay — click to upload */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          aria-label="Change profile photo"
          className="absolute bottom-1 right-1 flex size-10 items-center justify-center rounded-full bg-blue-700 text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Camera className="size-5" />
          )}
        </button>
      </div>

      <h2 className="mt-7 font-headline text-xl font-extrabold text-slate-950">Profile Photo</h2>
      <p className="mx-auto mt-2 max-w-44 text-sm leading-5 text-slate-500">
        Upload a high-resolution headshot. JPG, PNG or WebP, max 5 MB.
      </p>

      <Button
        variant="outline"
        className="mt-6 h-12 w-full rounded-xl border-blue-700 font-bold text-blue-700 hover:bg-blue-50"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Uploading…
          </>
        ) : avatarUrl ? (
          'Change Photo'
        ) : (
          'Upload Photo'
        )}
      </Button>
    </section>
  )
}
