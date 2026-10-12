'use client'

import { useMemo, useState } from 'react'
import { AlertCircle, CalendarDays, ChevronRight, ClockAlert, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Skeleton } from '@/components/ui/skeleton'
import {
  useAdminCreateSlotsBulk,
  useAdminDeleteSlot,
  useAdminDeleteSlotsBulk,
  useAdminMentorAvailability,
} from '@/features/availability/hooks/useMentorAvailability'
import {
  AvailabilityForm,
  DEFAULT_AVAILABILITY_FORM,
} from '@/features/availability/components/AvailabilityForm'
import { AvailabilitySlotRow } from '@/features/availability/components/AvailabilitySlotRow'
import { formatShortDate, formatTime, toDateKey } from '@/features/availability/lib/datetime'
import {
  AvailabilityFormState,
  expandAvailabilityForm,
  groupSlotsByDate,
  overlapsExisting,
} from '@/features/availability/lib/slots'
import type {
  AvailabilitySlotResponse,
  BulkSlotCreateResponse,
} from '@/features/availability/types/availability.types'

export interface AdminAvailabilityManagerProps {
  mentorId: string
  /**
   * Optional override for the empty-state copy. Defaults to the
   * mentor-agnostic version shown when the mentor has zero availability.
   */
  emptyHint?: string
}

interface ConflictSummary {
  /** Items we successfully posted that came back from the server as created. */
  createdCount: number
  /** Items the server rejected with one of these reasons. */
  conflicts: BulkSlotCreateResponse['conflicts']
  /** Items we filtered client-side because they were in the past. */
  pastCount: number
  /** Items we filtered client-side because they overlapped an existing slot. */
  overlapCount: number
}

/**
 * Admin view that mirrors the mentor's own "Add availability" flow. The
 * same form controls, slot-row visual chrome, and bulk-create contract —
 * the only differences are:
 * - the API targets `mentor_id` from the URL (admin's own user id is unused)
 * - the slots list supports multi-select + bulk delete
 * - bulk-create conflicts surface in a dedicated "Skipped rows" panel so
 *   the admin can see which rows failed and why (per the API doc)
 */
