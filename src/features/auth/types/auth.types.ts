export type OAuthProvider = 'google' | 'linkedin'

export interface UserResponse {
  id: string
  email: string
  full_name: string
  role: 'mentor' | 'mentee' | 'admin'
  is_active: boolean
  is_verified: boolean
  avatar_url: string | null
  created_at: string
  // Populated when the backend includes the OAuth accounts linked to this
  // user (e.g. on /auth/me). Optional because the field is added by the
  // OAuth endpoints and isn't part of every legacy user payload.
  oauth_providers?: OAuthProvider[]
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: UserResponse
}

export interface OAuthLinkPayload {
  provider: OAuthProvider
  code: string
  redirect_uri: string
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
