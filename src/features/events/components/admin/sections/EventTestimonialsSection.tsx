'use client'

import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { EVENT_FORM_INPUT_CLASS } from '../../../lib/events.constants'
import { nextLocalId } from '../../../lib/events.utils'
import type { EventCreateForm } from '../../../lib/events.validation'

import { EventImageUploader } from '../EventImageUploader'

interface EventTestimonialsSectionProps {
  value: EventCreateForm['testimonials']
  onChange: (next: EventCreateForm['testimonials']) => void
  errorsByIndex: Record<number, { name?: string; content?: string; imageUrl?: string }>
}

export function EventTestimonialsSection({
  value,
  onChange,
  errorsByIndex,
}: EventTestimonialsSectionProps) {
  const addRow = () => {
    onChange([...value, { id: nextLocalId('ts'), name: '', content: '', imageUrl: '' }])
  }

  const updateRow = (
    idx: number,
    key: 'name' | 'content' | 'imageUrl',
    next: string
  ) => {
    onChange(value.map((row, i) => (i === idx ? { ...row, [key]: next } : row)))
  }

  const removeRow = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx))
  }

  return (
    <section className="rounded-[22px] border border-[#d9e3f6] bg-white p-5 shadow-sm sm:p-6">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-headline text-lg font-extrabold tracking-tight text-slate-900">
            Reflections from past attendees
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Sort by creation time — add them in the order they should appear.
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
          Add testimonial
        </Button>
      </header>

      {value.length === 0 ? (
        <div className="rounded-[22px] border border-dashed border-[#c9d7f4] bg-[#f8f9ff] p-8 text-center">
          <p className="text-sm font-bold text-slate-700">No testimonials yet.</p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Add quotes from attendees — even one or two make a difference.
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addRow}
            className="mt-4 gap-1.5 rounded-[22px] border-[#004ac6]/30 bg-white font-bold text-[#004ac6] hover:bg-[#e6eeff]"
          >
            <Plus className="size-3.5" strokeWidth={2.6} />
            Add the first testimonial
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
                    Testimonial {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeRow(idx)}
                    className="grid size-8 place-items-center rounded-[22px] text-red-600 hover:bg-red-50"
                    aria-label={`Remove testimonial ${idx + 1}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
                  <EventImageUploader
                    variant="generic"
                    folder="events/testimonials"
                    label="Avatar (optional)"
                    hint="Small portrait, square crop."
                    value={row.imageUrl || null}
                    onChange={(url) => updateRow(idx, 'imageUrl', url ?? '')}
                  />

                  <div className="grid gap-3">
                    <Field
                      label="Name"
                      required
                      error={rowErrors.name}
                      input={
                        <Input
                          value={row.name}
                          onChange={(e) => updateRow(idx, 'name', e.target.value)}
                          placeholder="Sujata Karki"
                          maxLength={255}
                          aria-invalid={!!rowErrors.name}
                          className={EVENT_FORM_INPUT_CLASS}
                        />
                      }
                    />
                    <Field
                      label="Quote"
                      required
                      error={rowErrors.content}
                      input={
                        <Textarea
                          value={row.content}
                          onChange={(e) => updateRow(idx, 'content', e.target.value)}
                          placeholder="Best fireside chat I've been to in Kathmandu this year."
                          rows={4}
                          aria-invalid={!!rowErrors.content}
                          className={EVENT_FORM_INPUT_CLASS}
                        />
                      }
                    />
                  </div>
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
