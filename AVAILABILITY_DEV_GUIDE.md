# Frontend Dev Guide — Availability & Slot-Booking Refactor

> **Audience:** Frontend engineers working on the booking flow.
> **Repo:** `book-my-counselling/` (Next.js + React Query + Tailwind).
> **Status:** Implemented end-to-end on backend + frontend. This is the
> what-shipped guide, not a plan — read it to onboard and understand
> the new contracts.

---

## 1. What changed (and why)

The booking system had three production bugs:

1. **A 90-min package could book a 60-min slot.** The backend never read
   `package.duration_minutes` when validating the slot window.
2. **Frontend chopped slots into 30/60/90-min slices client-side.** The
   slicing was cosmetic, ignored `package.duration_minutes` semantics, and
   produced broken adjacency behaviour.
4. **After a successful booking, the slot reappeared as unbooked when the
   user reopened the profile modal.** React Query had a 2-minute `staleTime`
   and no `invalidateQueries` ran on the booking success path.

The fix makes the backend the single source of truth for "what is
bookable right now" via a new endpoint that emits discrete,
package-aligned units, drops all client-side slicing, and invalidates
availability caches after every booking event.

---

## 2. New API contract

**`GET /api/v1/availability/mentor/{mentor_id}/bookable-units`**

| Param       | Required | Default | Notes |
| ----------- | --------- | ------- | ----- |
| `package_id`| ✅        | —       | Service package the mentee selected. |
| `from_time` | ❌        | now (UTC)| ISO datetime; lower bound for returned units. |
| `page`      | ❌        | 1       | Standard pagination. |
| `page_size` | ❌        | 100     | Capped by server. |

**Response:**

```json
{
  "items": [
    {
      "id": "8e4f0...c2:2026-10-02T09:00:00+00:00",
      "parent_slot_id": "8e4f0...c2",
      "mentor_id": "1a2b...c4",
      "start_time": "2026-10-02T09:00:00+00:00",
      "end_time":   "2026-10-02T10:00:00+00:00",
      "is_booked":  false
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 100
}
```

**Key invariants enforced by the backend:**

- A unit is emitted only if the parent slot window fits
  `package.duration_minutes` cleanly. A 60-min slot with a 90-min
  package returns `[]`.
- A unit is marked `is_booked: true` if any **confirmed** or **completed**
  booking on the same mentor overlaps its window.
- The `id` is **deterministic** (`<parent_slot_id>:<start_iso>`) so the
  frontend can keep selection state across refetches.
- Past units are filtered out.

The legacy `/availability/mentor/{id}` endpoint still exists and is
unchanged. It is used by:

- The mentor-only "my availability" settings view (where partial bookings
  matter — `booked_intervals` is populated).
- Any UI that needs to render raw slot rows for editing.

**Do not call the legacy endpoint from the mentee booking flow.** Use
`getMentorBookableUnits(mentorId, packageId)`.

---

## 3. Files you will touch

| File | Change |
| --- | --- |
| `src/features/availability/api/availability.api.ts` | Added `getMentorBookableUnits`. `createSlotsBulk` now returns `BulkSlotCreateResponse` (`{items, conflicts}`). |
| `src/features/availability/types/availability.types.ts` | New `BookableUnit` and `BulkSlotCreateResponse` types. `booked_intervals` is required (not optional). Removed `is_recurring` / `recurrence_rule` fields. |
| `src/features/availability/hooks/useMentorAvailability.ts` | New `useMentorBookableUnits(mentorId, packageId)` hook. `useMentorAvailability` staleTime reduced from 2 min → 30 s. All mutation hooks invalidate `mentor-bookable-units`. |
| `src/features/availability/components/AvailabilityPicker.tsx` | **Rewritten.** Renders `BookableUnit[]` directly. Day-strip and time-grid UX unchanged; the slot-list → sub-slice transformation is gone. |
| `src/features/academic-counsellor/components/AcademicCounsellorProfileModal.tsx` | Uses `useMentorBookableUnits` when a package is selected. Passes `units` to the new picker API. |
| `src/features/coach-for-freshers/components/CoachForFreshersProfileModal.tsx` | Same as above. |
| `src/features/profile-settings/components/ProfileSessionAvailabilityCard.tsx` | `useCreateSlotsBulk` now consumes `{items, conflicts}` — surface server-side rejections in the toast. |
| `src/features/booking/components/BookingPageContent.tsx` | Calls `createGuestBooking` without `session_start`/`session_end` when a `package_id` is selected (backend derives them). Invalidates `mentor-availability`, `mentor-bookable-units`, and `my-availability` on submit success, submit error, and payment confirmation. |

---

## 4. TypeScript types you'll use

