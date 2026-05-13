import apiClient from '@/lib/api/api-client'
import { LoginResponse, UserResponse } from '../types/auth.types'

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

export async function getMe(): Promise<UserResponse> {
  const response = await apiClient.get<UserResponse>('/auth/me')
  return response.data
}
