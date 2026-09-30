'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import {
  useAppendEventSpeaker,
  useDeleteEventSpeaker,
  useUpdateEventSpeaker,
} from '../../hooks/useAdminEventNested'
import { EVENT_FORM_INPUT_CLASS } from '../../lib/events.constants'
import { validateEventSpeakerLinkedinUrl } from '../../lib/events.validation'
import type { EventResponse, EventSpeakerResponse } from '../../types/events.types'

import { SpeakerPhotoField } from './SpeakerPhotoField'

interface AdminEventSpeakerTabProps {
  event: EventResponse
}

type EditableSpeakerRow = {
  id: string
  name: string
  title: string
  description: string
  imageUrl: string
  linkedinUrl: string
  isNew?: boolean
}

export function AdminEventSpeakerTab({ event }: AdminEventSpeakerTabProps) {
  const sorted = useMemo(
    () => [...event.speakers].sort((a, b) => a.order_index - b.order_index),
    [event.speakers]
  )

  const [editing, setEditing] = useState<Record<string, EditableSpeakerRow>>({})

  const append = useAppendEventSpeaker(event.id)
  const update = useUpdateEventSpeaker(event.id)
  const remove = useDeleteEventSpeaker(event.id)

  const startNew = () => {
    const id = `new-${Date.now()}`
    setEditing((prev) => ({
      ...prev,
      [id]: {
        id,
        name: '',
        title: '',
        description: '',
        imageUrl: '',
        linkedinUrl: '',
        isNew: true,
      },
    }))
  }

  const startEdit = (row: EventSpeakerResponse) => {
    setEditing((prev) => ({
      ...prev,
      [row.id]: {
        id: row.id,
        name: row.name,
        title: row.title ?? '',
        description: row.description ?? '',
        imageUrl: row.image_url ?? '',
        linkedinUrl: row.linkedin_url ?? '',
      },
    }))
  }

  const cancelEdit = (id: string) =>
    setEditing((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })

  const saveEdit = (row: EditableSpeakerRow) => {
    const payload = diffSpeakerPayload(row, findSpeakerById(sorted, row.id))
    if (Object.keys(payload).length === 0) {
      // Nothing to send — just close the edit card.
      cancelEdit(row.id)
      return
    }
    update.mutate(
      { speakerId: row.id, payload },
      {
        onSuccess: () => cancelEdit(row.id),
        onError: (err) => {
          toast.error(humanizeSpeakerError(err))
        },
      }
    )
  }

  const saveNew = (row: EditableSpeakerRow) => {
    const name = row.name.trim()
    if (!name) {
      toast.error('Speaker name is required.')
      return
    }
    append.mutate(
      {
        name,
        title: row.title.trim() || null,
        description: row.description.trim() || null,
        image_url: row.imageUrl.trim() || null,
        linkedin_url: row.linkedinUrl.trim() || null,
        order_index: sorted.length,
      },
      {
        onSuccess: () => cancelEdit(row.id),
        onError: (err) => {
          toast.error(humanizeSpeakerError(err))
        },
      }
    )
  }

  const handleMove = (row: EventSpeakerResponse, dir: -1 | 1) => {
    const idx = sorted.findIndex((s) => s.id === row.id)
    const target = idx + dir
    if (target < 0 || target >= sorted.length) return
    const neighbour = sorted[target]
    if (!neighbour) return

    // Optimistically reflect the swap in the local edit drafts so the user
    // sees immediate feedback; the two PATCHes will land in the background.
    update.mutate({ speakerId: row.id, payload: { order_index: neighbour.order_index } })
    update.mutate({ speakerId: neighbour.id, payload: { order_index: row.order_index } })
  }

  const handleDelete = (row: EventSpeakerResponse) => {
    remove.mutate(row.id)
  }

  return (
    <section className="rounded-[22px] border border-[#d9e3f6] bg-white p-5 shadow-sm sm:p-6">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-headline text-lg font-extrabold tracking-tight text-slate-900">
            Speakers
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Each speaker renders as a card on the event page. Use the arrows to reorder.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={startNew}
          className="gap-1.5 rounded-[22px] border-[#004ac6]/30 bg-[#e6eeff] font-bold text-[#004ac6] hover:bg-[#dbe6ff]"
        >
          <Plus className="size-3.5" strokeWidth={2.6} />
          Add speaker
        </Button>
      </header>

      {sorted.length === 0 && Object.keys(editing).length === 0 ? (
        <EmptyState onAdd={startNew} />
      ) : (
        <ol className="space-y-3">
          {sorted.map((row, idx) => {
            const draft = editing[row.id]
            if (draft) {
              return (
                <li key={row.id}>
                  <EditCard
                    row={draft}
                    onChange={(next) => setEditing((prev) => ({ ...prev, [row.id]: next }))}
                    onSave={() => saveEdit(draft)}
                    onCancel={() => cancelEdit(row.id)}
                    isSaving={update.isPending}
                    index={idx + 1}
                  />
                </li>
              )
            }
            return (
              <li
                key={row.id}
                className="flex items-start gap-4 rounded-[22px] border border-[#eff4ff] bg-[#f8f9ff] p-4 shadow-sm sm:p-5"
              >
                <SpeakerAvatar imageUrl={row.image_url} name={row.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="font-headline text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
                      {row.name}
                    </p>
                    {row.linkedin_url ? (
                      <a
                        href={row.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${row.name} on LinkedIn`}
                        className="inline-flex size-6 items-center justify-center rounded-full bg-[#e6eeff] text-[#0a66c2] transition hover:bg-[#0a66c2] hover:text-white"
                      >
                        <FaLinkedin className="size-3" aria-hidden />
                      </a>
                    ) : null}
                  </div>
                  {row.title ? (
                    <p className="mt-0.5 text-xs font-bold text-[#004ac6] sm:text-sm">
                      {row.title}
                    </p>
                  ) : null}
                  {row.description ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                      {row.description}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(row, -1)}
                    disabled={idx === 0}
                    className="grid size-8 place-items-center rounded-[22px] text-slate-500 hover:bg-white disabled:opacity-40"
                    aria-label={`Move ${row.name} up`}
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(row, 1)}
                    disabled={idx === sorted.length - 1}
                    className="grid size-8 place-items-center rounded-[22px] text-slate-500 hover:bg-white disabled:opacity-40"
                    aria-label={`Move ${row.name} down`}
                  >
                    <ArrowDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(row)}
                    className="grid size-8 place-items-center rounded-[22px] text-slate-500 hover:bg-white"
                    aria-label={`Edit ${row.name}`}
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(row)}
                    disabled={remove.isPending}
                    className="grid size-8 place-items-center rounded-[22px] text-red-600 hover:bg-red-50"
                    aria-label={`Remove ${row.name}`}
                  >
                    {remove.isPending && remove.variables === row.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </button>
                </div>
              </li>
            )
          })}
          {Object.values(editing)
            .filter((row) => row.isNew)
            .map((row) => (
              <li key={row.id}>
                <EditCard
                  row={row}
                  onChange={(next) => setEditing((prev) => ({ ...prev, [row.id]: next }))}
                  onSave={() => saveNew(row)}
                  onCancel={() => cancelEdit(row.id)}
                  isSaving={append.isPending}
                  index={sorted.length + 1}
                />
              </li>
            ))}
        </ol>
      )}
    </section>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────

function SpeakerAvatar({ imageUrl, name }: { imageUrl: string | null; name: string }) {
  const initials = (name || '?').charAt(0).toUpperCase()
  if (imageUrl) {
    return (
      <div className="relative size-12 shrink-0 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#eef4ff] via-[#dbe6ff] to-white shadow-[0_12px_28px_rgba(0,74,198,0.12)] ring-2 ring-white sm:size-14">
        <Image src={imageUrl} alt={name} fill sizes="56px" className="object-cover" />
      </div>
    )
  }
  return (
    <div className="font-headline grid size-12 shrink-0 place-items-center rounded-[22px] bg-gradient-to-br from-[#eef4ff] via-[#dbe6ff] to-white text-base font-extrabold text-[#004ac6]/40 shadow-[0_12px_28px_rgba(0,74,198,0.12)] ring-2 ring-white sm:size-14 sm:text-lg">
      {initials}
    </div>
  )
}

function EditCard({
  row,
  onChange,
  onSave,
  onCancel,
  isSaving,
  index,
}: {
  row: EditableSpeakerRow
  onChange: (next: EditableSpeakerRow) => void
  onSave: () => void
  onCancel: () => void
  isSaving: boolean
  index: number
}) {
  const linkedinError = validateEventSpeakerLinkedinUrl(row.linkedinUrl)
  const trimmedName = row.name.trim()
  const hasAnyOther =
    row.title.trim() || row.description.trim() || row.imageUrl.trim() || row.linkedinUrl.trim()
  const nameError = !trimmedName && row.name.length > 0 ? 'Speaker name is required.' : null
  const missingFieldsError =
    trimmedName && !hasAnyOther ? 'Add a title, description, image, or LinkedIn URL.' : null

  const canSave = !isSaving && trimmedName.length > 0 && !linkedinError && !missingFieldsError

  return (
    <div className="rounded-[22px] border border-[#c9d7f4] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-slate-500 uppercase">
          <span className="grid size-7 place-items-center rounded-full bg-[#004ac6] text-[11px] font-extrabold text-white">
            {index}
          </span>
          {row.isNew ? 'New speaker' : 'Editing'}
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="grid size-8 place-items-center rounded-[22px] text-slate-500 hover:bg-slate-100"
          aria-label="Cancel"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)]">
        <div>
          <SpeakerPhotoField
            value={row.imageUrl.trim() ? row.imageUrl : null}
            name={row.name}
            onChange={(url) => onChange({ ...row, imageUrl: url ?? '' })}
            allowRemove={false}
          />
        </div>
        <div className="grid gap-x-4 gap-y-0 sm:grid-cols-2">
          <Field
            label="Name"
            required
            error={nameError ?? undefined}
            input={
              <Input
                value={row.name}
                onChange={(e) => onChange({ ...row, name: e.target.value })}
                placeholder="Nirmal Thapa"
                maxLength={255}
                aria-invalid={!!nameError}
                className={EVENT_FORM_INPUT_CLASS}
              />
            }
          />
          <Field
            label="Title"
            input={
              <Input
                value={row.title}
                onChange={(e) => onChange({ ...row, title: e.target.value })}
                placeholder="Founder, Webpoint Technology"
                maxLength={255}
                className={EVENT_FORM_INPUT_CLASS}
              />
            }
          />
          <Field
            label="Description"
            className="my-3 sm:col-span-2"
            input={
              <Textarea
                value={row.description}
                onChange={(e) => onChange({ ...row, description: e.target.value })}
                placeholder="Two or three sentences about the speaker."
                rows={4}
                className={`${EVENT_FORM_INPUT_CLASS} h-auto`}
              />
            }
          />
          <Field
            label="LinkedIn URL"
            error={linkedinError ?? missingFieldsError ?? undefined}
            className="sm:col-span-2"
            input={
              <div className="flex items-center gap-2">
                <span className="grid size-9 shrink-0 place-items-center rounded-[22px] bg-[#e6eeff] text-[#0a66c2]">
                  <FaLinkedin className="size-4" aria-hidden />
                </span>
                <Input
                  value={row.linkedinUrl}
                  onChange={(e) => onChange({ ...row, linkedinUrl: e.target.value })}
                  placeholder="https://www.linkedin.com/in/username"
                  inputMode="url"
                  autoComplete="url"
                  aria-invalid={!!linkedinError || !!missingFieldsError}
                  className={`${EVENT_FORM_INPUT_CLASS} flex-1`}
                />
              </div>
            }
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="rounded-[22px] border-slate-300 text-slate-700"
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onSave}
          disabled={!canSave}
          className="gap-1.5 rounded-[22px] bg-[#0755d8] font-bold text-white hover:bg-blue-700"
        >
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
          {row.isNew ? 'Add speaker' : 'Save'}
        </Button>
      </div>
    </div>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-[22px] border border-dashed border-[#c9d7f4] bg-[#f8f9ff] p-8 text-center">
      <p className="text-sm font-bold text-slate-700">No speakers yet.</p>
      <p className="mt-1 text-xs font-medium text-slate-500">
        Add the people taking the stage — they&rsquo;ll render as cards on the event page.
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

// ── Helpers ─────────────────────────────────────────────────────────────

function findSpeakerById(
  sorted: EventSpeakerResponse[],
  id: string
): EventSpeakerResponse | undefined {
  return sorted.find((s) => s.id === id)
}

/**
 * Build a minimal PATCH payload — only ship fields that actually changed.
 * A field that was non-empty and is now empty becomes null so the server
 * clears it.
 */
function diffSpeakerPayload(
  next: EditableSpeakerRow,
  current: EventSpeakerResponse | undefined
): Record<string, string | number | null> {
  if (!current) return {}
  const out: Record<string, string | number | null> = {}
  const name = next.name.trim()
  if (name !== current.name) out.name = name

  const title = next.title.trim()
  if ((title || null) !== (current.title ?? null)) out.title = title || null

  const description = next.description.trim()
  if ((description || null) !== (current.description ?? null)) {
    out.description = description || null
  }

  const image = next.imageUrl.trim()
  if ((image || null) !== (current.image_url ?? null)) {
    out.image_url = image || null
  }

  const linkedin = next.linkedinUrl.trim()
  if ((linkedin || null) !== (current.linkedin_url ?? null)) {
    out.linkedin_url = linkedin || null
  }

  return out
}

/** Best-effort error extraction — keep the toast short. */
function humanizeSpeakerError(err: unknown): string {
  if (err && typeof err === 'object') {
    const e = err as { response?: { data?: { detail?: unknown } } }
    const detail = e.response?.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0]
      if (
        first &&
        typeof first === 'object' &&
        'message' in first &&
        typeof (first as { message?: unknown }).message === 'string'
      ) {
        return (first as { message: string }).message
      }
    }
  }
  return 'Failed to save speaker.'
}
