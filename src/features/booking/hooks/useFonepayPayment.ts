'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchPaymentStatus, initiatePayment } from '../api/paymentApi'
import type { PaymentError, PaymentStep, QRData, WebSocketMessage } from '../types/payment'
import { useFonepayWebSocket } from './useFonepayWebSocket'
import { makePaymentStatusFetcher, pollMeetingWith } from '../lib/meetingStatus'

export type PaymentLifecycleStatus = 'idle' | 'pending' | 'success' | 'failed' | 'expired'

export interface UseFonepayPaymentReturn {
  step: PaymentStep
  qrData: QRData | null
  error: PaymentError | null
  timeRemaining: number | null
  /**
   * Latest fetched transaction status. `null` until the first fetch lands.
   * The page reads this to decide whether to render the meeting UI at all
   * (i.e. only show the meeting block when the payment cleared).
   */
  paymentStatus: PaymentLifecycleStatus
  /** Auto-created Google Meet link. Null while in-flight. */
  meetingLink: string | null
  /** True while polling for the meeting link (skeleton in the modal). */
  meetingPreparing: boolean
  /** True after 5 polls with no link and no error. */
  meetingErrorFallback: boolean
  startPayment: () => Promise<void>
  cancelPayment: () => void
  retryPayment: () => void
}

