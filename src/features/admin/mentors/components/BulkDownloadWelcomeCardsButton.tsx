'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { bulkDownloadWelcomeCards } from '@/features/welcome-card/lib/bulkDownloadWelcomeCards'

interface BulkDownloadWelcomeCardsButtonProps {
  /**
   * Optional rough hint from the current page (mentors with `avatar_url`
   * on screen right now). Shown as `(N)` in the label when > 0 so the
   * admin has a sense of scale before clicking. Never used to disable —
   * the bulk fetch walks every page server-side, so a "0 on this page"
   * doesn't mean a "0 overall" zip.
   */
  availableCount?: number
}

/**
 * Admin-only: downloads one PNG welcome card per mentor that has a profile
 * picture, bundled into a single `welcome-cards.zip`. Generates cards
 * sequentially in the browser (slow but simple) and reports progress via
 * a single toast that updates in place.
 */
export function BulkDownloadWelcomeCardsButton({
  availableCount,
}: BulkDownloadWelcomeCardsButtonProps) {
  const [running, setRunning] = useState(false)

  const handleClick = async () => {
    setRunning(true)
    let progressToastId: string | number | undefined
    try {
      // Lazy-import so jszip + the welcome-card module don't enter the
      // server bundle. Admin button is client-only, but the dashboard's
      // server pre-render shouldn't drag the rasterizer along.
      const { getAllMentorsWithAvatars } = await import('../api/mentors.api')

      progressToastId = toast.loading('Fetching mentors with profile pictures…')
      const mentors = await getAllMentorsWithAvatars({})

      if (mentors.length === 0) {
        toast.error('No mentors have a profile picture yet.', { id: progressToastId })
        return
      }

      toast.loading(`Building 0 of ${mentors.length} cards…`, { id: progressToastId })

      const result = await bulkDownloadWelcomeCards({
        mentors: mentors.map((m) => ({
          full_name: m.user.full_name,
          title: m.title,
          company: m.company,
          avatar_url: m.user.avatar_url,
        })),
        onProgress: (done, total) => {
          toast.loading(`Building ${done} of ${total} cards…`, { id: progressToastId })
        },
      })

      if (result.failed > 0) {
        toast.warning(
          `Downloaded ${result.succeeded} card${result.succeeded === 1 ? '' : 's'} · ${result.failed} failed (check console).`,
          { id: progressToastId }
        )
      } else {
        toast.success(
          `Downloaded ${result.succeeded} card${result.succeeded === 1 ? '' : 's'} as welcome-cards.zip.`,
          { id: progressToastId }
        )
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not build the cards.'
      toast.error(message, { id: progressToastId })
    } finally {
      setRunning(false)
    }
  }

  const showCount = typeof availableCount === 'number' && availableCount > 0
  const label = showCount ? `Welcome cards (${availableCount})` : 'Welcome cards'
  const ariaLabel = showCount
    ? `Download welcome cards for ${availableCount} mentor${availableCount === 1 ? '' : 's'}`
    : 'Download welcome cards for all mentors with profile pictures'

  return (
    <Button
      size="sm"
      variant="outline"
      className="gap-1.5 rounded-lg border-slate-300 bg-white px-4 py-6 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      onClick={handleClick}
      disabled={running}
      aria-label={ariaLabel}
    >
      {running ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Download className="size-3.5" strokeWidth={2.4} />
      )}
      {label}
    </Button>
  )
}
