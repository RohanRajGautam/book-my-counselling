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
