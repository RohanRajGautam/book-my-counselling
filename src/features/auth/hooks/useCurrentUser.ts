import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { getMe } from '../api/auth.api'
import { getAccessToken, clearTokens } from '@/lib/auth/auth'

export function useCurrentUser() {
  const hasToken = typeof window !== 'undefined' && Boolean(getAccessToken())

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        return await getMe()
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          clearTokens()
        }
        throw err
      }
    },
    enabled: hasToken,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
