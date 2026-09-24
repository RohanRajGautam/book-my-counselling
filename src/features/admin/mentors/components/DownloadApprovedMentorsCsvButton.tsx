'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { downloadApprovedMentorsCsv } from '../api/mentors.api'

/**
 * Admin-only: downloads every approved mentor on the platform as a single
 * `approved_mentors_<UTC-date>.csv` file. The backend streams the CSV with
 * `Content-Disposition: attachment`; we read the suggested filename from
 * the response header so the browser saves it with the right name.
 *
 * The button stays enabled even when no mentors are currently in view — the
 * export is server-side and walks the full table, so "0 on this page" is
 * not a meaningful gate.
 */
export function DownloadApprovedMentorsCsvButton() {
  const [running, setRunning] = useState(false)

  const handleClick = async () => {
    setRunning(true)
    let progressToastId: string | number | undefined
    try {
      progressToastId = toast.loading('Preparing mentor export…')
      const { blob, filename } = await downloadApprovedMentorsCsv()

      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = filename
      anchor.rel = 'noopener'
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)

      toast.success(`Downloaded ${filename}.`, { id: progressToastId })
    } catch (err) {
      // `responseType: 'blob'` leaves the error body as a Blob; try to read
      // it as text so the admin sees the backend's own message rather than
      // a generic "Network Error".
      let message = 'Could not download the mentor CSV.'
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { status?: number; data?: unknown } }).response
        if (response?.status === 401 || response?.status === 403) {
          message = 'Your admin session has expired. Please sign in again.'
        } else if (response?.data instanceof Blob) {
          try {
            const text = await response.data.text()
            const parsed = JSON.parse(text)
            if (parsed?.detail) message = String(parsed.detail)
          } catch {
            // Fall back to the generic message — body wasn't JSON.
          }
        }
      }
      toast.error(message, { id: progressToastId })
    } finally {
      setRunning(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="gap-1.5 rounded-lg border-slate-300 bg-white px-4 py-6 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      onClick={handleClick}
      disabled={running}
      aria-label="Download all approved mentors as a CSV file"
    >
      {running ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Download className="size-3.5" strokeWidth={2.4} />
      )}
      Approved mentors (CSV)
    </Button>
  )
}
