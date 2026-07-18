'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, Check, Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  useMyAvailabilitySlots,
  useCreateSlotsBulk,
  useDeleteSlot,
} from '@/features/availability/hooks/useMentorAvailability'
import type { AvailabilitySlotResponse } from '@/features/availability/types/availability.types'

// ── Constants ────────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = [
  { value: 0, short: 'S', label: 'Sunday' },
  { value: 1, short: 'M', label: 'Monday' },
  { value: 2, short: 'T', label: 'Tuesday' },
  { value: 3, short: 'W', label: 'Wednesday' },
  { value: 4, short: 'T', label: 'Thursday' },
  { value: 5, short: 'F', label: 'Friday' },
  { value: 6, short: 'S', label: 'Saturday' },
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

type RecurrenceMode = 'none' | 'weekly' | 'custom'

interface FormState {
  date: string // YYYY-MM-DD (local)
  startHour: number
  startMinute: number
  endHour: number
  endMinute: number
  mode: RecurrenceMode
  endDate: string // YYYY-MM-DD (local)
  customDays: number[] // 0..6
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function parseDateKey(key: string): Date | null {
  const [y, m, d] = key.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

function todayKey() {
  return toDateKey(new Date())
}

function addDaysKey(key: string, days: number) {
  const d = parseDateKey(key)
  if (!d) return key
  d.setDate(d.getDate() + days)
  return toDateKey(d)
}

function formatDateLabel(key: string) {
  const d = parseDateKey(key)
  if (!d) return key
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

function formatShortDate(key: string) {
  const d = parseDateKey(key)
  if (!d) return key
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function timeIndex(hour: number, minute: number) {
  return hour * 60 + minute
}

/** Group slots by local date key "YYYY-MM-DD". */
function groupByDate(slots: AvailabilitySlotResponse[]) {
  const map = new Map<string, AvailabilitySlotResponse[]>()
  for (const slot of slots) {
    const key = toDateKey(new Date(slot.start_time))
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(slot)
  }
  return map
}

/** Build concrete (start, end) ISO ranges from the form state. */
function expandForm(form: FormState): Array<{ start: Date; end: Date }> {
  const startDate = parseDateKey(form.date)
  if (!startDate) return []

  const buildAt = (day: Date): { start: Date; end: Date } => {
    const start = new Date(day)
    start.setHours(form.startHour, form.startMinute, 0, 0)
    const end = new Date(day)
    end.setHours(form.endHour, form.endMinute, 0, 0)
    return { start, end }
  }

  if (form.mode === 'none') {
    return [buildAt(startDate)]
  }

  const endDate = parseDateKey(form.endDate)
  if (!endDate) return []

  const targetDays =
    form.mode === 'weekly' ? [startDate.getDay()] : [...new Set(form.customDays)]
  if (targetDays.length === 0) return []

  const out: Array<{ start: Date; end: Date }> = []
  const cursor = new Date(startDate)
  while (cursor <= endDate) {
    if (targetDays.includes(cursor.getDay())) {
      out.push(buildAt(cursor))
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return out
}

/** True if a candidate range overlaps any existing slot. */
function overlapsExisting(
  range: { start: Date; end: Date },
  existing: AvailabilitySlotResponse[],
) {
  return existing.some((s) => {
    const sStart = new Date(s.start_time).getTime()
    const sEnd = new Date(s.end_time).getTime()
    return range.start.getTime() < sEnd && range.end.getTime() > sStart
  })
}

// ── Component ────────────────────────────────────────────────────────────────

const TODAY = todayKey()
const DEFAULT_FORM: FormState = {
  date: TODAY,
  startHour: 9,
  startMinute: 0,
  endHour: 10,
  endMinute: 0,
  mode: 'none',
  endDate: addDaysKey(TODAY, 28),
  customDays: [],
}

export function ProfileSessionAvailabilityCard() {
  const { data: existingSlots = [], isLoading } = useMyAvailabilitySlots()
  const { mutate: createBulk, isPending: isCreating } = useCreateSlotsBulk()
  const { mutate: deleteOne, isPending: isDeleting } = useDeleteSlot()

  const [form, setForm] = useState<FormState>(DEFAULT_FORM)

  const groupedExisting = useMemo(() => groupByDate(existingSlots), [existingSlots])
  const sortedDateKeys = useMemo(
    () => [...groupedExisting.keys()].sort(),
    [groupedExisting],
  )

  const startIdx = timeIndex(form.startHour, form.startMinute)
  const endTimeOptions = TIME_OPTIONS.filter((t) => timeIndex(t.hour, t.minute) > startIdx)

  const selectedDate = parseDateKey(form.date)
  const weeklyDayName = selectedDate
    ? DAYS_OF_WEEK[selectedDate.getDay()]?.label ?? ''
    : ''

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const updateStart = (hour: number, minute: number) => {
    setForm((prev) => {
      const newStart = timeIndex(hour, minute)
      const currentEnd = timeIndex(prev.endHour, prev.endMinute)
      if (newStart >= currentEnd) {
        // Push end forward by 1 hour, capped at 10:00 PM.
        const pushedH = Math.min(22, hour + 1)
        return { ...prev, startHour: hour, startMinute: minute, endHour: pushedH, endMinute: minute }
      }
      return { ...prev, startHour: hour, startMinute: minute }
    })
  }

  const toggleCustomDay = (day: number) => {
    setForm((prev) => {
      const has = prev.customDays.includes(day)
      return {
        ...prev,
        customDays: has ? prev.customDays.filter((d) => d !== day) : [...prev.customDays, day],
      }
    })
  }

  const handleDateChange = (newDate: string) => {
    setForm((prev) => {
      // Keep endDate >= date.
      const endDate =
        parseDateKey(prev.endDate) && parseDateKey(prev.endDate)! >= parseDateKey(newDate)!
          ? prev.endDate
          : addDaysKey(newDate, 28)
      return { ...prev, date: newDate, endDate }
    })
  }

  const handlePublish = () => {
    const ranges = expandForm(form)

    if (ranges.length === 0) {
      if (form.mode === 'custom' && form.customDays.length === 0) {
        toast.error('Pick at least one day of the week.')
      } else {
        toast.error('Could not build any slots from that input. Check your dates.')
      }
      return
    }

    // Filter out past times and self-overlap with existing slots.
    const now = Date.now()
    const future = ranges.filter((r) => r.start.getTime() > now)
    const nonConflicting = future.filter((r) => !overlapsExisting(r, existingSlots))
    const overlapCount = future.length - nonConflicting.length
    const pastCount = ranges.length - future.length

    if (nonConflicting.length === 0) {
      if (overlapCount > 0) {
        toast.error('All of those times overlap with availability you already have.')
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
        onSuccess: (created) => {
          const messages: string[] = []
          messages.push(`Added ${created.length} slot${created.length !== 1 ? 's' : ''}.`)
          if (overlapCount > 0) {
            messages.push(`${overlapCount} overlapped existing availability.`)
          }
          if (pastCount > 0) {
            messages.push(`${pastCount} were in the past.`)
          }
          toast.success(messages.join(' '))
          setForm((prev) => ({ ...DEFAULT_FORM, date: prev.date }))
        },
        onError: () => toast.error('Failed to publish availability. Please try again.'),
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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
      {/* LEFT: Add availability form */}
      <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
        <div className="mb-6">
          <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
            Add Availability
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Pick a date and time, then choose how often it repeats.
          </p>
        </div>

        <div className="space-y-5">
          {/* Date */}
          <Field label="Date">
            <input
              type="date"
              value={form.date}
              min={TODAY}
              onChange={(e) => handleDateChange(e.target.value)}
              className="mt-2 flex min-h-14 w-full items-center rounded-2xl bg-[#eef4ff] px-4 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-200 sm:px-5"
            />
          </Field>

          {/* Time */}
          <Field label="Time">
            <div className="mt-2 grid gap-2 min-[420px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] min-[420px]:items-center">
              <TimeSelect
                value={`${form.startHour}:${form.startMinute}`}
                options={TIME_OPTIONS}
                onChange={updateStart}
              />
              <span className="text-center text-sm font-medium text-slate-500">to</span>
              <TimeSelect
                value={`${form.endHour}:${form.endMinute}`}
                options={endTimeOptions}
                onChange={(h, m) => setForm((p) => ({ ...p, endHour: h, endMinute: m }))}
              />
            </div>
          </Field>

          {/* Recurrence */}
          <Field label="Repeat">
            <select
              value={form.mode}
              onChange={(e) => update('mode', e.target.value as RecurrenceMode)}
              className="mt-2 flex min-h-14 w-full items-center rounded-2xl bg-[#eef4ff] px-4 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-200 sm:px-5"
            >
              <option value="none">Does not repeat</option>
              <option value="weekly">
                Weekly{weeklyDayName ? ` on ${weeklyDayName}` : ''}
              </option>
              <option value="custom">Custom</option>
            </select>
          </Field>

          {/* Custom day picker */}
          {form.mode === 'custom' && (
            <Field label="Repeat on">
              <div className="mt-2 flex flex-wrap gap-1.5">
                {DAYS_OF_WEEK.map((d) => {
                  const active = form.customDays.includes(d.value)
                  return (
                    <button
                      key={d.value}
                      type="button"
                      aria-pressed={active}
                      aria-label={d.label}
                      onClick={() => toggleCustomDay(d.value)}
                      className={`inline-flex min-h-8 items-center justify-center rounded-full border px-3 text-xs font-extrabold transition ${
                        active
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-200 bg-[#eef4ff] text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {d.short}
                    </button>
                  )
                })}
              </div>
            </Field>
          )}

          {/* End date */}
          {form.mode !== 'none' && (
            <Field label="Ends on">
              <input
                type="date"
                value={form.endDate}
                min={form.date}
                onChange={(e) => update('endDate', e.target.value)}
                className="mt-2 flex min-h-14 w-full items-center rounded-2xl bg-[#eef4ff] px-4 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-200 sm:px-5"
              />
            </Field>
          )}

          {/* Submit */}
          <div className="border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={handlePublish}
              disabled={isCreating}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(0,83,219,0.22)] transition hover:bg-blue-700 disabled:opacity-60"
            >
              {isCreating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Adding…
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Add Availability
                </>
              )}
            </button>
            <p className="mt-2 text-center text-xs font-medium text-slate-500">
              Times that overlap existing availability are skipped automatically.
            </p>
          </div>
        </div>
      </section>

      {/* RIGHT: Published slots */}
      <aside>
        <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
              Published Slots
            </h2>
            <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-blue-700 uppercase">
              {existingSlots.length}
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 py-6 text-sm text-slate-500">
              <Loader2 className="size-4 animate-spin" />
              Loading…
            </div>
          ) : sortedDateKeys.length === 0 ? (
            <div className="rounded-2xl bg-[#f8f9ff] p-6 text-center">
              <CalendarDays className="mx-auto mb-2 size-6 text-slate-400" />
              <p className="text-sm font-medium text-slate-700">
                No availability yet.
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Use the form to add your first time window.
              </p>
            </div>
          ) : (
            <div className="max-h-[560px] space-y-4 overflow-y-auto pr-1">
              {sortedDateKeys.map((dateKey) => {
                const daySlots = groupedExisting.get(dateKey)!
                return (
                  <div key={dateKey}>
                    <p className="mb-2 text-xs font-bold tracking-[0.16em] text-slate-600 uppercase">
                      {formatShortDate(dateKey)}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold tracking-[0.16em] text-slate-600 uppercase">
        {label}
      </span>
      {children}
    </label>
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
      className="h-11 flex-1 rounded-2xl bg-[#eef4ff] px-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-200 sm:px-4"
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
  const isBooked = slot.is_booked || (slot.booked_intervals?.length ?? 0) > 0

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 ${
        isBooked ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex min-w-0 items-center gap-2">
        {isBooked ? (
          <Check className="size-3.5 text-amber-600" />
        ) : (
          <div className="size-2 rounded-full bg-emerald-500" />
        )}
        <span className="truncate text-xs font-semibold text-slate-700">
          {start} – {end}
        </span>
        {isBooked && (
          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-700">
            BOOKED
          </span>
        )}
      </div>
      {!isBooked && (
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          aria-label="Delete slot"
          title={formatDateLabel(toDateKey(new Date(slot.start_time)))}
          className="flex size-6 items-center justify-center rounded-lg text-blue-700 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
        >
          <Trash2 className="size-3.5" />
        </button>
      )}
    </div>
  )
}
