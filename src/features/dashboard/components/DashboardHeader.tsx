'use client'

import { Bell } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function DashboardHeader() {
  const { data: user } = useCurrentUser()

  const displayName = user?.full_name ?? 'Mentor'
  const initials = getInitials(displayName)
  const firstName = displayName.split(' ')[0]

  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-headline text-3xl leading-tight font-extrabold tracking-normal text-slate-950 sm:text-4xl lg:text-5xl">
          Welcome back, {firstName}.
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 font-medium text-slate-500">
          Here is your academic advisory overview for this week.
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
