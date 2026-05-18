import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  approveRefund, listRefunds, markRefundProcessed, rejectRefund,
} from '../api/admin.api'
import { RefundStatus } from '../types/admin.types'

export function useAdminRefunds(status: RefundStatus | undefined, page = 1) {
  return useQuery({
    queryKey: ['admin', 'refunds', status ?? 'all', page],
    queryFn: () => listRefunds(status, page),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

export function useApproveRefund() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      approveRefund(id, notes),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'refunds'] }),
  })
}

export function useRejectRefund() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      rejectRefund(id, notes),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'refunds'] }),
  })
}

export function useMarkRefundProcessed() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id, reference, notes,
    }: { id: string; reference: string; notes?: string }) =>
      markRefundProcessed(id, reference, notes),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'refunds'] }),
  })
}
