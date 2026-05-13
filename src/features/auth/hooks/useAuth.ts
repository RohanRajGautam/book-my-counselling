import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login, register } from '../api/auth.api'
import { setTokens, clearTokens, getAccessToken } from '@/lib/auth/auth'
import { RegisterPayload } from '../types/auth.types'
import { useCurrentUser } from './useCurrentUser'

export function useAuth() {
  const queryClient = useQueryClient()
  const { data: user, isLoading, isFetching } = useCurrentUser()

  const isAuthenticated = Boolean(
    typeof window !== 'undefined' && getAccessToken() && user
  )

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token)
      // Seed the cache immediately so useCurrentUser resolves without a round-trip
      queryClient.setQueryData(['auth', 'me'], data.user)
    },
  })

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    // Registration doesn't return tokens — user must log in after
  })

  const logout = () => {
    clearTokens()
    queryClient.clear()
    // Hard-navigate to clear any in-memory state
    window.location.href = '/mentor'
  }

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || isFetching,
    loginMutation,
    registerMutation,
    logout,
  }
}
