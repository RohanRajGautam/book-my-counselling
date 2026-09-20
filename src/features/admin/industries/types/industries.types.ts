/** Payload for `POST /api/v1/admin/industries`. `slug` is derived server-side. */
export interface IndustryCreate {
  name: string
  description?: string | null
}