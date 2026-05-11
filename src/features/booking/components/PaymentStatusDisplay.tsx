'use client'

import { AlertCircle, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import type { PaymentError, PaymentStep } from '../types/payment'

interface PaymentStatusDisplayProps {
  step: PaymentStep
  error: PaymentError | null
  onRetry: () => void
  onCancel: () => void
}

export function PaymentStatusDisplay({
  step,
  error,
  onRetry,
  onCancel,
}: PaymentStatusDisplayProps) {
  if (step === 'PROCESSING') {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#004ac6]" />
        <div>
          <p className="font-semibold text-[#121c2a]">Processing payment…</p>
          <p className="mt-1 text-sm text-[#434655]">
            QR scanned. Please confirm in your banking app.
          </p>
        </div>
      </div>
    )
  }

  if (step === 'SUCCESS') {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <CheckCircle2 className="h-12 w-12 text-[#006c49]" />
        <div>
          <p className="font-semibold text-[#121c2a]">Payment confirmed!</p>
          <p className="mt-1 text-sm text-[#434655]">
            Your booking is confirmed. Check your email for details.
          </p>
        </div>
      </div>
    )
  }

  if (step === 'FAILED') {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <AlertCircle className="h-12 w-12 text-[#ba1a1a]" />
        <div>
          <p className="font-semibold text-[#121c2a]">Payment failed</p>
          <p className="mt-1 text-sm text-[#434655]">
            {error?.message || 'Something went wrong. Please try again.'}
          </p>
          {error?.error_code && (
            <p className="mt-1 text-xs text-[#434655] opacity-60">
              Error code: {error.error_code}
            </p>
          )}
        </div>
        <div className="flex w-full flex-col gap-2">
          <button
            onClick={onRetry}
            className="w-full rounded-[24px] bg-gradient-to-br from-[#004ac6] to-[#2563eb] py-3 font-semibold text-white"
          >
            Try again
          </button>
          <button
            onClick={onCancel}
            className="w-full rounded-lg py-2 text-sm text-[#434655] underline-offset-2 hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  if (step === 'EXPIRED') {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <Clock className="h-12 w-12 text-amber-500" />
        <div>
          <p className="font-semibold text-[#121c2a]">Payment timed out</p>
          <p className="mt-1 text-sm text-[#434655]">
            The payment session expired. Please start again.
          </p>
        </div>
        <button
          onClick={onRetry}
          className="w-full rounded-[24px] bg-gradient-to-br from-[#004ac6] to-[#2563eb] py-3 font-semibold text-white"
        >
          Retry payment
        </button>
      </div>
    )
  }

  return null
}