export function useFonepayPayment(bookingId: string): UseFonepayPaymentReturn {
  const [step, setStep] = useState<PaymentStep>('IDLE')
  const [qrData, setQrData] = useState<QRData | null>(null)
  const [error, setError] = useState<PaymentError | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  // Meeting-link state — owned by the hook because the polling lifecycle
  // is tied to the WS connect/disconnect. The hook exposes these so the
  // success modal can render the right branch (CTA / skeleton / fallback).
  const [paymentStatus, setPaymentStatus] = useState<PaymentLifecycleStatus>('idle')
  const [meetingLink, setMeetingLink] = useState<string | null>(null)
  const [meetingPreparing, setMeetingPreparing] = useState(false)
  const [meetingErrorFallback, setMeetingErrorFallback] = useState(false)

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const meetingPollAbortRef = useRef<AbortController | null>(null)

  // ── Countdown timer ──────────────────────────────────────────────────────

  const startCountdown = useCallback((expiresAt: string) => {
    if (countdownRef.current) clearInterval(countdownRef.current)
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000),
      )
      setTimeRemaining(remaining)
      if (remaining === 0) {
        clearInterval(countdownRef.current!)
        countdownRef.current = null
        setStep('EXPIRED')
      }
    }
    tick()
    countdownRef.current = setInterval(tick, 1000)
  }, [])

  const stopCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
  }, [])

  // ── Meeting polling ──────────────────────────────────────────────────────

  const resetMeetingState = useCallback(() => {
    meetingPollAbortRef.current?.abort()
    meetingPollAbortRef.current = null
    setMeetingLink(null)
    setMeetingPreparing(false)
    setMeetingErrorFallback(false)
  }, [])

  /**
   * Fire the REST status endpoint once and, if the payment cleared and the
   * meeting link isn't ready yet, poll up to 5× for it. Called on both the
   * WS `payment_success` path AND when the WS-fallback REST poll detects
   * `status=success`.
   *
   * The WS stays status-only per the spec — meeting state always comes from
   * `/payments/status/{tx_id}`.
   */
  const startMeetingPolling = useCallback(
    (transactionId: string) => {
      // Cancel any in-flight meeting poll from a previous attempt.
      meetingPollAbortRef.current?.abort()
      const ac = new AbortController()
      meetingPollAbortRef.current = ac
      const fetcher = makePaymentStatusFetcher(transactionId)

      void (async () => {
        const first = await fetcher()
        if (ac.signal.aborted) return
        if (!first || !first.resolved) return // payment didn't clear yet

        if (first.meetingLink) {
          setMeetingLink(first.meetingLink)
          return
        }
        if (first.meetingError) {
          setMeetingErrorFallback(true)
          return
        }
        // In-flight — poll.
        setMeetingPreparing(true)
        await pollMeetingWith(
          fetcher,
          (r) => {
            if (ac.signal.aborted) return
            if (r.meetingLink) {
              setMeetingLink(r.meetingLink)
              setMeetingPreparing(false)
              return
            }
            if (r.meetingError) {
              setMeetingErrorFallback(true)
              setMeetingPreparing(false)
              return
            }
            if (r.meetingAttempts >= 5) {
              setMeetingErrorFallback(true)
              setMeetingPreparing(false)
            }
          },
          5,
          2000,
          ac.signal,
        )
        if (!ac.signal.aborted) {
          setMeetingPreparing(false)
          setMeetingErrorFallback(true)
        }
      })()
    },
    []
  )

  // ── Fallback REST polling (when WS relay is unavailable) ─────────────────

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  const startFallbackPolling = useCallback(
    (transactionId: string) => {
      if (pollRef.current) return
      pollRef.current = setInterval(async () => {
        try {
          const status = await fetchPaymentStatus(transactionId)
          if (status.status === 'success') {
            stopCountdown()
            stopPolling()
            setStep('SUCCESS')
            setPaymentStatus('success')
            startMeetingPolling(transactionId)
          } else if (status.status === 'failed') {
            stopCountdown()
            stopPolling()
            setError({ error_code: 'PAYMENT_FAILED', message: 'Payment failed. Please try again.' })
            setStep('FAILED')
            setPaymentStatus('failed')
          } else if (status.status === 'expired') {
            stopCountdown()
            stopPolling()
            setStep('EXPIRED')
            setPaymentStatus('expired')
          } else {
            setPaymentStatus('pending')
          }
        } catch {
          // ignore transient poll errors
        }
      }, 10_000)
    },
    [startMeetingPolling, stopCountdown, stopPolling],
  )

  // ── WebSocket message handler ────────────────────────────────────────────

  const handleWsMessage = useCallback(
    (message: WebSocketMessage) => {
      if (message.type === 'payment_success' || message.status === 'success') {
        stopCountdown()
        stopPolling()
        setStep('SUCCESS')
        setPaymentStatus('success')
        if (qrData) startMeetingPolling(qrData.transaction_id)
      } else if (message.type === 'qr_verified' || message.status === 'processing') {
        setStep('PROCESSING')
        setPaymentStatus('pending')
      } else if (message.status === 'failed') {
        stopCountdown()
        stopPolling()
        setError({ error_code: 'PAYMENT_FAILED', message: message.message || 'Payment failed' })
        setStep('FAILED')
        setPaymentStatus('failed')
      } else if (message.status === 'expired') {
        stopCountdown()
        stopPolling()
        setStep('EXPIRED')
        setPaymentStatus('expired')
      }
    },
    [qrData, startMeetingPolling, stopCountdown, stopPolling],
  )

  const handleWsDisconnected = useCallback(() => {
    if (qrData) startFallbackPolling(qrData.transaction_id)
  }, [qrData, startFallbackPolling])

  const { disconnect } = useFonepayWebSocket({
    transactionId: qrData?.transaction_id ?? null,
    onMessage: handleWsMessage,
    onDisconnected: handleWsDisconnected,
  })

  // ── Actions ──────────────────────────────────────────────────────────────

  /**
   * Go straight from IDLE → QR_DISPLAY.
   * No bank selection — the Fonepay QR works with all connected banks.
   */
  const startPayment = useCallback(async () => {
    setStep('QR_DISPLAY')
    setError(null)
    setPaymentStatus('pending')
    resetMeetingState()
    try {
      const data = await initiatePayment(bookingId)
      setQrData(data)
      startCountdown(data.expires_at)
    } catch (err: unknown) {
      let msg = 'Failed to generate QR. Please try again.'
      if (err && typeof err === 'object') {
        const axiosErr = err as {
          response?: { data?: { detail?: string; message?: string } }
          message?: string
        }
        msg =
          axiosErr.response?.data?.detail ||
          axiosErr.response?.data?.message ||
          axiosErr.message ||
          msg
      }
      setError({ error_code: 'INITIATE_FAILED', message: msg })
      setStep('FAILED')
      setPaymentStatus('failed')
    }
  }, [bookingId, resetMeetingState, startCountdown])

  const cancelPayment = useCallback(() => {
    stopCountdown()
    stopPolling()
    disconnect()
    resetMeetingState()
    setQrData(null)
    setError(null)
    setStep('IDLE')
    setPaymentStatus('idle')
  }, [disconnect, resetMeetingState, stopCountdown, stopPolling])

  const retryPayment = useCallback(() => {
    stopCountdown()
    stopPolling()
    disconnect()
    resetMeetingState()
    setQrData(null)
    setError(null)
    setStep('IDLE')
    setPaymentStatus('idle')
  }, [disconnect, resetMeetingState, stopCountdown, stopPolling])

  useEffect(() => {
    return () => {
      stopCountdown()
      stopPolling()
      meetingPollAbortRef.current?.abort()
    }
  }, [stopCountdown, stopPolling])

  return {
    step,
    qrData,
    error,
    timeRemaining,
    paymentStatus,
    meetingLink,
    meetingPreparing,
    meetingErrorFallback,
    startPayment,
    cancelPayment,
    retryPayment,
  }
}