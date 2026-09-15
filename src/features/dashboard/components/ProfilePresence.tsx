'use client'

import { useState } from 'react'
import {
  Download,
  Edit2,
  ExternalLink,
  Globe2,
  ImageDown,
  Link2,
  Loader2,
  Share2,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useMentorProfile } from '@/features/mentor-dashboard/hooks/useMentorProfile'
import { downloadWelcomeCard } from '@/features/welcome-card/lib/buildWelcomeCard'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function ProfilePresence() {
  const { data: profile, isLoading } = useMentorProfile()
  const [downloading, setDownloading] = useState(false)

  const displayName = profile?.user?.full_name ?? '—'
  const initials = getInitials(displayName)
  const subtitle = [
    profile?.title,
    profile?.years_of_experience ? `${profile.years_of_experience}+ yrs exp` : null,
  ]
    .filter(Boolean)
    .join(' • ')

  const avatarUrl = profile?.user?.avatar_url ?? null
  // Welcome card download needs an avatar — that's the card's background. If
  // the mentor hasn't uploaded one yet, surface that with a clear CTA.
  const hasAvatar = !!avatarUrl?.trim()

  const handleDownload = async () => {
    if (!hasAvatar || !profile) return
    setDownloading(true)
    try {
      await downloadWelcomeCard({
        full_name: profile.user.full_name,
        title: profile.title ?? '',
        company: profile.company ?? null,
        avatar_url: avatarUrl,
      })
      toast.success('Welcome card downloaded.')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not build the card.'
      toast.error(message)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-7">
      <h2 className="font-headline text-xl font-extrabold text-slate-950">
        Profile &amp; Presence
      </h2>

      {isLoading ? (
        <div className="mt-7 flex flex-col items-center text-center">
          <Skeleton className="size-20 rounded-full" />
          <Skeleton className="mt-5 h-5 w-32" />
          <Skeleton className="mt-2 h-4 w-44" />
          <Skeleton className="mt-7 h-24 w-full rounded-2xl bg-slate-100" />
          <Skeleton className="mt-3 h-12 w-full rounded-2xl bg-slate-100" />
          <Skeleton className="mt-3 h-12 w-full rounded-2xl bg-slate-100" />
          <Skeleton className="mt-7 h-32 w-full rounded-2xl bg-slate-100" />
        </div>
      ) : (
        <>
          <div className="mt-7 flex flex-col items-center text-center">
            <Avatar className="size-20 border-4 border-blue-100">
              <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
              <AvatarFallback className="bg-blue-100 text-xl font-bold text-blue-700">
                {initials}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-headline mt-5 text-lg font-extrabold text-slate-950">
              {displayName}
            </h3>
            {subtitle && (
              <p className="mt-1 max-w-44 text-sm leading-5 text-slate-500">{subtitle}</p>
            )}
          </div>

          {profile?.bio && (
            <>
              <p className="mt-8 text-xs leading-none font-bold tracking-[0.12em] text-slate-500 uppercase">
                Personal Bio
              </p>
              <p className="mt-3 rounded-2xl bg-[#eef4ff] p-5 text-sm leading-6 text-slate-700">
                {profile.bio}
              </p>
            </>
          )}

          {(profile?.linkedin_url || profile?.website_url) && (
            <>
              <p className="mt-7 text-xs leading-none font-bold tracking-[0.12em] text-slate-500 uppercase">
                Professional Links
              </p>
              <div className="mt-3 space-y-3">
                {profile.linkedin_url && (
                  <ProfileLink
                    href={profile.linkedin_url}
                    icon={<Link2 className="size-5 text-blue-700" />}
                  >
                    LinkedIn Profile
                  </ProfileLink>
                )}
                {profile.website_url && (
                  <ProfileLink
                    href={profile.website_url}
                    icon={<Globe2 className="size-5 text-blue-700" />}
                  >
                    Portfolio / Website
                  </ProfileLink>
                )}
              </div>
            </>
          )}

          {/* Welcome card — minimal feature block: solid brand-blue icon, short
              pitch, solid brand-blue CTA. No border, no panel shadow. */}
          <div className="mt-7 rounded-[22px]">
            <div className="flex items-start gap-3">
              {/* <span className="grid size-9 shrink-0 place-items-center rounded-[22px] bg-brand text-white">
                <Share2 className="size-4" strokeWidth={2.4} />
              </span> */}
              <div className="min-w-0">
                <p className="font-headline text-sm font-extrabold text-slate-950">
                  Share your welcome card
                </p>
                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                  A branded PNG with your name, role and company — for LinkedIn, Instagram, or your
                  bio.
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleDownload}
              disabled={!hasAvatar || downloading}
              className="bg-brand hover:bg-brand-hover mt-4 h-11 w-full rounded-lg font-bold text-white transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              {downloading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" strokeWidth={2.4} />
              )}
              {downloading ? 'Building…' : 'Download welcome card'}
            </Button>

            {!hasAvatar ? (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-slate-500">
                <ImageDown className="size-3.5 shrink-0" strokeWidth={2.4} />
                <span>Upload a picture first to download.</span>
                <Link
                  href="/mentor/profile-settings"
                  className="font-bold text-blue-700 underline-offset-2 hover:underline"
                >
                  Edit profile
                </Link>
              </p>
            ) : null}
          </div>

          <Button
            variant="outline"
            className="mt-4 h-11 w-full rounded-2xl border-slate-100 bg-slate-50 font-bold text-blue-700 hover:bg-blue-50"
          >
            <Link href="/mentor/profile-settings" className="flex items-center gap-2">
              <Edit2 className="size-4" />
              Edit Profile
            </Link>
          </Button>
        </>
      )}
    </section>
  )
}

function ProfileLink({
  href,
  icon,
  children,
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-12 items-center justify-between rounded-2xl bg-[#e6efff] px-4 text-sm font-bold text-blue-900 transition hover:bg-blue-100"
    >
      <span className="flex items-center gap-3">
        {icon}
        {children}
      </span>
      <ExternalLink className="size-4 text-slate-400" />
    </Link>
  )
}
