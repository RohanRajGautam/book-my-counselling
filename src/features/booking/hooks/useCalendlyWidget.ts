'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  CalendlyEventScheduled,
  CalendlyPrefillResponse,
  CalendlyWidgetStep,
} from '../types/calendly'

// Platform-wide default Calendly link used until mentors configure their own
const DEFAULT_CALENDLY_URL = 'https://calendly.com/bookyourcounselling/30min'

interface UseCalendlyWidgetOptions {
  mentorId: string
  bookingId: string | null
  userName?: string
  userEmail?: string
  onScheduled?: () => void
}

interface UseCalendlyWidgetReturn {
  step: CalendlyWidgetStep
  prefillData: CalendlyPrefillResponse | null
  error: string | null
  openWidget: () => void
  resetWidget: () => void
}

/**
 * Manages the Calendly inline embed widget lifecycle.
 *
 * Flow:
 *   IDLE → OPEN (widget visible) → SCHEDULED (success)
 *                                ↘ ERROR
 *
 * Uses the platform default Calendly URL directly — no backend round-trip
 * needed until per-mentor links are configured.
 */
export function useCalendlyWidget({
  mentorId,
  bookingId,
  userName = '',
  userEmail = '',
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
        console.info('[Calendly] Event scheduled:', data.payload?.event?.uri)
        setStep('SCHEDULED')
        onScheduled?.()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onScheduled])

  const openWidget = useCallback(() => {
    if (!bookingId) {
      setError('Booking must be created before scheduling a call')
      setStep('ERROR')
      return
    }

    // Build prefill data locally — no backend call needed
    const data: CalendlyPrefillResponse = {
      calendly_url: DEFAULT_CALENDLY_URL,
      prefill: {
        name: userName,
        email: userEmail,
        customAnswers: {
          a1: bookingId,
        },
      },
      utm: {
        utmSource: 'byc_platform',
        utmCampaign: 'intro_call',
        utmContent: mentorId,
      },
    }

    setPrefillData(data)
    ensureScript()
    setStep('OPEN')
  }, [bookingId, mentorId, userName, userEmail, ensureScript])

  const resetWidget = useCallback(() => {
    setStep('IDLE')
    setPrefillData(null)
    setError(null)
  }, [])

  return { step, prefillData, error, openWidget, resetWidget }
}
