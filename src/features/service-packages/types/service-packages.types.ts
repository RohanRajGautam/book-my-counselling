// Service package offered by a mentor for booking.
export interface ServicePackageResponse {
  id: string
  mentor_id: string
  title: string
  description: string | null
  duration_minutes: number
  price: string
  is_active: boolean
  created_at: string
  updated_at: string
}
