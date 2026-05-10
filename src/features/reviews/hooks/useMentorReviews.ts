import { useQuery } from '@tanstack/react-query'
import { getMentorReviews } from '../api/reviews.api'
import { ReviewResponse } from '../types/reviews.types'
import { PaginatedResponse } from '@/lib/api/api.types'

export function useMentorReviews(mentorId: string | null, page: number) {
  return useQuery<PaginatedResponse<ReviewResponse>>({
    queryKey: ['mentor-reviews', mentorId, page],
    queryFn: () => getMentorReviews(mentorId!, page, 1),
    enabled: !!mentorId,
    staleTime: 5 * 60 * 1000,
  })
}
