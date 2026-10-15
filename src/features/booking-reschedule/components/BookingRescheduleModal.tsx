'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarClock, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { SlotPicker } from '@/features/booking/components/SlotPicker'
import {
  useMentorAvailability,
  useMentorBookableUnits,
} from '@/features/availability/hooks/useMentorAvailability'
import type { AvailabilitySlotResponse } from '@/features/availability/types/availability.types'

import { useRescheduleBooking } from '../hooks/useRescheduleBooking'
import type { ReschedulableBooking } from '../types'

export interface BookingRescheduleModalProps {
  booking: ReschedulableBooking
  onClose: () => void
  /**
   * When the admin triggered the reschedule (vs the mentor), the success
   * toast should append "By admin on behalf of {mentor name}." so the admin
   * has a single-sentence acknowledgement of whose authority they acted
   * under.
   */
  triggeredByAdmin?: boolean
}

const REASON_MAX = 2000

/**
 * Pull a human-friendly string out of a FastAPI error payload.
 *
 *   422 — list of `{loc, msg, type}` (Pydantic). Surface the first msg as
 *         the topBanner; nothing maps cleanly to a single field on the
 *         reschedule form so we don't try to split it.
 *   4xx/5xx with `{detail: string}` — use that.
 *   Anything else — null so the caller can supply a generic fallback.
 */
function extractApiError(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null
  const e = err as Record<string, unknown>
  const response = e['response'] as Record<string, unknown> | undefined
  const data = response?.['data'] as Record<string, unknown> | undefined
  if (!data) return null
  if (Array.isArray(data['detail'])) {
    const items = data['detail'] as Array<Record<string, unknown>>
    const first = items[0]
    if (first && typeof first['msg'] === 'string') return first['msg']
    return null
  }
  if (typeof data['detail'] === 'string') return data['detail']
  return null
}

/** Read the HTTP status code off an axios-shaped error. Returns null when
 *  the error isn't axios-shaped (e.g. a network failure). */
function extractStatus(err: unknown): number | null {
  if (!err || typeof err !== 'object') return null
  const e = err as Record<string, unknown>
  const response = e['response']
  if (!response || typeof response !== 'object') return null
  const status = (response as Record<string, unknown>)['status']
  return typeof status === 'number' ? status : null
}

/** "Mon, Oct 13" — short, locale-aware day label. */
function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

/** "2:00 PM – 3:00 PM" — locale-aware 12-hour range. */
function formatTimeRange(startIso: string, endIso: string): string {
  const fmt = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
  return `${fmt.format(new Date(startIso))} – ${fmt.format(new Date(endIso))}`
}

/** "30 min" / "1h" / "1h 30m" — short duration label for the custom-time
 *  end-time preview. Same shape as the mentor session card duration. */
function formatDurationMinutes(mins: number): string {
  if (mins >= 60) {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return m === 0 ? `${h}h` : `${h}h ${m}m`
  }
  return `${mins} min`
}

// ── Sub-unit picker plumbing ────────────────────────────────────────────────

/**
 * Unified "pickable option" — the unit type the picker presents and that
 * holds the payload bits when the user submits. Backed by either:
 *
 *   - a `BookableUnit` returned by `/availability/mentor/{id}/bookable-units`
 *     when the booking has a `package_id` (sub-unit selection). The
 *     pickerId is the deterministic `<slot_id>:<start_iso>` the endpoint
 *     emits, and the PATCH carries the parent slot id + sub-unit start.
 *
 *   - an `AvailabilitySlotResponse` returned by `/availability/mentor/{id}?only_available=true`
 *     when the booking has no `package_id` (basic flow). pickerId is the
 *     slot's UUID; PATCH sends `new_session_start: null` so the booking
 *     lands at `slot.start_time`.
 */
interface RescheduleOption {
  pickerId: string
  /** Becomes the PATCH `new_slot_id`. */
  newSlotId: string
  /** Becomes the PATCH `new_session_start` (null when there's no package). */
  newSessionStart: string | null
  startTime: string
  endTime: string
}

