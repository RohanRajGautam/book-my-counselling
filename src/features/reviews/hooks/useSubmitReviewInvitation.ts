import { useMutation, useQueryClient } from '@tanstack/react-query'
import { submitReviewInvitation } from '../api/reviews.api'
import { ReviewSubmitRequest, ReviewResponse } from '../types/reviews.types'
import { reviewInvitationKey } from './useReviewInvitation'

export function useSubmitReviewInvitation(token: string) {
  const queryClient = useQueryClient()

  return useMutation<ReviewResponse, unknown, ReviewSubmitRequest>({
    mutationFn: (body) => submitReviewInvitation(token, body),
    onSuccess: () => {
      // After a successful submit, a revisit should land on the "already
      // submitted" state, not refetch a stale form. Bust the GET so a reload
      // (or refetch) gets fresh 400/already data.
      queryClient.invalidateQueries({ queryKey: reviewInvitationKey(token) })
      // The mentor's review listing might show this review — refresh too.
      queryClient.invalidateQueries({ queryKey: ['mentor-reviews'] })
    },
  })
}