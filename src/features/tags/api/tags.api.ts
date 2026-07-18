import api from '@/lib/api/api-client'
import { TagResponse } from '../types/tags.types'

export async function getTags(): Promise<TagResponse[]> {
  const response = await api.get<TagResponse[]>('/catalog/tags')
  return response.data
}