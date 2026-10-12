import type { AvailabilitySlotResponse } from '../types/availability.types'
import { parseDateKey, TIME_OPTIONS, toDateKey } from './datetime'

// ── Form state for "Add availability" — shared by mentor and admin flows ──

export type RecurrenceMode = 'none' | 'weekly' | 'custom'

export interface AvailabilityFormState {
  date: string // YYYY-MM-DD (local)
  startHour: number
  startMinute: number
  endHour: number
  endMinute: number
  mode: RecurrenceMode
  endDate: string // YYYY-MM-DD (local)
  customDays: number[] // 0..6
}

/** Group raw slot rows by local date key "YYYY-MM-DD". */
export function groupSlotsByDate(
  slots: AvailabilitySlotResponse[]
): Map<string, AvailabilitySlotResponse[]> {
  const map = new Map<string, AvailabilitySlotResponse[]>()
  for (const slot of slots) {
    const key = toDateKey(new Date(slot.start_time))
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(slot)
  }
  return map
}

/** True if a candidate range overlaps any existing slot. */
export function overlapsExisting(
  range: { start: Date; end: Date },
  existing: AvailabilitySlotResponse[]
): boolean {
  return existing.some((s) => {
    const sStart = new Date(s.start_time).getTime()
    const sEnd = new Date(s.end_time).getTime()
    return range.start.getTime() < sEnd && range.end.getTime() > sStart
  })
}

/** Build concrete (start, end) ranges from the form state. */
export function expandAvailabilityForm(
  form: AvailabilityFormState
): Array<{ start: Date; end: Date }> {
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

  const targetDays = form.mode === 'weekly' ? [startDate.getDay()] : [...new Set(form.customDays)]
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

/** Compute end-time options for the TimeSelect given a chosen start. */
export function endTimeOptions(startHour: number, startMinute: number) {
  const startIdx = startHour * 60 + startMinute
  return TIME_OPTIONS.filter((t) => t.hour * 60 + t.minute > startIdx)
}
