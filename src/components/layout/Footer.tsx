'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Globe, MessageCircle, Mail, ArrowUpRight } from 'lucide-react'

const PLATFORM_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/mentor', label: 'Mentor Sign In' },
]

const SUPPORT_LINKS = [
  { href: '/#about', label: 'About us' },
  { href: '/#faq', label: 'Mentorship FAQ' },
]

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-[#c3c6d7]/20 bg-white/28 font-[family-name:var(--font-body)] text-sm text-[var(--color-on-surface-variant)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-10 sm:px-8 lg:px-4 lg:pt-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label="Book Your Counselling home" className="inline-flex">
              <Image
                src="/home/byc-logo.svg"
                alt="Book Your Counselling"
                width={190}
                height={88}
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--color-on-surface-variant)]">
              Connect with mentors who can guide your academic choices, study path, and next steps —
              one conversation at a time.
            </p>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-headline)] text-[11px] font-extrabold tracking-[0.18em] text-[var(--color-outline)] uppercase">
              Platform
            </h4>
            <ul className="mt-5 space-y-3">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--foreground)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-headline)] text-[11px] font-extrabold tracking-[0.18em] text-[var(--color-outline)] uppercase">
              Support
            </h4>
            <ul className="mt-5 space-y-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--foreground)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-headline)] text-[11px] font-extrabold tracking-[0.18em] text-[var(--color-outline)] uppercase">
              Connect
            </h4>
            <p className="mt-5 text-sm text-[var(--color-on-surface-variant)]">
              Reach us, anytime.
            </p>
            <div className="mt-4 flex items-center gap-2.5">
              <Link
                href="#"
                aria-label="Website"
                className="flex size-9 items-center justify-center rounded-full bg-[var(--brand-blue-surface)] text-[var(--brand-blue)] transition hover:bg-[var(--brand-blue-soft)] hover:text-[var(--brand-blue-hover)]"
              >
                <Globe className="size-4" />
              </Link>
              <Link
                href="#"
                aria-label="Chat"
                className="flex size-9 items-center justify-center rounded-full bg-[var(--brand-blue-surface)] text-[var(--brand-blue)] transition hover:bg-[var(--brand-blue-soft)] hover:text-[var(--brand-blue-hover)]"
              >
                <MessageCircle className="size-4" />
              </Link>
              <Link
                href="mailto:hello@bookyourcounselling.com"
                aria-label="Email"
                className="flex size-9 items-center justify-center rounded-full bg-[var(--brand-blue-surface)] text-[var(--brand-blue)] transition hover:bg-[var(--brand-blue-soft)] hover:text-[var(--brand-blue-hover)]"
              >
                <Mail className="size-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 h-px w-full bg-[var(--color-surface-container-high)]" />

        <div className="mt-6 flex flex-col items-start justify-between gap-4 text-xs text-[var(--color-outline)] md:flex-row md:items-center">
          <p>© 2026 Book Your Counselling. Guided fluidity in career growth.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-[var(--foreground)]">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-[var(--foreground)]">
              Terms
            </Link>
            <Link href="#" className="transition-colors hover:text-[var(--foreground)]">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
