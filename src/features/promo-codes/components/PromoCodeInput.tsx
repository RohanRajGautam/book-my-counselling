'use client'

import { Check, Loader2, Tag, X } from 'lucide-react'

interface AppliedPromo {
  code: string
  discount_percent: string
  discount_amount: string
  final_amount: string
}

interface PromoCodeInputProps {
  /** Current input value (controlled). */
  value: string
  /** Called on every keystroke. */
  onChange: (next: string) => void
  /** Called when the user clicks "Apply" — parent kicks off validation. */
  onApply: () => void
  /** Called when the user clicks "Remove" on an applied code. */
  onRemove: () => void
  /** Set when validation succeeded — drives the success preview. */
  applied?: AppliedPromo | null
  /** Reflects the parent's mutation state. */
  isValidating?: boolean
  /** Inline error string (also surfaced via toast by the parent). */
  errorMessage?: string | null
}

function formatNpr(value: string): string {
  const n = Number(value)
  if (!Number.isFinite(n)) return value
  return `NPR ${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function PromoCodeInput({
  value,
  onChange,
  onApply,
  onRemove,
  applied,
  isValidating,
  errorMessage,
}: PromoCodeInputProps) {
  if (applied) {
    const discountPct = Number(applied.discount_percent)
    return (
      <div
        className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-200"
        aria-live="polite"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-emerald-600 ring-1 ring-emerald-200">
            <Check className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-emerald-700">
              {applied.code}: {Number.isFinite(discountPct) ? `${discountPct}% off` : 'applied'}
              <span className="ml-2 font-semibold text-emerald-600">
                — save {formatNpr(applied.discount_amount)}
              </span>
            </p>
            <p className="text-xs font-medium text-emerald-600/80">
              You&apos;ll pay {formatNpr(applied.final_amount)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="grid size-9 shrink-0 place-items-center rounded-xl text-emerald-700 transition hover:bg-emerald-100"
          aria-label="Remove promo code"
        >
          <X className="size-4" />
        </button>
      </div>
    )
  }

  const canApply = value.trim().length > 0 && !isValidating

  return (
    <div className="space-y-2">
      <label
        htmlFor="promo-code"
        className="mb-2 block font-[family-name:var(--font-label)] text-sm font-semibold text-[#434655]"
      >
        Promo code
        <span className="ml-1 font-normal text-[#737686]">(Optional)</span>
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#737686]">
            <Tag className="size-4" />
          </span>
          <input
            id="promo-code"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canApply) {
                e.preventDefault()
                onApply()
              }
            }}
            placeholder="e.g. BYC1234"
            autoComplete="off"
            spellCheck={false}
            disabled={isValidating}
            aria-invalid={errorMessage ? 'true' : 'false'}
            className={`w-full rounded-lg border-none bg-[#d9e3f6] py-3 pr-4 pl-10 text-[#121c2a] transition-colors focus:bg-white focus:ring-2 focus:ring-[#004ac6] disabled:opacity-60 ${
              errorMessage ? 'ring-2 ring-[#ba1a1a]' : ''
            }`}
          />
        </div>
        <button
          type="button"
          onClick={onApply}
          disabled={!canApply}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#004ac6] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#003da8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isValidating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Checking
            </>
          ) : (
            'Apply'
          )}
        </button>
      </div>
      {errorMessage ? (
        <p className="text-sm text-[#ba1a1a]" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}