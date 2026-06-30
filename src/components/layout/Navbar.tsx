'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowRight, BookText, ChevronDown, GraduationCap, Menu, X } from 'lucide-react'

import { COACH_FOR_FRESHERS_VARIETIES } from '@/features/coach-for-freshers/types/coach-for-freshers.types'
// import { ArrowRight, BookOpen, Compass, Globe2, Menu, Rocket, X } from 'lucide-react'

const navItems = [
  {
    href: '/academic-counsellor',
    label: 'Academic Counsellor',
    icon: GraduationCap,
  },
  // {
  //   href: '/blog',
  //   label: 'Blog',
  //   icon: BookText,
  // },
  // {
  //   href: '/professional-counsellor',
  //   label: 'Professional Coach',
  //   icon: BriefcaseBusiness,
  // },
  // { href: '/study-abroad', label: 'Study Abroad', icon: Globe2 },
  // { href: '/how-it-works', label: 'How it Works', icon: Compass },
  // { href: '/events', label: '"३० मा ३०"', icon: BookOpen },
  // { href: '/about', label: 'About Us' },
]

const coachNavItems = [
  {
    href: '/coach-for-freshers',
    navLabel: 'Coach for Freshers',
    services: Object.values(COACH_FOR_FRESHERS_VARIETIES).map((variety) => ({
      label: variety.navLabel,
      href: `/coach-for-freshers/${variety.slug}`,
    })),
    icon: GraduationCap,
  },
]

function getCoachServiceHref(service: { label: string; href: string }) {
  return service.href
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (item: (typeof navItems)[number] | string) => {
    if (typeof item === 'string') return pathname === item

    if (pathname === item.href) return true

    return pathname.startsWith(`${item.href}/`)
  }
  const isCoachActive = (item: (typeof coachNavItems)[number]) => {
    if (pathname === item.href) return true
    if (pathname.startsWith('/coach-for-freshers/')) {
      return item.services.some((service) => service.href === pathname)
    }

    return false
  }
  const showAnnouncement = pathname === '/'

  // Auto-close mobile menu when the route changes
  useEffect(() => {
    const id = window.setTimeout(() => setMobileMenuOpen(false), 0)
    return () => window.clearTimeout(id)
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
          href="/academic-counsellor"
          className="fixed inset-x-0 top-0 z-50 flex min-h-10 items-center justify-center gap-2 bg-[#004ac6] px-4 py-2 text-center text-xs font-extrabold text-white shadow-[0_8px_22px_rgba(0,74,198,0.18)] sm:text-sm"
        >
          <span>Completed +2 and confused about career?</span>
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
                  isActive(item)
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400'
                } `}
              >
                {item.label}
              </Link>
            ))}

            {coachNavItems.map((item) => {
              const active = isCoachActive(item)
              return (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 font-[family-name:var(--font-headline)] font-semibold tracking-tight transition-colors hover:text-blue-500 ${
                      active
                        ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                        : 'text-slate-600 dark:text-slate-400'
                    } `}
                  >
                    {item.navLabel}
                    <ChevronDown className="size-4 transition-transform group-hover:rotate-180" />
                  </Link>

                  <div className="pointer-events-none absolute top-full right-0 z-50 w-64 pt-3 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
                    <div className="space-y-1 overflow-hidden rounded-xl border border-slate-100/80 bg-white p-2 ring-1 ring-[#004ac6]/5 dark:border-slate-800 dark:bg-slate-900 dark:ring-white/5">
                      {item.services.map((service) => (
                        <Link
                          key={service.href}
                          href={getCoachServiceHref(service)}
                          className="group/item relative flex items-center gap-3 overflow-hidden rounded-md bg-[#004ac6]/[0.04] px-3 py-2.5 text-sm font-extrabold tracking-tight text-[#1e3a8a] transition-all hover:bg-[#004ac6]/10 hover:text-[#004ac6] hover:shadow-[inset_2px_0_0_0_#004ac6] dark:bg-[#3b82f6]/[0.06] dark:text-blue-200/90 dark:hover:bg-[#3b82f6]/15 dark:hover:text-blue-300 dark:hover:shadow-[inset_2px_0_0_0_#3b82f6]"
                        >
                          <span className="flex-1">{service.label}</span>
                          <ArrowRight className="size-3.5 -translate-x-1 text-[#004ac6] opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100 dark:text-blue-300" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
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
        } ${showAnnouncement ? 'top-[128px]' : 'top-[84px]'}`}
      >
        <div className="flex flex-col gap-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  setMobileMenuOpen(false)
                }}
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

          {coachNavItems.map((item) => {
            const Icon = item.icon
            const active = isCoachActive(item)

            return (
              <div
                key={item.href}
                className="rounded-xl border border-slate-100 dark:border-slate-800"
              >
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3.5 font-[family-name:var(--font-headline)] text-base font-bold transition ${
                    active
                      ? 'bg-[#eff4ff] text-[#004ac6] dark:bg-[#004ac6]/15 dark:text-blue-300'
                      : 'text-[#000000] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60'
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
                  <span className="flex-1">{item.navLabel}</span>
                  <ArrowRight
                    className={`size-4 transition ${
                      active
                        ? 'text-[#004ac6]'
                        : 'text-slate-300 group-hover:translate-x-0.5 group-hover:text-slate-500'
                    }`}
                    aria-hidden="true"
                  />
                </Link>

                <div className="px-3 pb-3">
                  {item.services.map((service) => (
                    <Link
                      key={service.href}
                      href={getCoachServiceHref(service)}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-lg px-12 py-2 text-sm font-bold text-slate-500 transition hover:bg-[#eff4ff] hover:text-[#004ac6] dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                      {service.label}
                    </Link>
                  ))}
                </div>
              </div>
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
              <CalendarDays className="size-4" aria-hidden="true" />
            </span>
            <span className="flex-1">&quot;३० मा ३०&quot;</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link> */}

          {/* Primary CTA */}
          {/* <Link
            href="/webinars"
            onClick={() => setMobileMenuOpen(false)}
            className={`relative flex items-center gap-3 overflow-hidden rounded-xl bg-[#004ac6] px-3 py-3.5 font-[family-name:var(--font-headline)] text-base font-extrabold text-white shadow-[0_12px_28px_rgba(0,74,198,0.22)] transition hover:bg-[#003fa8] active:translate-y-px ${
              isActive('/webinars')
                ? 'ring-2 ring-[#6cf8bb]/70 ring-offset-2 ring-offset-white dark:ring-offset-slate-900'
                : ''
            }`}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/15">
              <Video className="size-4" aria-hidden="true" />
            </span>
            <span className="flex-1 font-extrabold">Free Trainings</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link> */}
        </div>
      </div>
    </>
  )
}
