'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import {
  useAppendTestimonial,
  useDeleteTestimonial,
  useUpdateTestimonial,
} from '../../hooks/useAdminEventNested'
import { EVENT_FORM_INPUT_CLASS } from '../../lib/events.constants'
import type { TestimonialResponse } from '../../types/events.types'

import { EventImageUploader } from './EventImageUploader'

interface AdminEventTestimonialsTabProps {
  eventId: string
  testimonials: TestimonialResponse[]
}

type EditableRow = {
  id: string
  name: string
  content: string
  imageUrl: string
  isNew?: boolean
}

export function AdminEventTestimonialsTab({
  eventId,
  testimonials,
}: AdminEventTestimonialsTabProps) {
  const [editing, setEditing] = useState<Record<string, EditableRow>>({})

  const append = useAppendTestimonial(eventId)
  const update = useUpdateTestimonial(eventId)
  const remove = useDeleteTestimonial(eventId)

  const startNew = () => {
    const id = `new-${Date.now()}`
    setEditing((prev) => ({
      ...prev,
      [id]: { id, name: '', content: '', imageUrl: '', isNew: true },
    }))
  }

  const startEdit = (row: TestimonialResponse) => {
    setEditing((prev) => ({
      ...prev,
      [row.id]: {
        id: row.id,
        name: row.name,
        content: row.content,
        imageUrl: row.image_url ?? '',
      },
    }))
  }

  const cancelEdit = (id: string) =>
    setEditing((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })

  const saveEdit = (row: EditableRow) => {
    update.mutate(
      {
        testimonialId: row.id,
        payload: {
          name: row.name.trim(),
          content: row.content.trim(),
          image_url: row.imageUrl.trim() || null,
        },
      },
      { onSuccess: () => cancelEdit(row.id) }
    )
  }

  const saveNew = (row: EditableRow) => {
    append.mutate(
      {
        name: row.name.trim(),
        content: row.content.trim(),
        image_url: row.imageUrl.trim() || null,
      },
      { onSuccess: () => cancelEdit(row.id) }
    )
  }

  return (
    <section className="rounded-[22px] border border-[#d9e3f6] bg-white p-5 shadow-sm sm:p-6">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-headline text-lg font-extrabold tracking-tight text-slate-900">
            Testimonials
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Sort by creation time — add them in the order they should appear.
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
          Add testimonial
        </Button>
      </header>

      {testimonials.length === 0 && Object.keys(editing).length === 0 ? (
        <div className="rounded-[22px] border border-dashed border-[#c9d7f4] bg-[#f8f9ff] p-8 text-center">
          <p className="text-sm font-bold text-slate-700">No testimonials yet.</p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={startNew}
            className="mt-4 gap-1.5 rounded-[22px] border-[#004ac6]/30 bg-white font-bold text-[#004ac6] hover:bg-[#e6eeff]"
          >
            <Plus className="size-3.5" strokeWidth={2.6} />
            Add the first testimonial
          </Button>
        </div>
      ) : (
        <ol className="space-y-3">
          {testimonials.map((row, idx) => {
            const draft = editing[row.id]
            if (draft) {
              return (
                <li key={row.id}>
                  <EditCard
                    row={draft}
                    onChange={(next) =>
                      setEditing((prev) => ({ ...prev, [row.id]: next }))
                    }
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
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-[#e6eeff] ring-1 ring-[#c9d7f4]">
                  {row.image_url ? (
                    <Image
                      src={row.image_url}
                      alt={row.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center text-sm font-extrabold text-[#004ac6]">
                      {row.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-headline text-base font-extrabold tracking-tight text-slate-900">
                    {row.name}
                  </p>
                  <blockquote className="mt-1 text-sm leading-6 text-slate-700">
                    &ldquo;{row.content}&rdquo;
                  </blockquote>
                </div>
                <div className="flex shrink-0 items-center gap-1">
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
                    onClick={() => remove.mutate(row.id)}
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
                  onChange={(next) =>
                    setEditing((prev) => ({ ...prev, [row.id]: next }))
                  }
                  onSave={() => saveNew(row)}
                  onCancel={() => cancelEdit(row.id)}
                  isSaving={append.isPending}
                  index={testimonials.length + 1}
                />
              </li>
            ))}
        </ol>
      )}
    </section>
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
  row: EditableRow
  onChange: (next: EditableRow) => void
  onSave: () => void
  onCancel: () => void
  isSaving: boolean
  index: number
}) {
  return (
    <div className="rounded-[22px] border border-[#c9d7f4] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-slate-500 uppercase">
          <span className="grid size-7 place-items-center rounded-full bg-[#004ac6] text-[11px] font-extrabold text-white">
            {index}
          </span>
          {row.isNew ? 'New testimonial' : 'Editing'}
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
      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <EventImageUploader
          variant="generic"
          folder="events/testimonials"
          label="Avatar (optional)"
          value={row.imageUrl || null}
          onChange={(url) => onChange({ ...row, imageUrl: url ?? '' })}
        />
        <div className="grid gap-3">
          <Field
            label="Name"
            input={
              <Input
                value={row.name}
                onChange={(e) => onChange({ ...row, name: e.target.value })}
                maxLength={255}
                placeholder="Sujata Karki"
                className={EVENT_FORM_INPUT_CLASS}
              />
            }
          />
          <Field
            label="Quote"
            input={
              <Textarea
                value={row.content}
                onChange={(e) => onChange({ ...row, content: e.target.value })}
                rows={4}
                className={EVENT_FORM_INPUT_CLASS}
              />
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
          disabled={isSaving || !row.name.trim() || !row.content.trim()}
          className="gap-1.5 rounded-[22px] bg-[#0755d8] font-bold text-white hover:bg-blue-700"
        >
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
          {row.isNew ? 'Add testimonial' : 'Save'}
        </Button>
      </div>
    </div>
  )
}

function Field({
  label,
  input,
}: {
  label: string
  input: React.ReactNode
}) {
  return (
    <div>
      <Label className="text-xs font-extrabold tracking-wide text-slate-700 uppercase">
        {label}
      </Label>
      <div className="mt-1.5">{input}</div>
    </div>
  )
}
