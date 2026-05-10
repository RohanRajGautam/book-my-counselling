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
