/**
 * Bulk welcome-card download. Fetches every mentor with a profile picture,
 * rasterizes one PNG per mentor via `buildWelcomeCard`, and bundles them
 * into a single ZIP the browser downloads at the end.
 *
 * Used by the admin mentors page so marketing can grab a fresh folder of
 * cards in one click instead of N. Each card is generated sequentially
 * (so the page stays responsive between builds) but the resulting ZIP is
 * a single download.
 */
import JSZip from 'jszip'

import { buildWelcomeCard, WelcomeCardMentor } from './buildWelcomeCard'

export interface BulkDownloadOptions {
  /**
   * Source roster — typically the result of `getAdminMentors` iterated
   * across pages, or any pre-filtered list of `WelcomeCardMentor`-shaped
   * records. Pass only mentors that have a profile picture.
   */
  mentors: WelcomeCardMentor[]
  /**
   * Called after each card finishes (success or failure). Use this to
   * drive a progress UI like "Building 5 of 23…".
   */
  onProgress?: (done: number, total: number) => void
  /** Override the default `welcome-cards.zip` archive filename. */
  zipFilename?: string
}

export interface BulkDownloadResult {
  attempted: number
  succeeded: number
  failed: number
}

export async function bulkDownloadWelcomeCards(
  options: BulkDownloadOptions
): Promise<BulkDownloadResult> {
  const { mentors, onProgress, zipFilename = 'welcome-cards.zip' } = options
  const total = mentors.length
  if (total === 0) {
    return { attempted: 0, succeeded: 0, failed: 0 }
  }

  const zip = new JSZip()
  let succeeded = 0
  let failed = 0

  // Track filenames we've used so two mentors with the same name don't
  // collide silently (second overwrites first inside the zip).
  const usedNames = new Set<string>()

  for (let i = 0; i < mentors.length; i += 1) {
    const mentor = mentors[i]
    if (!mentor) continue
    try {
      const { blob, filename } = await buildWelcomeCard(mentor)
      const uniqueName = dedupeFilename(filename, usedNames)
      usedNames.add(uniqueName)
      zip.file(uniqueName, blob)
      succeeded += 1
    } catch (err) {
      // Skip the failing card and continue with the rest. Surface the
      // failure as a count so the caller can warn the admin.
      console.error(`Welcome card failed for "${mentor.full_name}":`, err)
      failed += 1
    }
    onProgress?.(i + 1, total)
    // Yield to the browser between cards so the spinner / button stays
    // painted. `html-to-image` is CPU-bound and a long sync stretch
    // would freeze the page.
    await new Promise((r) => setTimeout(r, 0))
  }

  if (succeeded === 0) {
    return { attempted: total, succeeded: 0, failed }
  }

  const archive = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(archive)
  const a = document.createElement('a')
  a.href = url
  a.download = zipFilename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)

  return { attempted: total, succeeded, failed }
}

function dedupeFilename(filename: string, used: Set<string>): string {
  if (!used.has(filename)) return filename
  const dot = filename.lastIndexOf('.')
  const base = dot === -1 ? filename : filename.slice(0, dot)
  const ext = dot === -1 ? '' : filename.slice(dot)
  let n = 2
  while (used.has(`${base}-${n}${ext}`)) n += 1
  return `${base}-${n}${ext}`
}
