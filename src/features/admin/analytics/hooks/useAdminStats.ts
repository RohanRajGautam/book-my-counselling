import { useQuery } from '@tanstack/react-query'
import { getAdminStats, getMentorOnboardingStats } from '../api/analytics.api'

export const ADMIN_STATS_KEY = ['admin', 'analytics', 'stats'] as const
export const MENTOR_ONBOARDING_STATS_KEY = [
  'admin',
  'analytics',
  'mentor-onboarding-stats',
] as const

export function useAdminStats() {
  return useQuery({
    queryKey: ADMIN_STATS_KEY,
    queryFn: getAdminStats,
    staleTime: 30 * 1000,
  })
}

/**
 * Day / week / month counts of newly-onboarded mentors. Short staleTime so
 * the dashboard reflects fresh signups without manual refresh — onboarding
 * can happen at any time.
 */
export function useMentorOnboardingStats() {
  return useQuery({
    queryKey: MENTOR_ONBOARDING_STATS_KEY,
    queryFn: getMentorOnboardingStats,
    staleTime: 30 * 1000,
  })
}
