import { PaginatedResponse } from '@/lib/api/api.types'
import apiClient from '@/lib/api/api-client'
import { ReviewResponse } from '../types/reviews.types'

export async function getMentorReviews(
  mentorId: string,
  page: number = 1,
  page_size: number = 1
): Promise<PaginatedResponse<ReviewResponse>> {
  const response = await apiClient.get<PaginatedResponse<ReviewResponse>>(
    `/reviews/mentor/${mentorId}`,
    {
      params: {
        page,
        page_size,
      },
    }
  )

  return response.data
}
