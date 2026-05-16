'use client'

import { Bell } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { getInitials } from '@/features/mentors/components/MentorCard'

export function EarningsHeader() {
  const { data: user } = useCurrentUser()

  const displayName = user?.full_name ?? 'Mentor'
  const initials = getInitials(displayName)

  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-headline text-2xl leading-tight font-extrabold tracking-normal text-slate-950 sm:text-4xl lg:text-5xl">
          Earnings Overview
        </h1>
        <p className="mt-2 text-sm leading-6 font-medium text-slate-500 sm:text-base sm:leading-7">
          Track your performance and manage your payouts.
        </p>
      </div>

      <div className="hidden items-center gap-4 sm:flex">
        <Button
          aria-label="View notifications"
          variant="ghost"
          size="icon-lg"
          className="size-11 rounded-full bg-white text-slate-700 shadow-sm hover:bg-blue-50 hover:text-blue-700"
        >
          <Bell className="size-5" />
        </Button>
        <Avatar className="size-12 border-2 border-blue-600 shadow-sm">
          <AvatarImage src={user?.avatar_url ?? undefined} alt={displayName} />
          <AvatarFallback className="bg-blue-100 font-bold text-blue-700">{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
