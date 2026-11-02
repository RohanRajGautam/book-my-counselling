import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  AdminListMentorSessionsParams,
  adminGetMentorSessionSummary,
  adminListMentorSessions,
} from '../api/mentor-sessions.api'
import { MENTOR_SESSION_SUMMARY_KEY, MENTOR_SESSIONS_KEY } from '../lib/queryKeys'

export interface UseMentorSessionsParams extends AdminListMentorSessionsParams {
  mentorId: string
  page?: number
}

/**
 * One mentor's platform bookings.
 *
 * Every filter gets its own positional slot in the key so changing one
 * changes the cache entry — the mentor id is slot 0 of the feature prefix,
 * so two mentors never share an entry.
 */
export function useMentorSessions({
  mentorId,
  status,
  paymentStatus,
  dateFrom,
  dateTo,
  sort,
  page = 1,
}: UseMentorSessionsParams) {
  return useQuery({
    queryKey: [
      ...MENTOR_SESSIONS_KEY,
      mentorId,
      status ?? 'all',
      paymentStatus ?? 'all',
      dateFrom ?? '',
      dateTo ?? '',
      sort ?? 'session',
      page,
    ],
    queryFn: () =>
      adminListMentorSessions(mentorId, {
        status,
        paymentStatus,
        dateFrom,
        dateTo,
        sort,
        page,
      }),
    enabled: !!mentorId,
    placeholderData: keepPreviousData,
    staleTime: 15 * 1000,
  })
}

/**
 * Grouped counts for one mentor's sessions. Backs the summary cards and the
 * "still open" count.
 */
export function useMentorSessionSummary(mentorId: string) {
  return useQuery({
    queryKey: [...MENTOR_SESSION_SUMMARY_KEY, mentorId],
    queryFn: () => adminGetMentorSessionSummary(mentorId),
    enabled: !!mentorId,
    staleTime: 15 * 1000,
  })
}
