// Admin event hooks — list + detail + the create / update / delete / mark-complete
// mutations. Nested mutations live in `useAdminEventNested.ts` so this file stays
// focused on top-level event state.

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  createAdminEvent,
  deleteAdminEvent,
  getAdminEvent,
  getAdminEvents,
  markEventComplete,
  updateAdminEvent,
} from '../api/admin-events.api'
import {
  EventCreatePayload,
  EventResponse,
  EventSummaryResponse,
  EventUpdatePayload,
} from '../types/events.types'
import { PaginatedResponse } from '@/lib/api/api.types'

export const ADMIN_EVENTS_KEY = ['admin', 'events'] as const
export const ADMIN_EVENT_DETAIL_KEY = ['admin', 'event'] as const

// ── List ─────────────────────────────────────────────────────────────────

export type AdminEventFilter = {
  isCompleted?: boolean | null
}

export function useAdminEvents(filter: AdminEventFilter, page = 1, pageSize = 20) {
  return useQuery<PaginatedResponse<EventSummaryResponse>>({
    queryKey: [...ADMIN_EVENTS_KEY, filter, page, pageSize],
    queryFn: () => getAdminEvents({ ...filter, page, pageSize }),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

// ── Detail ───────────────────────────────────────────────────────────────

export function useAdminEvent(eventId: string | undefined) {
  return useQuery<EventResponse>({
    queryKey: [...ADMIN_EVENT_DETAIL_KEY, eventId],
    queryFn: () => getAdminEvent(eventId as string),
    enabled: !!eventId,
    staleTime: 15 * 1000,
  })
}

// ── Mutations ────────────────────────────────────────────────────────────

export function useCreateAdminEvent() {
  const qc = useQueryClient()
  return useMutation<EventResponse, Error, EventCreatePayload>({
    mutationFn: (payload) => createAdminEvent(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ADMIN_EVENTS_KEY })
    },
  })
}

export function useUpdateAdminEvent(eventId: string) {
  const qc = useQueryClient()
  return useMutation<EventResponse, Error, EventUpdatePayload>({
    mutationFn: (payload) => updateAdminEvent(eventId, payload),
    onSuccess: (data) => {
      qc.setQueryData([...ADMIN_EVENT_DETAIL_KEY, eventId], data)
      void qc.invalidateQueries({ queryKey: ADMIN_EVENTS_KEY })
    },
  })
}

export function useDeleteAdminEvent() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteAdminEvent(id),
    onSuccess: (_data, id) => {
      qc.removeQueries({ queryKey: [...ADMIN_EVENT_DETAIL_KEY, id] })
      void qc.invalidateQueries({ queryKey: ADMIN_EVENTS_KEY })
    },
  })
}

export function useMarkEventComplete(eventId: string) {
  const qc = useQueryClient()
  return useMutation<EventResponse, Error, void>({
    mutationFn: () => markEventComplete(eventId),
    onSuccess: (data) => {
      qc.setQueryData([...ADMIN_EVENT_DETAIL_KEY, eventId], data)
      void qc.invalidateQueries({ queryKey: ADMIN_EVENTS_KEY })
      toast.success('Event marked as complete.')
    },
    onError: () => {
      toast.error('Failed to mark event complete.')
    },
  })
}

// ── Helper to surface 422 details ────────────────────────────────────────

interface ApiErrorBody {
  detail?: string | EventValidationRow[] | unknown
  errors?: EventValidationRow[]
}

interface EventValidationRow {
  field?: string
  message?: string
  type?: string
  loc?: unknown[]
}

/**
 * Walk the 422 envelope and produce `{ field: message }` for every entry.
 * Handles both `{ detail: [{...}] }` (FastAPI default) and `{ errors: [...] }`
 * (project custom) shapes.
 */
export function extractValidationErrors(err: unknown): Record<string, string> {
  const out: Record<string, string> = {}
  if (!err || typeof err !== 'object') return out
  const e = err as { response?: { data?: ApiErrorBody } }
  const data = e.response?.data
  if (!data) return out

  const candidates: EventValidationRow[] = []
  if (Array.isArray(data.detail)) {
    for (const row of data.detail) {
      if (row && typeof row === 'object') candidates.push(row as EventValidationRow)
    }
  } else if (Array.isArray(data.errors)) {
    for (const row of data.errors) candidates.push(row as EventValidationRow)
  }

  for (const row of candidates) {
    const message = row.message
    if (!message) continue
    let field = row.field ?? ''
    if (!field && Array.isArray(row.loc)) {
      field = (row.loc as unknown[])
        .filter((l) => l !== 'body')
        .map((l) => String(l))
        .join('.')
    }
    if (field && !(field in out)) out[field] = message
  }

  return out
}
