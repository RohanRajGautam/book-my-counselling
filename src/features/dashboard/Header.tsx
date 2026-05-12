import React from 'react'
import { Bell } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'

const Header = () => {
  return (
    <header className="w-full rounded-[28px]  bg-[#f7f8fc] px-8 py-7">
      <div className="flex items-start justify-between gap-6">
        
        {/* Left Content */}
        <div>
          <h1 className="text-[48px] font-extrabold leading-none tracking-[-2px] text-slate-900">
            Welcome back, Dr. Chen.
          </h1>

          <p className="mt-3 text-[17px] font-medium text-slate-500">
            Here’s your academic advisory overview for this week.
          </p>
        </div>

        {/* Right Content */}
        <div className="flex items-center gap-4">
          
          {/* Notification Button */}
          <button className="relative flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-50">
            <Bell className="h-5 w-5 text-slate-700" />

            {/* Notification Dot */}
            <span className="absolute right-[15px] top-[15px] h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Profile */}
          <div className="flex items-center">
            <Avatar className="h-12 w-12 border-2 border-blue-500">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>DC</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header