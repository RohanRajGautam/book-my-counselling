'use client'

import { ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'
import { BankSelector } from './BankSelector'
import { PaymentStatusDisplay } from './PaymentStatusDisplay'
import { QRDisplay } from './QRDisplay'
import { useFonepayPayment } from '../hooks/useFonepayPayment'

interface FonepayPaymentSectionProps {
  bookingId: string
  amount: number
  onSuccess?: () => void
}

export function FonepayPaymentSection({
  bookingId,
  amount,
  onSuccess,
}: FonepayPaymentSectionProps) {
  const {
    step,
    qrData,
    error,
    timeRemaining,
    banks,
    banksLoading,
    banksError,
    selectedBank,
    startPayment,
    initiateWithBank,
    cancelPayment,
    retryPayment,
    retryBankFetch,
  } = useFonepayPayment(bookingId)

  // Notify parent on success
  useEffect(() => {
    if (step === 'SUCCESS') {
      onSuccess?.()
    }
  }, [step, onSuccess])

  return (
    <div className="rounded-[24px] bg-white p-8 shadow-[0_8px_24px_rgba(18,28,42,0.06)]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-headline)] text-xl font-bold text-[#121c2a]">
          Payment
        </h3>
        <Image
          src="https://fonepay.com/assets/images/fonepay-logo.png"
          alt="Fonepay"
          width={80}
          height={24}
          className="h-6 w-auto object-contain"
          unoptimized
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      </div>

      {/* Amount */}
      <div className="mb-6 rounded-xl bg-[#eff4ff] px-4 py-3">
        <p className="text-sm text-[#434655]">Amount to pay</p>
        <p className="text-2xl font-bold text-[#121c2a]">
          NPR {amount.toLocaleString('en-NP', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* Step: IDLE */}
      {step === 'IDLE' && (
        <button
          onClick={startPayment}
          className="w-full rounded-[24px] bg-gradient-to-br from-[#004ac6] to-[#2563eb] py-4 font-[family-name:var(--font-headline)] text-lg font-bold text-white shadow-sm transition-all hover:shadow-md"
        >
          Pay with Fonepay
        </button>
      )}

      {/* Step: BANK_SELECTION */}
      {step === 'BANK_SELECTION' && (
        <div className="space-y-5">
          <p className="text-sm font-medium text-[#121c2a]">Select your bank</p>
          <BankSelector
            banks={banks}
            loading={banksLoading}
            error={banksError}
            selectedBank={selectedBank}
            onSelect={initiateWithBank}
            onRetry={retryBankFetch}
          />
          <button
            onClick={cancelPayment}
            className="w-full rounded-xl py-2.5 text-sm text-[#434655] transition hover:bg-[#f8f9ff]"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Step: QR_DISPLAY — shows spinner while fetching, then QR once ready */}
      {step === 'QR_DISPLAY' && (
        <QRDisplay
          qrData={qrData}
          timeRemaining={timeRemaining}
          onCancel={cancelPayment}
        />
      )}

      {/* Steps: PROCESSING, SUCCESS, FAILED, EXPIRED */}
      {(step === 'PROCESSING' ||
        step === 'SUCCESS' ||
        step === 'FAILED' ||
        step === 'EXPIRED') && (
        <PaymentStatusDisplay
          step={step}
          error={error}
          onRetry={retryPayment}
          onCancel={cancelPayment}
        />
      )}

      {/* Security badge */}
      {step !== 'SUCCESS' && (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#434655]">
          <ShieldCheck className="h-4 w-4 text-[#006c49]" />
          <span>Secured by Fonepay · 256-bit SSL</span>
        </div>
      )}
    </div>
  )
}
