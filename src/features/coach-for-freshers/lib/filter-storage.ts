import { isCoachForFreshersCategory } from '../types/coach-for-freshers.types'
import type { CoachForFreshersFilters, SortBy } from '../types/filters.types'

const STORAGE_KEY = 'byc_cff_filters'

const SORT_VALUES: readonly SortBy[] = ['rating', 'reviews', 'price-low', 'price-high', 'newest']

function isSortBy(value: unknown): value is SortBy {
  return typeof value === 'string' && (SORT_VALUES as readonly string[]).includes(value)
}

function sanitizeFilters(raw: unknown): Partial<CoachForFreshersFilters> | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const out: Partial<CoachForFreshersFilters> = {}

  if (typeof r.jobTitle === 'string') out.jobTitle = r.jobTitle

  const category = r.category
  if (typeof category === 'string' && isCoachForFreshersCategory(category)) {
    out.category = category
  }

  if (typeof r.availableThisWeek === 'boolean') out.availableThisWeek = r.availableThisWeek

  if (isSortBy(r.sortBy)) out.sortBy = r.sortBy

  return out
}

function buildSearchParams(
  stored: Partial<CoachForFreshersFilters> | null,
): URLSearchParams | null {
  if (!stored) return null

  const params = new URLSearchParams()
  if (stored.jobTitle && stored.jobTitle.trim()) params.set('q', stored.jobTitle.trim())
  if (stored.category) params.set('category', stored.category)
  if (stored.availableThisWeek) params.set('available', 'this-week')
  if (stored.sortBy && stored.sortBy !== 'rating') params.set('sort', stored.sortBy)

  const query = params.toString()
  return query ? params : null
}

function readFromStorage(): URLSearchParams | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return buildSearchParams(sanitizeFilters(JSON.parse(raw)))
  } catch {
    return null
  }
}

let cachedSnapshot: URLSearchParams | null | undefined = undefined
const subscribers = new Set<() => void>()

function invalidateSnapshot() {
  cachedSnapshot = undefined
  for (const cb of subscribers) cb()
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) invalidateSnapshot()
  })
}

export function saveCoachForFreshersFilters(filters: CoachForFreshersFilters): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
    invalidateSnapshot()
  } catch {
    /* storage unavailable — ignore */
  }
}

// useSyncExternalStore pair. getSnapshot must return a stable reference until
// the underlying value actually changes; the module-level cache gives us that.
export function getStoredCoachForFreshersSearchParams(): URLSearchParams | null {
  if (cachedSnapshot === undefined) {
    cachedSnapshot = readFromStorage()
  }
  return cachedSnapshot
}

export function subscribeToStoredCoachForFreshersParams(callback: () => void): () => void {
  subscribers.add(callback)
  return () => {
    subscribers.delete(callback)
  }
}
