'use client'

import { useMemo, useState } from 'react'
import axios from 'axios'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useIndustries } from '@/features/industries/hooks/useIndustries'

import { AdminPageHeader } from '../layout/AdminPageHeader'

import {
  AdminIndustryFormModal,
  parseIndustryFieldErrors,
} from './components/AdminIndustryFormModal'
import { AdminIndustryCard } from './components/AdminIndustryCard'
import {
  useCreateIndustry,
} from './hooks/useAdminIndustries'
import type { IndustryFormValues } from './lib/industryValidation'

const DUPLICATE_NAME_MESSAGE =
  'An industry with this name already exists.'

export function AdminIndustriesPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [duplicateName, setDuplicateName] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const { data: industries = [], isLoading } = useIndustries()
  const { mutate: create, isPending: creating } = useCreateIndustry()

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return industries
    return industries.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.slug.toLowerCase().includes(q) ||
        (i.description ?? '').toLowerCase().includes(q),
    )
  }, [industries, search])

  const handleCreate = (values: IndustryFormValues) => {
    setDuplicateName(null)
    create(
      {
        name: values.name,
        description: values.description ? values.description : null,
      },
      {
        onSuccess: () => {
          toast.success(`Industry "${values.name}" added.`)
          setCreateOpen(false)
        },
        onError: (err) => {
          if (axios.isAxiosError(err) && err.response?.status === 409) {
            setDuplicateName(values.name)
            return
          }
          const fieldErrors = parseIndustryFieldErrors(err)
          if (fieldErrors.name) {
            setDuplicateName(null)
            toast.error(fieldErrors.name)
            return
          }
          toast.error(
            (axios.isAxiosError(err) && err.response?.data?.detail) ||
              'Failed to add industry.',
          )
        },
      },
    )
  }

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Industries"
          subtitle="The catalog mentors pick from when tagging their expertise."
          action={
            <div className="flex shrink-0 items-center gap-3">
              <span className="hidden self-start rounded-full bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700 sm:inline-flex">
                {industries.length} total
              </span>
              <Button
                size="sm"
                className="gap-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  setDuplicateName(null)
                  setCreateOpen(true)
                }}
              >
                <Plus className="size-3.5" />
                New industry
              </Button>
            </div>
          }
        />

        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name, slug, or description"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white pr-4 pl-10 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <section aria-label="Industries" className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-xl bg-slate-100" />
                        <div className="h-5 w-32 rounded-md bg-slate-100" />
                        <div className="h-4 w-20 rounded-full bg-slate-100" />
                      </div>
                      <div className="h-3 w-64 rounded-md bg-slate-100" />
                    </div>
                    <div className="h-8 w-20 rounded-xl bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-400">
                {search.trim()
                  ? 'No industries match your filter.'
                  : 'No industries yet. Add the first one to populate the mentor picker.'}
              </p>
            </div>
          ) : (
            filtered.map((industry) => (
              <AdminIndustryCard key={industry.id} industry={industry} />
            ))
          )}
        </section>
      </div>

      {createOpen ? (
        <AdminIndustryFormModal
          onClose={() => setCreateOpen(false)}
          onSubmit={handleCreate}
          submitting={creating}
          serverError={
            duplicateName
              ? `${DUPLICATE_NAME_MESSAGE} (${duplicateName})`
              : null
          }
        />
      ) : null}
    </div>
  )
}