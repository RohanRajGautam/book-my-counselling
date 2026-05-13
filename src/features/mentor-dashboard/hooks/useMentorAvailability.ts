import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getMyAvailabilitySlots,
  createAvailabilitySlot,
  deleteAvailabilitySlot,
} from '../api/mentor-dashboard.api'
import { AvailabilitySlotCreate } from '../types/mentor-dashboard.types'

export const AVAILABILITY_KEY = (mentorId: string) =>
  ['mentor', 'availability', mentorId] as const

export function useMentorAvailabilitySlots(mentorId: string | undefined) {
  return useQuery({
    queryKey: AVAILABILITY_KEY(mentorId ?? ''),
    queryFn: () => getMyAvailabilitySlots(mentorId!, false, 100),
    enabled: Boolean(mentorId),
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreateAvailabilitySlot(mentorId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AvailabilitySlotCreate) => createAvailabilitySlot(data),
    onSuccess: () => {
      if (mentorId) {
        queryClient.invalidateQueries({ queryKey: AVAILABILITY_KEY(mentorId) })
      }
    },
  })
}

export function useDeleteAvailabilitySlot(mentorId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (slotId: string) => deleteAvailabilitySlot(slotId),
    onSuccess: () => {
      if (mentorId) {
        queryClient.invalidateQueries({ queryKey: AVAILABILITY_KEY(mentorId) })
      }
    },
  })
}
