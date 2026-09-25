import { useMutation, useQueryClient } from '@tanstack/react-query'
import { linkOAuthProvider, unlinkOAuthProvider } from '../api/auth.api'
import type { OAuthLinkPayload, OAuthProvider } from '../types/auth.types'
import { getMe } from '../api/auth.api'

/**
 * Mutation that links a new OAuth provider to the current user, then
 * refreshes the cached "me" query so the settings UI can immediately show
 * the newly linked provider.
 */
export function useOAuthLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: OAuthLinkPayload) => linkOAuthProvider(payload),
    onSuccess: async () => {
      // Refetch /auth/me so the user object's oauth_providers list reflects
      // the new link. setQueryData would work too, but refetch keeps the
      // backend's source-of-truth ordering and any extra fields.
      try {
        const fresh = await getMe()
        queryClient.setQueryData(['auth', 'me'], fresh)
      } catch {
        // Worst case the cache falls back to refetchOnMount on next visit.
      }
    },
  })
}

/**
 * Mutation that unlinks an OAuth provider from the current user, then
 * refreshes the cached "me" query so the settings UI reflects the change.
 */
export function useOAuthUnlink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (provider: OAuthProvider) => unlinkOAuthProvider(provider),
    onSuccess: async () => {
      try {
        const fresh = await getMe()
        queryClient.setQueryData(['auth', 'me'], fresh)
      } catch {
        // See useOAuthLink above.
      }
    },
  })
}
