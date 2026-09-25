import { getMe } from '../api/auth.api'
import type { QueryClient } from '@tanstack/react-query'
import { setTokens } from '@/lib/auth/auth'

/**
 * Common post-login bookkeeping used by both the password flow and the OAuth
 * callback flow. The password flow's `useMutation.onSuccess` already seeds
 * the cache from the LoginResponse payload; the OAuth callback flow only has
 * an access/refresh pair in the URL fragment, so it needs to fetch /auth/me
 * explicitly.
 *
 * Returns the cached user on success so callers (e.g. the callback route)
 * can decide where to navigate based on role without an extra query
 * subscribe.
 */
export async function completeOAuthLogin(
  accessToken: string,
  refreshToken: string,
  queryClient: QueryClient,
) {
  setTokens(accessToken, refreshToken)
  const user = await getMe()
  queryClient.setQueryData(['auth', 'me'], user)
  return user
}
