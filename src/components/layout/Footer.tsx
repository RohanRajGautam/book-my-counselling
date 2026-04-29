import Link from 'next/link'
import { Mail, Phone } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16 lg:px-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-primary">{SITE_CONFIG.name}</h3>
            <p className="text-sm text-muted-foreground">{SITE_CONFIG.description}</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#services"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="#counsellors"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Our Counsellors
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#testimonials"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:hello@bookmycounselling.com"
                  className="transition-colors hover:text-foreground"
                >
                  hello@bookmycounselling.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href="tel:+1234567890" className="transition-colors hover:text-foreground">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>© {currentYear} {SITE_CONFIG.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
