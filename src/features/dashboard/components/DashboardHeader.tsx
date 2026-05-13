import { Bell } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export function DashboardHeader() {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-headline text-3xl leading-tight font-extrabold tracking-normal text-slate-950 sm:text-4xl lg:text-5xl">
          Welcome back, Dr. Chen.
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
          <AvatarImage alt="Dr. Chen" />
          <AvatarFallback className="bg-blue-100 font-bold text-blue-700">DC</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
