'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowRight, Menu, X } from 'lucide-react'

const navItems = [
  { href: '/explore-mentors', label: 'Explore Mentors' },
  { href: '/how-it-works', label: 'How it Works' },
  { href: '/about', label: 'About Us' },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-[#c3c6d7]/20 bg-white/88 shadow-[0_8px_24px_rgba(18,28,42,0.06)] backdrop-blur-md dark:bg-slate-900/88">
        <div className="max-w-8xl mx-auto flex items-center justify-between px-4 py-4 sm:px-8">
          <Link
            href="/"
            className="font-[family-name:var(--font-headline)] text-xl font-bold tracking-tight text-blue-700 sm:text-2xl dark:text-blue-300"
          >
            Book Your Counselling
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
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

            <Link
              href="/school-to-startup"
              className="relative inline-flex items-center justify-center overflow-hidden rounded-full p-[1.5px] transition-all focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none"
            >
              {/* The Moving Stroke Layer */}
              <span className="animate-spin-slow absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#3B82F6_50%,#E2E8F0_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#1E293B_0%,#3B82F6_50%,#1E293B_100%)]" />

              {/* The Content Layer */}
              <span
                className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-bold backdrop-blur-3xl transition-colors dark:bg-slate-950 ${
                  isActive('/school-to-startup')
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 hover:text-blue-500 dark:text-slate-400'
                } `}
              >
                School to Startup
              </span>
            </Link>
          </div>

          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-lg border border-[#c3c6d7]/40 bg-white text-[#121c2a] shadow-[0_8px_20px_rgba(18,28,42,0.08)] transition hover:bg-[#eff4ff] md:hidden"
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[77px] z-40 border-b border-[#c3c6d7]/20 bg-white/96 px-4 pb-5 shadow-[0_18px_42px_rgba(18,28,42,0.14)] backdrop-blur-md md:hidden dark:bg-slate-900/96">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 pt-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between rounded-lg px-4 py-4 font-[family-name:var(--font-headline)] text-base font-bold transition ${
                  isActive(item.href)
                    ? 'bg-[#eff4ff] text-[#004ac6]'
                    : 'text-[#121c2a] hover:bg-[#f8f9ff]'
                } `}
              >
                {item.label}
                <ArrowRight className="size-4" />
              </Link>
            ))}

            <Link
              href="/school-to-startup"
              onClick={() => setMobileMenuOpen(false)}
              className={`mt-2 flex items-center justify-between rounded-lg bg-[#004ac6] px-4 py-4 font-[family-name:var(--font-headline)] text-base font-bold text-white shadow-[0_12px_28px_rgba(0,74,198,0.22)] transition hover:bg-[#003fa8] ${
                isActive('/school-to-startup') ? 'ring-3 ring-[#6cf8bb]/60' : ''
              } `}
            >
              School to Startup
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
