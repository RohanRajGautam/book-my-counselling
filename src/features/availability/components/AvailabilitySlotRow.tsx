'use client'

import { Check, Trash2 } from 'lucide-react'
import type { AvailabilitySlotResponse } from '../types/availability.types'
import { formatDateLabel, formatTime, toDateKey } from '../lib/datetime'

export interface AvailabilitySlotRowProps {
  slot: AvailabilitySlotResponse
  onDelete: () => void
  isDeleting?: boolean
  /**
   * When true, render a checkbox in front of the row so the admin can
   * multi-select slots for the bulk-delete action. The trash icon is
   * hidden in this mode (use the bulk-delete control in the list footer).
   */
  selectable?: boolean
  selected?: boolean
  onToggleSelect?: () => void
}

/**
 * One row in the "Published Slots" list. Used by both the mentor's
 * profile-settings page and the admin's "Manage mentor availability" page so
 * the visual chrome stays in lockstep.
 *
 * Booked slots are rendered with an amber chip + a disabled trash icon (per
 * the API: `DELETE` single raises 400 if `is_booked`). The full date is shown
 * in the trash-icon tooltip, matching the mentor UI.
 */
export function AvailabilitySlotRow({
  slot,
  onDelete,
  isDeleting,
  selectable,
  selected,
  onToggleSelect,
}: AvailabilitySlotRowProps) {
  const start = formatTime(slot.start_time)
  const end = formatTime(slot.end_time)
  const isBooked = slot.is_booked || (slot.booked_intervals?.length ?? 0) > 0
  const slotDay = toDateKey(new Date(slot.start_time))

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 transition ${
        isBooked
          ? 'border-amber-200 bg-amber-50'
          : selected
            ? 'border-blue-300 bg-blue-50/40'
            : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex min-w-0 items-center gap-2">
        {selectable ? (
          <input
            type="checkbox"
            checked={!!selected}
            disabled={isBooked}
            onChange={onToggleSelect}
            aria-label={`Select ${start}–${end} on ${formatDateLabel(slotDay)}`}
            className="size-4 shrink-0 cursor-pointer rounded border-slate-300 text-blue-600 accent-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          />
        ) : null}
        {isBooked ? (
          <Check className="size-3.5 text-amber-600" aria-hidden="true" />
        ) : (
          <div className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
        )}
        <span className="truncate text-xs font-semibold text-slate-700">
          {start} – {end}
        </span>
        {isBooked ? (
          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-700">
            BOOKED
          </span>
        ) : null}
      </div>
      {!selectable && !isBooked ? (
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          aria-label="Delete slot"
          title={formatDateLabel(slotDay)}
          className="flex size-6 items-center justify-center rounded-lg text-blue-700 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
        >
          <Trash2 className="size-3.5" />
        </button>
      ) : null}
    </div>
  )
}
