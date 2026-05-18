'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowRight, BookOpen, Compass, Menu, Rocket, X } from 'lucide-react'
import Image from 'next/image'

const navItems = [
  { href: '/explore-mentors', label: 'Explore Mentors', icon: Compass },
  { href: '/how-it-works', label: 'How it Works', icon: Compass },
  // { href: '/events', label: '"३० मा ३०"', icon: BookOpen },
  // { href: '/about', label: 'About Us' },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path
  const showAnnouncement = pathname === '/' || pathname === '/school-to-startup'

  // Auto-close mobile menu when the route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    if (!mobileMenuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileMenuOpen])

  // Close on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileMenuOpen])

  return (
    <>
      {showAnnouncement && (
        <Link
          href="/explore-mentors"
          className="fixed inset-x-0 top-0 z-50 flex min-h-10 items-center justify-center gap-2 bg-[#004ac6] px-4 py-2 text-center text-xs font-extrabold text-white shadow-[0_8px_22px_rgba(0,74,198,0.18)] sm:text-sm"
        >
          <span>Completed SEE or +2 and confused about career?</span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            Find Mentor <ArrowRight className="size-4" />
          </span>
        </Link>
      )}

      <nav
        className={`fixed z-50 w-full border-b border-[#c3c6d7]/20 bg-white/88 shadow-[0_8px_24px_rgba(18,28,42,0.06)] backdrop-blur-md dark:bg-slate-900/88 ${
          showAnnouncement ? 'top-10' : 'top-0'
        }`}
      >
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-4 py-4 sm:px-8">
          <div>
            <Link
              href="/"
              className="flex items-center font-[family-name:var(--font-headline)] text-xl font-bold tracking-tight text-blue-700 sm:text-2xl dark:text-blue-300"
            >
              {/* <Image
              src={'/home/byc-logo.svg'}
              alt="Book Your Counselling Logo"
              width={32}
              height={32}
            /> */}
              Book Your Counselling
            </Link>
          </div>

          <div className="hidden gap-8 sm:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-[family-name:var(--font-headline)] font-semibold tracking-tight transition-colors hover:text-blue-500 ${
                  isActive(item.href)
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400'
                } `}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden gap-4 sm:flex">
            {/* <Link
              href="/events"
              className="relative inline-flex items-center justify-center overflow-hidden rounded-full p-[1.5px] transition-all focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none"
            >
              <span className="animate-spin-slow absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#3B82F6_50%,#E2E8F0_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#1E293B_0%,#3B82F6_50%,#1E293B_100%)]" />

              <span
                className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white px-4 py-1 text-lg font-semibold backdrop-blur-3xl transition-colors dark:bg-slate-950 ${
                  isActive('/events')
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 hover:text-blue-500 dark:text-slate-400'
                } `}
              >
                "३० मा ३०"
              </span>
            </Link> */}

            <Link
              href="/school-to-startup"
              className="relative inline-flex items-center justify-center overflow-hidden rounded-full p-[1.5px] transition-all focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none"
            >
              <span className="animate-spin-slow absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#3B82F6_50%,#E2E8F0_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#1E293B_0%,#3B82F6_50%,#1E293B_100%)]" />

              <span
                className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white px-4 py-1 py-2 text-lg text-sm font-semibold backdrop-blur-3xl transition-colors dark:bg-slate-950 ${
                  isActive('/school-to-startup')
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 hover:text-blue-500 dark:text-slate-400'
                } `}
              >
                School to Startup
              </span>
            </Link>
            {/* <Link
              href={'/school-to-startup'}
              className={`flex items-center rounded-full font-[family-name:var(--font-headline)] text-sm font-bold tracking-tight transition-colors ${
                isActive('/school-to-startup') ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
              }`}
            >
              <div className="px-4"> School to Startup</div>
            </Link> */}
            {/* <Link
              href="/school-to-startup"
              className="relative inline-flex items-center justify-center overflow-hidden rounded-full p-[1.5px] transition-all focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none"
            >
            
              <span className="animate-spin-slow absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#3B82F6_50%,#E2E8F0_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#1E293B_0%,#3B82F6_50%,#1E293B_100%)]" />

            
              <span
                className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-bold backdrop-blur-3xl transition-colors dark:bg-slate-950 ${
                  isActive('/school-to-startup')
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 hover:text-blue-500 dark:text-slate-400'
                } `}
              >
                School to Startup
              </span>
            </Link> */}
          </div>

          <button
            type="button"
            className="relative grid size-11 place-items-center rounded-xl text-[#121c2a] transition-colors hover:bg-[#eff4ff] active:bg-[#dbe6ff] md:hidden dark:text-slate-100 dark:hover:bg-slate-800"
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <Menu
              className={`absolute size-5 transition-all duration-200 ${
                mobileMenuOpen ? 'scale-75 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
              }`}
              aria-hidden="true"
            />
            <X
              className={`absolute size-5 transition-all duration-200 ${
                mobileMenuOpen ? 'scale-100 rotate-0 opacity-100' : 'scale-75 -rotate-90 opacity-0'
              }`}
              aria-hidden="true"
            />
          </button>
        </div>
      </nav>

      {/* Backdrop — click to close */}
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-200 md:hidden ${
          mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        className={`fixed inset-x-3 z-40 origin-top overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] transition-all duration-200 ease-out md:hidden dark:border-slate-800 dark:bg-slate-900 ${
          mobileMenuOpen
            ? 'translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-2 scale-[0.98] opacity-0'
        } ${showAnnouncement ? 'top-[128px]' : 'top-[68px]'}`}
      >
        <div className="flex flex-col gap-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3.5 font-[family-name:var(--font-headline)] text-base font-bold transition ${
                  active
                    ? 'bg-[#eff4ff] text-[#004ac6] dark:bg-[#004ac6]/15 dark:text-blue-300'
                    : 'text-[#27313f] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60'
                }`}
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-lg transition ${
                    active
                      ? 'bg-[#004ac6] text-white shadow-[0_6px_14px_rgba(0,74,198,0.25)]'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-[#004ac6] dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="flex-1">{item.label}</span>
                <ArrowRight
                  className={`size-4 transition ${
                    active
                      ? 'text-[#004ac6]'
                      : 'text-slate-300 group-hover:translate-x-0.5 group-hover:text-slate-500'
                  }`}
                  aria-hidden="true"
                />
              </Link>
            )
          })}

          {/* Divider */}
          <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" aria-hidden="true" />
          {/* <Link
            href="/events"
            onClick={() => setMobileMenuOpen(false)}
            className={`relative flex items-center gap-3 overflow-hidden rounded-xl bg-[#004ac6] px-3 py-3.5 font-[family-name:var(--font-headline)] text-base font-extrabold text-white shadow-[0_12px_28px_rgba(0,74,198,0.22)] transition hover:bg-[#003fa8] active:translate-y-px ${
              isActive('/events')
                ? 'ring-2 ring-[#6cf8bb]/70 ring-offset-2 ring-offset-white dark:ring-offset-slate-900'
                : ''
            }`}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/15">
              <Rocket className="size-4" aria-hidden="true" />
            </span>
            <span className="flex-1"> "३० मा ३०"</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link> */}

          {/* Primary CTA */}
          <Link
            href="/school-to-startup"
            onClick={() => setMobileMenuOpen(false)}
            className={`relative flex items-center gap-3 overflow-hidden rounded-xl bg-[#004ac6] px-3 py-3.5 font-[family-name:var(--font-headline)] text-base font-extrabold text-white shadow-[0_12px_28px_rgba(0,74,198,0.22)] transition hover:bg-[#003fa8] active:translate-y-px ${
              isActive('/school-to-startup')
                ? 'ring-2 ring-[#6cf8bb]/70 ring-offset-2 ring-offset-white dark:ring-offset-slate-900'
                : ''
            }`}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/15">
              <Rocket className="size-4" aria-hidden="true" />
            </span>
            <span className="flex-1">School to Startup</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  )
}
