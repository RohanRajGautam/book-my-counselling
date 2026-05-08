'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white/80 py-4 shadow-[0_8px_24px_rgba(18,28,42,0.06)] backdrop-blur-md dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          {/* Logo */}
          <Link
            href="/"
            className="font-[family-name:var(--font-headline)] text-2xl font-bold tracking-tight text-blue-700 dark:text-blue-300"
          >
            Book Your Counselling
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            <Link
              href="/explore-mentors"
              className={`font-[family-name:var(--font-headline)] font-semibold tracking-tight transition-colors hover:text-blue-500 ${
                isActive('/explore-mentors')
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400'
              } `}
            >
              Explore Mentors
            </Link>

            <Link
              href="/about"
              className={`font-[family-name:var(--font-headline)] font-medium tracking-tight transition-colors hover:text-blue-500 ${
                isActive('/about')
                  ? 'border-b-2 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400'
              } `}
            >
              About Us
            </Link>

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

          {/* Actions */}
          {/* <div className="flex items-center space-x-4">
            <button className="px-4 py-2 font-medium text-slate-600 transition-all duration-150 hover:text-blue-500 active:scale-95">
              Login
            </button>

            <button className="rounded-lg bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-6 py-2.5 font-semibold text-white shadow-lg transition-all duration-150 hover:shadow-[#004ac6]/20 active:scale-95">
              Sign Up
            </button>

         
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-slate-600" />
              ) : (
                <Menu className="h-6 w-6 text-slate-600" />
              )}
            </button>
          </div> */}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-40 bg-white md:hidden dark:bg-slate-900">
          <div className="flex flex-col space-y-4 p-8">
            <Link
              href="/#search"
              className={`font-[family-name:var(--font-headline)] text-lg font-semibold ${
                isActive('/') ? 'text-blue-600' : 'text-slate-600'
              } `}
              onClick={() => setMobileMenuOpen(false)}
            >
              Search Mentors
            </Link>

            <Link
              href="/how-it-works"
              className={`font-[family-name:var(--font-headline)] text-lg font-medium ${
                isActive('/how-it-works') ? 'text-blue-600' : 'text-slate-600'
              } `}
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </Link>

            <Link
              href="/#about"
              className={`font-[family-name:var(--font-headline)] text-lg font-medium ${
                isActive('/') ? 'text-blue-600' : 'text-slate-600'
              } `}
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
