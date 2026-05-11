'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchBanks, fetchPaymentStatus, initiatePayment } from '../api/paymentApi'
import type { BankInfo, PaymentError, PaymentStep, QRData, WebSocketMessage } from '../types/payment'
import { useFonepayWebSocket } from './useFonepayWebSocket'

export interface UseFonepayPaymentReturn {
  step: PaymentStep
  qrData: QRData | null
  error: PaymentError | null
  timeRemaining: number | null // seconds
  banks: BankInfo[]
  banksLoading: boolean
  banksError: string | null
  selectedBank: BankInfo | null
  selectBank: (bank: BankInfo) => void
  startPayment: () => void
  initiateWithBank: (bank: BankInfo) => Promise<void>
  cancelPayment: () => void
  retryPayment: () => void
  retryBankFetch: () => void
}

export function useFonepayPayment(bookingId: string): UseFonepayPaymentReturn {
  const [step, setStep] = useState<PaymentStep>('IDLE')
  const [qrData, setQrData] = useState<QRData | null>(null)
  const [error, setError] = useState<PaymentError | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  // Bank selection state
  const [banks, setBanks] = useState<BankInfo[]>([])
  const [banksLoading, setBanksLoading] = useState(false)
  const [banksError, setBanksError] = useState<string | null>(null)
  const [selectedBank, setSelectedBank] = useState<BankInfo | null>(null)

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Bank list fetching ───────────────────────────────────────────────────

  const loadBanks = useCallback(async () => {
    setBanksLoading(true)
    setBanksError(null)
    try {
      const data = await fetchBanks()
      setBanks(data)
    } catch {
      setBanksError('Failed to load banks. Please try again.')
    } finally {
      setBanksLoading(false)
    }
  }, [])

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
      // 'ping' = keepalive, no state change needed
    },
    [stopCountdown, stopPolling],
  )

  const handleWsDisconnected = useCallback(() => {
    // Backend WS relay unavailable — fall back to direct REST polling
    if (qrData) startFallbackPolling(qrData.transaction_id)
  }, [qrData, startFallbackPolling])

  // Only connect WS once we have a transaction_id (qrData is set)
  const { disconnect } = useFonepayWebSocket({
    transactionId: qrData?.transaction_id ?? null,
    onMessage: handleWsMessage,
    onDisconnected: handleWsDisconnected,
  })

  // ── Actions ──────────────────────────────────────────────────────────────

  /** Move from IDLE → BANK_SELECTION, loading banks if needed */
  const startPayment = useCallback(() => {
    setError(null)
    setStep('BANK_SELECTION')
    if (banks.length === 0 && !banksLoading) {
      loadBanks()
    }
  }, [banks.length, banksLoading, loadBanks])

  const selectBank = useCallback((bank: BankInfo) => {
    setSelectedBank(bank)
  }, [])

  /** Called when user confirms bank selection — initiates QR generation */
  const initiateWithBank = useCallback(
    async (bank: BankInfo) => {
      setSelectedBank(bank)
      // Show loading state immediately (qrData is null → spinner shows in QRDisplay)
      setStep('QR_DISPLAY')
      setError(null)
      try {
        const data = await initiatePayment(bookingId, bank.bank_code)
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
      }
    },
    [bookingId, startCountdown],
  )

  const cancelPayment = useCallback(() => {
    stopCountdown()
    stopPolling()
    disconnect()
    setQrData(null)
    setError(null)
    setSelectedBank(null)
    setStep('IDLE')
  }, [stopCountdown, stopPolling, disconnect])

  const retryPayment = useCallback(() => {
    stopCountdown()
    stopPolling()
    disconnect()
    setQrData(null)
    setError(null)
    setSelectedBank(null)
    setStep('BANK_SELECTION')
    if (banks.length === 0 && !banksLoading) {
      loadBanks()
    }
  }, [stopCountdown, stopPolling, disconnect, banks.length, banksLoading, loadBanks])

  const retryBankFetch = useCallback(() => {
    loadBanks()
  }, [loadBanks])

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
    banks,
    banksLoading,
    banksError,
    selectedBank,
    selectBank,
    startPayment,
    initiateWithBank,
    cancelPayment,
    retryPayment,
    retryBankFetch,
  }
}
