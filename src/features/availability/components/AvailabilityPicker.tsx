'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import type { AvailabilitySlotResponse } from '../types/availability.types'

// ── Types ────────────────────────────────────────────────────────────────────

interface DayOption {
  dateKey: string   // "YYYY-MM-DD" local
  label: string     // "Mon\n19"
  dayName: string   // "Mon"
  dayNum: string    // "19"
  slots: SlicedSlot[]
}

interface SlicedSlot {
  id: string
  parentSlotId: string
  start_time: string
  end_time: string
  is_booked: boolean
}

interface Props {
  slots: AvailabilitySlotResponse[]
  /** Mentor's hourly rate — used to generate fallback slots when none exist */
  hourlyRate: number
  disabled: boolean
  selectedSlotId: string | null
  packageDurationMinutes?: number
  onSelect: (slicedSlotId: string, parentSlotId: string, startTime: string, endTime: string) => void
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function toLocalDateKey(iso: string): string {
  const d = new Date(iso)
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

/**
 * Generate synthetic fallback slots for the next 7 days (9 AM – 5 PM, hourly)
 * when the mentor has no published availability.
 */
function generateFallbackSlots(mentorId: string): AvailabilitySlotResponse[] {
  const slots: AvailabilitySlotResponse[] = []
  const now = new Date()

  for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
    const day = new Date(now)
    day.setDate(day.getDate() + dayOffset)
    day.setSeconds(0, 0)

    const start = new Date(day)
    start.setHours(9, 0, 0, 0)
    const end = new Date(day)
    end.setHours(17, 0, 0, 0)

    slots.push({
      id: `fallback-${dayOffset}`,
      mentor_id: mentorId,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      is_booked: false,
      is_recurring: false,
      recurrence_rule: null,
      created_at: '',
    })
  }
  return slots
}

function sliceSlots(slots: AvailabilitySlotResponse[], durationMinutes?: number): SlicedSlot[] {
  if (!durationMinutes) {
    return slots.map(s => ({
      id: s.id,
      parentSlotId: s.id,
      start_time: s.start_time,
      end_time: s.end_time,
      is_booked: s.is_booked || (s.booked_intervals && s.booked_intervals.length > 0)
    }))
  }

  const sliced: SlicedSlot[] = []
  for (const slot of slots) {
    const start = new Date(slot.start_time)
    const end = new Date(slot.end_time)
    
    // If the slot is exactly the same or smaller than duration, keep it
    if (end.getTime() - start.getTime() <= durationMinutes * 60000) {
       const isBooked = slot.is_booked || (slot.booked_intervals?.some(b => {
         const bStart = new Date(b.start).getTime()
         const bEnd = new Date(b.end).getTime()
         return bStart < end.getTime() && bEnd > start.getTime()
       }) ?? false)

       sliced.push({
         id: slot.id,
         parentSlotId: slot.id,
         start_time: slot.start_time,
         end_time: slot.end_time,
         is_booked: isBooked
       })
       continue
    }

    let currentStart = start
    while (currentStart.getTime() + durationMinutes * 60000 <= end.getTime()) {
      const currentEnd = new Date(currentStart.getTime() + durationMinutes * 60000)
      
      const isBooked = slot.is_booked || (slot.booked_intervals?.some(b => {
         const bStart = new Date(b.start).getTime()
         const bEnd = new Date(b.end).getTime()
         return bStart < currentEnd.getTime() && bEnd > currentStart.getTime()
       }) ?? false)

      sliced.push({
        id: `${slot.id}_${currentStart.toISOString()}`,
        parentSlotId: slot.id,
        start_time: currentStart.toISOString(),
        end_time: currentEnd.toISOString(),
        is_booked: isBooked,
      })
      currentStart = currentEnd
    }
  }
  return sliced
}

// ── Component ────────────────────────────────────────────────────────────────

const DAYS_VISIBLE = 5   // how many day pills to show at once

export function AvailabilityPicker({
  slots,
  hourlyRate,
  disabled,
  selectedSlotId,
  packageDurationMinutes,
  onSelect,
}: Props) {
  const [dayOffset, setDayOffset] = useState(0)
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null)

  // Use real slots if available, otherwise generate fallback
  const isFallback = slots.length === 0
  const rawSlots = useMemo(
    () =>
      isFallback && hourlyRate > 0
        ? generateFallbackSlots(slots[0]?.mentor_id ?? 'unknown')
        : slots,
    [isFallback, hourlyRate, slots],
  )
  
  const effectiveSlots = useMemo(
    () => sliceSlots(rawSlots, packageDurationMinutes),
    [rawSlots, packageDurationMinutes]
  )

