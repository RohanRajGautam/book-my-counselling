'use client'

import axios from 'axios'
import { useMemo, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import {
  extractValidationErrors,
  useUpdateAdminEvent,
} from '../../hooks/useAdminEvents'
import { EVENT_FORM_INPUT_CLASS } from '../../lib/events.constants'
import {
  validateEventSlug,
} from '../../lib/events.validation'
import type { EventResponse, EventUpdatePayload } from '../../types/events.types'

import { EventImageUploader } from './EventImageUploader'

interface AdminEventDetailsTabProps {
  event: EventResponse
}

interface OverviewForm {
  slug: string
  title: string
  description: string
  about: string
  eventDate: string
  eventTime: string
  location: string
  partner: string
  coverImageUrl: string
  youtubeLink: string
}

function buildForm(event: EventResponse): OverviewForm {
  return {
    slug: event.slug,
    title: event.title,
    description: event.description,
    about: event.about ?? '',
    eventDate: event.event_date,
    eventTime: event.event_time ?? '',
    location: event.location ?? '',
    partner: event.partner ?? '',
    coverImageUrl: event.cover_image_url ?? '',
    youtubeLink: event.youtube_link ?? '',
  }
}

export function AdminEventDetailsTab({ event }: AdminEventDetailsTabProps) {
  const [form, setForm] = useState<OverviewForm>(() => buildForm(event))
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  const [confirmSlugRepoint, setConfirmSlugRepoint] = useState(false)
  const { mutate, isPending } = useUpdateAdminEvent(event.id)

  const errors = useMemo(() => validateOverviewForm(form), [form])
  const update = <K extends keyof OverviewForm>(key: K, next: OverviewForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: next }))

  const showError = (key: keyof OverviewForm): string | undefined => {
    if (submitAttempted) {
      const client = errors.find((e) => e.field === key)
      if (client) return client.message
    }
    return serverErrors[key]
  }

  const slugChanged = form.slug.trim() !== event.slug
  const slugPreviewPath = form.slug.trim()
    ? `/events/${form.slug.trim()}`
    : `/events/${event.slug}`

  const submit = () => {
    const payload = buildPayload(form, event)
    mutate(payload, {
      onSuccess: () => {
        setConfirmSlugRepoint(false)
        toast.success('Event details saved.')
      },
      onError: (err) => {
        // Treat 409 on PATCH as a slug collision — surface it inline instead of a generic toast.
        if (axios.isAxiosError(err) && err.response?.status === 409) {
          const detail =
            typeof err.response.data === 'object' &&
            err.response.data &&
            'detail' in err.response.data &&
            typeof (err.response.data as { detail?: unknown }).detail === 'string'
              ? ((err.response.data as { detail: string }).detail)
              : 'This slug is already used by another event.'
          setServerErrors({ slug: detail })
          toast.error(detail)
          setConfirmSlugRepoint(false)
          return
        }
        const serverErrors = extractValidationErrors(err)
        if (Object.keys(serverErrors).length > 0) {
          setServerErrors(serverErrors)
          toast.error('Server rejected some fields.')
        } else {
          toast.error('Failed to save. Please try again.')
        }
        setConfirmSlugRepoint(false)
      },
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)
    setServerErrors({})
    if (errors.length > 0) {
      toast.error('Please fix the highlighted fields.')
      return
    }

    // Re-pointing the slug moves the public URL — confirm before sending.
    if (slugChanged) {
      setConfirmSlugRepoint(true)
      return
    }

    submit()
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <section className="rounded-[22px] border border-[#d9e3f6] bg-white p-5 shadow-sm sm:p-6">
        <header className="mb-5">
          <h2 className="font-headline text-lg font-extrabold tracking-tight text-slate-900">
            The essentials
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Past events stay editable — these fields are never locked.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="URL slug"
            required
            error={showError('slug')}
            hint={
              <span className="break-all">
                Public URL:{' '}
                <span className="font-mono text-slate-700">{slugPreviewPath}</span>
                {slugChanged ? (
                  <span className="ml-2 font-semibold text-amber-700">
                    Changing this will move the public URL — old links will stop working.
                  </span>
                ) : null}
              </span>
            }
            input={
              <Input
                value={form.slug}
                onChange={(e) => update('slug', e.target.value.toLowerCase())}
                maxLength={255}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                aria-invalid={!!showError('slug')}
                className={`${EVENT_FORM_INPUT_CLASS} font-mono`}
              />
            }
          />
          <Field
            label="Event title"
            required
            error={showError('title')}
            input={
              <Input
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                maxLength={255}
                aria-invalid={!!showError('title')}
                className={EVENT_FORM_INPUT_CLASS}
              />
            }
          />
          <Field
            label="Event date"
            required
            error={showError('eventDate')}
            input={
              <Input
                type="date"
                value={form.eventDate}
                onChange={(e) => update('eventDate', e.target.value)}
                className={EVENT_FORM_INPUT_CLASS}
              />
            }
          />
          <Field
            label="Short description"
            required
            error={showError('description')}
            className="sm:col-span-2"
            input={
              <Textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={3}
                className={EVENT_FORM_INPUT_CLASS}
              />
            }
          />
          <Field
            label="Event time"
            error={showError('eventTime')}
            input={
              <Input
                value={form.eventTime}
                onChange={(e) => update('eventTime', e.target.value)}
                maxLength={50}
                placeholder="6:00 PM"
                className={EVENT_FORM_INPUT_CLASS}
              />
            }
          />
          <Field
            label="Location"
            error={showError('location')}
            input={
              <Input
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                maxLength={500}
                className={EVENT_FORM_INPUT_CLASS}
              />
            }
          />
          <Field
            label="Partner"
            error={showError('partner')}
            input={
              <Input
                value={form.partner}
                onChange={(e) => update('partner', e.target.value)}
                maxLength={255}
                className={EVENT_FORM_INPUT_CLASS}
              />
            }
          />
          <Field
            label="YouTube link"
            error={showError('youtubeLink')}
            input={
              <Input
                type="url"
                value={form.youtubeLink}
                onChange={(e) => update('youtubeLink', e.target.value)}
                className={EVENT_FORM_INPUT_CLASS}
              />
            }
          />
        </div>
      </section>

      <section className="rounded-[22px] border border-[#d9e3f6] bg-white p-5 shadow-sm sm:p-6">
        <header className="mb-5">
          <h2 className="font-headline text-lg font-extrabold tracking-tight text-slate-900">
            Cover image
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Click the area to upload or replace. 16:9 works best.
          </p>
        </header>
        <EventImageUploader
          variant="cover"
          value={form.coverImageUrl || null}
          onChange={(url) => update('coverImageUrl', url ?? '')}
        />
      </section>

      <section className="rounded-[22px] border border-[#d9e3f6] bg-white p-5 shadow-sm sm:p-6">
        <header className="mb-5">
          <h2 className="font-headline text-lg font-extrabold tracking-tight text-slate-900">
            About this event
          </h2>
        </header>
        <Field
          label=""
          error={showError('about')}
          input={
            <Textarea
              value={form.about}
              onChange={(e) => update('about', e.target.value)}
              placeholder="A few paragraphs about the gathering."
              rows={6}
              className={`${EVENT_FORM_INPUT_CLASS} h-auto min-h-[200px] max-h-[420px] overflow-y-auto py-3 leading-6`}
            />
          }
        />
      </section>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="gap-1.5 rounded-[22px] bg-[#0755d8] px-5 py-3 font-bold text-white shadow-sm hover:bg-blue-700"
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" strokeWidth={2.4} />}
          {isPending ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>

    {confirmSlugRepoint ? (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Re-point public URL"
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4"
      >
        <div className="w-full max-w-md rounded-[22px] bg-white p-6 shadow-2xl">
          <h2 className="font-headline text-lg font-extrabold text-slate-950">
            Re-point the public URL?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            The event&rsquo;s public URL will move from{' '}
            <span className="font-mono font-bold text-slate-800">/events/{event.slug}</span> to{' '}
            <span className="font-mono font-bold text-slate-800">/events/{form.slug.trim()}</span>.
            Old links will stop working.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmSlugRepoint(false)}
              disabled={isPending}
              className="rounded-[22px]"
            >
              Cancel
            </Button>
            <Button
              onClick={submit}
              disabled={isPending}
              className="gap-1.5 rounded-[22px] bg-[#0755d8] font-bold text-white hover:bg-blue-700"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Re-point URL
            </Button>
          </div>
        </div>
      </div>
    ) : null}
  </>
  )
}

