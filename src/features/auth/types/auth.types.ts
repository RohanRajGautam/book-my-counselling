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

export interface RegisterPayload {
  email: string
  password: string
  full_name: string
  role?: 'mentor' | 'mentee'
}

export interface ForgotPasswordPayload {
  email: string
}

export interface VerifyResetCodePayload {
  email: string
  code: string
}

export interface ResetPasswordPayload {
  email: string
  code: string
  new_password: string
}

export interface MessageResponse {
  message: string
}
