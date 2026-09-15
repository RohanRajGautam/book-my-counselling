'use client'

import { useMemo, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import {
  extractValidationErrors,
  useUpdateAdminEvent,
} from '../../hooks/useAdminEvents'
import type { EventResponse, EventUpdatePayload } from '../../types/events.types'
import {
  validateEventSpeakerLinkedinUrl,
  type EventCreateForm,
} from '../../lib/events.validation'

import { EventSpeakerSection } from './sections/EventSpeakerSection'

interface AdminEventSpeakerTabProps {
  event: EventResponse
}

type SpeakerForm = EventCreateForm['speaker']

function buildForm(event: EventResponse): SpeakerForm {
  return {
    name: event.speaker_name ?? '',
    title: event.speaker_title ?? '',
    description: event.speaker_description ?? '',
    imageUrl: event.speaker_image_url ?? '',
    linkedinUrl: event.speaker_linkedin_url ?? '',
  }
}

export function AdminEventSpeakerTab({ event }: AdminEventSpeakerTabProps) {
  const [form, setForm] = useState<SpeakerForm>(() => buildForm(event))
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  const { mutate, isPending } = useUpdateAdminEvent(event.id)

  const errors = useMemo(() => validateSpeakerForm(form), [form])

  const showError = (key: keyof SpeakerForm): string | undefined => {
    if (submitAttempted) {
      const client = errors.find((e) => e.field === key)
      if (client) return client.message
    }
    return serverErrors[key]
  }

  const submit = () => {
    const payload = buildPayload(form, event)
    mutate(payload, {
      onSuccess: () => toast.success('Speaker saved.'),
      onError: (err) => {
        const serverErrors = extractValidationErrors(err)
        if (Object.keys(serverErrors).length > 0) {
          setServerErrors(serverErrors)
          toast.error('Server rejected some fields.')
        } else {
          toast.error('Failed to save. Please try again.')
        }
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
    submit()
  }

  const handleClearLinkedin = () => {
    setForm((prev) => ({ ...prev, linkedinUrl: '' }))
    // If the event already has a stored URL, a separate save would send
    // `null` to clear it. Until then, this just clears the visible field.
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <EventSpeakerSection
        value={form}
        onChange={setForm}
        onClearLinkedin={handleClearLinkedin}
        errors={{
          name: showError('name'),
          title: showError('title'),
          description: showError('description'),
          imageUrl: showError('imageUrl'),
          linkedinUrl: showError('linkedinUrl'),
        }}
      />

      <div className="flex items-center justify-end gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="gap-1.5 rounded-[22px] bg-[#0755d8] px-5 py-3 font-bold text-white shadow-sm hover:bg-blue-700"
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" strokeWidth={2.4} />}
          {isPending ? 'Saving…' : 'Save speaker'}
        </Button>
      </div>
    </form>
  )
}

// ── Validation + payload ─────────────────────────────────────────────────

interface ValidationError {
  field: keyof SpeakerForm
  message: string
}

function validateSpeakerForm(form: SpeakerForm): ValidationError[] {
  const errors: ValidationError[] = []
  const name = form.name.trim()
  const title = form.title.trim()
  const description = form.description.trim()
  if (name.length > 255)
    errors.push({ field: 'name', message: 'Speaker name must be 255 characters or fewer.' })
  if (title.length > 255)
    errors.push({ field: 'title', message: 'Speaker title must be 255 characters or fewer.' })
  if (description.length > 2000)
    errors.push({
      field: 'description',
      message: 'Speaker description must be 2000 characters or fewer.',
    })
  const linkedinError = validateEventSpeakerLinkedinUrl(form.linkedinUrl)
  if (linkedinError) errors.push({ field: 'linkedinUrl', message: linkedinError })
  if (name && !title && !description) {
    errors.push({
      field: 'title',
      message: 'Add a speaker title or description.',
    })
  }
  return errors
}

function buildPayload(form: SpeakerForm, current: EventResponse): EventUpdatePayload {
  const payload: EventUpdatePayload = {}
  const trim = (val: string) => val.trim()

  const nameVal = trim(form.name)
  const currentName = current.speaker_name ?? ''
  if (nameVal !== currentName) payload.speaker_name = nameVal || null

  const titleVal = trim(form.title)
  const currentTitle = current.speaker_title ?? ''
  if (titleVal !== currentTitle) payload.speaker_title = titleVal || null

  const descVal = trim(form.description)
  const currentDesc = current.speaker_description ?? ''
  if (descVal !== currentDesc) payload.speaker_description = descVal || null

  const imageVal = trim(form.imageUrl)
  const currentImage = current.speaker_image_url ?? ''
  if (imageVal !== currentImage) payload.speaker_image_url = imageVal || null

  const linkedinVal = trim(form.linkedinUrl)
  const currentLinkedin = current.speaker_linkedin_url ?? ''
  if (linkedinVal !== currentLinkedin) payload.speaker_linkedin_url = linkedinVal || null

  return payload
}
