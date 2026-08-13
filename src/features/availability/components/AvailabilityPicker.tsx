'use client'

import { useMemo, useState } from 'react'
import { CalendarOff, ChevronLeft, ChevronRight } from 'lucide-react'
import type { AvailabilitySlotResponse } from '../types/availability.types'

// ── Types ────────────────────────────────────────────────────────────────────

interface DayOption {
  dateKey: string // "YYYY-MM-DD" local
  dayName: string // "Sat"
  dayNum: string // "15"
  monthShort: string // "Jan"
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

function sliceSlots(slots: AvailabilitySlotResponse[], durationMinutes?: number): SlicedSlot[] {
  if (!durationMinutes) {
    return slots.map((s) => ({
      id: s.id,
      parentSlotId: s.id,
      start_time: s.start_time,
      end_time: s.end_time,
      is_booked: s.is_booked || (s.booked_intervals?.length ?? 0) > 0,
    }))
  }

  const sliced: SlicedSlot[] = []
  for (const slot of slots) {
    const start = new Date(slot.start_time)
    const end = new Date(slot.end_time)

    if (end.getTime() - start.getTime() <= durationMinutes * 60000) {
      const isBooked =
        slot.is_booked ||
        (slot.booked_intervals?.some((b) => {
          const bStart = new Date(b.start).getTime()
          const bEnd = new Date(b.end).getTime()
          return bStart < end.getTime() && bEnd > start.getTime()
        }) ??
          false)

      sliced.push({
        id: slot.id,
        parentSlotId: slot.id,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_booked: isBooked,
      })
      continue
    }

    let currentStart = start
    while (currentStart.getTime() + durationMinutes * 60000 <= end.getTime()) {
      const currentEnd = new Date(currentStart.getTime() + durationMinutes * 60000)

      const isBooked =
        slot.is_booked ||
        (slot.booked_intervals?.some((b) => {
          const bStart = new Date(b.start).getTime()
          const bEnd = new Date(b.end).getTime()
          return bStart < currentEnd.getTime() && bEnd > currentStart.getTime()
        }) ??
          false)

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

const DAYS_VISIBLE = 5

export function AvailabilityPicker({
  slots,
  disabled,
  selectedSlotId,
  packageDurationMinutes,
  onSelect,
}: Props) {
  const [dayOffset, setDayOffset] = useState(0)
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null)

  const effectiveSlots = useMemo(
    () => sliceSlots(slots, packageDurationMinutes),
    [slots, packageDurationMinutes]
  )

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
          dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
          dayNum: String(d.getDate()),
          monthShort: d.toLocaleDateString('en-US', { month: 'short' }),
          slots: daySlots.sort(
            (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
          ),
        }
      })
  }, [effectiveSlots])

  const visibleDays = days.slice(dayOffset, dayOffset + DAYS_VISIBLE)
  const canPrev = dayOffset > 0
  const canNext = dayOffset + DAYS_VISIBLE < days.length

  const activeDateKey = selectedDateKey
  const activeDay = days.find((d) => d.dateKey === activeDateKey) ?? null

  if (days.length === 0) {
    return <NoSlotsBanner />
  }

  return (
    <div className={disabled ? 'pointer-events-none opacity-45 select-none' : ''}>
      {/* ── Day strip ─────────────────────────────────────────────────────── */}
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setDayOffset((o) => Math.max(0, o - DAYS_VISIBLE))}
          disabled={disabled || !canPrev}
          aria-label="Previous days"
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f8f9ff] text-[#737686] transition hover:bg-[#eff4ff] disabled:cursor-not-allowed ${
            !canPrev && !disabled ? 'disabled:opacity-30' : ''
          }`}
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
                disabled={disabled}
                onClick={() => {
                  setSelectedDateKey(day.dateKey)
                  if (selectedSlotId) {
                    const slotDay = toLocalDateKey(
                      effectiveSlots.find((s) => s.id === selectedSlotId)?.start_time ?? ''
                    )
                    if (slotDay !== day.dateKey) {
                      const found = effectiveSlots.find((s) => s.id === selectedSlotId)
                      if (found)
                        onSelect(
                          selectedSlotId,
                          found.parentSlotId,
                          found.start_time,
                          found.end_time
                        )
                    }
                  }
                }}
                className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 transition disabled:cursor-not-allowed ${
                  isActive
                    ? 'bg-[#004ac6] text-white'
                    : 'bg-[#f8f9ff] text-[#434655] hover:bg-[#eff4ff]'
                }`}
              >
                <span
                  className={`text-xs font-medium tracking-wide uppercase ${
                    isActive ? 'text-white/80' : 'text-[#737686]'
                  }`}
                >
                  {day.dayName}
                </span>
                <span
                  className={`text-base leading-none font-bold ${
                    isActive ? 'text-white' : 'text-[#121c2a]'
                  }`}
                >
                  {day.dayNum} {day.monthShort}
                </span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => setDayOffset((o) => o + DAYS_VISIBLE)}
          disabled={disabled || !canNext}
          aria-label="Next days"
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f8f9ff] text-[#737686] transition hover:bg-[#eff4ff] disabled:cursor-not-allowed ${
            !canNext && !disabled ? 'disabled:opacity-30' : ''
          }`}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* ── Time slots for selected day ────────────────────────────────────── */}
      {activeDay ? (
        activeDay.slots.length === 0 ? (
          <NoSlotsBanner />
        ) : (
          <div className="grid grid-cols-2 gap-3 px-[44px] sm:grid-cols-3 xl:grid-cols-4">
            {activeDay.slots.map((slot) => {
              const isSelected = selectedSlotId === slot.id
              const label = `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`

              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={disabled || slot.is_booked}
                  onClick={() =>
                    onSelect(slot.id, slot.parentSlotId, slot.start_time, slot.end_time)
                  }
                  className={`flex items-center justify-center rounded-lg border px-3 py-4 text-sm font-medium transition disabled:cursor-not-allowed ${
                    slot.is_booked
                      ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-60'
                      : isSelected
                        ? 'border-[#004ac6] bg-[#004ac6] text-white'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        )
      ) : (
        <p className="text-sm text-[#737686]">Select a day above to see available times.</p>
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function NoSlotsBanner() {
  return (
    <div className="mt-6 flex items-center gap-4 rounded-md bg-[#004ac6] p-6 text-white">
      <CalendarOff className="size-6 shrink-0" aria-hidden="true" />
      <div className="flex-1">
        <p className="text-sm font-extrabold">No availability published yet</p>
        <p className="mt-1 text-xs font-medium text-white/80">
          This mentor hasn&apos;t set their available times. Please check back soon.
        </p>
      </div>
      <ChevronRight className="size-5 shrink-0" aria-hidden="true" />
    </div>
  )
}
