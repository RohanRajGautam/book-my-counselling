'use client'

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
  }
}

export function EventSpeakerSection({ value, onChange, errors }: EventSpeakerSectionProps) {
  const update = <K extends keyof EventCreateForm['speaker']>(
    key: K,
    next: EventCreateForm['speaker'][K]
  ) => onChange({ ...value, [key]: next })

  return (
    <section className="rounded-[22px] border border-[#d9e3f6] bg-white p-5 shadow-sm sm:p-6">
      <header className="mb-5">
        <h2 className="font-headline text-lg font-extrabold tracking-tight text-slate-900">
          Featured speaker
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          All four fields are optional. Leave them blank to skip the speaker block on the
          detail page.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <EventImageUploader
          variant="generic"
          folder="events/speakers"
          label="Speaker photo"
          hint="Square crop works best. Click the area to upload."
          value={value.imageUrl || null}
          onChange={(url) => update('imageUrl', url ?? '')}
        />

        <div className="grid gap-4 sm:grid-cols-2">
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
            className="sm:col-span-2"
            input={
              <Textarea
                value={value.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Two or three sentences about the speaker."
                rows={4}
                className={EVENT_FORM_INPUT_CLASS}
              />
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
