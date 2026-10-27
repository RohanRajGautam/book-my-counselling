export interface UserPublic {
  id: string
  full_name: string
  avatar_url: string | null
  role: 'mentor' | 'mentee' | 'admin'
}

/**
 * Fields the signed-in user may change on their own account.
 *
 * Only the fields present in the payload are touched — the rest of the
 * profile is preserved. An empty `phone` clears the number.
 */
export interface UserUpdatePayload {
  full_name?: string | null
  avatar_url?: string | null
  /** 7–50 characters. `null` clears it. */
  phone?: string | null
}