export function AdminAvailabilityManager({ mentorId, emptyHint }: AdminAvailabilityManagerProps) {
  const { data: paginated, isLoading } = useAdminMentorAvailability(mentorId)
  // Memoize the slot array so downstream useMemo deps don't churn when the
  // surrounding object identity changes but `items` does not.
  const slots = useMemo<AvailabilitySlotResponse[]>(() => paginated?.items ?? [], [paginated])
  const totalSlots = paginated?.total ?? 0

  const { mutate: createBulk, isPending: isCreating } = useAdminCreateSlotsBulk(mentorId)
  const { mutate: deleteOne, isPending: isDeleting } = useAdminDeleteSlot(mentorId)
  const { mutate: deleteMany, isPending: isDeletingBulk } = useAdminDeleteSlotsBulk(mentorId)

  const [form, setForm] = useState<AvailabilityFormState>(DEFAULT_AVAILABILITY_FORM)
  /** IDs the admin ticked for the bulk-delete action. */
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  /** Most-recent bulk-create result, surfaced in the "Skipped rows" panel. */
  const [conflictSummary, setConflictSummary] = useState<ConflictSummary | null>(null)

  const groupedSlots = useMemo(() => groupSlotsByDate(slots), [slots])
  const sortedDateKeys = useMemo(() => [...groupedSlots.keys()].sort(), [groupedSlots])

  const handlePublish = () => {
    const ranges = expandAvailabilityForm(form)

    if (ranges.length === 0) {
      if (form.mode === 'custom' && form.customDays.length === 0) {
        toast.error('Pick at least one day of the week.')
      } else {
        toast.error('Could not build any slots from that input. Check your dates.')
      }
      return
    }

    // Mirror the mentor-side rule — drop past ranges and obvious overlaps
    // client-side so the user sees fewer 422s. The server still re-checks
    // and reports anything it filters in `conflicts`.
    const now = Date.now()
    const future = ranges.filter((r) => r.start.getTime() > now)
    const nonConflicting = future.filter((r) => !overlapsExisting(r, slots))
    const overlapCount = future.length - nonConflicting.length
    const pastCount = ranges.length - future.length

    if (nonConflicting.length === 0) {
      if (overlapCount > 0) {
        toast.error('All of those times overlap with availability this mentor already has.')
      } else {
        toast.error('Those times are in the past.')
      }
      return
    }

    const payload = nonConflicting.map((r) => ({
      start_time: r.start.toISOString(),
      end_time: r.end.toISOString(),
    }))

    createBulk(
      { slots: payload },
      {
        onSuccess: (response) => {
          const createdCount = response.items.length
          const conflicts = response.conflicts
          setConflictSummary({ createdCount, conflicts, pastCount, overlapCount })

          const toastParts: string[] = []
          toastParts.push(`Added ${createdCount} slot${createdCount !== 1 ? 's' : ''}.`)
          const totalSkipped = conflicts.length + pastCount + overlapCount
          if (totalSkipped > 0) {
            const parts: string[] = []
            if (conflicts.length > 0) parts.push(`${conflicts.length} rejected by server`)
            if (overlapCount > 0) parts.push(`${overlapCount} overlapped existing`)
            if (pastCount > 0) parts.push(`${pastCount} in the past`)
            toastParts.push(`${parts.join(', ')} — see skipped rows below.`)
          }
          toast.success(toastParts.join(' '))
          setForm((prev) => ({ ...DEFAULT_AVAILABILITY_FORM, date: prev.date }))
        },
        onError: () =>
          toast.error('Failed to publish availability. Check the inputs and try again.'),
      }
    )
  }

  const handleDelete = (slotId: string) => {
    deleteOne(slotId, {
      onSuccess: (res) => {
        toast.success(res.message)
        // Clear any stale selection for the just-deleted slot.
        setSelectedIds((prev) => {
          if (!prev.has(slotId)) return prev
          const next = new Set(prev)
          next.delete(slotId)
          return next
        })
      },
      onError: (err) => {
        const msg = extractApiErrorMessage(err)
        toast.error(msg ?? 'Failed to delete slot.')
      },
    })
  }

  const handleBulkDelete = () => {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    deleteMany(ids, {
      onSuccess: (res) => {
        toast.success(res.message)
        setSelectedIds(new Set())
      },
      onError: (err) => {
        const msg = extractApiErrorMessage(err)
        toast.error(msg ?? 'Failed to delete selected slots.')
      },
    })
  }

  const toggleSelect = (slotId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(slotId)) next.delete(slotId)
      else next.add(slotId)
      return next
    })
  }

  const toggleSelectDay = (daySlots: AvailabilitySlotResponse[]) => {
    const deletable = daySlots.filter((s) => !s.is_booked)
    if (deletable.length === 0) return
    const allSelected = deletable.every((s) => selectedIds.has(s.id))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (allSelected) {
        for (const s of deletable) next.delete(s.id)
      } else {
        for (const s of deletable) next.add(s.id)
      }
      return next
    })
  }

  const selectableCount = useMemo(() => slots.filter((s) => !s.is_booked).length, [slots])
  const allSlotsSelected =
    selectableCount > 0 && slots.filter((s) => !s.is_booked).every((s) => selectedIds.has(s.id))

  const isSubmitting = isCreating || isDeleting || isDeletingBulk

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-8">
      {/* LEFT: Add availability form */}
      <AvailabilityForm
        title="Add availability"
        subtitle="Pick a date and time, then choose how often it repeats."
        submitHint="Times that overlap existing availability are skipped automatically."
        submitLabel="Add Availability"
        submittingLabel="Adding…"
        form={form}
        onChange={setForm}
        isSubmitting={isSubmitting}
        onSubmit={handlePublish}
      />

      {/* RIGHT: Published slots + conflicts panel */}
      <aside className="space-y-5">
        {conflictSummary ? (
          <ConflictsPanel summary={conflictSummary} onDismiss={() => setConflictSummary(null)} />
        ) : null}

        <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
                Published slots
              </h2>
              <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-blue-700 uppercase">
                {totalSlots}
              </span>
            </div>
            {selectedIds.size > 0 ? (
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={isDeletingBulk}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700 ring-1 ring-red-200 transition hover:bg-red-100 disabled:opacity-60"
                aria-label={`Delete ${selectedIds.size} selected slot${selectedIds.size === 1 ? '' : 's'}`}
              >
                {isDeletingBulk ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
                Delete {selectedIds.size} selected
              </button>
            ) : null}
          </div>

          {isLoading ? (
            <div className="space-y-3" aria-busy="true">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8"
                >
                  <Skeleton className="h-5 w-40 rounded bg-slate-100" />
                  <Skeleton className="mt-3 h-4 w-64 rounded bg-slate-100" />
                  <Skeleton className="mt-3 h-4 w-48 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : sortedDateKeys.length === 0 ? (
            <div className="mt-2 flex items-center gap-4 rounded-md bg-[#004ac6] p-6 text-white">
              <CalendarDays className="size-6 shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm font-extrabold">No availability yet</p>
                <p className="mt-1 text-xs font-medium text-white/80">
                  {emptyHint ?? 'Use the form to add the first time window for this mentor.'}
                </p>
              </div>
              <ChevronRight className="size-5 shrink-0" aria-hidden="true" />
            </div>
          ) : (
            <div className="space-y-4">
              {selectableCount > 0 ? (
                <label className="flex cursor-pointer items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-slate-600 uppercase">
                  <input
                    type="checkbox"
                    checked={allSlotsSelected}
                    onChange={() => {
                      if (allSlotsSelected) {
                        setSelectedIds(new Set())
                      } else {
                        setSelectedIds(new Set(slots.filter((s) => !s.is_booked).map((s) => s.id)))
                      }
                    }}
                    className="size-3.5 cursor-pointer rounded border-slate-300 accent-[#0755d8]"
                    aria-label="Select all unbooked slots"
                  />
                  Select all unbooked
                </label>
              ) : null}

              <div className="max-h-[560px] space-y-4 overflow-y-auto pr-1">
                {sortedDateKeys.map((dateKey) => {
                  const daySlots = groupedSlots.get(dateKey) ?? []
                  const deletable = daySlots.filter((s) => !s.is_booked)
                  const daySelected =
                    deletable.length > 0 && deletable.every((s) => selectedIds.has(s.id))
                  return (
                    <div key={dateKey}>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-bold tracking-[0.16em] text-slate-600 uppercase">
                          {formatShortDate(dateKey)}
                        </p>
                        {deletable.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => toggleSelectDay(daySlots)}
                            aria-pressed={daySelected}
                            className="text-[10px] font-extrabold tracking-wide text-blue-700 uppercase transition hover:text-blue-800"
                          >
                            {daySelected ? 'Clear day' : 'Select day'}
                          </button>
                        ) : null}
                      </div>
                      <div className="space-y-1.5">
                        {daySlots
                          .sort(
                            (a, b) =>
                              new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
                          )
                          .map((slot) => (
                            <AvailabilitySlotRow
                              key={slot.id}
                              slot={slot}
                              onDelete={() => handleDelete(slot.id)}
                              isDeleting={isDeleting}
                              selectable
                              selected={selectedIds.has(slot.id)}
                              onToggleSelect={() => toggleSelect(slot.id)}
                            />
                          ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </section>
      </aside>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ConflictsPanel({
  summary,
  onDismiss,
}: {
  summary: ConflictSummary
  onDismiss: () => void
}) {
  const past = summary.conflicts.filter((c) => c.reason === 'in_the_past')
  const overlap = summary.conflicts.filter((c) => c.reason === 'overlaps_existing_slot')
  const total = summary.conflicts.length + summary.pastCount + summary.overlapCount
  if (total === 0) return null

  return (
    <section
      aria-live="polite"
      className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-4 text-amber-600" aria-hidden="true" />
          <h3 className="font-headline text-base font-extrabold text-slate-950">Skipped rows</h3>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-amber-800 uppercase">
            {total}
          </span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss skipped rows"
          className="text-xs font-bold text-slate-500 transition hover:text-slate-800"
        >
          Dismiss
        </button>
      </div>
      <p className="text-xs font-medium text-slate-500">
        {summary.createdCount} added
        {summary.overlapCount > 0
          ? ` · ${summary.overlapCount} overlapped (skipped client-side)`
          : ''}
        {summary.pastCount > 0 ? ` · ${summary.pastCount} in the past (skipped client-side)` : ''}
      </p>

      {past.length > 0 ? (
        <ConflictGroup
          icon={<ClockAlert className="size-3.5 text-slate-500" aria-hidden="true" />}
          label="Rejected by server — start time was in the past"
          tone="slate"
          items={past}
        />
      ) : null}
      {overlap.length > 0 ? (
        <ConflictGroup
          icon={<AlertCircle className="size-3.5 text-amber-600" aria-hidden="true" />}
          label="Rejected by server — this slot overlaps an existing one"
          tone="amber"
          items={overlap}
        />
      ) : null}
    </section>
  )
}

function ConflictGroup({
  icon,
  label,
  tone,
  items,
}: {
  icon: React.ReactNode
  label: string
  tone: 'slate' | 'amber'
  items: BulkSlotCreateResponse['conflicts']
}) {
  const toneClasses =
    tone === 'amber' ? 'border-amber-200 bg-amber-50/40' : 'border-slate-200 bg-slate-50'

  return (
    <div className={`mt-3 rounded-xl border p-3 ${toneClasses}`}>
      <p className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wide text-slate-700 uppercase">
        {icon}
        {label}
      </p>
      <ul className="mt-2 space-y-1">
        {items.map((c, i) => (
          <li key={`${c.start_time}-${i}`} className="text-xs font-medium text-slate-600">
            <span className="font-semibold text-slate-800">
              {formatTime(c.start_time)} – {formatTime(c.end_time)}
            </span>
            <span className="ml-2 text-slate-400">
              {formatShortDate(toDateKey(new Date(c.start_time)))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Pull the FastAPI `detail` string out of an axios error. Falls back to null
 * so the caller can supply a generic message. Mirrors the helper in the
 * admin edit page — kept local to this feature since it's only two lines.
 */
function extractApiErrorMessage(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null
  const response = (err as Record<string, unknown>)['response'] as
    Record<string, unknown> | undefined
  const data = response?.['data'] as Record<string, unknown> | undefined
  if (!data) return null
  if (typeof data['detail'] === 'string') return data['detail']
  return null
}
