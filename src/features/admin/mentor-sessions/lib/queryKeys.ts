/**
 * Query-key prefixes for the mentor-scoped session lists.
 *
 * They live in a plain constants module (no imports) so the bookings feature
 * can invalidate them without importing this feature's hooks — and without an
 * import cycle.
 *
 * A mentor's session list holds the same `AdminBookingRow`s as the global
 * bookings list, so completing a booking has to patch both prefixes.
 *
 * The summary prefix is deliberately NOT a prefix-match of the list prefix
 * (`mentor-session-summary` vs `mentor-sessions`) so the row-patch walk can
 * never mistake the summary object for a paginated list.
 */

/** Paginated `AdminBookingRow` pages for one mentor's platform bookings. */
export const MENTOR_SESSIONS_KEY = ['admin', 'mentor-sessions'] as const

/** The `MentorSessionSummary` object for one mentor (not paginated). */
export const MENTOR_SESSION_SUMMARY_KEY = ['admin', 'mentor-session-summary'] as const
