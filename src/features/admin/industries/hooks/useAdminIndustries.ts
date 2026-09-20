import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createIndustry, deleteIndustry } from '../api/industries.api'
import type { IndustryCreate } from '../types/industries.types'

/** Public list query key — invalidated on writes so the mentor picker refreshes. */
export const INDUSTRIES_QUERY_KEY = ['industries'] as const

export function useCreateIndustry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: IndustryCreate) => createIndustry(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: INDUSTRIES_QUERY_KEY })
    },
  })
}

export function useDeleteIndustry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteIndustry(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: INDUSTRIES_QUERY_KEY })
    },
  })
}