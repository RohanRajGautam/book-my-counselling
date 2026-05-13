export interface UserResponse {
  id: string
  email: string
  full_name: string
  role: 'mentor' | 'mentee' | 'admin'
  is_active: boolean
  is_verified: boolean
  avatar_url: string | null
  created_at: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: UserResponse
}
