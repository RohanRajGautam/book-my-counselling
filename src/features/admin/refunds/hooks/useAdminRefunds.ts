import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  approveRefund,
  listRefunds,
  markRefundProcessed,
  rejectRefund,
} from '../api/refunds.api'
import { RefundStatus } from '../../types/admin.types'

export const ADMIN_REFUNDS_KEY = ['admin', 'refunds'] as const

export function useAdminRefunds(status: RefundStatus | undefined, page = 1) {
  return useQuery({
    queryKey: [...ADMIN_REFUNDS_KEY, status ?? 'all', page],
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
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ADMIN_REFUNDS_KEY })
    },
  })
}

export function useRejectRefund() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      rejectRefund(id, notes),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ADMIN_REFUNDS_KEY })
    },
  })
}

export function useMarkRefundProcessed() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      reference,
      notes,
    }: {
      id: string
      reference: string
      notes?: string
    }) => markRefundProcessed(id, reference, notes),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ADMIN_REFUNDS_KEY })
      void qc.invalidateQueries({ queryKey: ['admin', 'analytics', 'stats'] })
      void qc.invalidateQueries({ queryKey: ['admin', 'analytics', 'revenue'] })
    },
  })
}
