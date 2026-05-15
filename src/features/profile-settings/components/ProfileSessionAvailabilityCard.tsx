'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, Check, Loader2, Plus, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import {
  useMyAvailabilitySlots,
  useCreateSlotsBulk,
  useDeleteSlot,
} from '@/features/availability/hooks/useMentorAvailability'
import type { AvailabilitySlotResponse } from '@/features/availability/types/availability.types'

// ── Constants ────────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
]

// Half-hour increments from 06:00 to 22:00
const TIME_OPTIONS: { label: string; hour: number; minute: number }[] = []
for (let h = 6; h <= 22; h++) {
  for (const m of [0, 30]) {
    if (h === 22 && m === 30) break
    const ampm = h < 12 ? 'AM' : 'PM'
    const displayH = h % 12 === 0 ? 12 : h % 12
    const displayM = m === 0 ? '00' : '30'
    TIME_OPTIONS.push({ label: `${displayH}:${displayM} ${ampm}`, hour: h, minute: m })
  }
}

// How many weeks ahead to generate slots for
const WEEKS_AHEAD = 4

interface ScheduleRow {
  id: string
  dayOfWeek: number
  startHour: number
  startMinute: number
  endHour: number
  endMinute: number
}

function makeId() {
  return Math.random().toString(36).slice(2)
}

