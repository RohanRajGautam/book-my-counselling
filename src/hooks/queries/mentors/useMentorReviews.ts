import { useQuery } from '@tanstack/react-query'
import { getMentorReviews } from '@/lib/api/mentors'

export function useMentorReviews(mentorId: string | null, page: number) {
  return useQuery({
    queryKey: ['mentor-reviews', mentorId, page],
    queryFn: () => getMentorReviews(mentorId!, page, 1),
    enabled: !!mentorId,
    staleTime: 5 * 60 * 1000,
  })
}
