'use client'

import { useEffect, useMemo, useState } from 'react'
import { Loader2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { PromoCodeResponse } from '../types/promo-codes.types'
import {
  validatePromoCodeForm,
  type PromoCodeFormValues,
} from '../lib/promoCodeValidation'

const EMPTY_FORM: PromoCodeFormValues = {
  code: '',
  discountPercent: '',
  description: '',
  validUntil: '',
}

export interface AdminPromoCodeFormModalProps {
  mode: 'create' | 'edit'
  initial?: PromoCodeResponse | null
  onClose: () => void
  onSubmitCreate: (values: PromoCodeFormValues) => void
  onSubmitUpdate: (id: string, values: PromoCodeFormValues) => void
  submitting: boolean
}

function isoDateToInput(iso: string | null): string {
  if (!iso) return ''
  // Take the YYYY-MM-DD slice of the ISO timestamp for the date input.
  return iso.slice(0, 10)
}

export function AdminPromoCodeFormModal({
  mode,
  initial,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  submitting,
}: AdminPromoCodeFormModalProps) {
  const [form, setForm] = useState<PromoCodeFormValues>(EMPTY_FORM)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && initial) {
      setForm({
        code: initial.code,
        discountPercent: initial.discount_percent,
        description: initial.description ?? '',
        validUntil: isoDateToInput(initial.valid_until),
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [mode, initial])

  const errors = useMemo(
    () => validatePromoCodeForm(form, { mode }),
    [form, mode],
  )
  const errorFor = (field: string) =>
    submitAttempted ? errors.find((e) => e.field === field)?.message : undefined

  const handleSubmit = () => {
    setSubmitAttempted(true)
    if (errors.length > 0) return
    if (mode === 'edit' && initial) {
      onSubmitUpdate(initial.id, form)
    } else {
      onSubmitCreate(form)
    }
  }

  const updateField = (field: keyof PromoCodeFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const inputCls = (hasError: boolean) =>
    `mt-1 w-full rounded-xl border bg-slate-50 p-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 ${
      hasError ? 'border-red-300' : 'border-slate-200'
    }`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-headline text-lg font-extrabold text-slate-950">
            {mode === 'create' ? 'New promo code' : `Edit ${initial?.code ?? ''}`}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
            aria-label="Close"
            disabled={submitting}
          >
            <X className="size-5" />
          </button>
        </div>

        {mode === 'create' ? (
          <label className="mt-1 block">
            <span className="text-xs font-extrabold tracking-wide text-slate-500 uppercase">
              Code
            </span>
            <input
              type="text"
              autoFocus
              value={form.code}
              onChange={(e) => updateField('code', e.target.value.toUpperCase())}
              placeholder="BYC1234"
              spellCheck={false}
              autoComplete="off"
              disabled={submitting}
              className={inputCls(Boolean(errorFor('code')))}
            />
            {errorFor('code') ? (
              <p className="mt-1 text-xs font-bold text-red-600">{errorFor('code')}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-500">
                Pattern: BYC followed by 4–8 letters or digits. Stored upper-case.
              </p>
            )}
          </label>
        ) : null}

        <label className="mt-4 block">
          <span className="text-xs font-extrabold tracking-wide text-slate-500 uppercase">
            Discount percent
          </span>
          <input
            type="number"
            min="0.01"
            max="100"
            step="0.01"
            value={form.discountPercent}
            onChange={(e) => updateField('discountPercent', e.target.value)}
            placeholder="e.g. 25"
            disabled={submitting}
            className={inputCls(Boolean(errorFor('discountPercent')))}
          />
          {errorFor('discountPercent') ? (
            <p className="mt-1 text-xs font-bold text-red-600">{errorFor('discountPercent')}</p>
          ) : null}
        </label>

        <label className="mt-3 block">
          <span className="text-xs font-extrabold tracking-wide text-slate-500 uppercase">
            Description (optional)
          </span>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Internal note (not shown to mentees)"
            disabled={submitting}
            className={inputCls(Boolean(errorFor('description')))}
          />
          {errorFor('description') ? (
            <p className="mt-1 text-xs font-bold text-red-600">{errorFor('description')}</p>
          ) : null}
        </label>

        <label className="mt-3 block">
          <span className="text-xs font-extrabold tracking-wide text-slate-500 uppercase">
            Valid until (optional)
          </span>
          <input
            type="date"
            value={form.validUntil}
            onChange={(e) => updateField('validUntil', e.target.value)}
            disabled={submitting}
            className={inputCls(Boolean(errorFor('validUntil')))}
          />
          {errorFor('validUntil') ? (
            <p className="mt-1 text-xs font-bold text-red-600">{errorFor('validUntil')}</p>
          ) : (
            <p className="mt-1 text-xs text-slate-500">Leave empty for no expiry.</p>
          )}
        </label>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <span className="text-xs font-extrabold uppercase tracking-wide">
                {mode === 'create' ? 'Create' : 'Save'}
              </span>
            )}
            {mode === 'create' ? 'Create code' : 'Save changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}