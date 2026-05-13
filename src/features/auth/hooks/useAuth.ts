import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login, register } from '../api/auth.api'
import { setTokens, clearTokens, getAccessToken } from '@/lib/auth/auth'
import { RegisterPayload } from '../types/auth.types'
import { useCurrentUser } from './useCurrentUser'

export function useAuth() {
  const queryClient = useQueryClient()

  // Only use isLoading (initial fetch), NOT isFetching.
  // isFetching is true during background refetches and would cause the gate
  // to re-render → re-evaluate enabled → trigger another fetch → infinite loop.
  const { data: user, isLoading } = useCurrentUser()

  // A user is authenticated when:
  // 1. A token exists in localStorage (client-side only)
  // 2. The /auth/me query has resolved with a user object
  const isAuthenticated = Boolean(
    typeof window !== 'undefined' && getAccessToken() && user
  )

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token)
      // Seed the cache so useCurrentUser resolves without an extra round-trip
      queryClient.setQueryData(['auth', 'me'], data.user)
    },
  })

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
  })

  const logout = () => {
    clearTokens()
    queryClient.clear()
    window.location.href = '/mentor'
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    loginMutation,
    registerMutation,
    logout,
  }
}
