import { useQuery } from '@tanstack/react-query'
import { getMe } from '../api/auth.api'
import { getAccessToken } from '@/lib/auth/auth'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    // Only fetch if a token is present
    enabled: typeof window !== 'undefined' && Boolean(getAccessToken()),
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}
