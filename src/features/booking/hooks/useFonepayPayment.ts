'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchPaymentStatus, initiatePayment } from '../api/paymentApi'
import type { PaymentError, PaymentStep, QRData, WebSocketMessage } from '../types/payment'
import { useFonepayWebSocket } from './useFonepayWebSocket'

export interface UseFonepayPaymentReturn {
  step: PaymentStep
  qrData: QRData | null
  error: PaymentError | null
  timeRemaining: number | null // seconds
  startPayment: () => Promise<void>
  cancelPayment: () => void
  retryPayment: () => void
}

export function useFonepayPayment(bookingId: string): UseFonepayPaymentReturn {
  const [step, setStep] = useState<PaymentStep>('IDLE')
  const [qrData, setQrData] = useState<QRData | null>(null)
  const [error, setError] = useState<PaymentError | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

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

  // ── Fallback REST polling (when WS is unavailable) ───────────────────────

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  const startFallbackPolling = useCallback(
    (transactionId: string) => {
      if (pollRef.current) return // already polling
      pollRef.current = setInterval(async () => {
        try {
          const status = await fetchPaymentStatus(transactionId)
          if (status.status === 'success') {
            stopCountdown()
            stopPolling()
            setStep('SUCCESS')
          } else if (status.status === 'failed') {
            stopCountdown()
            stopPolling()
            setError({ error_code: 'PAYMENT_FAILED', message: 'Payment failed. Please try again.' })
            setStep('FAILED')
          } else if (status.status === 'expired') {
            stopCountdown()
            stopPolling()
            setStep('EXPIRED')
          }
        } catch {
          // ignore transient poll errors
        }
      }, 10_000)
    },
    [stopCountdown, stopPolling],
  )

  // ── WebSocket message handler ────────────────────────────────────────────

  const handleWsMessage = useCallback(
    (message: WebSocketMessage) => {
      if (message.type === 'payment_success' || message.status === 'success') {
        stopCountdown()
        stopPolling()
        setStep('SUCCESS')
      } else if (message.type === 'qr_verified' || message.status === 'processing') {
        setStep('PROCESSING')
      } else if (message.status === 'failed') {
        stopCountdown()
        stopPolling()
        setError({ error_code: 'PAYMENT_FAILED', message: message.message || 'Payment failed' })
        setStep('FAILED')
      } else if (message.status === 'expired') {
        stopCountdown()
        stopPolling()
        setStep('EXPIRED')
      }
      // 'ping' messages are keepalives — no state change needed
    },
    [stopCountdown, stopPolling],
  )

  const handleWsDisconnected = useCallback(() => {
    // WS unavailable — fall back to REST polling
    if (qrData) startFallbackPolling(qrData.transaction_id)
  }, [qrData, startFallbackPolling])

  const { disconnect } = useFonepayWebSocket({
    transactionId: qrData?.transaction_id ?? null,
    onMessage: handleWsMessage,
    onDisconnected: handleWsDisconnected,
  })

  // ── Actions ──────────────────────────────────────────────────────────────

  const startPayment = useCallback(async () => {
    setStep('QR_DISPLAY')
    setError(null)
    try {
      const data = await initiatePayment(bookingId)
      setQrData(data)
      startCountdown(data.expires_at)
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to generate QR. Please try again.'
      setError({ error_code: 'INITIATE_FAILED', message: msg })
      setStep('FAILED')
    }
  }, [bookingId, startCountdown])

  const cancelPayment = useCallback(() => {
    stopCountdown()
    stopPolling()
    disconnect()
    setQrData(null)
    setError(null)
    setStep('IDLE')
  }, [stopCountdown, stopPolling, disconnect])

  const retryPayment = useCallback(() => {
    stopCountdown()
    stopPolling()
    disconnect()
    setQrData(null)
    setError(null)
    // Re-initiate immediately
    setStep('IDLE')
  }, [stopCountdown, stopPolling, disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCountdown()
      stopPolling()
    }
  }, [stopCountdown, stopPolling])

  return {
    step,
    qrData,
    error,
    timeRemaining,
    startPayment,
    cancelPayment,
    retryPayment,
  }
}
