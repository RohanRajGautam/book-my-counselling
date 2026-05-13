import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getMyServicePackages,
  createServicePackage,
  updateServicePackage,
  deleteServicePackage,
} from '../api/mentor-dashboard.api'
import { ServicePackageCreate, ServicePackageUpdate } from '../types/mentor-dashboard.types'

export const SERVICE_PACKAGES_KEY = ['mentor', 'service-packages']

export function useMentorServicePackages() {
  return useQuery({
    queryKey: SERVICE_PACKAGES_KEY,
    queryFn: getMyServicePackages,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateServicePackage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ServicePackageCreate) => createServicePackage(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SERVICE_PACKAGES_KEY }),
  })
}

export function useUpdateServicePackage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServicePackageUpdate }) =>
      updateServicePackage(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SERVICE_PACKAGES_KEY }),
  })
}

export function useDeleteServicePackage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteServicePackage(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SERVICE_PACKAGES_KEY }),
  })
}