```ts
import type {
  AvailabilitySlotResponse,
  BookableUnit,
  BulkSlotCreateResponse,
} from '@/features/availability/types/availability.types'

interface AvailabilitySlotResponse {
  id: string
  mentor_id: string
  start_time: string
  end_time: string
  is_booked: boolean
  created_at: string
  booked_intervals: Array<{ start: string; end: string }>  // required, not optional
}

interface BookableUnit {
  id: string                       // <parent_slot_id>:<start_iso>
  parent_slot_id: string
  mentor_id: string
  start_time: string
  end_time: string
  is_booked: boolean
}

interface BulkSlotCreateResponse {
  items: AvailabilitySlotResponse[]
  conflicts: Array<{
    start_time: string
    end_time: string
    reason: 'in_the_past' | 'overlaps_existing_slot'
  }>
}
```

The `is_recurring` and `recurrence_rule` fields have been dropped from
`AvailabilitySlotResponse` (the corresponding DB columns were removed in
the `c3d4e5f6g7h8` migration). Don't reference them anywhere.

---

## 5. How to use the picker

```tsx
import { AvailabilityPicker } from '@/features/availability/components/AvailabilityPicker'
import { useMentorBookableUnits } from '@/features/availability/hooks/useMentorAvailability'

const { data: bookableUnits = [], isPending } = useMentorBookableUnits(
  isOpen ? resolvedMentorId : null,
  selectedPackageId,
)

<AvailabilityPicker
  units={selectedPackageId ? bookableUnits : []}
  disabled={!selectedPackageId}
  selectedUnitId={selection.slicedSlotId}
  onSelect={(unit) =>
    setSelection({
      packageId: selectedPackageId,
      slicedSlotId: unit.id,                       // pass unit.id (deterministic)
      parentSlotId: unit.parent_slot_id,           // pass through for booking
      sessionStart: unit.start_time,
      sessionEnd: unit.end_time,
    })
  }
/>
```

**Migration checklist for any other modal that used to slice slots:**

1. Replace `useMentorAvailability(mentorId)` with
   `useMentorBookableUnits(mentorId, packageId)` when a package is
   selected.
2. Replace `slots={availability}` with `units={bookableUnits}`.
3. Drop the `packageDurationMinutes` prop from `<AvailabilityPicker>`.
4. Replace the `(slicedSlotId, parentSlotId, startTime, endTime)`
   callback with a single `(unit: BookableUnit) => void`.

---

## 6. How to submit a booking from this flow

```tsx
import { useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()
const mentorId = searchParams.get('mentorId')!
const packageId = searchParams.get('packageId')

const invalidateAvailabilityCaches = useCallback(() => {
  queryClient.invalidateQueries({ queryKey: ['mentor-availability', mentorId] })
  queryClient.invalidateQueries({ queryKey: ['mentor-bookable-units', mentorId] })
  queryClient.invalidateQueries({ queryKey: ['my-availability'] })
}, [queryClient, mentorId])

await createGuestBooking({
  mentor_id: mentorId,
  slot_id: selection.slicedSlotId,            // unit.id — slot row the unit belongs to
  package_id: packageId,
  // session_start IS required when package_id is set — it's the unit's
  // start_time, which the bookable-units endpoint emits (e.g. one 30-min
  // unit starts at slot.start_time, the next starts at slot.start_time +
  // 30min). session_end must NOT be sent; the backend derives it as
  // session_start + package.duration_minutes.
  session_start: selection.sessionStart,
  full_name: formData.fullName,
  email: formData.email,
  phone: formData.phone,
  goals: formData.message,
  mentee_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  promo_code: appliedPromo?.code,
})

// On success, error, and payment-confirmed:
invalidateAvailabilityCaches()
```

### 6.1 Why `session_start` but not `session_end`?

When the backend has a `package_id`:

```python
session_end = session_start + timedelta(minutes=package.duration_minutes)
```

The mentor can publish a single 60-min slot and have it host two 30-min
bookings back-to-back, or a 60-min slot and have it host one 60-min
booking. The bookable-units endpoint emits one row per discrete
package-sized unit, each with its own `start_time`. The backend needs
that `start_time` to know which unit is being claimed and to enforce
that it stays inside the parent slot.

Sending `session_end` is rejected (`400 "Do not pass session_end when
booking by package"`). Sending a wrong `session_start` is rejected as
"session_start is before the slot start" or "Package duration (X min)
does not fit in the selected slot".

The two flows that send client-chosen times remain:

- **Featured event** (`isEvent === true`): no package, no slot — backend
  takes the times at face value.
- **Coach for freshers without a slot** (`source === 'coach-for-freshers'
  && !slotId`): mentee typed in a date/time the mentor will review.

---

## 7. Cache invalidation rules

| Event | Invalidate |
| --- | --- |
| Booking submit succeeds (free booking auto-confirms) | `mentor-availability`, `mentor-bookable-units`, `my-availability` |
| Booking submit fails (e.g. payment timeout left a PENDING+unpaid row) | Same — defends against stale UI re-offering a slot the server has reserved. |
| Fonepay callback confirms payment | Same — the booking row transitions PENDING → CONFIRMED. The picker must reflect that before the user navigates back. |
| Mentor creates / deletes a slot | `my-availability`, `mentor-availability`, `mentor-bookable-units` |

Stale time is 30 s for `useMentorAvailability` and
`useMentorBookableUnits`, 60 s for `useMyAvailabilitySlots`. Even if a
code path forgets to invalidate, the worst case is a 30 s window.

