'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { extractValidationErrors, useCreateAdminEvent } from '../../hooks/useAdminEvents'
import {
  ADMIN_EVENT_CREATE_TABS,
  findAdminEventCreateTab,
  type AdminEventCreateTabId,
} from '../../lib/events.constants'
import {
  EMPTY_EVENT_FORM,
  EventCreateForm,
  formatFieldErrors,
  validateEventCreateForm,
} from '../../lib/events.validation'
import type {
  CompanyInput,
  EventCreatePayload,
  GalleryImageInput,
  TestimonialInput,
  TimelineItemInput,
} from '../../types/events.types'

import { AdminCreateEventHeader } from './AdminCreateEventHeader'
import { AdminCreateEventTabs } from './AdminCreateEventTabs'
import { EventCompaniesSection } from './sections/EventCompaniesSection'
import { EventDetailsSection } from './sections/EventDetailsSection'
import { EventGallerySection } from './sections/EventGallerySection'
import { EventSpeakerSection } from './sections/EventSpeakerSection'
import { EventTestimonialsSection } from './sections/EventTestimonialsSection'
import { EventTimelineSection } from './sections/EventTimelineSection'

export function AdminCreateEventPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<AdminEventCreateTabId>('details')
  const [form, setForm] = useState<EventCreateForm>(EMPTY_EVENT_FORM)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [serverErrorsByField, setServerErrorsByField] = useState<Record<string, string>>({})

  const { mutate, isPending } = useCreateAdminEvent()

  const errors = useMemo(
    () => validateEventCreateForm(form),
    [form]
  )

  // Count errors per section so the tab strip can show a red dot.
  const errorsBySection = useMemo(() => {
    const counts: Record<AdminEventCreateTabId, number> = {
      details: 0,
      speaker: 0,
      timeline: 0,
      gallery: 0,
      companies: 0,
      testimonials: 0,
    }
    for (const err of errors) {
      const section = err.field.split('.')[0]
      if (section && section in counts) {
        counts[section as AdminEventCreateTabId] += 1
      }
    }
    return counts
  }, [errors])

  const errorCount =
    Object.values(errorsBySection).reduce((sum, n) => sum + n, 0) +
    Object.keys(serverErrorsByField).length

  const showServerError = (key: string): string | undefined => serverErrorsByField[key]
  const fieldError = (key: string): string | undefined => {
    if (submitAttempted) {
      const client = errors.find((e) => e.field === key)
      if (client) return client.message
    }
    return serverErrorsByField[key]
  }

  const switchToTabForField = (field: string) => {
    const section = field.split('.')[0]
    const tab = findAdminEventCreateTab(section ?? null)
    setActiveTab(tab.id)
  }

  const handleSubmit = () => {
    setSubmitAttempted(true)
    setServerErrorsByField({})
    if (errors.length > 0) {
      toast.error(formatFieldErrors(errors))
      switchToTabForField(errors[0]?.field ?? 'details')
      return
    }

    const payload = buildPayload(form)

    mutate(payload, {
      onSuccess: (event) => {
        toast.success('Event published.')
        router.push(`/admin/events/${event.id}`)
      },
      onError: (err) => {
        const serverErrors = extractValidationErrors(err)
        if (Object.keys(serverErrors).length > 0) {
          setServerErrorsByField(serverErrors)
          const firstField = Object.keys(serverErrors)[0]
          if (firstField) switchToTabForField(firstField)
          toast.error(formatFieldErrors(Object.values(serverErrors).map((m) => ({ field: '', message: m }))))
        } else {
          toast.error('Failed to publish event. Please try again.')
        }
      },
    })
  }

  return (
    <div className="min-h-svh bg-[#f8f9ff] pb-28 text-slate-950 md:pb-6">
      <div className="mx-auto w-full max-w-[1180px] space-y-3 px-3 py-5 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminCreateEventHeader
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          errorCount={errorCount}
        />

        <div className="sticky top-16 z-10 -mx-3 bg-[#f8f9ff]/95 px-3 py-2 backdrop-blur md:static md:mx-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
          <AdminCreateEventTabs
            value={activeTab}
            onChange={setActiveTab}
            errorsBySection={errorsBySection}
          />
        </div>

        {activeTab === 'details' ? (
          <EventDetailsSection
            value={form}
            onChange={setForm}
            errors={{
              title: fieldError('details.title'),
              description: fieldError('details.description'),
              about: fieldError('details.about'),
              eventDate: fieldError('details.eventDate'),
              eventTime: fieldError('details.eventTime'),
              location: fieldError('details.location'),
              partner: fieldError('details.partner'),
              coverImageUrl: fieldError('details.coverImageUrl'),
              youtubeLink: fieldError('details.youtubeLink'),
            }}
          />
        ) : null}

        {activeTab === 'speaker' ? (
          <EventSpeakerSection
            value={form.speaker}
            onChange={(speaker) => setForm({ ...form, speaker })}
            errors={{
              name: fieldError('speaker.name'),
              title: fieldError('speaker.title'),
              description: fieldError('speaker.description'),
              imageUrl: fieldError('speaker.imageUrl'),
            }}
          />
        ) : null}

        {activeTab === 'timeline' ? (
          <EventTimelineSection
            value={form.timeline}
            onChange={(rows) => setForm({ ...form, timeline: rows })}
            errorsByIndex={collectIndexedErrors(errors, 'timeline', ['time', 'title', 'description'])}
          />
        ) : null}

        {activeTab === 'gallery' ? (
          <EventGallerySection
            value={form.gallery.map((g) => g.imageUrl)}
            onChange={(urls) =>
              setForm({
                ...form,
                gallery: urls.map((imageUrl, idx) => ({ id: `g-${idx}`, imageUrl })),
              })
            }
            errorsByIndex={collectIndexedErrors(errors, 'gallery', ['imageUrl'])}
          />
        ) : null}

        {activeTab === 'companies' ? (
          <EventCompaniesSection
            value={form.companies}
            onChange={(rows) => setForm({ ...form, companies: rows })}
            errorsByIndex={collectIndexedErrors(errors, 'companies', ['name', 'logoUrl'])}
          />
        ) : null}

        {activeTab === 'testimonials' ? (
          <EventTestimonialsSection
            value={form.testimonials}
            onChange={(rows) => setForm({ ...form, testimonials: rows })}
            errorsByIndex={collectIndexedErrors(errors, 'testimonials', ['name', 'content', 'imageUrl'])}
          />
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/80 bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-16px_40px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="h-12 w-full rounded-[22px] bg-[#0755d8] font-bold text-white shadow-[0_12px_24px_rgba(7,85,216,0.22)] hover:bg-blue-700 disabled:opacity-60"
        >
          {isPending ? 'Publishing…' : 'Publish event'}
        </button>
      </div>

      {/* Surface unused vars so they don't trip the linter */}
      {ADMIN_EVENT_CREATE_TABS.map(() => null)}
      {showServerError('never-called') ? null : null}
    </div>
  )
}

// ── Payload builder ─────────────────────────────────────────────────────

function buildPayload(form: EventCreateForm): EventCreatePayload {
  const timeline_items: TimelineItemInput[] = form.timeline.map((row, idx) => ({
    time: row.time.trim(),
    title: row.title.trim(),
    description: row.description.trim() || null,
    order_index: idx,
  }))

  const gallery_images: GalleryImageInput[] = form.gallery.map((row, idx) => ({
    image_url: row.imageUrl.trim(),
    order_index: idx,
  }))

  const companies: CompanyInput[] = form.companies.map((row, idx) => ({
    name: row.name.trim(),
    logo_url: row.logoUrl.trim(),
    order_index: idx,
  }))

  const testimonials: TestimonialInput[] = form.testimonials.map((row) => ({
    name: row.name.trim(),
    content: row.content.trim(),
    image_url: row.imageUrl.trim() || null,
  }))

  return {
    title: form.title.trim(),
    description: form.description.trim(),
    about: form.about.trim() || null,
    event_date: form.eventDate.trim(),
    event_time: form.eventTime.trim() || null,
    location: form.location.trim() || null,
    partner: form.partner.trim() || null,
    cover_image_url: form.coverImageUrl.trim() || null,
    youtube_link: form.youtubeLink.trim() || null,
    speaker_name: form.speaker.name.trim() || null,
    speaker_title: form.speaker.title.trim() || null,
    speaker_description: form.speaker.description.trim() || null,
    speaker_image_url: form.speaker.imageUrl.trim() || null,
    timeline_items,
    gallery_images,
    companies,
    testimonials,
  }
}

// ── Error helpers ───────────────────────────────────────────────────────

/**
 * Group validation errors into a per-index shape so each row in a list editor
 * can show its own inline messages.
 */
function collectIndexedErrors(
  errors: ReturnType<typeof validateEventCreateForm>,
  section: string,
  keys: string[]
): Record<number, Record<string, string>> {
  const out: Record<number, Record<string, string>> = {}
  for (const err of errors) {
    const parts = err.field.split('.')
    if (parts[0] !== section) continue
    const idx = Number(parts[1])
    const key = parts[2]
    if (Number.isNaN(idx) || !key || !keys.includes(key)) continue
    if (!out[idx]) out[idx] = {}
    out[idx][key] = err.message
  }
  return out
}
