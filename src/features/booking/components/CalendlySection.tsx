'use client'

import { CalendarCheck, CalendarClock, CheckCircle, XCircle } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useCalendlyWidget } from '../hooks/useCalendlyWidget'

interface CalendlySectionProps {
  mentorId: string
  bookingId: string | null
  userName?: string
  userEmail?: string
  onScheduled?: () => void
}

export function CalendlySection({
  mentorId,
  bookingId,
  onScheduled,
}: CalendlySectionProps) {
  const { step, prefillData, error, openWidget, resetWidget } = useCalendlyWidget({
    mentorId,
    bookingId,
    onScheduled,
  })

  const widgetContainerRef = useRef<HTMLDivElement>(null)

  // Initialise the Calendly inline widget once prefill data is ready
  useEffect(() => {
    if (step !== 'OPEN' || !prefillData || !widgetContainerRef.current) return

    // Clear any previous widget content before re-initialising
    widgetContainerRef.current.innerHTML = ''

    // Wait for the Calendly script to be available
    const init = () => {
      if (typeof window.Calendly === 'undefined') {
        setTimeout(init, 200)
        return
      }
      window.Calendly.initInlineWidget({
        url: prefillData.calendly_url,
        parentElement: widgetContainerRef.current!,
        prefill: prefillData.prefill,
        utm: prefillData.utm,
      })
    }

    init()
  }, [step, prefillData])

  return (
    <div className="rounded-[24px] bg-white p-8 shadow-[0_8px_24px_rgba(18,28,42,0.06)]">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eff4ff]">
          <CalendarClock className="h-5 w-5 text-[#004ac6]" />
        </div>
        <div>
          <h3 className="font-[family-name:var(--font-headline)] text-xl font-bold text-[#121c2a]">
            Schedule Your Intro Call
          </h3>
          <p className="text-sm text-[#434655]">30-minute session · Free</p>
        </div>
      </div>

      {/* IDLE */}
      {step === 'IDLE' && (
        <div className="space-y-4">
          <p className="text-sm text-[#434655]">
            Book a free 30-minute intro call with your mentor to discuss your goals
            and make sure it&apos;s a great fit.
          </p>
          <button
            onClick={openWidget}
            disabled={!bookingId}
            className="flex w-full items-center justify-center gap-2 rounded-[24px] bg-gradient-to-br from-[#004ac6] to-[#2563eb] py-4 font-[family-name:var(--font-headline)] text-lg font-bold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CalendarCheck className="h-5 w-5" />
            {bookingId ? 'Schedule Now' : 'Complete booking first'}
          </button>
        </div>
      )}

      {/* OPEN — Calendly inline widget */}
      {step === 'OPEN' && (
        <div className="space-y-3">
          <p className="text-xs text-[#434655]">
            Select a time that works for you. Your details are pre-filled.
          </p>
          {/* The Calendly widget renders itself into this div */}
          <div
            ref={widgetContainerRef}
            className="w-full overflow-hidden rounded-xl border border-[#e8eaf0]"
            style={{ height: 450 }}
          />
          <button
            onClick={resetWidget}
            className="w-full rounded-lg border border-[#e0e0e0] py-2 text-sm text-[#434655] hover:bg-[#f8f9ff]"
          >
            Cancel
          </button>
        </div>
      )}

      {/* SCHEDULED */}
      {step === 'SCHEDULED' && (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e6f4ee]">
            <CheckCircle className="h-8 w-8 text-[#006c49]" />
          </div>
          <div>
            <p className="font-[family-name:var(--font-headline)] text-lg font-bold text-[#121c2a]">
              Call Scheduled!
            </p>
            <p className="mt-1 text-sm text-[#434655]">
              You&apos;ll receive a confirmation email with the meeting details.
            </p>
          </div>
        </div>
      )}

      {/* ERROR */}
      {step === 'ERROR' && (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fce8e8]">
            <XCircle className="h-8 w-8 text-[#ba1a1a]" />
          </div>
          <div>
            <p className="font-[family-name:var(--font-headline)] text-lg font-bold text-[#121c2a]">
              Something went wrong
            </p>
            <p className="mt-1 text-sm text-[#434655]">{error}</p>
          </div>
          <button
            onClick={resetWidget}
            className="rounded-[24px] bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-6 py-3 font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
