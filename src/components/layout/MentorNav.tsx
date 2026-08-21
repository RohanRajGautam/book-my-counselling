'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  CalendarDays,
  Inbox,
  LayoutDashboard,
  LogOut,
  UserRound,
  WalletCards,
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
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const BYC_LOGO_SRC = '/byc-logo.svg'

const mentorNavItems = [
  { icon: LayoutDashboard, href: '/mentor/dashboard', label: 'Dashboard' },
  { icon: CalendarDays, href: '/mentor/my-sessions', label: 'My Sessions' },
  { icon: Inbox, href: '/mentor/availability-requests', label: 'Availability Requests' },
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
  const [signOutOpen, setSignOutOpen] = useState(false)

  const displayName = user?.full_name ?? '—'
  const initials = getInitials(displayName)
  const roleLabel = user?.role === 'mentor' ? 'Mentor' : user?.role ?? ''

  return (
    <Sidebar
      className="border-r border-slate-200/70 bg-white text-slate-950"
      style={{ '--sidebar-width': '272px' } as React.CSSProperties}
    >
      {/* Brand block */}
      <SidebarHeader className="px-5 pt-7 pb-6">
        <Link
          href="/mentor/dashboard"
          className="group/brand flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 p-2 shadow-[0_8px_22px_rgba(7,85,216,0.28)] transition duration-200 group-hover/brand:scale-[1.04] group-hover/brand:shadow-[0_10px_28px_rgba(7,85,216,0.36)]">
            <img
              src={BYC_LOGO_SRC}
              alt="Book My Counselling"
              className="size-7 w-auto object-contain brightness-0 invert"
            />
          </div>
          <div className="min-w-0">
            <h2 className="font-headline text-[15px] font-extrabold tracking-tight text-slate-950">
              Book My Counselling
            </h2>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[10px] font-extrabold tracking-[0.14em] text-emerald-700 uppercase">
                Mentor Panel
              </span>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent className="px-4 pt-1 pb-5">
        <p className="mb-3 px-3 text-[10px] font-extrabold tracking-[0.18em] text-slate-400 uppercase">
          Workspace
        </p>
        <SidebarMenu className="gap-1.5">
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
                    'h-12 rounded-2xl px-3 font-bold transition-all duration-200',
                    isActive
                      ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/70 shadow-[0_4px_14px_rgba(7,85,216,0.08)]'
                      : 'text-slate-700 hover:bg-slate-50/80 hover:text-slate-950'
                  )}
                >
                  <Link
                    href={item.href}
                    className="flex w-full items-center gap-3"
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-200',
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-500'
                      )}
                    >
                      <Icon size={16} strokeWidth={2.2} />
                    </span>
                    <span className="text-sm font-bold tracking-tight">
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* User + logout */}
      <SidebarFooter className="border-t border-slate-200/70 px-4 pt-3 pb-5">
        <div className="rounded-2xl bg-[#f8f9ff] p-3">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <Avatar className="size-10 border-2 border-white shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
                <AvatarImage src={user?.avatar_url ?? undefined} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-xs font-extrabold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-[#f8f9ff] bg-emerald-500 shadow-[0_0_0_1px_rgba(16,185,129,0.2)]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-extrabold text-slate-950">
                {displayName}
              </p>
              <p className="mt-0.5 truncate text-[10px] font-bold tracking-[0.12em] text-slate-600 uppercase">
                {roleLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSignOutOpen(true)}
              aria-label="Sign out"
              title="Sign out"
              className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-blue-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 active:scale-[0.96]"
            >
              <LogOut size={15} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </SidebarFooter>

      <SignOutConfirmationDialog
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        onConfirm={logout}
      />
    </Sidebar>
  )
}

function SignOutConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (next: boolean) => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-sm gap-6 rounded-3xl bg-white p-7 text-center shadow-[0_24px_60px_rgba(15,23,42,0.18)] ring-0"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-[0_10px_30px_rgba(220,38,38,0.32)]">
            <LogOut className="size-6" strokeWidth={2.2} />
          </div>
          <div className="space-y-1.5">
            <DialogTitle className="font-headline text-lg font-extrabold tracking-tight text-slate-950">
              Sign out of your account?
            </DialogTitle>
            <DialogDescription className="mx-auto max-w-[18rem] text-sm leading-5 font-medium text-slate-500">
              You&apos;ll need to sign in again to access your mentor dashboard and earnings.
            </DialogDescription>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 flex-1 rounded-xl border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="h-11 flex-1 rounded-xl bg-red-600 font-bold text-white shadow-[0_8px_20px_rgba(220,38,38,0.28)] hover:bg-red-700"
          >
            Sign out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
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
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-200/70 bg-white/95 px-3 backdrop-blur md:hidden sm:px-5">
      <Link
        href="/mentor/dashboard"
        className="flex min-w-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
      >
        <img
          src={BYC_LOGO_SRC}
          alt="Book My Counselling"
          className="h-7 w-auto shrink-0"
        />
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold tracking-[0.16em] text-emerald-700 uppercase">
            Mentor Panel
          </p>
          <p className="truncate font-headline text-[15px] font-extrabold tracking-tight text-slate-950">
            {currentItem?.label ?? 'Dashboard'}
          </p>
        </div>
      </Link>
      <MobileNavTrigger />
    </header>
  )
}

function MobileNavTrigger() {
  const { openMobile, toggleSidebar } = useSidebar()

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label={openMobile ? 'Close mentor navigation' : 'Open mentor navigation'}
      aria-expanded={openMobile}
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-xl border transition active:scale-[0.96]',
        openMobile
          ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-[0_6px_18px_rgba(7,85,216,0.18)]'
          : 'border-slate-200 bg-white text-blue-700 shadow-sm hover:border-blue-300 hover:bg-blue-50'
      )}
    >
      <HamburgerIcon open={openMobile} />
    </button>
  )
}

function HamburgerIcon({ open }: { open: boolean }) {
  const interactiveBar =
    '[transform-box:fill-box] origin-center motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-reduce:transition-none'
  const middleBar =
    'origin-center motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out motion-reduce:transition-none'

  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="16"
        height="2.4"
        rx="1.2"
        className={cn(interactiveBar, open ? 'translate-y-[4.8px] rotate-45' : '')}
      />
      <rect
        x="3"
        y="9.8"
        width="16"
        height="2.4"
        rx="1.2"
        className={cn(
          middleBar,
          open ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
        )}
      />
      <rect
        x="3"
        y="14.6"
        width="16"
        height="2.4"
        rx="1.2"
        className={cn(
          interactiveBar,
          open ? '-translate-y-[4.8px] -rotate-45' : ''
        )}
      />
    </svg>
  )
}
