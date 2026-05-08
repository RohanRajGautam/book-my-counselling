'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchBanks, fetchPaymentStatus, initiatePayment } from '../api/paymentApi'
import type {
  BankInfo,
  PaymentError,
  PaymentStep,
  QRData,
  WebSocketMessage,
} from '../types/payment'
import { useFonepayWebSocket } from './useFonepayWebSocket'

const PAYMENT_TIMEOUT_MINUTES = 15
const POLL_INTERVAL_MS = 30_000

export interface UseFonepayPaymentReturn {
  step: PaymentStep
  banks: BankInfo[]
  banksLoading: boolean
  banksError: string | null
  selectedBank: BankInfo | null
  qrData: QRData | null
  error: PaymentError | null
  timeRemaining: number | null // seconds
  selectBank: (bank: BankInfo) => void
  startPayment: () => void
  initiatePaymentFlow: () => Promise<void>
  cancelPayment: () => void
  retryPayment: () => void
}

export function useFonepayPayment(bookingId: string): UseFonepayPaymentReturn {
  const [step, setStep] = useState<PaymentStep>('IDLE')
  const [banks, setBanks] = useState<BankInfo[]>([])
  const [banksLoading, setBanksLoading] = useState(false)
  const [banksError, setBanksError] = useState<string | null>(null)
  const [selectedBank, setSelectedBank] = useState<BankInfo | null>(null)
  const [qrData, setQrData] = useState<QRData | null>(null)
  const [error, setError] = useState<PaymentError | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fallbackPollingRef = useRef(false)

  // Load banks when entering BANK_SELECTION
  useEffect(() => {
    if (step !== 'BANK_SELECTION') return
    setBanksLoading(true)
    setBanksError(null)
    fetchBanks()
      .then(setBanks)
      .catch(() => setBanksError('Failed to load banks. Please try again.'))
      .finally(() => setBanksLoading(false))
  }, [step])

  // Countdown timer
  const startCountdown = useCallback((expiresAt: string) => {
    if (countdownRef.current) clearInterval(countdownRef.current)
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)
      )
      setTimeRemaining(remaining)
      if (remaining === 0) {
        clearInterval(countdownRef.current!)
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

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  // WebSocket message handler
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
      } else if (message.type === 'error') {
        setError({ error_code: 'WS_ERROR', message: message.message || 'Connection error' })
      }
    },
    [stopCountdown, stopPolling]
  )

  const handleMaxRetriesExceeded = useCallback(() => {
    fallbackPollingRef.current = true
    if (!qrData) return
    pollRef.current = setInterval(async () => {
      try {
        const status = await fetchPaymentStatus(qrData.transaction_id)
        if (status.status === 'success') {
          stopCountdown()
          stopPolling()
          setStep('SUCCESS')
        } else if (status.status === 'failed' || status.status === 'expired') {
          stopCountdown()
          stopPolling()
          setStep(status.status === 'expired' ? 'EXPIRED' : 'FAILED')
        }
      } catch {
        // ignore poll errors
      }
    }, POLL_INTERVAL_MS)
  }, [qrData, stopCountdown, stopPolling])

  const { disconnect } = useFonepayWebSocket({
    transactionId: qrData?.transaction_id ?? null,
    onMessage: handleWsMessage,
    onMaxRetriesExceeded: handleMaxRetriesExceeded,
  })

  const selectBank = useCallback((bank: BankInfo) => {
    setSelectedBank(bank)
  }, [])

  const startPayment = useCallback(() => {
    setSelectedBank(null)
    setError(null)
    setStep('BANK_SELECTION')
  }, [])

  const initiatePaymentFlow = useCallback(async () => {
    if (!selectedBank) return
    setStep('QR_DISPLAY')
    setError(null)
    try {
      const data = await initiatePayment(bookingId, selectedBank.bank_code)
      setQrData(data)
      startCountdown(data.expires_at)
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to initiate payment. Please try again.'
      setError({ error_code: 'INITIATE_FAILED', message: msg })
      setStep('FAILED')
    }
  }, [selectedBank, bookingId, startCountdown])

  const cancelPayment = useCallback(() => {
    stopCountdown()
    stopPolling()
    disconnect()
    setQrData(null)
    setSelectedBank(null)
    setError(null)
    setStep('IDLE')
  }, [stopCountdown, stopPolling, disconnect])

  const retryPayment = useCallback(() => {
    stopCountdown()
    stopPolling()
    disconnect()
    setQrData(null)
    setError(null)
    setStep('BANK_SELECTION')
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
    banks,
    banksLoading,
    banksError,
    selectedBank,
    qrData,
    error,
    timeRemaining,
    selectBank,
    startPayment,
    initiatePaymentFlow,
    cancelPayment,
    retryPayment,
  }
}
