'use client'

import { FaLinkedin } from 'react-icons/fa'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { EVENT_FORM_INPUT_CLASS } from '../../../lib/events.constants'
import type { EventCreateForm } from '../../../lib/events.validation'

import { EventImageUploader } from '../EventImageUploader'

interface EventSpeakerSectionProps {
  value: EventCreateForm['speaker']
  onChange: (next: EventCreateForm['speaker']) => void
  errors: {
    name?: string
    title?: string
    description?: string
    imageUrl?: string
    linkedinUrl?: string
  }
  /** Optional — when provided, renders a "Clear" button next to the LinkedIn
   *  input. Used by the admin detail tab so the stored URL can be wiped. */
  onClearLinkedin?: () => void
}

export function EventSpeakerSection({
  value,
  onChange,
  errors,
  onClearLinkedin,
}: EventSpeakerSectionProps) {
  const update = <K extends keyof EventCreateForm['speaker']>(
    key: K,
    next: EventCreateForm['speaker'][K]
  ) => onChange({ ...value, [key]: next })

  return (
    <section className="rounded-[22px] border border-[#d9e3f6] bg-white p-5 shadow-sm sm:p-6">
      <header className="mb-3">
        <h2 className="font-headline text-lg font-extrabold tracking-tight text-slate-900">
          Featured speaker
        </h2>
        <p className="my-2 text-sm font-medium text-slate-500">
          All five fields are optional. Leave them blank to skip the speaker block on the detail
          page.
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-[180px_minmax(0,1fr)]">
        <EventImageUploader
          variant="generic"
          folder="events/speakers"
          label="Speaker photo"
          value={value.imageUrl || null}
          onChange={(url) => update('imageUrl', url ?? '')}
        />

        <div className="grid gap-x-4 gap-y-0 sm:grid-cols-2">
          <Field
            label="Name"
            error={errors.name}
            input={
              <Input
                value={value.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Nirmal Thapa"
                maxLength={255}
                className={EVENT_FORM_INPUT_CLASS}
              />
            }
          />
          <Field
            label="Title"
            error={errors.title}
            input={
              <Input
                value={value.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="Founder, Webpoint Technology"
                maxLength={255}
                className={EVENT_FORM_INPUT_CLASS}
              />
            }
          />
          <Field
            label="Description"
            error={errors.description}
            className="my-3 sm:col-span-2"
            input={
              <Textarea
                value={value.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Two or three sentences about the speaker."
                rows={4}
                className={`${EVENT_FORM_INPUT_CLASS} h-auto`}
              />
            }
          />
          <Field
            label="LinkedIn URL"
            error={errors.linkedinUrl}
            className="sm:col-span-2"
            input={
              <div className="flex items-center gap-2">
                <span className="grid size-9 shrink-0 place-items-center rounded-[22px] bg-[#e6eeff] text-[#0a66c2]">
                  <FaLinkedin className="size-4" aria-hidden />
                </span>
                <Input
                  value={value.linkedinUrl}
                  onChange={(e) => update('linkedinUrl', e.target.value)}
                  placeholder="https://www.linkedin.com/in/username"
                  inputMode="url"
                  autoComplete="url"
                  className={`${EVENT_FORM_INPUT_CLASS} flex-1`}
                />
                {onClearLinkedin && value.linkedinUrl ? (
                  <button
                    type="button"
                    onClick={onClearLinkedin}
                    className="shrink-0 rounded-full px-3 py-1 text-xs font-bold text-slate-500 uppercase hover:bg-slate-100 hover:text-slate-700"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
            }
          />
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  error,
  input,
  className,
}: {
  label: string
  error?: string
  input: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <Label className="text-xs font-extrabold tracking-wide text-slate-700 uppercase">
        {label}
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
