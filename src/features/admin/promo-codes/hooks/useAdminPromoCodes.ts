import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  createPromoCode,
  deletePromoCode,
  listPromoCodes,
  updatePromoCode,
} from '../api/promo-codes.api'
import type {
  PromoCodeCreate,
  PromoCodeListParams,
  PromoCodeUpdate,
} from '../types/promo-codes.types'

export const ADMIN_PROMO_CODES_KEY = ['admin', 'promo-codes'] as const

export function useAdminPromoCodes(params: PromoCodeListParams = {}) {
  return useQuery({
    queryKey: [
      ...ADMIN_PROMO_CODES_KEY,
      params.status ?? 'all',
      params.page ?? 1,
    ],
    queryFn: () => listPromoCodes(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

export function useCreatePromoCode() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PromoCodeCreate) => createPromoCode(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ADMIN_PROMO_CODES_KEY })
    },
  })
}

export function useUpdatePromoCode() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PromoCodeUpdate }) =>
      updatePromoCode(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ADMIN_PROMO_CODES_KEY })
    },
  })
}

export function useDeletePromoCode() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePromoCode(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ADMIN_PROMO_CODES_KEY })
      void qc.invalidateQueries({ queryKey: ['admin', 'analytics', 'stats'] })
      void qc.invalidateQueries({ queryKey: ['admin', 'analytics', 'revenue'] })
    },
  })
}