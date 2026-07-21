import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'
import { RefundRequest, RefundStatus } from '../../types/admin.types'

export async function listRefunds(
  status?: RefundStatus,
  page = 1,
  pageSize = 20,
): Promise<PaginatedResponse<RefundRequest>> {
  const res = await apiClient.get<PaginatedResponse<RefundRequest>>('/refunds/admin', {
    params: { status, page, page_size: pageSize },
  })
  return res.data
}

export async function approveRefund(
  refundId: string,
  decisionNotes?: string,
): Promise<RefundRequest> {
  const res = await apiClient.post<RefundRequest>(
    `/refunds/admin/${refundId}/approve`,
    { decision_notes: decisionNotes ?? null },
  )
  return res.data
}

export async function rejectRefund(
  refundId: string,
  decisionNotes?: string,
): Promise<RefundRequest> {
  const res = await apiClient.post<RefundRequest>(
    `/refunds/admin/${refundId}/reject`,
    { decision_notes: decisionNotes ?? null },
  )
  return res.data
}

export async function markRefundProcessed(
  refundId: string,
  fonepayRefundReference: string,
  decisionNotes?: string,
): Promise<RefundRequest> {
  const res = await apiClient.post<RefundRequest>(
    `/refunds/admin/${refundId}/processed`,
    {
      fonepay_refund_reference: fonepayRefundReference,
      decision_notes: decisionNotes ?? null,
    },
  )
  return res.data
}
