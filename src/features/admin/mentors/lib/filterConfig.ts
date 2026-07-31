import type { AdminMentorFilter } from '../hooks/useAdminMentors'

export type AdminMentorTabId =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'without_availability'
  | 'all'

export interface AdminMentorTab {
  id: AdminMentorTabId
  label: string
  filter: AdminMentorFilter
  emptyMsg: string
}

/**
 * Mentor-management tabs. Each tab maps to a specific backend filter:
 *   all                  → no filter
 *   pending              → is_verified=false, is_rejected=false (never reviewed)
 *   approved             → is_verified=true
 *   rejected             → is_rejected=true
 *   without_availability → without_availability=true (no upcoming slots)
 */
export const ADMIN_MENTOR_TABS: readonly AdminMentorTab[] = [
  {
    id: 'all',
    label: 'All',
    filter: {},
    emptyMsg: 'No mentors found.',
  },
  {
    id: 'pending',
    label: 'Pending',
    filter: { isVerified: false, isRejected: false },
    emptyMsg: 'No pending applications.',
  },
  {
    id: 'approved',
    label: 'Approved',
    filter: { isVerified: true },
    emptyMsg: 'No approved mentors yet.',
  },
  {
    id: 'rejected',
    label: 'Rejected',
    filter: { isRejected: true },
    emptyMsg: 'No rejected applications.',
  },
  {
    id: 'without_availability',
    label: 'Missing availability',
    filter: { withoutAvailability: true },
    emptyMsg: 'No mentors are missing availability.',
  },
] as const

export function findAdminMentorTab(id: AdminMentorTabId): AdminMentorTab {
  const tab = ADMIN_MENTOR_TABS.find((t) => t.id === id)
  if (!tab) throw new Error(`Unknown mentor tab: ${id}`)
  return tab
}
