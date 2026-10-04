'use client'

import { useMemo, useState } from 'react'
import { CalendarOff, ChevronLeft, ChevronRight } from 'lucide-react'
import type { BookableUnit } from '../types/availability.types'

// ── Types ────────────────────────────────────────────────────────────────────

interface DayOption {
  dateKey: string // "YYYY-MM-DD" local
  dayName: string // "Sat"
  dayNum: string // "15"
  monthShort: string // "Jan"
  units: BookableUnit[]
}

interface Props {
  units: BookableUnit[]
  disabled: boolean
  selectedUnitId: string | null
  onSelect: (unit: BookableUnit) => void
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

// ── Component ────────────────────────────────────────────────────────────────

const DAYS_VISIBLE = 5

export function AvailabilityPicker({
  units,
  disabled,
  selectedUnitId,
  onSelect,
}: Props) {
  const [dayOffset, setDayOffset] = useState(0)
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null)

  const days: DayOption[] = useMemo(() => {
    const map = new Map<string, BookableUnit[]>()
    for (const unit of units) {
      const key = toLocalDateKey(unit.start_time)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(unit)
    }
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateKey, dayUnits]) => {
        const d = new Date(`${dateKey}T12:00:00`)
        return {
          dateKey,
          dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
          dayNum: String(d.getDate()),
          monthShort: d.toLocaleDateString('en-US', { month: 'short' }),
          units: dayUnits.sort(
            (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
          ),
        }
      })
  }, [units])

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
          className={`hidden size-9 shrink-0 items-center justify-center rounded-lg bg-[#f8f9ff] text-[#737686] transition hover:bg-[#eff4ff] disabled:cursor-not-allowed sm:flex ${
            !canPrev && !disabled ? 'disabled:opacity-30' : ''
          }`}
        >
          <ChevronLeft className="size-4" />
        </button>

        <div
          className="flex flex-1 snap-x snap-mandatory gap-2 overflow-x-auto sm:overflow-hidden [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {visibleDays.map((day) => {
            const isActive = day.dateKey === activeDateKey
            return (
              <button
                key={day.dateKey}
                type="button"
                disabled={disabled}
                onClick={() => {
                  setSelectedDateKey(day.dateKey)
                  if (selectedUnitId) {
                    const unitDay = toLocalDateKey(
                      units.find((u) => u.id === selectedUnitId)?.start_time ?? ''
                    )
                    if (unitDay !== day.dateKey) {
                      const found = units.find((u) => u.id === selectedUnitId)
                      if (found) onSelect(found)
                    }
                  }
                }}
                className={`flex min-w-[33.5%] shrink-0 snap-start flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 transition disabled:cursor-not-allowed sm:min-w-0 sm:flex-1 sm:shrink ${
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
          className={`hidden size-9 shrink-0 items-center justify-center rounded-lg bg-[#f8f9ff] text-[#737686] transition hover:bg-[#eff4ff] disabled:cursor-not-allowed sm:flex ${
            !canNext && !disabled ? 'disabled:opacity-30' : ''
          }`}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* ── Time slots for selected day ────────────────────────────────────── */}
      {activeDay ? (
        activeDay.units.length === 0 ? (
          <NoSlotsBanner />
        ) : (
          <div className="grid grid-cols-2 gap-3 px-[44px] sm:grid-cols-3 xl:grid-cols-4">
            {activeDay.units.map((unit) => {
              const isSelected = selectedUnitId === unit.id
              const label = `${formatTime(unit.start_time)} - ${formatTime(unit.end_time)}`

              return (
                <button
                  key={unit.id}
                  type="button"
                  disabled={disabled || unit.is_booked}
                  onClick={() => onSelect(unit)}
                  className={`flex items-center justify-center rounded-lg border px-3 py-4 text-sm font-medium transition disabled:cursor-not-allowed ${
                    unit.is_booked
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
    <div className="mt-6 flex items-center gap-4 rounded-2xl bg-[#f8f9ff] p-6 ring-1 ring-[#e5edf9]">
      <CalendarOff className="size-6 shrink-0 text-[#737686]" aria-hidden="true" />
      <div className="flex-1">
        <p className="text-sm font-extrabold text-[#121c2a]">No availability published yet</p>
        <p className="mt-1 text-xs font-medium text-[#737686]">
          This mentor hasn&apos;t set their available times. Please check back soon.
        </p>
      </div>
    </div>
  )
}