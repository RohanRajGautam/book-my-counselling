import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getMentorPackages,
  getMyPackages,
  upsertMentorPackages,
  type PackageCreatePayload,
} from '../api/service-packages.api'
import { ServicePackageResponse } from '../types/service-packages.types'

export function useMentorPackages(mentorId: string | null) {
  const enabled = !!mentorId

  return useQuery({
    queryKey: ['mentor-packages', mentorId],
    queryFn: () => getMentorPackages(mentorId!),
    enabled,
    staleTime: 10 * 60 * 1000,
  })
}

export function useMyPackages() {
  return useQuery({
    queryKey: ['my-packages'],
    queryFn: getMyPackages,
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpsertMentorPackages() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      existing,
      next,
    }: {
      existing: ServicePackageResponse[]
      next: PackageCreatePayload[]
    }) => upsertMentorPackages(existing, next),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-packages'] })
      // Also invalidate public package queries so homepage refreshes
      qc.invalidateQueries({ queryKey: ['mentor-packages'] })
    },
  })
}
