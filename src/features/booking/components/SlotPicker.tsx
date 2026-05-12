'use client'

import { CalendarClock, Loader2 } from 'lucide-react'
import type { AvailabilitySlotResponse } from '@/features/availability/types/availability.types'

interface SlotPickerProps {
  slots: AvailabilitySlotResponse[]
  loading: boolean
  selectedSlotId: string | null
  onSelect: (slotId: string) => void
  error?: string
}

function formatSlot(slot: AvailabilitySlotResponse): { date: string; time: string } {
  const start = new Date(slot.start_time)
  const end = new Date(slot.end_time)
  const date = start.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const startTime = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  const endTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return { date, time: `${startTime} – ${endTime}` }
}

export function SlotPicker({ slots, loading, selectedSlotId, onSelect, error }: SlotPickerProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-[#434655]">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading available slots…
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-[#ba1a1a]">{error}</p>
  }

  if (slots.length === 0) {
    return (
      <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
        No available slots right now. Please check back later.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {slots.map((slot) => {
        const { date, time } = formatSlot(slot)
        const isSelected = selectedSlotId === slot.id
        return (
          <button
            key={slot.id}
            type="button"
            onClick={() => onSelect(slot.id)}
            className={`flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-all ${
              isSelected
                ? 'border-[#004ac6] bg-[#eff4ff]'
                : 'border-[#e6eeff] bg-white hover:border-[#004ac6]/40 hover:bg-[#f8f9ff]'
            }`}
          >
            <CalendarClock
              className={`mt-0.5 h-4 w-4 shrink-0 ${isSelected ? 'text-[#004ac6]' : 'text-[#434655]'}`}
            />
            <div>
              <p className={`text-sm font-semibold ${isSelected ? 'text-[#004ac6]' : 'text-[#121c2a]'}`}>
                {date}
              </p>
              <p className="text-xs text-[#434655]">{time}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
