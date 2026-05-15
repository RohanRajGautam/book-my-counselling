import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getMentorAvailability,
  getMyAvailabilitySlots,
  createSlotsBulk,
  deleteSlot,
  deleteSlotsBulk,
} from '../api/availability.api'
import type { AvailabilitySlotResponse, BulkSlotCreatePayload } from '../types/availability.types'

export function useMentorAvailability(mentorId: string | null) {
  return useQuery<AvailabilitySlotResponse[]>({
    queryKey: ['mentor-availability', mentorId],
    queryFn: () => getMentorAvailability(mentorId!),
    enabled: !!mentorId,
    staleTime: 2 * 60 * 1000,
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
  return useMutation({
    mutationFn: (payload: BulkSlotCreatePayload) => createSlotsBulk(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-availability'] })
      qc.invalidateQueries({ queryKey: ['mentor-availability'] })
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
    },
  })
}
