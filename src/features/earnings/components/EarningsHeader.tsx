import { Bell } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export function EarningsHeader() {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-headline text-3xl leading-tight font-extrabold tracking-normal text-slate-950 sm:text-4xl lg:text-5xl">
          Earnings Overview
        </h1>
        <p className="mt-2 text-base leading-7 font-medium text-slate-500">
          Track your performance and manage your payouts.
        </p>
      </div>

      <div className="hidden items-center gap-4 sm:flex">
        <Button
          aria-label="View notifications"
          variant="ghost"
          size="icon-lg"
          className="size-11 rounded-full bg-[#eef4ff] text-slate-700 hover:bg-blue-50 hover:text-blue-700"
        >
          <Bell className="size-5" />
        </Button>
        <Avatar className="size-12 border-2 border-blue-600 shadow-sm">
          <AvatarImage alt="Mentor profile" />
          <AvatarFallback className="bg-white font-bold text-blue-700">EC</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
