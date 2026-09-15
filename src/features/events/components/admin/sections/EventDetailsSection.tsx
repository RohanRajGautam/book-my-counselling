'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { EVENT_FORM_INPUT_CLASS } from '../../../lib/events.constants'
import type { EventCreateForm } from '../../../lib/events.validation'

import { EventImageUploader } from '../EventImageUploader'

interface EventDetailsSectionProps {
  value: EventCreateForm
  onChange: (next: EventCreateForm) => void
  errors: {
    title?: string
    description?: string
    about?: string
    eventDate?: string
    eventTime?: string
    location?: string
    partner?: string
    coverImageUrl?: string
    youtubeLink?: string
  }
}

export function EventDetailsSection({ value, onChange, errors }: EventDetailsSectionProps) {
  const update = <K extends keyof EventCreateForm>(key: K, next: EventCreateForm[K]) =>
    onChange({ ...value, [key]: next })

  return (
    <div className="space-y-6">
      <Section title="The essentials" subtitle="The bits visitors see first on the listing card.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Event title"
            required
            error={errors.title}
            input={
              <Input
                value={value.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="BYC × Webpoint Fireside Chat"
                maxLength={255}
                aria-invalid={!!errors.title}
                className={EVENT_FORM_INPUT_CLASS}
              />
            }
          />
          <Field
            label="Event date"
            required
            error={errors.eventDate}
            input={
              <Input
                type="date"
                value={value.eventDate}
                onChange={(e) => update('eventDate', e.target.value)}
                aria-invalid={!!errors.eventDate}
                className={EVENT_FORM_INPUT_CLASS}
              />
            }
          />
          <Field
            label="Short description"
            required
            error={errors.description}
            className="sm:col-span-2"
            input={
              <Textarea
                value={value.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="One or two sentences — what this event is and why it matters."
                rows={3}
                aria-invalid={!!errors.description}
                className={EVENT_FORM_INPUT_CLASS}
              />
            }
          />
          <Field
            label="Event time"
            error={errors.eventTime}
            input={
              <Input
                value={value.eventTime}
                onChange={(e) => update('eventTime', e.target.value)}
                placeholder="6:00 PM"
                maxLength={50}
                className={EVENT_FORM_INPUT_CLASS}
              />
            }
          />
          <Field
            label="Location"
            error={errors.location}
            input={
              <Input
                value={value.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="Melung Thakali Kitchen, Kathmandu"
                maxLength={500}
                className={EVENT_FORM_INPUT_CLASS}
              />
            }
          />
          <Field
            label="Partner"
            error={errors.partner}
            input={
              <Input
                value={value.partner}
                onChange={(e) => update('partner', e.target.value)}
                placeholder="Webpoint Technology"
                maxLength={255}
                className={EVENT_FORM_INPUT_CLASS}
              />
            }
          />
          <Field
            label="YouTube link"
            error={errors.youtubeLink}
            input={
              <Input
                type="url"
                value={value.youtubeLink}
                onChange={(e) => update('youtubeLink', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=…"
                className={EVENT_FORM_INPUT_CLASS}
              />
            }
          />
        </div>
      </Section>

      <Section
        title="Cover image"
        subtitle="Click the area to upload. 16:9 works best on the listing card and detail banner."
      >
        <div className="mx-auto max-w-md">
          <EventImageUploader
            variant="cover"
            value={value.coverImageUrl || null}
            onChange={(url) => update('coverImageUrl', url ?? '')}
          />
        </div>
      </Section>

      <Section
        title="About this event"
        subtitle="Longer body copy. Renders as paragraphs on the detail page."
      >
        <Field
          label=""
          error={errors.about}
          input={
            <Textarea
              value={value.about}
              onChange={(e) => update('about', e.target.value)}
              placeholder="A few paragraphs about the gathering, what to expect, and who it's for."
              rows={6}
              className={`${EVENT_FORM_INPUT_CLASS} h-auto min-h-[200px] max-h-[420px] overflow-y-auto py-3 leading-6`}
            />
          }
        />
      </Section>
    </div>
  )
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-[22px] border border-[#d9e3f6] bg-white p-5 shadow-sm sm:p-6">
      <header className="mb-5">
        <h2 className="font-headline text-lg font-extrabold tracking-tight text-slate-900">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>
        ) : null}
      </header>
      {children}
    </section>
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
      {label ? (
        <Label className="text-xs font-extrabold tracking-wide text-slate-700 uppercase">
          {label}
          {required ? <span className="ml-1 text-red-600">*</span> : null}
        </Label>
      ) : null}
      <div className="mt-1.5">{input}</div>
      {error ? (
        <p className="mt-1.5 text-xs font-semibold text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