---

## 8. Bulk-create contract change

`createSlotsBulk` now returns `{items, conflicts}` instead of a bare
array. The mentor UI should display the conflict count in its toast and
(optionally) let the mentor see which entries failed. The two conflict
reasons are:

| Reason | Meaning |
| --- | --- |
| `in_the_past` | `start_time <= now` — the slot's start is in the past. |
| `overlaps_existing_slot` | The slot intersects an existing availability row on the same mentor. |

Updated caller in `ProfileSessionAvailabilityCard`:

```tsx
createBulk(
  { slots: payload },
  {
    onSuccess: (response) => {
      const created = response.items.length
      const serverConflicts = response.conflicts.length
      // … toast logic uses created + serverConflicts + overlapCount + pastCount
    },
  },
)
```

If you add a new bulk-create caller, please preserve this contract.

---

## 9. Verification steps for QA

### Manual end-to-end (browser)

1. Log in as a mentee.
2. Open an academic counsellor profile. Mentor has only 60-min
   availability.
4. Select the 90-min package card → expect an **empty time-grid**
   ("No availability published yet"). The 60-min slot MUST NOT appear.
5. Select the 60-min package → expect the 60-min slot to appear.
6. Click the slot. Book it (use a 100%-off promo to skip payment flow, or
   a real payment).
7. After redirect, click "back" / reopen the profile → the just-booked
   slot MUST be marked unavailable **immediately** (not after 30 s).
8. Repeat on `/coach-for-freshers`.
9. Mentor profile-settings (`/profile-settings`) → confirm mentor still
   sees the underlying slot row (legacy endpoint unchanged).
10. Hard-refresh the browser tab — slot list still shows the booked slot
    as booked.

### Backend integration tests

```bash
cd byc-backend
pytest tests/integration/test_bookable_units_and_validation.py -v
pytest tests/integration/test_promo_code_free_booking.py -v
```

If you're adding more booking-related tests, mirror the helper in
`test_bookable_units_and_validation.py` (`_make_mentor_with_packages`)
— it builds a mentor with packages and a single slot.

### DB constraint verification

```sql
-- Attempt to insert a confirmed booking that overlaps another confirmed one:
INSERT INTO bookings (mentor_id, mentee_id, slot_id, package_id,
  status, payment_status, session_start, session_end,
  agreed_price, original_price, mentor_earning, platform_earning,
  is_released, created_at, updated_at)
VALUES (...);

-- Expect:
-- ERROR: conflicting key value violates exclusion constraint
-- "bookings_no_overlap"
```

The constraint was added in `b3c4d5e6f7g8` and is the absolute
last-line-of-defense against overlapping confirmed sessions on the same
mentor. Don't drop it.

---

## 10. Backend mapping (for reference)

| Backend file | Purpose |
| --- | --- |
| `app/services/availability.py::list_bookable_units` | New — emits discrete bookable units for a mentor + package. |
| `app/services/booking.py::create_booking` | When `package_id` is provided, `session_start` is REQUIRED from the client (the unit's `start_time`) and `session_end` is derived as `session_start + package.duration_minutes`. The duplicate-row guard is scoped to `(slot_id, session_start)` so multiple units inside one parent slot can coexist. |
| `app/services/booking.py` (create + cancel) | `await cache_service.delete_pattern("mentor_search:*")` after commit. |
| `app/services/fonepay.py` (payment confirmed) | Spawns `_refresh_es_after_payment(mentor_profile_id)` to push the latest slot flags to Elasticsearch. |
| `alembic/versions/b3c4d5e6f7g8_bookings_no_overlap_constraint.py` | Adds `EXCLUDE USING gist` on `bookings(mentor_id WITH =, tstzrange(session_start, session_end) WITH &&) WHERE status IN ('confirmed', 'completed')`. |
| `alembic/versions/c3d4e5f6g7h8_drop_recurring_slot_fields.py` | Drops `is_recurring` and `recurrence_rule` columns from `availability_slots`. |
| `alembic/versions/d4e5f6g7h8i9_slot_id_session_start_uniq.py` | Replaces `UNIQUE (slot_id) WHERE is_released IS FALSE AND NOT (status='pending' AND payment_status='unpaid')` with the same on `(slot_id, session_start)`. Allows multiple effective bookings on the same parent slot provided they start at different times. |
| `app/api/v1/routers/availability.py` | New `GET /availability/mentor/{mentor_id}/bookable-units` endpoint. `/availability/bulk` now returns `AvailabilityBulkCreateResponse`. |

---

## 11. Out-of-scope (do not change in a side PR)

- Google Calendar OAuth integration. Stubbed at `app/services/calendar.py`.
- Mentor-timezone field. All times are stored in UTC; mentee timezone is
  display-only metadata.
- Optimistic UI on the slot picker (would need WebSocket fan-out). Cache
  invalidation + 30 s staleTime is sufficient for now.
- The legacy `/availability/mentor/{id}` endpoint — keep it for the
  mentor-only view. Do not redirect or remove.