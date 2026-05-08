'use client'

import { Lock, CreditCard, ShieldCheck } from 'lucide-react'
import { formatCardNumber, formatExpiry } from '@/features/booking/lib/validation'
import { ChangeEvent } from 'react'

interface PaymentSectionProps {
  cardNumber: string
  expiry: string
  cvc: string
  errors: Record<string, string>
  onCardNumberChange: (value: string) => void
  onExpiryChange: (value: string) => void
  onCvcChange: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function PaymentSection({
  cardNumber,
  expiry,
  cvc,
  errors,
  onCardNumberChange,
  onExpiryChange,
  onCvcChange,
  onSubmit,
  isSubmitting,
}: PaymentSectionProps) {
  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    onCardNumberChange(formatted)
  }

  const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value)
    onExpiryChange(formatted)
  }

  const handleCvcChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4)
    onCvcChange(value)
  }

  return (
    <div className="rounded-[24px] bg-white p-8 shadow-[0_8px_24px_rgba(18,28,42,0.06)]">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-headline)] text-xl font-bold text-[#121c2a]">
          Payment
        </h3>
        <Lock className="h-5 w-5 text-[#006c49]" />
      </div>

      <div className="space-y-5">
        {/* Card Number */}
        <div>
          <label htmlFor="card_number" className="sr-only">
            Card Number
          </label>
          <div className="relative">
            <CreditCard className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-[#434655]" />
            <input
              id="card_number"
              name="card_number"
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="Card number"
              maxLength={19}
              className={`w-full rounded-lg border-none bg-[#eff4ff] py-3 pr-4 pl-12 text-[#121c2a] transition-colors focus:bg-white focus:ring-2 focus:ring-[#004ac6] ${
                errors.cardNumber ? 'ring-2 ring-[#ba1a1a]' : ''
              }`}
              aria-invalid={errors.cardNumber ? 'true' : 'false'}
              aria-describedby={errors.cardNumber ? 'card_number-error' : undefined}
            />
          </div>
          {errors.cardNumber && (
            <p id="card_number-error" className="mt-2 text-sm text-[#ba1a1a]" role="alert">
              {errors.cardNumber}
            </p>
          )}
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiry" className="sr-only">
              Expiry Date
            </label>
            <input
              id="expiry"
              name="expiry"
              type="text"
              value={expiry}
              onChange={handleExpiryChange}
              placeholder="MM / YY"
              maxLength={7}
              className={`w-full rounded-lg border-none bg-[#eff4ff] px-4 py-3 text-[#121c2a] transition-colors focus:bg-white focus:ring-2 focus:ring-[#004ac6] ${
                errors.expiry ? 'ring-2 ring-[#ba1a1a]' : ''
              }`}
              aria-invalid={errors.expiry ? 'true' : 'false'}
              aria-describedby={errors.expiry ? 'expiry-error' : undefined}
            />
            {errors.expiry && (
              <p id="expiry-error" className="mt-2 text-sm text-[#ba1a1a]" role="alert">
                {errors.expiry}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="cvc" className="sr-only">
              CVC
            </label>
            <input
              id="cvc"
              name="cvc"
              type="text"
              value={cvc}
              onChange={handleCvcChange}
              placeholder="CVC"
              maxLength={4}
              className={`w-full rounded-lg border-none bg-[#eff4ff] px-4 py-3 text-[#121c2a] transition-colors focus:bg-white focus:ring-2 focus:ring-[#004ac6] ${
                errors.cvc ? 'ring-2 ring-[#ba1a1a]' : ''
              }`}
              aria-invalid={errors.cvc ? 'true' : 'false'}
              aria-describedby={errors.cvc ? 'cvc-error' : undefined}
            />
            {errors.cvc && (
              <p id="cvc-error" className="mt-2 text-sm text-[#ba1a1a]" role="alert">
                {errors.cvc}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="mt-8 w-full rounded-[24px] bg-gradient-to-br from-[#004ac6] to-[#2563eb] py-4 font-[family-name:var(--font-headline)] text-lg font-bold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Processing...' : 'Confirm and Pay'}
      </button>

      {/* Security Badge */}
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#434655]">
        <ShieldCheck className="h-4 w-4 text-[#006c49]" />
        <span>Secure 256-bit SSL encrypted payment</span>
      </div>
    </div>
  )
}
