'use client'

import { useState } from 'react'
import { Loader2, Pencil, Power, Tag, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import type { PromoCodeResponse } from '../types/promo-codes.types'
import {
  useDeletePromoCode,
  useUpdatePromoCode,
} from '../hooks/useAdminPromoCodes'
import { formatDateTime } from '../../lib/format'
import type { PromoCodeFormValues } from '../lib/promoCodeValidation'
import { AdminPromoCodeFormModal } from './AdminPromoCodeFormModal'

const STATUS_BADGE = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-slate-100 text-slate-500',
} as const

function extractApiError(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null
  const detail = (err as { response?: { data?: { detail?: unknown } } }).response?.data
    ?.detail
  if (typeof detail === 'string') return detail
  return null
}

export function AdminPromoCodeCard({ code }: { code: PromoCodeResponse }) {
  const [editOpen, setEditOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { mutate: update, isPending: updating } = useUpdatePromoCode()
  const { mutate: remove, isPending: deleting } = useDeletePromoCode()

  const handleToggle = () =>
    update(
      { id: code.id, payload: { is_active: !code.is_active } },
      {
        onSuccess: () =>
          toast.success(
            code.is_active
              ? `Code ${code.code} deactivated.`
              : `Code ${code.code} activated.`,
          ),
        onError: (err) =>
          toast.error(extractApiError(err) ?? 'Failed to update promo code.'),
      },
    )

  const handleUpdate = (_id: string, values: PromoCodeFormValues) => {
    const payload = {
      discount_percent: values.discountPercent.trim(),
      description: values.description.trim() === '' ? '' : values.description.trim(),
      is_active: code.is_active,
      valid_until: values.validUntil ? new Date(values.validUntil).toISOString() : null,
    }
    update(
      { id: code.id, payload },
      {
        onSuccess: () => {
          toast.success(`Code ${code.code} updated.`)
          setEditOpen(false)
        },
        onError: (err) =>
          toast.error(extractApiError(err) ?? 'Failed to update promo code.'),
      },
    )
  }

  const handleDelete = () =>
    remove(code.id, {
      onSuccess: () => {
        toast.success(`Code ${code.code} deleted.`)
        setConfirmDelete(false)
      },
      onError: (err) =>
        toast.error(
          extractApiError(err) ?? 'Failed to delete promo code.',
        ),
    })

  const status = code.is_active ? 'active' : 'inactive'
  const discountLabel = `${Number(code.discount_percent)}% off`
  const validLabel = code.valid_until
    ? `Expires ${formatDateTime(code.valid_until)}`
    : 'No expiry'

  return (
    <>
      <article className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                <Tag className="size-4" />
              </span>
              <span className="font-headline text-lg font-extrabold text-slate-950">
                {code.code}
              </span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold text-blue-700">
                {discountLabel}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${STATUS_BADGE[status]}`}
              >
                {status}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-600">
                Used {code.times_used}×
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-700">{validLabel}</p>
            {code.description ? (
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                {code.description}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 rounded-xl"
              disabled={updating || deleting}
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="size-3.5" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className={`gap-1.5 rounded-xl ${
                code.is_active
                  ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                  : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
              }`}
              disabled={updating || deleting}
              onClick={handleToggle}
            >
              {updating ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Power className="size-3.5" />
              )}
              {code.is_active ? 'Deactivate' : 'Activate'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
              disabled={updating || deleting || code.times_used > 0}
              onClick={() => setConfirmDelete(true)}
              title={
                code.times_used > 0
                  ? 'Code is in use by bookings; deactivate it instead.'
                  : undefined
              }
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </article>

      {editOpen ? (
        <AdminPromoCodeFormModal
          mode="edit"
          initial={code}
          onClose={() => setEditOpen(false)}
          onSubmitCreate={() => {
            /* unreachable in edit mode */
          }}
          onSubmitUpdate={handleUpdate}
          submitting={updating}
        />
      ) : null}

      {confirmDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="font-headline text-lg font-extrabold text-slate-950">
              Delete {code.code}?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              This permanently removes the code. Codes referenced by any booking
              can&rsquo;t be deleted — deactivate those instead.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmDelete(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button
                className="gap-1.5 bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}