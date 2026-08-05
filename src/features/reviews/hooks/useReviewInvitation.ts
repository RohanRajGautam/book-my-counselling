import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { getReviewInvitation } from '../api/reviews.api'
import { ReviewInvitation } from '../types/reviews.types'

export const reviewInvitationKey = (token: string) => ['review-invitation', token] as const

// One-shot fetch for a magic-link token. Each token gets its own cache entry;
// staleTime: 0 means a remount always refetches — fine and cheap, and the
// state machine expects fresh data on revisit.
export function useReviewInvitation(token: string | undefined) {
  return useQuery<ReviewInvitation, AxiosError>({
    queryKey: token ? reviewInvitationKey(token) : ['review-invitation', 'idle'],
    queryFn: () => getReviewInvitation(token!),
    enabled: !!token,
    staleTime: 0,
    gcTime: 0,
    retry: false,
  })
}