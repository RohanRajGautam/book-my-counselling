'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getCalendlyPrefill } from '../api/calendlyApi'
import type {
  CalendlyEventScheduled,
  CalendlyPrefillResponse,
  CalendlyWidgetStep,
} from '../types/calendly'

interface UseCalendlyWidgetOptions {
  mentorId: string
  bookingId: string | null
  onScheduled?: () => void
}

interface UseCalendlyWidgetReturn {
  step: CalendlyWidgetStep
  prefillData: CalendlyPrefillResponse | null
  error: string | null
  openWidget: () => Promise<void>
  resetWidget: () => void
}

/**
 * Manages the Calendly inline embed widget lifecycle.
 *
 * Flow:
 *   IDLE → LOADING (fetching prefill) → OPEN (widget visible) → SCHEDULED (success)
 *                                                              ↘ ERROR (fetch failed)
 *
 * The Calendly widget is loaded via the official embed script
 * (https://assets.calendly.com/assets/external/widget.js).
 * We listen for the `calendly.event_scheduled` window message to detect
 * when the user completes booking.
 */
export function useCalendlyWidget({
  mentorId,
  bookingId,
  onScheduled,
}: UseCalendlyWidgetOptions): UseCalendlyWidgetReturn {
  const [step, setStep] = useState<CalendlyWidgetStep>('IDLE')
  const [prefillData, setPrefillData] = useState<CalendlyPrefillResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Track whether the Calendly script has been injected
  const scriptInjectedRef = useRef(false)

  // Inject the Calendly embed script once
  const ensureScript = useCallback(() => {
    if (scriptInjectedRef.current) return
    if (document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) {
      scriptInjectedRef.current = true
      return
    }
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.head.appendChild(script)
    scriptInjectedRef.current = true
  }, [])

  // Listen for the Calendly scheduled event
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin === 'https://calendly.com' &&
        event.data?.event === 'calendly.event_scheduled'
      ) {
        const data = event.data as CalendlyEventScheduled
        // Log for debugging; the webhook will handle the actual DB sync
        console.info('[Calendly] Event scheduled:', data.payload?.event?.uri)
        setStep('SCHEDULED')
        onScheduled?.()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onScheduled])

  const openWidget = useCallback(async () => {
    if (!bookingId) {
      setError('Booking must be created before scheduling a call')
      setStep('ERROR')
      return
    }

    setStep('LOADING')
    setError(null)

    try {
      const data = await getCalendlyPrefill(mentorId, bookingId)
      setPrefillData(data)
      ensureScript()
      setStep('OPEN')
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to load scheduling widget. Please try again.'
      setError(message)
      setStep('ERROR')
    }
  }, [bookingId, mentorId, ensureScript])

  const resetWidget = useCallback(() => {
    setStep('IDLE')
    setPrefillData(null)
    setError(null)
  }, [])

  return { step, prefillData, error, openWidget, resetWidget }
}
