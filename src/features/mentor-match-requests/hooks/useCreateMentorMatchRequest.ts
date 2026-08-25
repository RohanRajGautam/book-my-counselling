'use client'

import { useMutation } from '@tanstack/react-query'

import { createMentorMatchRequest } from '../api/mentor-match-requests.api'
import type {
  MentorMatchCreate,
  MentorMatchResponse,
} from '../types/mentor-match-requests.types'

export function useCreateMentorMatchRequest() {
  return useMutation<MentorMatchResponse, Error, MentorMatchCreate>({
    mutationFn: (payload) => createMentorMatchRequest(payload),
  })
}
