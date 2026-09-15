// Constants used by the events feature.

/**
 * Form input style applied across every admin event form section. Bigger
 * height, soft border, blue focus ring — matches the platform's "filled"
 * form aesthetic without going as far as the booking form's tinted bg.
 */
export const EVENT_FORM_INPUT_CLASS =
  'h-11 w-full rounded-xl border border-[#d9e3f6] bg-white px-3.5 text-sm shadow-sm transition placeholder:text-slate-400 focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 focus:outline-none aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-100'

export const EVENT_PAGE_SIZE = 12
export const ADMIN_EVENT_PAGE_SIZE = 20
export const ADMIN_EVENT_BOOKINGS_PAGE_SIZE = 50

// Tabs in the admin event list. Matches the integration guide's "All / Upcoming / Past" UI.
export const ADMIN_EVENT_TABS = [
  { id: 'upcoming', label: 'Upcoming', filter: { is_completed: false } },
  { id: 'past', label: 'Past', filter: { is_completed: true } },
  { id: 'all', label: 'All', filter: {} },
] as const

export type AdminEventTabId = (typeof ADMIN_EVENT_TABS)[number]['id']

export function findAdminEventTab(id: string | null): (typeof ADMIN_EVENT_TABS)[number] {
  const match = ADMIN_EVENT_TABS.find((t) => t.id === id)
  return match ?? ADMIN_EVENT_TABS[0]
}

// Tabs in the admin event detail page.
export const ADMIN_EVENT_DETAIL_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'companies', label: 'Companies' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'bookings', label: 'Bookings' },
] as const

export type AdminEventDetailTabId = (typeof ADMIN_EVENT_DETAIL_TABS)[number]['id']

export function findAdminEventDetailTab(
  id: string | null
): (typeof ADMIN_EVENT_DETAIL_TABS)[number] {
  const match = ADMIN_EVENT_DETAIL_TABS.find((t) => t.id === id)
  return match ?? ADMIN_EVENT_DETAIL_TABS[0]
}

// Tabs in the admin create wizard. The integration guide lists five sections
// in order; we expose six (splitting details + speaker for cleaner editing).
export const ADMIN_EVENT_CREATE_TABS = [
  { id: 'details', label: 'Details' },
  { id: 'speaker', label: 'Speaker' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'companies', label: 'Companies' },
  { id: 'testimonials', label: 'Testimonials' },
] as const

export type AdminEventCreateTabId = (typeof ADMIN_EVENT_CREATE_TABS)[number]['id']

export function findAdminEventCreateTab(
  id: string | null
): (typeof ADMIN_EVENT_CREATE_TABS)[number] {
  const match = ADMIN_EVENT_CREATE_TABS.find((t) => t.id === id)
  return match ?? ADMIN_EVENT_CREATE_TABS[0]
}
