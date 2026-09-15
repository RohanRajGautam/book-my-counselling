'use client'

import { useState } from 'react'
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import {
  useAppendTimelineItem,
  useDeleteTimelineItem,
  useUpdateTimelineItem,
} from '../../hooks/useAdminEventNested'
import { EVENT_FORM_INPUT_CLASS } from '../../lib/events.constants'
import type { TimelineItemResponse } from '../../types/events.types'

interface AdminEventTimelineTabProps {
  eventId: string
  items: TimelineItemResponse[]
}

type EditableRow = {
  id: string
  time: string
  title: string
  description: string
  /** True when this row is brand-new and hasn't been POSTed yet. */
  isNew?: boolean
  /** True while the PATCH is in flight. */
  isSaving?: boolean
}

export function AdminEventTimelineTab({ eventId, items }: AdminEventTimelineTabProps) {
  const sorted = [...items].sort((a, b) => a.order_index - b.order_index)
  const [editing, setEditing] = useState<Record<string, EditableRow>>({})

  const append = useAppendTimelineItem(eventId)
  const update = useUpdateTimelineItem(eventId)
  const remove = useDeleteTimelineItem(eventId)

  const startEdit = (item: TimelineItemResponse) => {
    setEditing((prev) => ({
      ...prev,
      [item.id]: {
        id: item.id,
        time: item.time,
        title: item.title,
        description: item.description ?? '',
      },
    }))
  }

  const cancelEdit = (id: string) => {
    setEditing((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const saveEdit = (row: EditableRow) => {
    update.mutate(
      {
        itemId: row.id,
        payload: {
          time: row.time.trim(),
          title: row.title.trim(),
          description: row.description.trim() || null,
        },
      },
      {
        onSuccess: () => cancelEdit(row.id),
      }
    )
  }

  const startNew = () => {
    const id = `new-${Date.now()}`
    setEditing((prev) => ({
      ...prev,
      [id]: { id, time: '', title: '', description: '', isNew: true },
    }))
  }

  const saveNew = (row: EditableRow) => {
    append.mutate(
      {
        time: row.time.trim(),
        title: row.title.trim(),
        description: row.description.trim() || null,
        order_index: sorted.length,
      },
      {
        onSuccess: () => cancelEdit(row.id),
      }
    )
  }

  return (
    <section className="rounded-[22px] border border-[#d9e3f6] bg-white p-5 shadow-sm sm:p-6">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-headline text-lg font-extrabold tracking-tight text-slate-900">
            Schedule
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Each row renders as a timeline entry on the event page. Click edit to make changes.
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
          Add row
        </Button>
      </header>

      {sorted.length === 0 && Object.keys(editing).length === 0 ? (
        <EmptyState onAdd={startNew} />
      ) : (
        <ol className="space-y-3">
          {sorted.map((item, idx) => {
            const draft = editing[item.id]
            if (draft) {
              return (
                <li key={item.id}>
                  <EditCard
                    row={draft}
                    onChange={(next) =>
                      setEditing((prev) => ({ ...prev, [item.id]: next }))
                    }
                    onSave={() => saveEdit(draft)}
                    onCancel={() => cancelEdit(item.id)}
                    isSaving={update.isPending}
                    index={idx + 1}
                  />
                </li>
              )
            }
            return (
              <li
                key={item.id}
                className="flex items-start gap-4 rounded-[22px] border border-[#eff4ff] bg-[#f8f9ff] p-4 shadow-sm sm:p-5"
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-[22px] bg-[#004ac6] text-xs font-extrabold text-white sm:size-12 sm:text-sm">
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline text-sm font-extrabold tracking-tight text-[#004ac6] sm:text-base">
                      {item.time}
                    </span>
                    <span className="font-headline text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
                      {item.title}
                    </span>
                  </div>
                  {item.description ? (
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="grid size-8 place-items-center rounded-[22px] text-slate-500 hover:bg-white"
                    aria-label={`Edit ${item.title}`}
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove.mutate(item.id)}
                    disabled={remove.isPending}
                    className="grid size-8 place-items-center rounded-[22px] text-red-600 hover:bg-red-50"
                    aria-label={`Remove ${item.title}`}
                  >
                    {remove.isPending && remove.variables === item.id ? (
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
                  index={sorted.length + 1}
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
          {row.isNew ? 'New row' : 'Editing'}
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
      <div className="grid gap-3 sm:grid-cols-[140px_minmax(0,1fr)]">
        <Field
          label="Time"
          input={
            <Input
              value={row.time}
              onChange={(e) => onChange({ ...row, time: e.target.value })}
              maxLength={50}
              placeholder="6:00 PM"
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
              maxLength={255}
              placeholder="Arrival & networking"
              className={EVENT_FORM_INPUT_CLASS}
            />
          }
        />
      </div>
      <Field
        label="Description"
        input={
          <Textarea
            value={row.description}
            onChange={(e) => onChange({ ...row, description: e.target.value })}
            rows={2}
            className={EVENT_FORM_INPUT_CLASS}
          />
        }
      />
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
          disabled={isSaving || !row.time.trim() || !row.title.trim()}
          className="gap-1.5 rounded-[22px] bg-[#0755d8] font-bold text-white hover:bg-blue-700"
        >
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
          {row.isNew ? 'Add row' : 'Save'}
        </Button>
      </div>
    </div>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-[22px] border border-dashed border-[#c9d7f4] bg-[#f8f9ff] p-8 text-center">
      <p className="text-sm font-bold text-slate-700">No timeline rows yet.</p>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={onAdd}
        className="mt-4 gap-1.5 rounded-[22px] border-[#004ac6]/30 bg-white font-bold text-[#004ac6] hover:bg-[#e6eeff]"
      >
        <Plus className="size-3.5" strokeWidth={2.6} />
        Add the first row
      </Button>
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