  // Group by local date key, sorted ascending
  const days: DayOption[] = useMemo(() => {
    const map = new Map<string, SlicedSlot[]>()
    for (const slot of effectiveSlots) {
      const key = toLocalDateKey(slot.start_time)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(slot)
    }
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateKey, daySlots]) => {
        const d = new Date(`${dateKey}T12:00:00`)
        return {
          dateKey,
          label: d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
          dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
          dayNum: String(d.getDate()),
          slots: daySlots.sort(
            (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
          ),
        }
      })
  }, [effectiveSlots])

  const visibleDays = days.slice(dayOffset, dayOffset + DAYS_VISIBLE)
  const canPrev = dayOffset > 0
  const canNext = dayOffset + DAYS_VISIBLE < days.length

  // Auto-select first day when days load
  const activeDateKey = selectedDateKey ?? days[0]?.dateKey ?? null
  const activeDay = days.find((d) => d.dateKey === activeDateKey) ?? null

  if (days.length === 0) {
    return (
      <div className="rounded-[16px] bg-[#f8f9ff] p-6 text-center text-sm font-medium text-[#737686]">
        No availability found.
      </div>
    )
  }

  return (
    <div className={disabled ? 'pointer-events-none opacity-45 select-none' : ''}>
      {isFallback && (
        <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
          This mentor hasn&apos;t published specific slots yet — showing default availability.
          Confirm your preferred time and the mentor will follow up.
        </p>
      )}

      {/* ── Day strip ─────────────────────────────────────────────────────── */}
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setDayOffset((o) => Math.max(0, o - DAYS_VISIBLE))}
          disabled={!canPrev}
          aria-label="Previous days"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f8f9ff] text-[#737686] transition hover:bg-[#eff4ff] disabled:opacity-30"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="flex flex-1 gap-2 overflow-hidden">
          {visibleDays.map((day) => {
            const isActive = day.dateKey === activeDateKey
            return (
              <button
                key={day.dateKey}
                type="button"
                onClick={() => {
                  setSelectedDateKey(day.dateKey)
                  // Deselect time if switching day
                  if (selectedSlotId) {
                    const slotDay = toLocalDateKey(
                      effectiveSlots.find((s) => s.id === selectedSlotId)?.start_time ?? '',
                    )
                    if (slotDay !== day.dateKey) {
                       const found = effectiveSlots.find((s) => s.id === selectedSlotId)
                       if (found) onSelect(selectedSlotId, found.parentSlotId, found.start_time, found.end_time) // toggle off
                    }
                  }
                }}
                className={`flex flex-1 flex-col items-center rounded-2xl py-3 transition ${
                  isActive
                    ? 'bg-[#004ac6] text-white'
                    : 'bg-[#f8f9ff] text-[#434655] hover:bg-[#eff4ff]'
                }`}
              >
                <span className={`text-[11px] font-extrabold ${isActive ? 'text-white/80' : 'text-[#737686]'}`}>
                  {day.dayName}
                </span>
                <span className={`mt-0.5 text-lg font-extrabold leading-none ${isActive ? 'text-white' : 'text-[#121c2a]'}`}>
                  {day.dayNum}
                </span>
                <span className={`mt-1.5 size-1.5 rounded-full ${isActive ? 'bg-white/60' : 'bg-[#004ac6]/40'}`} />
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => setDayOffset((o) => o + DAYS_VISIBLE)}
          disabled={!canNext}
          aria-label="Next days"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f8f9ff] text-[#737686] transition hover:bg-[#eff4ff] disabled:opacity-30"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* ── Time slots for selected day ────────────────────────────────────── */}
      {activeDay ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {activeDay.slots.map((slot) => {
            const isSelected = selectedSlotId === slot.id
            const startTime = formatTime(slot.start_time)
            const endTime = formatTime(slot.end_time)

            return (
              <button
                key={slot.id}
                type="button"
                disabled={slot.is_booked}
                onClick={() => onSelect(slot.id, slot.parentSlotId, slot.start_time, slot.end_time)}
                className={`flex items-center justify-between rounded-[14px] px-3 py-3 text-left ring-1 transition ring-inset ${
                  slot.is_booked
                    ? 'bg-slate-100 ring-slate-200 opacity-60 cursor-not-allowed'
                    : isSelected
                    ? 'bg-[#004ac6] ring-[#004ac6]'
                    : 'bg-[#f8f9ff] ring-[#eff4ff] hover:bg-[#eff4ff]'
                }`}
              >
                <div>
                  <p className={`text-sm font-extrabold ${isSelected ? 'text-white' : 'text-[#121c2a]'}`}>
                    {startTime}
                  </p>
                  <p className={`text-xs font-medium ${isSelected ? 'text-white/70' : 'text-[#737686]'}`}>
                    – {endTime}
                  </p>
                </div>
                {isSelected && <Check className="size-4 shrink-0 text-white" />}
                {slot.is_booked && <span className="text-[10px] font-extrabold text-slate-500 uppercase">Booked</span>}
              </button>
            )
          })}
        </div>
      ) : (
        <p className="text-sm text-[#737686]">Select a day above to see available times.</p>
      )}
    </div>
  )
}
