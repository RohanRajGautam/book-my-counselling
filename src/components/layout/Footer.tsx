'use client'

import Link from 'next/link'
import { Globe, MessageCircle, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-20 w-full bg-slate-100 font-[family-name:var(--font-body)] text-sm dark:bg-slate-900">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-8 py-16 md:grid-cols-4">
        {/* Brand */}
        <div className="space-y-4">
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Book Your Counselling
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            © 2026 Book Your Counselling. Guided Fluidity in Career Growth.
          </p>
        </div>

        {/* Platform */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-bold text-slate-900 dark:text-slate-100">Platform</h4>
          <Link
            href="/privacy"
            className="text-slate-500 underline-offset-4 transition-all hover:underline hover:decoration-emerald-500 dark:text-slate-400"
          >
            Privacy Policy
          </Link>
          <Link
            href="/how-it-works"
            className="text-slate-500 underline-offset-4 transition-all hover:underline hover:decoration-emerald-500 dark:text-slate-400"
          >
            How It Works
          </Link>
        </div>

        {/* Support */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-bold text-slate-900 dark:text-slate-100">Support</h4>
          <Link
            href="/support"
            className="text-slate-500 underline-offset-4 transition-all hover:underline hover:decoration-emerald-500 dark:text-slate-400"
          >
            Contact Support
          </Link>
          <Link
            href="/faq"
            className="text-slate-500 underline-offset-4 transition-all hover:underline hover:decoration-emerald-500 dark:text-slate-400"
          >
            Mentorship FAQ
          </Link>
        </div>

        {/* Connect */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-bold text-slate-900 dark:text-slate-100">Connect</h4>
          <div className="flex gap-4">
            <Globe className="h-6 w-6 cursor-pointer text-slate-500 transition-colors hover:text-[#004ac6]" />
            <MessageCircle className="h-6 w-6 cursor-pointer text-slate-500 transition-colors hover:text-[#004ac6]" />
            <Mail className="h-6 w-6 cursor-pointer text-slate-500 transition-colors hover:text-[#004ac6]" />
          </div>
        </div>
      </div>
    </footer>
  )
}
