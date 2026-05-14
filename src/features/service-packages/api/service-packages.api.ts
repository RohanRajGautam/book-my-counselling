import apiClient from '@/lib/api/api-client'
import { ServicePackageResponse } from '../types/service-packages.types'

// Fetches active service packages offered by a mentor.
export async function getMentorPackages(mentorId: string): Promise<ServicePackageResponse[]> {
  const response = await apiClient.get<ServicePackageResponse[]>(
    `/service-packages/mentor/${mentorId}`,
    {
      params: {
        only_active: true,
      },
    }
  )

  return response.data
}

// Fetches all packages for the current authenticated mentor (including inactive).
export async function getMyPackages(): Promise<ServicePackageResponse[]> {
  const response = await apiClient.get<ServicePackageResponse[]>('/service-packages/me')
  return response.data
}

export interface PackageCreatePayload {
  title: string
  description?: string
  duration_minutes: number
  price: number
}

// Creates a single package.
export async function createPackage(data: PackageCreatePayload): Promise<ServicePackageResponse> {
  const response = await apiClient.post<ServicePackageResponse>('/service-packages', data)
  return response.data
}

// Deletes a package by ID.
export async function deletePackage(packageId: string): Promise<void> {
  await apiClient.delete(`/service-packages/${packageId}`)
}

// Replaces all mentor packages with the provided set.
// Deletes existing packages then creates the new ones.
export async function upsertMentorPackages(
  existing: ServicePackageResponse[],
  next: PackageCreatePayload[],
): Promise<ServicePackageResponse[]> {
  // Delete all existing packages
  await Promise.all(existing.map((pkg) => deletePackage(pkg.id)))
  // Create new packages
  const created = await Promise.all(next.map((pkg) => createPackage(pkg)))
  return created
}
