import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getMentorAvailability,
  getMentorBookableUnits,
  getMyAvailabilitySlots,
  createSlotsBulk,
  deleteSlot,
  deleteSlotsBulk,
} from '../api/availability.api'
import type {
  AvailabilitySlotResponse,
  BookableUnit,
  BulkSlotCreatePayload,
  BulkSlotCreateResponse,
} from '../types/availability.types'

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
export function useMentorBookableUnits(
  mentorId: string | null,
  packageId: string | null,
) {
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
