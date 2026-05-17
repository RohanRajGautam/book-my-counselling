import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'
import {
  AdminMentorProfile, AdminStats, RefundRequest, RefundStatus,
} from '../types/admin.types'

export async function getAdminStats(): Promise<AdminStats> {
  const res = await apiClient.get<AdminStats>('/admin/stats')
  return res.data
}

export async function getAdminMentors(
  isVerified?: boolean,
  isRejected?: boolean,
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<AdminMentorProfile>> {
  const res = await apiClient.get<PaginatedResponse<AdminMentorProfile>>('/admin/mentors', {
    params: {
      is_verified: isVerified,
      is_rejected: isRejected,
      page,
      page_size: pageSize,
    },
  })
  return res.data
}

export async function verifyMentor(mentorId: string): Promise<{ message: string }> {
  const res = await apiClient.patch<{ message: string }>(`/admin/mentors/${mentorId}/verify`)
  return res.data
}

export async function rejectMentor(mentorId: string): Promise<{ message: string }> {
  const res = await apiClient.patch<{ message: string }>(`/admin/mentors/${mentorId}/reject`)
  return res.data
}

export async function featureMentor(mentorId: string, featured: boolean): Promise<{ message: string }> {
  const res = await apiClient.patch<{ message: string }>(
    `/admin/mentors/${mentorId}/feature`,
    null,
    { params: { featured } }
  )
  return res.data
}

export async function reindexElasticsearch(): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>('/admin/es/reindex')
  return res.data
}

// ── Refunds ────────────────────────────────────────────────────────────────

export async function listRefunds(
  status?: RefundStatus,
  page = 1,
  pageSize = 20,
): Promise<PaginatedResponse<RefundRequest>> {
  const res = await apiClient.get<PaginatedResponse<RefundRequest>>(
    '/refunds/admin',
    { params: { status, page, page_size: pageSize } },
  )
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
