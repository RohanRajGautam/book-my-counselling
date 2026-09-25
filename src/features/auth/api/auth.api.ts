import apiClient from '@/lib/api/api-client'
import {
  LoginResponse,
  UserResponse,
  RegisterPayload,
  ForgotPasswordPayload,
  VerifyResetCodePayload,
  ResetPasswordPayload,
  MessageResponse,
  OAuthLinkPayload,
  OAuthProvider,
} from '../types/auth.types'

export async function login(email: string, password: string): Promise<LoginResponse> {
  // Backend uses OAuth2PasswordRequestForm — must be sent as form-encoded
  const params = new URLSearchParams()
  params.append('username', email)
  params.append('password', password)

  const response = await apiClient.post<LoginResponse>('/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return response.data
}

export async function register(payload: RegisterPayload): Promise<UserResponse> {
  const response = await apiClient.post<UserResponse>('/auth/register', payload)
  return response.data
}

export async function getMe(): Promise<UserResponse> {
  const response = await apiClient.get<UserResponse>('/auth/me')
  return response.data
}

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>(
    '/auth/forgot-password',
    payload,
  )
  return response.data
}

export async function verifyResetCode(
  payload: VerifyResetCodePayload,
): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>(
    '/auth/verify-reset-code',
    payload,
  )
  return response.data
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>(
    '/auth/reset-password',
    payload,
  )
  return response.data
}

// ---------------------------------------------------------------------------
// OAuth
// ---------------------------------------------------------------------------

/**
 * Exchange an OAuth provider authorization code for a linked account.
 * Requires an authenticated session — the apiClient interceptor attaches the
 * Bearer token automatically. The backend will refuse if the user has no other
 * way to sign in (no password, no other linked provider) on the subsequent
 * unlink, but link is unconstrained here.
 */
export async function linkOAuthProvider(payload: OAuthLinkPayload): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>('/auth/oauth/link', payload)
  return response.data
}

/**
 * Unlink a previously linked OAuth provider from the current user. Returns
 * 200 with a human-readable message on success; the backend returns 409 if
 * the user would be left without any sign-in method.
 */
export async function unlinkOAuthProvider(provider: OAuthProvider): Promise<MessageResponse> {
  const response = await apiClient.delete<MessageResponse>(
    `/auth/oauth/link/${provider}`,
  )
  return response.data
}