export function BookingRescheduleModal({
  booking,
  onClose,
  triggeredByAdmin = false,
}: BookingRescheduleModalProps) {
  const [mode, setMode] = useState<'pick' | 'custom'>('pick')
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null)
  const [customDate, setCustomDate] = useState('')
  const [customTime, setCustomTime] = useState('')
  const [reason, setReason] = useState('')
  const [topError, setTopError] = useState<string | null>(null)

  const { mutate, isPending } = useRescheduleBooking()

  // Picker source:
  //   - Mentor + package → `bookable-units` (sub-units, one row per
  //     package-duration window inside each parent slot).
  //   - Mentor + no package → raw `availability` (basic flow).
  //   - Admin (any) → raw `availability` (basic flow). The bookable-units
  //     endpoint is mentor/mentee-side and 403s for admin tokens, so we
  //     skip the sub-unit UI on admin reschedules. The booking still
  //     moves correctly: the server lands the admin-picked slot at
  //     `slot.start_time` and applies the package's duration
  //     server-side.
  //
  // Each query is `enabled`-gated on non-null ids so the unused branch
  // never fires its fetch.
  const hasPackage = booking.package_id !== null && !triggeredByAdmin
  const unitsQuery = useMentorBookableUnits(
    hasPackage ? booking.mentor_id : null,
    hasPackage ? booking.package_id : null,
  )
  const slotsQuery = useMentorAvailability(hasPackage ? null : booking.mentor_id)

  const isLoading = hasPackage ? unitsQuery.isLoading : slotsQuery.isLoading

  // Stable `now` captured at mount; the user's selection won't disappear
  // mid-thought if the clock ticks while the modal is open.
  const [now] = useState(() => Date.now())

  // Project both query results into a common `RescheduleOption` shape so
  // the picker + filter + submit logic don't need to know which branch is
  // active. The bookable-units endpoint has already filtered out booked
  // sub-units; the raw-slot endpoint uses `only_available=true`. We don't
  // add an extra `is_booked` filter — the server is the source of truth.
  const allOptions = useMemo<RescheduleOption[]>(() => {
    if (hasPackage) {
      const units = unitsQuery.data ?? []
      return units.map((u) => ({
        pickerId: u.id,
        newSlotId: u.parent_slot_id,
        newSessionStart: u.start_time,
        startTime: u.start_time,
        endTime: u.end_time,
      }))
    }
    const slots = slotsQuery.data ?? []
    return slots.map((s) => ({
      pickerId: s.id,
      newSlotId: s.id,
      newSessionStart: null,
      startTime: s.start_time,
      endTime: s.end_time,
    }))
  }, [hasPackage, unitsQuery.data, slotsQuery.data])

  // Drop past options and the booking's *currently held* option. Current
  // is matched by `(slot_id, session_start)` tuple, which works for both
  // flows — the basic flow anchors `session_start` to `slot.start_time`
  // (slot-id match alone identifies it), and the sub-unit flow pins
  // session_start to a specific start (tuple match needed).
  const eligible = useMemo(() => {
    const currentSlot = booking.slot_id
    return allOptions.filter((o) => {
      if (new Date(o.startTime).getTime() <= now) return false
      if (o.newSlotId !== currentSlot) return true
      // Same slot — must compare start times. For the basic-flow branch
      // `newSessionStart` is `null` (we don't track parent start times),
      // so the slot-id match alone indicates "currently held" and we drop.
      if (!hasPackage) return false
      return o.newSessionStart !== booking.session_start
    })
  }, [allOptions, now, booking.slot_id, booking.session_start, hasPackage])

  const selectedOption = useMemo(() => {
    if (mode !== 'pick' || !selectedUnitId) return null
    return allOptions.find((o) => o.pickerId === selectedUnitId) ?? null
  }, [mode, selectedUnitId, allOptions])

  // Booking duration, in ms. The backend auto-derives the actual
  // duration from the package (if attached) or the booking's original
  // session_end - session_start — both equal this value when the booking
  // was made via the package flow. We pre-package legacy bookings also
  // use this since there's no separate "package duration" column. So
  // session_end - session_start is a faithful preview of what the
  // backend will use, and we don't need to plumb package duration
  // through ReschedulableBooking.
  const durationMs = useMemo(
    () =>
      new Date(booking.session_end).getTime() -
      new Date(booking.session_start).getTime(),
    [booking.session_start, booking.session_end],
  )
  const durationMinutes = Math.round(durationMs / 60000)

  // Custom-time: combine the date+time controls as the user's LOCAL
  // time, then serialise to ISO with offset. `new Date('YYYY-MM-DDTHH:MM')`
  // is parsed in the browser's local tz; `toISOString()` converts to UTC.
  // So a mentor in Nepal (UTC+5:45) picking 11:00 their time becomes
  // "2026-10-21T05:15:00.000Z", which the backend correctly interprets as
  // 11:00 Nepal wall-clock. (A naive ISO with no offset would be read as
  // UTC by the server, putting the session at the wrong wall-clock.) The
  // backend's own contract accepts either, but we always include the
  // offset for unambiguity.
  const customStartIso = useMemo(() => {
    if (!customDate || !customTime) return null
    const d = new Date(`${customDate}T${customTime}:00`)
    if (Number.isNaN(d.getTime())) return null
    return d.toISOString()
  }, [customDate, customTime])
  const customEndIso = useMemo(
    () =>
      customStartIso
        ? new Date(new Date(customStartIso).getTime() + durationMs).toISOString()
        : null,
    [customStartIso, durationMs],
  )

  // Local "today" in YYYY-MM-DD for the date input's `min` attribute.
  // Lets the browser's native picker block past dates as a UX hint —
  // not as a validation (the backend is the source of truth on 422).
  const todayLocal = useMemo(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }, [])

  // Lock body scroll + Esc-to-close while the modal is mounted.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, isPending])

  const reasonTrimmed = reason.trim()
  const canSubmit =
    !isPending &&
    (mode === 'custom' ? customStartIso !== null : selectedOption !== null)

  const refetchActive = () => {
    if (hasPackage) void unitsQuery.refetch()
    else void slotsQuery.refetch()
  }

  const onSuccess = () => {
    const lines = [
      `Session rescheduled — ${booking.mentee_first_name} has been notified.`,
    ]
    if (triggeredByAdmin) {
      lines.push(`By admin on behalf of ${booking.mentor_name}.`)
    }
    toast.success(lines.join(' '))
    onClose()
  }

  const onError = (err: unknown) => {
    const detail = extractApiError(err)
    const status = extractStatus(err)

    // 409: someone else just booked the selected slot OR another
    // CONFIRMED overlap is now on the mentor's calendar — both
    // surface as "someone claimed it" from the user's POV. Re-fetch
    // so the picker offers fresh options (and the just-disappeared
    // slot vanishes from view).
    //
    // Custom-time 409: the requested window partially overlaps an
    // existing slot on the mentor's calendar. Fall back to pick mode
    // so the user can see the conflicting slot in the list and pick
    // a target directly. (We don't pre-select — the API's `detail`
    // text names the slot but doesn't give us its UUID.)
    if (status === 409) {
      refetchActive()
      if (mode === 'custom') {
        setMode('pick')
      }
      setTopError(detail ?? 'Someone just claimed that slot — try another.')
      return
    }
    // 422: domain validation failure (past slot, duration doesn't
    // fit, no slot bound to the booking, past custom_session_start,
    // both/neither of new_slot_id + custom_session_start). Show the
    // API's `detail` when it carries one — "That slot isn't available"
    // is a poor fallback when the message is e.g. "New slot is the
    // same as the current slot." Use the API's exact message.
    if (status === 422) {
      setTopError(detail ?? 'That slot isn’t available — please pick another.')
      return
    }
    // 5xx + anything unexpected: don't auto-retry, generic message.
    setTopError(detail ?? 'Couldn’t reschedule — please try again.')
  }

  const handleSubmit = () => {
    if (mode === 'custom') {
      if (!customStartIso) return
      setTopError(null)
      mutate(
        {
          bookingId: booking.id,
          payload: {
            custom_session_start: customStartIso,
            reason: reasonTrimmed.length > 0 ? reasonTrimmed : null,
          },
        },
        { onSuccess, onError },
      )
      return
    }
    if (!selectedOption) return
    setTopError(null)
    mutate(
      {
        bookingId: booking.id,
        payload: {
          new_slot_id: selectedOption.newSlotId,
          new_session_start: selectedOption.newSessionStart,
          reason: reasonTrimmed.length > 0 ? reasonTrimmed : null,
        },
      },
      { onSuccess, onError },
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-3 py-6 sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-reschedule-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={() => {
          if (!isPending) onClose()
        }}
        className="absolute inset-0 cursor-default"
      />
      <div className="relative z-[1] flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h2
              id="booking-reschedule-title"
              className="font-headline text-lg font-extrabold tracking-tight text-slate-950 sm:text-xl"
            >
              Reschedule session with{' '}
              {triggeredByAdmin ? booking.mentor_name : booking.mentee_first_name}
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
              Pick a new time on{' '}
              {triggeredByAdmin ? `${booking.mentor_name}’s` : 'your'} calendar.
              The booking id, payment, and meeting link stay the same.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!isPending) onClose()
            }}
            aria-label="Close"
            className="grid size-9 shrink-0 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {/* Current booking */}
          <section
            className="flex items-start gap-3 rounded-xl bg-slate-50 px-3 py-2.5"
            aria-label="Currently scheduled"
          >
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white text-blue-700 ring-1 ring-blue-100">
              <CalendarClock className="size-3.5" aria-hidden="true" />
            </span>
            <div className="min-w-0 text-sm">
              <p className="font-bold text-slate-800">Currently scheduled</p>
              <p className="text-slate-600">
                {formatDay(booking.session_start)} ·{' '}
                {formatTimeRange(booking.session_start, booking.session_end)}
              </p>
            </div>
          </section>

          {/* Two pick modes:
              - "Pick from calendar" — slot list (sub-units when the
                booking has a package, whole slots otherwise). Renders
                the existing SlotPicker.
              - "Custom time" — date + start-time inputs that the
                backend turns into either a slot reuse, a 409 partial
                overlap, or an auto-created slot. We preview the
                derived end time client-side so the user sees the
                session length before submitting. */}
          <section aria-label="New time">
            <p className="mb-2 text-xs font-extrabold tracking-wide text-slate-500 uppercase">
              New time
            </p>
            <div
              role="radiogroup"
              aria-label="Reschedule mode"
              className="mb-3 inline-flex rounded-full bg-slate-100 p-1"
            >
              <button
                type="button"
                role="radio"
                aria-checked={mode === 'pick'}
                onClick={() => setMode('pick')}
                disabled={isPending}
                className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition ${
                  mode === 'pick'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Pick from calendar
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={mode === 'custom'}
                onClick={() => setMode('custom')}
                disabled={isPending}
                className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition ${
                  mode === 'custom'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Custom time
              </button>
            </div>

            {mode === 'pick' ? (
              isLoading ? (
                <div className="flex items-center gap-2 py-4 text-sm text-slate-500">
                  <Loader2 className="size-4 animate-spin" />
                  {hasPackage
                    ? 'Loading available sub-units…'
                    : 'Loading available slots…'}
                </div>
              ) : eligible.length === 0 ? (
                <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  No free{' '}
                  {hasPackage ? 'sub-units' : 'slots'} on{' '}
                  <span className="font-bold">{booking.mentor_name}</span>
                  ’s calendar right now. Add a new availability window, or come
                  back later.
                </div>
              ) : (
                <SlotPicker
                  slots={eligible.map<AvailabilitySlotResponse>((o) => ({
                    id: o.pickerId,
                    mentor_id: booking.mentor_id,
                    start_time: o.startTime,
                    end_time: o.endTime,
                    is_booked: false,
                    created_at: '',
                    booked_intervals: [],
                  }))}
                  loading={false}
                  selectedSlotId={selectedUnitId}
                  onSelect={setSelectedUnitId}
                />
              )
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="block text-[10px] font-extrabold tracking-wide text-slate-500 uppercase">
                      Date
                    </span>
                    <input
                      type="date"
                      min={todayLocal}
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      disabled={isPending}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-[10px] font-extrabold tracking-wide text-slate-500 uppercase">
                      Start time
                    </span>
                    <input
                      type="time"
                      step={300}
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      disabled={isPending}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
                    />
                  </label>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <p>
                    Duration:{' '}
                    <span className="font-bold text-slate-800">
                      {formatDurationMinutes(durationMinutes)}
                    </span>{' '}
                    <span className="text-slate-500">
                      (auto — your booking length)
                    </span>
                  </p>
                  {customStartIso && customEndIso ? (
                    <p className="mt-1 text-slate-500">
                      End time:{' '}
                      <span className="font-bold text-slate-700">
                        {formatTimeRange(customStartIso, customEndIso)}
                      </span>
                    </p>
                  ) : null}
                </div>
              </div>
            )}
          </section>

          {/* Reason (optional) */}
          <section aria-label="Reason">
            <label className="block">
              <span className="block text-xs font-extrabold tracking-wide text-slate-500 uppercase">
                Reason for the mentee (optional)
              </span>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => {
                  const next = e.target.value.slice(0, REASON_MAX)
                  setReason(next)
                }}
                placeholder="Tell the mentee why you’re moving. Empty here sends “no reason given.”"
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-200"
                disabled={isPending}
              />
              <p className="mt-1 text-[11px] text-slate-400">
                {reasonTrimmed.length}/{REASON_MAX} characters
              </p>
            </label>
          </section>

          {topError ? (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {topError}
            </div>
          ) : null}
        </div>

        <footer className="sticky bottom-0 flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Rescheduling…
              </>
            ) : (
              'Reschedule'
            )}
          </Button>
        </footer>
      </div>
    </div>
  )
}
