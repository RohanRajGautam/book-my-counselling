'use client'

import { useMemo, useState } from 'react'
import axios from 'axios'
import { Loader2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { IndustryFormValues, } from '../lib/industryValidation'
import { validateIndustryForm } from '../lib/industryValidation'

const EMPTY_FORM: IndustryFormValues = {
  name: '',
  description: '',
}

export interface AdminIndustryFormModalProps {
  onClose: () => void
  onSubmit: (values: IndustryFormValues) => void
  submitting: boolean
  /** Error from the parent — surfaces duplicate-name (409), etc. */
  serverError?: string | null
}

export function AdminIndustryFormModal({
  onClose,
  onSubmit,
  submitting,
  serverError,
}: AdminIndustryFormModalProps) {
  const [form, setForm] = useState<IndustryFormValues>(EMPTY_FORM)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const errors = useMemo(() => validateIndustryForm(form), [form])
  const errorFor = (field: string) =>
    submitAttempted ? errors.find((e) => e.field === field)?.message : undefined

  const handleSubmit = () => {
    setSubmitAttempted(true)
    if (errors.length > 0) return
    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
    })
  }

  const updateField = (field: keyof IndustryFormValues, value: string) => {
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
            New industry
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

        <label className="block">
          <span className="text-xs font-extrabold tracking-wide text-slate-500 uppercase">
            Name
          </span>
          <input
            type="text"
            autoFocus
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g. FinTech"
            spellCheck={false}
            autoComplete="off"
            maxLength={100}
            disabled={submitting}
            className={inputCls(Boolean(errorFor('name')) || Boolean(serverError))}
          />
          {errorFor('name') ? (
            <p className="mt-1 text-xs font-bold text-red-600">{errorFor('name')}</p>
          ) : serverError ? (
            <p className="mt-1 text-xs font-bold text-red-600">{serverError}</p>
          ) : (
            <p className="mt-1 text-xs text-slate-500">
              2–100 characters. Slug is generated automatically.
            </p>
          )}
        </label>

        <label className="mt-4 block">
          <span className="text-xs font-extrabold tracking-wide text-slate-500 uppercase">
            Description (optional)
          </span>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="What kinds of mentors belong here?"
            disabled={submitting}
            className={inputCls(Boolean(errorFor('description')))}
          />
          {errorFor('description') ? (
            <p className="mt-1 text-xs font-bold text-red-600">
              {errorFor('description')}
            </p>
          ) : (
            <p className="mt-1 text-xs text-slate-500">
              {DESCRIPTION_COUNTER_HELPER(255 - form.description.length)}
            </p>
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
                Create
              </span>
            )}
            Add industry
          </Button>
        </div>
      </div>
    </div>
  )
}

function DESCRIPTION_COUNTER_HELPER(remaining: number): string {
  if (remaining <= 20) {
    return `${remaining} character${remaining === 1 ? '' : 's'} left`
  }
  return 'Up to 255 characters'
}

/** Map a 422 field error onto our form fields. */
export function parseIndustryFieldErrors(err: unknown): {
  name?: string
  description?: string
} {
  if (!axios.isAxiosError(err)) return {}
  const data = err.response?.data as { errors?: Array<{ field?: string; message?: string }> } | undefined
  if (!data?.errors) return {}
  const out: { name?: string; description?: string } = {}
  for (const e of data.errors) {
    if (e.field === 'body.name' || e.field === 'name') out.name = e.message
    if (e.field === 'body.description' || e.field === 'description') {
      out.description = e.message
    }
  }
  return out
}