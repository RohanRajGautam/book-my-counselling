'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants'
import { MobileNav } from './MobileNav'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8 lg:px-16">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-display text-xl font-bold text-primary md:text-2xl">
            {SITE_CONFIG.name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.title}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="#book" className="hidden md:inline-flex">
            <Button>Book Now</Button>
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNav open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
    </header>
  )
}
