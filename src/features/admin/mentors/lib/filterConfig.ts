import type { AdminMentorFilter } from '../hooks/useAdminMentors'

export type AdminMentorTabId = 'pending' | 'approved' | 'rejected' | 'all'

export interface AdminMentorTab {
  id: AdminMentorTabId
  label: string
  filter: AdminMentorFilter
  emptyMsg: string
}

/**
 * Mentor-management tabs. Each tab maps to a specific backend filter pair:
 *   pending  → is_verified=false, is_rejected=false  (never reviewed)
 *   approved → is_verified=true                       (approved)
 *   rejected → is_rejected=true                       (explicitly rejected)
 *   all      → no filter
 */
export const ADMIN_MENTOR_TABS: readonly AdminMentorTab[] = [
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
    id: 'all',
    label: 'All',
    filter: {},
    emptyMsg: 'No mentors found.',
  },
] as const

export function findAdminMentorTab(id: AdminMentorTabId): AdminMentorTab {
  const tab = ADMIN_MENTOR_TABS.find((t) => t.id === id)
  if (!tab) throw new Error(`Unknown mentor tab: ${id}`)
  return tab
}
