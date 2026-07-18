import { useQuery } from '@tanstack/react-query'
import { getTags } from '../api/tags.api'
import { TagResponse } from '../types/tags.types'

export function useTags() {
  return useQuery<TagResponse[]>({
    queryKey: ['tags'],
    queryFn: getTags,
  })
}