// ── Validation + payload ─────────────────────────────────────────────────

interface ValidationError {
  field: string
  message: string
}

function validateOverviewForm(form: OverviewForm): ValidationError[] {
  const errors: ValidationError[] = []
  if (!form.title.trim()) errors.push({ field: 'title', message: 'Title is required.' })
  if (form.title.trim().length > 255)
    errors.push({ field: 'title', message: 'Title must be 255 characters or fewer.' })
  if (!form.description.trim())
    errors.push({ field: 'description', message: 'Description is required.' })
  if (!form.eventDate.trim())
    errors.push({ field: 'eventDate', message: 'Event date is required.' })
  const slugError = validateEventSlug(form.slug)
  if (slugError) errors.push({ field: 'slug', message: slugError })
  if (form.youtubeLink.trim() && !isValidUrl(form.youtubeLink)) {
    errors.push({ field: 'youtubeLink', message: 'YouTube link must start with http:// or https://' })
  }
  return errors
}

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value.trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

function buildPayload(form: OverviewForm, current: EventResponse): EventUpdatePayload {
  const payload: EventUpdatePayload = {}
  const trim = (val: string) => val.trim()

  if (trim(form.slug) !== current.slug) payload.slug = trim(form.slug)
  if (trim(form.title) !== current.title) payload.title = trim(form.title)
  if (trim(form.description) !== current.description) payload.description = trim(form.description)

  const aboutVal = trim(form.about)
  const currentAbout = current.about ?? ''
  if (aboutVal !== currentAbout) payload.about = aboutVal || null

  if (trim(form.eventDate) !== current.event_date) payload.event_date = trim(form.eventDate)

  const timeVal = trim(form.eventTime)
  const currentTime = current.event_time ?? ''
  if (timeVal !== currentTime) payload.event_time = timeVal || null

  const locationVal = trim(form.location)
  const currentLocation = current.location ?? ''
  if (locationVal !== currentLocation) payload.location = locationVal || null

  const partnerVal = trim(form.partner)
  const currentPartner = current.partner ?? ''
  if (partnerVal !== currentPartner) payload.partner = partnerVal || null

  const coverVal = trim(form.coverImageUrl)
  const currentCover = current.cover_image_url ?? ''
  if (coverVal !== currentCover) payload.cover_image_url = coverVal || null

  const youtubeVal = trim(form.youtubeLink)
  const currentYoutube = current.youtube_link ?? ''
  if (youtubeVal !== currentYoutube) payload.youtube_link = youtubeVal || null

  return payload
}

// ── Tiny shared Field ────────────────────────────────────────────────────

function Field({
  label,
  required,
  error,
  hint,
  input,
  className,
}: {
  label: string
  required?: boolean
  error?: string
  hint?: React.ReactNode
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
      {hint && !error ? (
        <p className="mt-1.5 text-xs font-medium text-slate-500">{hint}</p>
      ) : null}
      {error ? (
        <p className="mt-1.5 text-xs font-semibold text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
