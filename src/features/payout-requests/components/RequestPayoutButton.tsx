'use client'

import { useState } from 'react'
import { Send, WalletCards } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { RequestPayoutDialog } from './RequestPayoutDialog'

interface RequestPayoutButtonProps {
  /**
   * When true (a previous request is still `open`), the button is
   * disabled and we explain why. Per the project's UX rule on hard
   * blocks: when the recommended path is unambiguous, disable the
   * conflicting action instead of pairing a nudge with an enabled
   * override. 409 from the backend is mirrored here client-side so the
   * mentor never gets to click and bounce.
   */
  blockedByOpenRequest: boolean
  className?: string
}

/**
 * CTA for filing a new payout request. The mentor sees this on the
 * payout-requests page header. The button is disabled while a previous
 * request is still `open` (admin hasn't acked yet) — re-clicking would
 * only get a 409, and the spec says to surface that as a friendly
 * message rather than let them fire a doomed request.
 */
export function RequestPayoutButton({ blockedByOpenRequest, className }: RequestPayoutButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        disabled={blockedByOpenRequest}
        aria-label="Request payout"
        title={blockedByOpenRequest ? 'You already have a pending request' : 'Request payout'}
        className={cn(
          'h-11 gap-2 rounded-xl bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-5 font-extrabold text-white shadow-[0_8px_18px_rgba(0,83,219,0.22)] hover:from-[#003fa8] hover:to-[#1d4ed8] disabled:cursor-not-allowed disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-500 disabled:shadow-none',
          className
        )}
      >
        {blockedByOpenRequest ? (
          <WalletCards className="size-4" strokeWidth={2.4} />
        ) : (
          <Send className="size-4" strokeWidth={2.4} />
        )}
        Request payout
      </Button>

      {open ? <RequestPayoutDialog onClose={() => setOpen(false)} /> : null}
    </>
  )
}
