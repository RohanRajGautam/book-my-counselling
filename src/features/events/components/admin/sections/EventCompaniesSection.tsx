'use client'

import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { EVENT_FORM_INPUT_CLASS } from '../../../lib/events.constants'
import { nextLocalId } from '../../../lib/events.utils'
import type { EventCreateForm } from '../../../lib/events.validation'

import { EventImageUploader } from '../EventImageUploader'

interface EventCompaniesSectionProps {
  value: EventCreateForm['companies']
  onChange: (next: EventCreateForm['companies']) => void
  errorsByIndex: Record<number, { name?: string; logoUrl?: string }>
}

export function EventCompaniesSection({
  value,
  onChange,
  errorsByIndex,
}: EventCompaniesSectionProps) {
  const addRow = () => {
    onChange([...value, { id: nextLocalId('co'), name: '', logoUrl: '' }])
  }

  const updateRow = (idx: number, key: 'name' | 'logoUrl', next: string) => {
    onChange(value.map((row, i) => (i === idx ? { ...row, [key]: next } : row)))
  }

  const removeRow = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx))
  }

  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir
    if (target < 0 || target >= value.length) return
    const next = [...value]
    const a = next[idx]
    const b = next[target]
    if (!a || !b) return
    next[idx] = b
    next[target] = a
    onChange(next)
  }

  return (
    <section className="rounded-[22px] border border-[#d9e3f6] bg-white p-5 shadow-sm sm:p-6">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-headline text-lg font-extrabold tracking-tight text-slate-900">
            Sponsors & partners
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Logos render as a horizontal strip on the event detail page.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addRow}
          className="gap-1.5 rounded-[22px] border-[#004ac6]/30 bg-[#e6eeff] font-bold text-[#004ac6] hover:bg-[#dbe6ff]"
        >
          <Plus className="size-3.5" strokeWidth={2.6} />
          Add company
        </Button>
      </header>

      {value.length === 0 ? (
        <div className="rounded-[22px] border border-dashed border-[#c9d7f4] bg-[#f8f9ff] p-8 text-center">
          <p className="text-sm font-bold text-slate-700">No companies yet.</p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Add the partners and sponsors who made this event happen.
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addRow}
            className="mt-4 gap-1.5 rounded-[22px] border-[#004ac6]/30 bg-white font-bold text-[#004ac6] hover:bg-[#e6eeff]"
          >
            <Plus className="size-3.5" strokeWidth={2.6} />
            Add the first company
          </Button>
        </div>
      ) : (
        <ol className="space-y-3">
          {value.map((row, idx) => {
            const rowErrors = errorsByIndex[idx] ?? {}
            return (
              <li
                key={row.id}
                className="rounded-[22px] border border-[#eff4ff] bg-[#f8f9ff] p-4 shadow-sm sm:p-5"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-slate-500 uppercase">
                    <span className="grid size-7 place-items-center rounded-full bg-[#004ac6] text-[11px] font-extrabold text-white">
                      {idx + 1}
                    </span>
                    Company {idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                      className="grid size-8 place-items-center rounded-[22px] text-slate-500 hover:bg-white disabled:opacity-40"
                      aria-label={`Move company ${idx + 1} up`}
                    >
                      <ArrowUp className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(idx, 1)}
                      disabled={idx === value.length - 1}
                      className="grid size-8 place-items-center rounded-[22px] text-slate-500 hover:bg-white disabled:opacity-40"
                      aria-label={`Move company ${idx + 1} down`}
                    >
                      <ArrowDown className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeRow(idx)}
                      className="grid size-8 place-items-center rounded-[22px] text-red-600 hover:bg-red-50"
                      aria-label={`Remove company ${idx + 1}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
                  <EventImageUploader
                    variant="generic"
                    folder="events/companies"
                    label="Logo"
                    hint="PNG with transparent background works best."
                    value={row.logoUrl || null}
                    onChange={(url) => updateRow(idx, 'logoUrl', url ?? '')}
                  />

                  <Field
                    label="Name"
                    required
                    error={rowErrors.name}
                    input={
                      <Input
                        value={row.name}
                        onChange={(e) => updateRow(idx, 'name', e.target.value)}
                        placeholder="Webpoint Technology"
                        maxLength={255}
                        aria-invalid={!!rowErrors.name}
                        className={EVENT_FORM_INPUT_CLASS}
                      />
                    }
                  />
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}

function Field({
  label,
  required,
  error,
  input,
}: {
  label: string
  required?: boolean
  error?: string
  input: React.ReactNode
}) {
  return (
    <div>
      <Label className="text-xs font-extrabold tracking-wide text-slate-700 uppercase">
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </Label>
      <div className="mt-1.5">{input}</div>
      {error ? (
        <p className="mt-1.5 text-xs font-semibold text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
