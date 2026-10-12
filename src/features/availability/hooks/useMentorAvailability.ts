import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PaginatedResponse } from '@/lib/api/api.types'
import {
  adminCreateSlot,
  adminCreateSlotsBulk,
  adminDeleteSlot,
  adminDeleteSlotsBulk,
  adminListMentorAvailability,
  AdminAvailabilityListParams,
  createSlotsBulk,
  deleteSlot,
  deleteSlotsBulk,
  getMentorAvailability,
  getMentorBookableUnits,
  getMyAvailabilitySlots,
} from '../api/availability.api'
import type {
  AvailabilitySlotResponse,
  BookableUnit,
  BulkSlotCreatePayload,
  BulkSlotCreateResponse,
  SingleSlotCreatePayload,
} from '../types/availability.types'
import { MessageResponse } from '@/features/auth/types/auth.types'

// Returns raw, server-validated availability rows. Use this only for the
// mentor-only "my availability" / settings view where partial bookings matter.
// For the mentee booking flow, prefer `useMentorBookableUnits` — it returns
// discrete, package-aligned units with `is_booked` already computed.
export function useMentorAvailability(mentorId: string | null) {
  return useQuery<AvailabilitySlotResponse[]>({
    queryKey: ['mentor-availability', mentorId],
    queryFn: () => getMentorAvailability(mentorId!),
    enabled: !!mentorId,
    // 30s — short enough that any cache-invalidation miss surfaces quickly,
    // long enough that toggling the same profile a few times doesn't refetch.
    staleTime: 30 * 1000,
  })
}

// Fetches server-validated bookable units for a mentor + package. Each unit
// is exactly one booking — `is_booked: true` means another confirmed booking
// already covers that window. The deterministic id keeps selection state
// across refetches stable.
export function useMentorBookableUnits(mentorId: string | null, packageId: string | null) {
  return useQuery<BookableUnit[]>({
    queryKey: ['mentor-bookable-units', mentorId, packageId],
    queryFn: () => getMentorBookableUnits(mentorId!, packageId!),
    enabled: !!mentorId && !!packageId,
    staleTime: 30 * 1000,
  })
}

export function useMyAvailabilitySlots() {
  return useQuery<AvailabilitySlotResponse[]>({
    queryKey: ['my-availability'],
    queryFn: getMyAvailabilitySlots,
    staleTime: 60 * 1000,
  })
}

export function useCreateSlotsBulk() {
  const qc = useQueryClient()
  return useMutation<BulkSlotCreateResponse, Error, BulkSlotCreatePayload>({
    mutationFn: (payload) => createSlotsBulk(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-availability'] })
      qc.invalidateQueries({ queryKey: ['mentor-availability'] })
      qc.invalidateQueries({ queryKey: ['mentor-bookable-units'] })
    },
  })
}

export function useDeleteSlot() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (slotId: string) => deleteSlot(slotId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-availability'] })
      qc.invalidateQueries({ queryKey: ['mentor-availability'] })
      qc.invalidateQueries({ queryKey: ['mentor-bookable-units'] })
    },
  })
}

export function useDeleteSlotsBulk() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (slotIds: string[]) => deleteSlotsBulk(slotIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-availability'] })
      qc.invalidateQueries({ queryKey: ['mentor-availability'] })
      qc.invalidateQueries({ queryKey: ['mentor-bookable-units'] })
    },
  })
}

// ── Admin: manage any mentor's availability ──────────────────────────────
//
// Query keys are scoped per `mentorId` so a mutation on mentor A never
// invalidates mentor B's list. Mutations also invalidate the public
// `mentor-availability` / `mentor-bookable-units` (mentee-facing views) and
// the admin mentor-list caches that surface the "missing availability" tab,
// so the admin's other screens reflect the change immediately.

const adminAvailabilityKey = (mentorId: string | null, params: AdminAvailabilityListParams) =>
  ['admin', 'mentor-availability', mentorId, params] as const

export function useAdminMentorAvailability(
  mentorId: string | null,
  params: AdminAvailabilityListParams = {}
) {
  return useQuery<PaginatedResponse<AvailabilitySlotResponse>>({
    queryKey: adminAvailabilityKey(mentorId, params),
    queryFn: () => adminListMentorAvailability(mentorId!, params),
    enabled: !!mentorId,
    staleTime: 30 * 1000,
  })
}

export function useAdminCreateSlot(mentorId: string) {
  return useMutation<AvailabilitySlotResponse, Error, SingleSlotCreatePayload>({
    mutationFn: (payload) => adminCreateSlot(mentorId, payload),
  })
}

export function useAdminCreateSlotsBulk(mentorId: string) {
  const qc = useQueryClient()
  return useMutation<BulkSlotCreateResponse, Error, BulkSlotCreatePayload>({
    mutationFn: (payload) => adminCreateSlotsBulk(mentorId, payload),
    onSuccess: () => invalidateAdminAvailability(qc, mentorId),
  })
}

export function useAdminDeleteSlot(mentorId: string) {
  const qc = useQueryClient()
  return useMutation<MessageResponse, Error, string>({
    mutationFn: (slotId) => adminDeleteSlot(mentorId, slotId),
    onSuccess: () => invalidateAdminAvailability(qc, mentorId),
  })
}

export function useAdminDeleteSlotsBulk(mentorId: string) {
  const qc = useQueryClient()
  return useMutation<MessageResponse, Error, string[]>({
    mutationFn: (slotIds) => adminDeleteSlotsBulk(mentorId, slotIds),
    onSuccess: () => invalidateAdminAvailability(qc, mentorId),
  })
}

function invalidateAdminAvailability(qc: ReturnType<typeof useQueryClient>, mentorId: string) {
  // Admin list for this mentor.
  qc.invalidateQueries({ queryKey: ['admin', 'mentor-availability', mentorId] })
  // Public mentee-facing views hit the same slots.
  qc.invalidateQueries({ queryKey: ['mentor-availability', mentorId] })
  qc.invalidateQueries({ queryKey: ['mentor-bookable-units', mentorId] })
  // The "missing availability" admin tab and the underlying admin mentors
  // list re-render the badge counts.
  qc.invalidateQueries({ queryKey: ['admin', 'mentors'] })
  qc.invalidateQueries({ queryKey: ['admin', 'reminders'] })
  // Mentor search + per-mentor detail caches are busted server-side too.
  qc.invalidateQueries({ queryKey: ['mentors'] })
  qc.invalidateQueries({ queryKey: ['mentor'] })
}
