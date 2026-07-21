import { BarChart3, Bell, Banknote, CalendarSearch, Database, UserCheck } from 'lucide-react'

export type AdminNavItem = {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  href: string
  label: string
  /** Section header this item falls under. Items without a section render before any header. */
  section?: 'Workspace' | 'Maintenance'
}

export const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  { icon: BarChart3, href: '/admin/dashboard', label: 'Analytics' },
  { icon: UserCheck, href: '/admin/mentors', label: 'Mentors' },
  { icon: CalendarSearch, href: '/admin/bookings', label: 'Bookings' },
  { icon: Banknote, href: '/admin/refunds', label: 'Refunds' },
  { icon: Bell, href: '/admin/reminders', label: 'Reminders' },
  { icon: Database, href: '/admin/maintenance', label: 'Maintenance', section: 'Maintenance' },
] as const

/**
 * True when `pathname` matches this nav item. The dashboard special-cases
 * the root /admin and any /admin/dashboard/** sub-route.
 */
export function isAdminNavItemActive(item: AdminNavItem, pathname: string): boolean {
  if (item.href === '/admin/dashboard') {
    return pathname === '/admin' || pathname.startsWith('/admin/dashboard')
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

/** Returns the item whose label should be shown in the mobile header. */
export function findAdminActiveNavItem(pathname: string): AdminNavItem | undefined {
  return ADMIN_NAV_ITEMS.find((item) => isAdminNavItemActive(item, pathname))
}
