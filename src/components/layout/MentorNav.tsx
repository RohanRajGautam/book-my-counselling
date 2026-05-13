'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CalendarDays,
  UserRound,
  WalletCards,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const mentorNavItems = [
  { icon: LayoutDashboard, href: '/mentor/dashboard', label: 'Dashboard' },
  { icon: CalendarDays, href: '/mentor/my-sessions', label: 'My Sessions' },
  { icon: WalletCards, href: '/mentor/earnings', label: 'Earnings' },
  { icon: UserRound, href: '/mentor/profile-settings', label: 'Profile Settings' },
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function MentorSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const displayName = user?.full_name ?? '—'
  const initials = getInitials(displayName)
  const roleLabel = user?.role === 'mentor' ? 'Mentor' : user?.role ?? ''

  return (
    <Sidebar className="border-none" style={{ '--sidebar-width': '260px' } as React.CSSProperties}>
      <SidebarHeader className="px-5 pt-7 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <LayoutDashboard size={18} strokeWidth={2.3} />
          </div>
          <div>
            <h2 className="font-headline text-sm font-extrabold tracking-normal text-slate-950">
              Book Your Counselling
            </h2>
            <p className="text-[10px] font-medium tracking-wider text-gray-400 uppercase">
              Expert Mentor Panel
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <div>
          <SidebarMenu className="gap-1">
            {mentorNavItems.map((item) => {
              const Icon = item.icon
              const isActive =
                item.href === '/mentor/dashboard'
                  ? pathname === '/mentor' || pathname.startsWith('/mentor/dashboard')
                  : pathname.startsWith(item.href)

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive}
                    className={cn(
                      'group h-11 rounded-xl px-3 font-bold transition-all duration-200',
                      isActive
                        ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-50'
                        : 'text-slate-500 hover:bg-white hover:text-slate-950'
                    )}
                  >
                    <Link href={item.href} className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          strokeWidth={isActive ? 2.2 : 1.8}
                          className={cn(
                            isActive ? 'text-blue-700' : 'text-slate-400 group-hover:text-slate-600'
                          )}
                        />
                        <span className="text-sm font-bold">{item.label}</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-100 p-4">
        <SidebarSeparator className="mb-4 bg-slate-100" />

        {/* User info */}
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <Avatar className="size-9 shrink-0 border-2 border-white shadow-sm">
            <AvatarImage src={user?.avatar_url ?? undefined} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-emerald-300 text-xs font-extrabold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold text-slate-950">{displayName}</p>
            <p className="truncate text-[11px] capitalize text-gray-500">{roleLabel}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="Sign out"
            title="Sign out"
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={15} />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export function MentorMobileHeader() {
  const pathname = usePathname()
  const currentItem = mentorNavItems.find((item) =>
    item.href === '/mentor/dashboard'
      ? pathname === '/mentor' || pathname.startsWith('/mentor/dashboard')
      : pathname.startsWith(item.href)
  )

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-100 bg-[#f8f9ff]/95 px-4 backdrop-blur md:hidden">
      <div>
        <p className="font-headline text-sm font-extrabold text-slate-950">Book My Counselling</p>
        <p className="text-xs font-semibold text-slate-500">
          {currentItem?.label ?? 'Mentor Panel'}
        </p>
      </div>
      <SidebarTrigger
        aria-label="Open mentor navigation"
        className="size-10 rounded-xl bg-white text-slate-700 shadow-sm"
      />
    </header>
  )
}
