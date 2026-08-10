'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { AdminPageHeader } from '../layout/AdminPageHeader'
import { AdminMentorPagination } from '../mentors/components/AdminMentorPagination'

import {
  useAdminPromoCodes,
  useCreatePromoCode,
} from './hooks/useAdminPromoCodes'
import { AdminPromoCodeCard } from './components/AdminPromoCodeCard'
import { AdminPromoCodeFormModal } from './components/AdminPromoCodeFormModal'
import type { PromoCodeFormValues } from './lib/promoCodeValidation'

type TabId = 'all' | 'active' | 'inactive'

const TABS: ReadonlyArray<{ id: TabId; label: string; status?: 'active' | 'inactive' }> = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active', status: 'active' },
  { id: 'inactive', label: 'Inactive', status: 'inactive' },
]

function findTab(id: string | null): { id: TabId; label: string; status?: 'active' | 'inactive' } {
  return TABS.find((t) => t.id === id) ?? TABS[0]!
}

function extractApiError(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null
  const detail = (err as { response?: { data?: { detail?: unknown } } }).response?.data
    ?.detail
  if (typeof detail === 'string') return detail
  return null
}

export function AdminPromoCodesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams?.get('tab') ?? null
  const tab = findTab(tabParam)
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)

  const { data, isLoading } = useAdminPromoCodes({
    status: tab.status,
    page,
    page_size: 20,
  })
  const { mutate: create, isPending: creating } = useCreatePromoCode()

  const codes = data?.items ?? []

  const handleTabChange = (next: TabId) => {
    setPage(1)
    const params = new URLSearchParams(searchParams?.toString())
    if (next === 'all') {
      params.delete('tab')
    } else {
      params.set('tab', next)
    }
    const qs = params.toString()
    router.replace(`/admin/promo-codes${qs ? `?${qs}` : ''}`, { scroll: false })
  }

  const handleCreate = (values: PromoCodeFormValues) => {
    create(
      {
        code: values.code.trim().toUpperCase(),
        discount_percent: values.discountPercent.trim(),
        description: values.description.trim() || undefined,
        valid_until: values.validUntil ? new Date(values.validUntil).toISOString() : null,
      },
      {
        onSuccess: () => {
          toast.success(`Code created.`)
          setCreateOpen(false)
        },
        onError: (err) =>
          toast.error(extractApiError(err) ?? 'Failed to create promo code.'),
      },
    )
  }

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Promo codes"
          subtitle="Create and manage discount codes for booking sessions."
          action={
            <div className="flex shrink-0 items-center gap-3">
              <span className="hidden self-start rounded-full bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700 sm:inline-flex">
                {data?.total ?? 0} {tab.label.toLowerCase()}
              </span>
              <Button
                size="sm"
                className="gap-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="size-3.5" />
                New code
              </Button>
            </div>
          }
        />

        <div
          role="tablist"
          aria-label="Promo code status"
          className="flex flex-wrap gap-1 rounded-2xl bg-white p-1 shadow-sm"
        >
          {TABS.map((t) => {
            const active = t.id === tab.id
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleTabChange(t.id)}
                className={`min-w-[5.5rem] flex-1 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-extrabold transition ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        <section aria-label="Promo codes" className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1,2,3].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="h-9 w-9 rounded-xl bg-slate-100" />
                        <div className="h-5 w-32 rounded-md bg-slate-100" />
                        <div className="h-4 w-16 rounded-full bg-slate-100" />
                        <div className="h-4 w-16 rounded-full bg-slate-100" />
                      </div>
                      <div className="h-3 w-40 rounded-md bg-slate-100" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 w-16 rounded-xl bg-slate-100" />
                      <div className="h-8 w-24 rounded-xl bg-slate-100" />
                      <div className="h-8 w-16 rounded-xl bg-slate-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : codes.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-400">
                {tab.id === 'active'
                  ? 'No active promo codes.'
                  : tab.id === 'inactive'
                    ? 'No inactive promo codes.'
                    : 'No promo codes yet.'}
              </p>
            </div>
          ) : (
            codes.map((c) => <AdminPromoCodeCard key={c.id} code={c} />)
          )}
        </section>

        {data ? (
          <AdminMentorPagination
            page={data.page}
            totalPages={data.total_pages}
            total={data.total}
            itemLabel="codes"
            hasPrev={data.has_prev}
            hasNext={data.has_next}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => p + 1)}
          />
        ) : null}
      </div>

      {createOpen ? (
        <AdminPromoCodeFormModal
          mode="create"
          onClose={() => setCreateOpen(false)}
          onSubmitCreate={handleCreate}
          onSubmitUpdate={() => {
            /* unreachable in create mode */
          }}
          submitting={creating}
        />
      ) : null}
    </div>
  )
}