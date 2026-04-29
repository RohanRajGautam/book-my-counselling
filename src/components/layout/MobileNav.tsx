'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants'

interface MobileNavProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="font-display text-left text-xl font-bold text-primary">
            {SITE_CONFIG.name}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => onOpenChange(false)}
              className="text-base font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.title}
            </Link>
          ))}
          <Link href="#book" onClick={() => onOpenChange(false)} className="mt-4">
            <Button className="w-full">Book Now</Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
