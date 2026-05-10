import api from '@/lib/api/api-client'
import { Industry } from '../types/industries.types'

// Fetches industries for filters and catalog-driven UI.
export async function getIndustries(): Promise<Industry[]> {
  const response = await api.get<Industry[]>('/catalog/industries')

  return response.data
}
