// Lightweight availability window used by mentor search results.
export interface AvailabilitySlot {
  start: string
  end: string
}

// Raw availability slot returned by the mentor availability endpoint.
// `booked_intervals` is required: any unit overlapping a confirmed booking
// is filtered before the picker ever sees it, but the field is kept for the
// mentor-only "my availability" view where partial bookings matter.
export interface AvailabilitySlotResponse {
  id: string
  mentor_id: string
  start_time: string
  end_time: string
  is_booked: boolean
  created_at: string
  booked_intervals: Array<{ start: string; end: string }>
}

// Discrete, server-validated bookable slice. The id is deterministic
// `<slot_id>:<start_iso>` so the picker can keep selection state across
// refetches without state loss. Parent slot id is preserved for the
// booking submission that still keys off the row in the bookings table.
export interface BookableUnit {
  id: string
  parent_slot_id: string
  mentor_id: string
  start_time: string
  end_time: string
  is_booked: boolean
}

// A day-grouped view used by the booking UI.
export interface AvailabilityDay {
  dateKey: string        // "YYYY-MM-DD" in local timezone
  label: string          // e.g. "Mon, May 19"
  slots: AvailabilitySlotResponse[]
}

// Payload for bulk slot creation.
export interface BulkSlotCreatePayload {
  slots: Array<{ start_time: string; end_time: string }>
}

// Result of bulk slot creation. `items` is what got persisted; `conflicts`
// is the surface for the previously-silent skip cases (past slots, slots
// that overlap an existing availability). The mentor UI uses `conflicts` to
// highlight which entries failed.
export interface BulkSlotCreateResponse {
  items: AvailabilitySlotResponse[]
  conflicts: Array<{
    start_time: string
    end_time: string
    reason: 'in_the_past' | 'overlaps_existing_slot'
  }>
}

// A weekly schedule entry used by the mentor dashboard UI.
export interface WeeklyScheduleEntry {
  dayOfWeek: number      // 0 = Sunday … 6 = Saturday
  startHour: number      // 0–23
  startMinute: number    // 0 or 30
  endHour: number
  endMinute: number
}