function timeIndex(hour: number, minute: number) {
  return hour * 60 + minute
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Group slots by local date key "YYYY-MM-DD" */
function groupByDate(slots: AvailabilitySlotResponse[]) {
  const map = new Map<string, AvailabilitySlotResponse[]>()
  for (const slot of slots) {
    const d = new Date(slot.start_time)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(slot)
  }
  return map
}

function formatDate(dateKey: string) {
  const d = new Date(`${dateKey}T12:00:00`)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

/** Generate concrete UTC ISO strings for the next WEEKS_AHEAD weeks from a schedule row */
function generateSlots(rows: ScheduleRow[]): Array<{ start_time: string; end_time: string }> {
  const slots: Array<{ start_time: string; end_time: string }> = []
  const now = new Date()
  const cutoff = new Date(now.getTime() + WEEKS_AHEAD * 7 * 24 * 60 * 60 * 1000)

  for (const row of rows) {
    // Find the next occurrence of this day of week
    const cursor = new Date(now)
    cursor.setHours(0, 0, 0, 0)
    // Advance to the correct day of week
    const diff = (row.dayOfWeek - cursor.getDay() + 7) % 7
    cursor.setDate(cursor.getDate() + diff)

    while (cursor <= cutoff) {
      const start = new Date(cursor)
      start.setHours(row.startHour, row.startMinute, 0, 0)
      const end = new Date(cursor)
      end.setHours(row.endHour, row.endMinute, 0, 0)

      if (start > now && end > start) {
        slots.push({
          start_time: start.toISOString(),
          end_time: end.toISOString(),
        })
      }
      cursor.setDate(cursor.getDate() + 7)
    }
  }

  return slots
}

// ── Component ────────────────────────────────────────────────────────────────

export function ProfileSessionAvailabilityCard() {
  const { data: existingSlots = [], isLoading } = useMyAvailabilitySlots()
  const { mutate: createBulk, isPending: isCreating } = useCreateSlotsBulk()
  const { mutate: deleteOne, isPending: isDeleting } = useDeleteSlot()

  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>([
    { id: makeId(), dayOfWeek: 1, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
  ])

  const groupedExisting = useMemo(() => groupByDate(existingSlots), [existingSlots])
  const sortedDateKeys = useMemo(
    () => [...groupedExisting.keys()].sort(),
    [groupedExisting],
  )

  const addRow = () => {
    setScheduleRows((prev) => [
      ...prev,
      { id: makeId(), dayOfWeek: 1, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
    ])
  }

  const removeRow = (id: string) => {
    setScheduleRows((prev) => prev.filter((r) => r.id !== id))
  }

  const updateRow = (id: string, patch: Partial<Omit<ScheduleRow, 'id'>>) => {
    setScheduleRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  const handlePublish = () => {
    const slots = generateSlots(scheduleRows)
    if (slots.length === 0) {
      toast.error('No future slots to publish. Check your schedule.')
      return
    }
    createBulk(
      { slots },
      {
        onSuccess: (created) =>
          toast.success(`Published ${created.length} availability slot${created.length !== 1 ? 's' : ''}.`),
        onError: () => toast.error('Failed to publish slots. Please try again.'),
      },
    )
  }

  const handleDelete = (slotId: string) => {
    deleteOne(slotId, {
      onSuccess: () => toast.success('Slot removed.'),
      onError: () => toast.error('Could not remove slot — it may already be booked.'),
    })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-8">
      {/* LEFT: Schedule builder */}
      <div className="space-y-6">
        <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-headline text-xl font-extrabold text-slate-950">
                Weekly Schedule
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Set recurring time windows. We&apos;ll generate slots for the next {WEEKS_AHEAD} weeks.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {scheduleRows.map((row) => (
              <ScheduleRowEditor
                key={row.id}
                row={row}
                onChange={(patch) => updateRow(row.id, patch)}
                onRemove={() => removeRow(row.id)}
                canRemove={scheduleRows.length > 1}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={addRow}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#eef4ff] px-4 py-2.5 text-sm font-extrabold text-blue-700 transition hover:bg-[#dfe9ff]"
          >
            <Plus className="size-4" />
            Add time window
          </button>

          <div className="mt-6 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={handlePublish}
              disabled={isCreating}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(0,83,219,0.22)] transition hover:bg-blue-700 disabled:opacity-60"
            >
              {isCreating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Publishing…
                </>
              ) : (
                <>
                  <CalendarDays className="size-4" />
                  Publish Availability
                </>
              )}
            </button>
            <p className="mt-2 text-center text-xs text-slate-400">
              Existing slots are kept. Overlapping times are skipped automatically.
            </p>
          </div>
        </section>
      </div>

      {/* RIGHT: Existing slots */}
      <aside>
        <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-6">
          <h2 className="mb-4 font-headline text-lg font-extrabold text-slate-950">
            Published Slots
          </h2>

          {isLoading ? (
            <div className="flex items-center gap-2 py-6 text-sm text-slate-400">
              <Loader2 className="size-4 animate-spin" />
              Loading…
            </div>
          ) : sortedDateKeys.length === 0 ? (
            <div className="rounded-2xl bg-[#f8f9ff] p-6 text-center text-sm font-medium text-slate-400">
              No slots published yet. Use the schedule builder to add availability.
            </div>
          ) : (
            <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1">
              {sortedDateKeys.map((dateKey) => {
                const daySlots = groupedExisting.get(dateKey)!
                return (
                  <div key={dateKey}>
                    <p className="mb-2 text-xs font-extrabold tracking-[0.12em] text-slate-500 uppercase">
                      {formatDate(dateKey)}
                    </p>
                    <div className="space-y-1.5">
                      {daySlots
                        .sort(
                          (a, b) =>
                            new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
                        )
                        .map((slot) => (
                          <SlotRow
                            key={slot.id}
                            slot={slot}
                            onDelete={() => handleDelete(slot.id)}
                            isDeleting={isDeleting}
                          />
                        ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </aside>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ScheduleRowEditor({
  row,
  onChange,
  onRemove,
  canRemove,
}: {
  row: ScheduleRow
  onChange: (patch: Partial<Omit<ScheduleRow, 'id'>>) => void
  onRemove: () => void
  canRemove: boolean
}) {
  const startIdx = timeIndex(row.startHour, row.startMinute)
  const endOptions = TIME_OPTIONS.filter((t) => timeIndex(t.hour, t.minute) > startIdx)

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#f8f9ff] p-3">
      {/* Day selector */}
      <div className="flex flex-wrap gap-1.5">
        {DAYS_OF_WEEK.map((d) => (
          <button
            key={d.value}
            type="button"
            aria-pressed={row.dayOfWeek === d.value}
            onClick={() => onChange({ dayOfWeek: d.value })}
            className={`flex size-9 items-center justify-center rounded-xl text-xs font-extrabold transition ${
              row.dayOfWeek === d.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-[#eef4ff]'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Time range */}
      <div className="flex items-center gap-2">
        <TimeSelect
          value={`${row.startHour}:${row.startMinute}`}
          options={TIME_OPTIONS}
          onChange={(h, m) => {
            // If new start >= end, push end forward by 1 hour
            const newEnd =
              timeIndex(h, m) >= timeIndex(row.endHour, row.endMinute)
                ? { endHour: h + 1 <= 22 ? h + 1 : 22, endMinute: m }
                : {}
            onChange({ startHour: h, startMinute: m, ...newEnd })
          }}
        />
        <span className="text-sm font-medium text-slate-400">–</span>
        <TimeSelect
          value={`${row.endHour}:${row.endMinute}`}
          options={endOptions}
          onChange={(h, m) => onChange({ endHour: h, endMinute: m })}
        />
      </div>

      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove time window"
          className="ml-auto flex size-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

function TimeSelect({
  value,
  options,
  onChange,
}: {
  value: string
  options: typeof TIME_OPTIONS
  onChange: (hour: number, minute: number) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => {
        const [h, m] = e.target.value.split(':').map(Number)
        onChange(h!, m!)
      }}
      className="h-9 rounded-xl bg-white px-2 text-xs font-semibold text-slate-800 ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-blue-300"
    >
      {options.map((t) => (
        <option key={`${t.hour}:${t.minute}`} value={`${t.hour}:${t.minute}`}>
          {t.label}
        </option>
      ))}
    </select>
  )
}

function SlotRow({
  slot,
  onDelete,
  isDeleting,
}: {
  slot: AvailabilitySlotResponse
  onDelete: () => void
  isDeleting: boolean
}) {
  const start = formatTime(slot.start_time)
  const end = formatTime(slot.end_time)

  return (
    <div
      className={`flex items-center justify-between rounded-xl px-3 py-2 ${
        slot.is_booked ? 'bg-amber-50' : 'bg-[#eef4ff]'
      }`}
    >
      <div className="flex items-center gap-2">
        {slot.is_booked ? (
          <Check className="size-3.5 text-amber-600" />
        ) : (
          <div className="size-2 rounded-full bg-emerald-500" />
        )}
        <span className="text-xs font-semibold text-slate-700">
          {start} – {end}
        </span>
        {slot.is_booked && (
          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-700">
            BOOKED
          </span>
        )}
      </div>
      {!slot.is_booked && (
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          aria-label="Delete slot"
          className="flex size-6 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
        >
          <Trash2 className="size-3.5" />
        </button>
      )}
    </div>
  )
}
