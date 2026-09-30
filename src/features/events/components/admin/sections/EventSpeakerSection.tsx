'use client'

import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { EVENT_FORM_INPUT_CLASS } from '../../../lib/events.constants'
import { nextLocalId } from '../../../lib/events.utils'
import type { EventFormSpeakerRow } from '../../../lib/events.validation'

import { SpeakerPhotoField } from '../SpeakerPhotoField'

interface EventSpeakerSectionProps {
  value: EventFormSpeakerRow[]
  onChange: (next: EventFormSpeakerRow[]) => void
  errorsByIndex: Record<
    number,
    {
      name?: string
      title?: string
      description?: string
      imageUrl?: string
      linkedinUrl?: string
    }
  >
}

export function EventSpeakerSection({ value, onChange, errorsByIndex }: EventSpeakerSectionProps) {
  const addRow = () => {
    onChange([
      ...value,
      {
        id: nextLocalId('sp'),
        name: '',
        title: '',
        description: '',
        imageUrl: '',
        linkedinUrl: '',
      },
    ])
  }

  const updateRow = (idx: number, key: keyof Omit<EventFormSpeakerRow, 'id'>, next: string) => {
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
            Speakers
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Add the people taking the stage. Each row becomes a card on the event page — use the
            arrows to reorder them.
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
          Add speaker
        </Button>
      </header>

      {value.length === 0 ? (
        <EmptyState onAdd={addRow} />
      ) : (
        <ol className="space-y-3">
          {value.map((row, idx) => {
            const rowErrors = errorsByIndex[idx] ?? {}
            return (
              <li
                key={row.id}
                className="rounded-[22px] border border-[#eff4ff] bg-[#f8f9ff] p-4 shadow-sm sm:p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-slate-500 uppercase">
                    <span className="grid size-7 place-items-center rounded-full bg-[#004ac6] text-[11px] font-extrabold text-white">
                      {idx + 1}
                    </span>
                    Speaker {idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                      className="grid size-8 place-items-center rounded-[22px] text-slate-500 hover:bg-white disabled:opacity-40"
                      aria-label={`Move speaker ${idx + 1} up`}
                    >
                      <ArrowUp className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(idx, 1)}
                      disabled={idx === value.length - 1}
                      className="grid size-8 place-items-center rounded-[22px] text-slate-500 hover:bg-white disabled:opacity-40"
                      aria-label={`Move speaker ${idx + 1} down`}
                    >
                      <ArrowDown className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeRow(idx)}
                      className="grid size-8 place-items-center rounded-[22px] text-red-600 hover:bg-red-50"
                      aria-label={`Remove speaker ${idx + 1}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)]">
                  <div>
                    <SpeakerPhotoField
                      value={row.imageUrl.trim() ? row.imageUrl : null}
                      name={row.name}
                      onChange={(url) => updateRow(idx, 'imageUrl', url ?? '')}
                      label="Photo"
                      hint="Square crops render as a circle on the event page."
                    />
                  </div>

                  <div className="grid gap-x-4 gap-y-0 sm:grid-cols-2">
                    <Field
                      label="Name"
                      required
                      error={rowErrors.name}
                      input={
                        <Input
                          value={row.name}
                          onChange={(e) => updateRow(idx, 'name', e.target.value)}
                          placeholder="Nirmal Thapa"
                          maxLength={255}
                          aria-invalid={!!rowErrors.name}
                          className={EVENT_FORM_INPUT_CLASS}
                        />
                      }
                    />
                    <Field
                      label="Title"
                      error={rowErrors.title}
                      input={
                        <Input
                          value={row.title}
                          onChange={(e) => updateRow(idx, 'title', e.target.value)}
                          placeholder="Founder, Webpoint Technology"
                          maxLength={255}
                          className={EVENT_FORM_INPUT_CLASS}
                        />
                      }
                    />
                    <Field
                      label="Description"
                      error={rowErrors.description}
                      className="my-3 sm:col-span-2"
                      input={
                        <Textarea
                          value={row.description}
                          onChange={(e) => updateRow(idx, 'description', e.target.value)}
                          placeholder="Two or three sentences about the speaker."
                          rows={4}
                          className={`${EVENT_FORM_INPUT_CLASS} h-auto`}
                        />
                      }
                    />
                    <Field
                      label="LinkedIn URL"
                      error={rowErrors.linkedinUrl}
                      className="sm:col-span-2"
                      input={
                        <div className="flex items-center gap-2">
                          <span className="grid size-9 shrink-0 place-items-center rounded-[22px] bg-[#e6eeff] text-[#0a66c2]">
                            <FaLinkedin className="size-4" aria-hidden />
                          </span>
                          <Input
                            value={row.linkedinUrl}
                            onChange={(e) => updateRow(idx, 'linkedinUrl', e.target.value)}
                            placeholder="https://www.linkedin.com/in/username"
                            inputMode="url"
                            autoComplete="url"
                            className={`${EVENT_FORM_INPUT_CLASS} flex-1`}
                          />
                        </div>
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

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-[22px] border border-dashed border-[#c9d7f4] bg-[#f8f9ff] p-8 text-center">
      <p className="text-sm font-bold text-slate-700">No speakers yet.</p>
      <p className="mt-1 text-xs font-medium text-slate-500">
        You can publish the event without any speakers — or add them now to feature on the detail
        page.
      </p>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={onAdd}
        className="mt-4 gap-1.5 rounded-[22px] border-[#004ac6]/30 bg-white font-bold text-[#004ac6] hover:bg-[#e6eeff]"
      >
        <Plus className="size-3.5" strokeWidth={2.6} />
        Add the first speaker
      </Button>
    </div>
  )
}

function Field({
  label,
  required,
  error,
  input,
  className,
}: {
  label: string
  required?: boolean
  error?: string
  input: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
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
