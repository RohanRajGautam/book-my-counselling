export interface UserPublic {
  id: string
  full_name: string
  avatar_url: string | null
  role: 'mentor' | 'mentee' | 'admin'
}
