'use client'

import { useState } from 'react'
import { Briefcase, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import type { Industry } from '@/features/industries/types/industries.types'

import { useDeleteIndustry } from '../hooks/useAdminIndustries'

function extractApiError(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null
  const detail = (err as { response?: { data?: { detail?: unknown } } }).response?.data
    ?.detail
  if (typeof detail === 'string') return detail
  return null
}

export function AdminIndustryCard({ industry }: { industry: Industry }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { mutate: remove, isPending: deleting } = useDeleteIndustry()

  const handleDelete = () =>
    remove(industry.id, {
      onSuccess: () => {
        toast.success(`Industry "${industry.name}" deleted.`)
        setConfirmDelete(false)
      },
      onError: (err) =>
        toast.error(extractApiError(err) ?? 'Failed to delete industry.'),
    })

  return (
    <>
      <article className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                <Briefcase className="size-4" />
              </span>
              <span className="font-headline text-lg font-extrabold text-slate-950">
                {industry.name}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wide text-slate-600">
                /{industry.slug}
              </span>
            </div>
            {industry.description ? (
              <p className="mt-2 text-sm text-slate-600">{industry.description}</p>
            ) : (
              <p className="mt-2 text-xs italic text-slate-400">No description.</p>
            )}
          </div>

          <div className="flex shrink-0 gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
              disabled={deleting}
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </article>

      {confirmDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="font-headline text-lg font-extrabold text-slate-950">
              Delete &ldquo;{industry.name}&rdquo;?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              This permanently removes the industry. Mentors currently tagged with
              it will lose it from their profile.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                className="gap-1.5 bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}