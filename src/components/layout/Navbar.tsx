'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white/80 shadow-[0_8px_24px_rgba(18,28,42,0.06)] backdrop-blur-md dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          {/* Logo */}
          <Link href="/" className="font-[family-name:var(--font-headline)] text-2xl font-bold tracking-tight text-blue-700 dark:text-blue-300">
            Book My Counselling
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            <Link
              href="#search"
              className="border-b-2 border-blue-600 font-[family-name:var(--font-headline)] font-semibold tracking-tight text-blue-600 transition-colors hover:text-blue-500 dark:border-blue-400 dark:text-blue-400"
            >
              Search Mentors
            </Link>
            <Link
              href="#how-it-works"
              className="font-[family-name:var(--font-headline)] font-medium tracking-tight text-slate-600 transition-colors hover:text-blue-500 dark:text-slate-400"
            >
              How it Works
            </Link>
            <Link
              href="#about"
              className="font-[family-name:var(--font-headline)] font-medium tracking-tight text-slate-600 transition-colors hover:text-blue-500 dark:text-slate-400"
            >
              About Us
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 font-medium text-slate-600 transition-all duration-150 hover:text-blue-500 active:scale-95">
              Login
            </button>
            <button className="rounded-lg bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-6 py-2.5 font-semibold text-white shadow-lg transition-all duration-150 hover:shadow-[#004ac6]/20 active:scale-95">
              Sign Up
            </button>

            {/* Mobile Menu Button */}
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
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-40 bg-white dark:bg-slate-900 md:hidden">
          <div className="flex flex-col space-y-4 p-8">
            <Link
              href="#search"
              className="font-[family-name:var(--font-headline)] text-lg font-semibold text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Search Mentors
            </Link>
            <Link
              href="#how-it-works"
              className="font-[family-name:var(--font-headline)] text-lg font-medium text-slate-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link
              href="#about"
              className="font-[family-name:var(--font-headline)] text-lg font-medium text-slate-600"
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
