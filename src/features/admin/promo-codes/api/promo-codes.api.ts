import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'

import type {
  PromoCodeCreate,
  PromoCodeListParams,
  PromoCodeResponse,
  PromoCodeUpdate,
} from '../types/promo-codes.types'

export async function listPromoCodes(
  params: PromoCodeListParams = {},
): Promise<PaginatedResponse<PromoCodeResponse>> {
  const res = await apiClient.get<PaginatedResponse<PromoCodeResponse>>(
    '/promo-codes/admin',
    {
      params: {
        status: params.status,
        page: params.page ?? 1,
        page_size: params.page_size ?? 20,
      },
    },
  )
  return res.data
}

export async function createPromoCode(
  payload: PromoCodeCreate,
): Promise<PromoCodeResponse> {
  const res = await apiClient.post<PromoCodeResponse>(
    '/promo-codes/admin',
    payload,
  )
  return res.data
}

export async function updatePromoCode(
  id: string,
  payload: PromoCodeUpdate,
): Promise<PromoCodeResponse> {
  const res = await apiClient.patch<PromoCodeResponse>(
    `/promo-codes/admin/${id}`,
    payload,
  )
  return res.data
}

export async function deletePromoCode(id: string): Promise<void> {
  await apiClient.delete(`/promo-codes/admin/${id}`)
}