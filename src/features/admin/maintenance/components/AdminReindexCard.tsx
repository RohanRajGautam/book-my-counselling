'use client'

import { Database, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useReindexES } from '../../mentors/hooks/useAdminMentors'

export function AdminReindexCard() {
  const { mutate: reindex, isPending: reindexing } = useReindexES()

  const handleReindex = () =>
    reindex(undefined, {
      onSuccess: (data) => toast.success(data.message),
      onError: () => toast.error('Reindex failed.'),
    })

  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <Database className="size-5 text-blue-700" />
          </div>
          <div className="min-w-0">
            <h2 className="font-headline text-base font-extrabold text-slate-950 sm:text-lg">
              Elasticsearch Reindex
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Sync all approved mentor profiles into the search index. Run this
              after bulk-editing mentor records or after deploying a profile
              schema change.
            </p>
            <p className="mt-2 text-xs font-semibold text-slate-400">
              May take a few minutes for large catalogues.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="gap-2 rounded-xl self-stretch sm:self-auto"
          disabled={reindexing}
          onClick={handleReindex}
        >
          {reindexing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Database className="size-4" />
          )}
          Reindex now
        </Button>
      </div>
    </article>
  )
}
