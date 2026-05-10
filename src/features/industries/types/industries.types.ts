// Normalized industry shape used by filters and UI lists.
export interface Industry {
  id: string
  name: string
  slug: string
  description?: string | null
}

// Raw industry object returned by API responses.
export interface IndustryResponse {
  id: string
  name: string
  slug: string
  description?: string | null
}
