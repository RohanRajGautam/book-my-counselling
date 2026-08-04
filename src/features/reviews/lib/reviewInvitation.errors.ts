import axios, { AxiosError } from 'axios'
import type { ValidationError } from '@/features/booking/lib/validation'

// Outcomes for the GET /invitation/{token} call.
export type FetchError =
  | { kind: 'invalid' }
  | { kind: 'expired' }
  | { kind: 'already' }
  | { kind: 'network' }

// Outcomes for the POST /invitation/{token} call.
export type SubmitError =
  | { kind: 'invalid' }
  | { kind: 'expired' }
  | { kind: 'already' }
  | { kind: 'validation'; errors: ValidationError[]; message: string }
  | { kind: 'error'; message: string }
  | { kind: 'network' }

// Backend returns FastAPI-style `detail` strings. Match by substring.
function classifyDetailMessage(detail: string): 'expired' | 'already' | 'unknown' {
  const lower = detail.toLowerCase()
  if (lower.includes('expired')) return 'expired'
  if (lower.includes('already')) return 'already'
  return 'unknown'
}

function detailFromBody(body: unknown): string {
  if (body && typeof body === 'object' && 'detail' in body) {
    const detail = (body as { detail: unknown }).detail
    if (typeof detail === 'string') return detail
  }
  return ''
}

function statusFromError(err: unknown): number | null {
  if (axios.isAxiosError(err)) return err.response?.status ?? null
  return null
}

export function mapFetchError(status: number | null, body: unknown): FetchError {
  if (status === null) return { kind: 'network' }
  if (status === 404) return { kind: 'invalid' }
  if (status === 400) {
    const detail = detailFromBody(body)
    const cls = classifyDetailMessage(detail)
    if (cls === 'expired') return { kind: 'expired' }
    if (cls === 'already') return { kind: 'already' }
    return { kind: 'invalid' }
  }
  return { kind: 'network' }
}

interface BackendFieldError {
  loc?: (string | number)[]
  msg?: string
}

function parse422(errors: BackendFieldError[]): ValidationError[] {
  return errors
    .map((e) => {
      if (!e.msg) return null
      const path = (e.loc ?? []).filter((p) => p !== 'body').join('.')
      return { field: path || 'form', message: e.msg }
    })
    .filter((e): e is ValidationError => e !== null)
}

export function mapSubmitError(err: unknown): SubmitError {
  const status = statusFromError(err)
  if (status === null) return { kind: 'network' }

  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<unknown>
    const body = axiosErr.response?.data

    if (status === 422) {
      const detail =
        body && typeof body === 'object' && 'detail' in body
          ? (body as { detail: unknown }).detail
          : undefined
      const fieldErrors = Array.isArray(detail) ? parse422(detail as BackendFieldError[]) : []
      return {
        kind: 'validation',
        errors: fieldErrors,
        message: fieldErrors[0]?.message ?? 'Please fix the highlighted fields.',
      }
    }

    if (status === 404) return { kind: 'invalid' }

    if (status === 400 || status === 409) {
      const detail = detailFromBody(body)
      const cls = classifyDetailMessage(detail)
      if (cls === 'expired') return { kind: 'expired' }
      return { kind: 'already' }
    }
  }

  return {
    kind: 'error',
    message: 'Something went wrong. Please try again in a moment.',
  }
}