// Lightweight availability window used by mentor search results.
export interface AvailabilitySlot {
  start: string
  end: string
}

// Raw availability slot returned by the mentor availability endpoint.
export interface AvailabilitySlotResponse {
  id: string
  mentor_id: string
  start_time: string
  end_time: string
  is_booked: boolean
  is_recurring: boolean
  recurrence_rule: string | null
  created_at: string
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

// A weekly schedule entry used by the mentor dashboard UI.
export interface WeeklyScheduleEntry {
  dayOfWeek: number      // 0 = Sunday … 6 = Saturday
  startHour: number      // 0–23
  startMinute: number    // 0 or 30
  endHour: number
  endMinute: number
}
