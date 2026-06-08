export interface WebinarDetails {
  slug: string
  guestName: string
  guestDesc?: string
  imageUrl: string
  topic: string
  duration: string
  date?: string
  time?: string
  seats: number
  highlights: string[]
}
