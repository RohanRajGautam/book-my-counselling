'use client'

import { Edit2, ExternalLink, Globe2, Link2 } from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useMentorProfile } from '@/features/mentor-dashboard/hooks/useMentorProfile'

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

  const displayName = profile?.user?.full_name ?? '—'
  const initials = getInitials(displayName)
  const subtitle = [
    profile?.title,
    profile?.years_of_experience ? `${profile.years_of_experience}+ yrs exp` : null,
  ]
    .filter(Boolean)
    .join(' • ')

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-7">
      <h2 className="font-headline text-xl font-extrabold text-slate-950">
        Profile &amp; Presence
      </h2>

      <div className="mt-7 flex flex-col items-center text-center">
        {isLoading ? (
          <div className="size-20 animate-pulse rounded-full bg-slate-200" />
        ) : (
          <Avatar className="size-20 border-4 border-blue-100">
            <AvatarImage src={profile?.user?.avatar_url ?? undefined} alt={displayName} />
            <AvatarFallback className="bg-blue-100 text-xl font-bold text-blue-700">
              {initials}
            </AvatarFallback>
          </Avatar>
        )}
        <h3 className="mt-5 font-headline text-lg font-extrabold text-slate-950">
          {isLoading ? <span className="inline-block h-5 w-32 animate-pulse rounded bg-slate-200" /> : displayName}
        </h3>
        {subtitle && (
          <p className="mt-1 max-w-44 text-sm leading-5 text-slate-500">{subtitle}</p>
        )}
      </div>

      {profile?.bio && (
        <>
          <p className="mt-8 text-xs font-bold uppercase leading-none tracking-[0.12em] text-slate-500">
            Personal Bio
          </p>
          <p className="mt-3 rounded-2xl bg-[#eef4ff] p-5 text-sm leading-6 text-slate-700">
            {profile.bio}
          </p>
        </>
      )}

      {(profile?.linkedin_url || profile?.website_url) && (
        <>
          <p className="mt-7 text-xs font-bold uppercase leading-none tracking-[0.12em] text-slate-500">
            Professional Links
          </p>
          <div className="mt-3 space-y-3">
            {profile.linkedin_url && (
              <ProfileLink href={profile.linkedin_url} icon={<Link2 className="size-5 text-blue-700" />}>
                LinkedIn Profile
              </ProfileLink>
            )}
            {profile.website_url && (
              <ProfileLink href={profile.website_url} icon={<Globe2 className="size-5 text-blue-700" />}>
                Portfolio / Website
              </ProfileLink>
            )}
          </div>
        </>
      )}

      <Button
        variant="outline"
        className="mt-7 h-11 w-full rounded-2xl border-slate-100 bg-slate-50 font-bold text-blue-700 hover:bg-blue-50"
      >
        <Link href="/mentor/profile-settings" className="flex items-center gap-2">
          <Edit2 className="size-4" />
          Edit Profile
        </Link>
      </Button>
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
      className="flex min-h-12 items-center justify-between rounded-2xl bg-[#e6efff] px-4 text-sm font-bold text-slate-800 transition hover:bg-blue-100"
    >
      <span className="flex items-center gap-3">
        {icon}
        {children}
      </span>
      <ExternalLink className="size-4 text-slate-400" />
    </Link>
  )
}
