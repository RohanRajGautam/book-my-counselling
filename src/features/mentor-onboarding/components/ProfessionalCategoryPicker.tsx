'use client'

import { useQueries } from '@tanstack/react-query'
import { Check, ChevronDown, Loader2, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useCounselingCategories } from '@/features/categories/hooks/useCounselingCategories'
import { getSubcategories } from '@/features/categories/api/categories.api'
import { CategoryListItem, Subcategory } from '@/features/categories/types/categories.types'
import { ProfessionalCategoryWithSubs } from '@/features/mentor-dashboard/types/mentor-dashboard.types'

type ProfessionalCategoryPickerProps = {
  /** Currently-selected (category, subcategories) pairs. */
  value: ProfessionalCategoryWithSubs[]
  /** Called whenever the selection changes. */
  onChange: (next: ProfessionalCategoryWithSubs[]) => void
  /**
   * Optional allow-list of category names. When provided, only categories whose
   * normalized name matches an entry are shown. Existing selections on hidden
   * categories are preserved in `value` (so legacy data isn't silently dropped)
   * — the restriction only gates new picks.
   */
  restrictToNames?: string[]
}

/**
 * Multi-select picker for professional categories (IT / Management / General).
 * Subs are grouped under their parent category; each parent is a collapsible
 * row. Selections are stored as (parent, subs) pairs — the parent bucket is
 * created on the first sub toggle and removed when the last sub is toggled
 * off, so the picker UI never has to expose "parent on/off" separately.
 *
 * All subcategories are loaded upfront via parallel queries so search and
 * auto-expand work without per-row network calls. A parent auto-expands when
 * (a) it has existing selections or (b) the user is searching — manual
 * collapse sticks.
 */
export function ProfessionalCategoryPicker({
  value,
  onChange,
  restrictToNames,
}: ProfessionalCategoryPickerProps) {
  const { data: categories = [], isLoading: categoriesLoading } = useCounselingCategories('professional')
  const [query, setQuery] = useState('')

  const subsQueries = useQueries({
    queries: categories.map((c) => ({
      queryKey: ['category-subcategories', c.id] as const,
      queryFn: () => getSubcategories(c.id),
      staleTime: 10 * 60 * 1000,
    })),
  })
  const subsLoading = subsQueries.some((q) => q.isLoading)

  const subsByCategory = useMemo(() => {
    const map = new Map<string, Subcategory[]>()
    categories.forEach((c, idx) => {
      const subs = subsQueries[idx]?.data
      if (subs) map.set(c.id, subs)
    })
    return map
  }, [categories, subsQueries])

  const trimmedQuery = query.trim().toLowerCase()
  const isSearching = trimmedQuery.length > 0

  const visibleSubsByCategory = useMemo(() => {
    const map = new Map<string, Subcategory[]>()
    subsByCategory.forEach((subs, catId) => {
      if (!isSearching) {
        map.set(catId, subs)
        return
      }
      const filtered = subs.filter((s) => s.name.toLowerCase().includes(trimmedQuery))
      if (filtered.length > 0) map.set(catId, filtered)
    })
    return map
  }, [subsByCategory, isSearching, trimmedQuery])

  const selectedById = new Map(value.map((v) => [v.category_id, v]))
  const totalSelected = value.reduce((sum, v) => sum + v.subcategory_ids.length, 0)

  const setSubs = (categoryId: string, subIds: string[]) => {
    // A non-empty selection always has a parent bucket; empty means remove.
    if (subIds.length === 0) {
      onChange(value.filter((v) => v.category_id !== categoryId))
      return
    }
    if (!selectedById.has(categoryId)) {
      onChange([...value, { category_id: categoryId, subcategory_ids: subIds }])
      return
    }
    onChange(
      value.map((v) => (v.category_id === categoryId ? { ...v, subcategory_ids: subIds } : v))
    )
  }

  const toggleSub = (categoryId: string, subId: string) => {
    const current = selectedById.get(categoryId)?.subcategory_ids ?? []
    setSubs(
      categoryId,
      current.includes(subId) ? current.filter((s) => s !== subId) : [...current, subId]
    )
  }

  if (categoriesLoading || subsLoading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-[#f0f4ff] px-4 py-3 text-xs font-medium text-slate-600">
        <Loader2 className="size-3.5 animate-spin" />
        Loading professional categories…
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <p className="rounded-2xl bg-[#f0f4ff] px-4 py-3 text-xs font-medium text-slate-600">
        No professional categories are available right now. Please contact support.
      </p>
    )
  }

  const visibleCategories = categories.filter(
    (c) =>
      visibleSubsByCategory.has(c.id) &&
      (!restrictToNames || restrictToNames.length === 0
        ? true
        : restrictToNames.some(
            (allowed) => allowed.trim().toLowerCase() === c.name.trim().toLowerCase()
          ))
  )

  return (
    <div className="space-y-3">
      <PickerSearch value={query} onChange={setQuery} placeholder="Search services…" />

      <div className="flex items-center justify-between gap-3 px-1">
        <p className="text-xs font-medium text-slate-500">
          {totalSelected === 0 ? (
            'No services selected'
          ) : (
            <>
              <span className="font-extrabold text-blue-600">{totalSelected}</span>{' '}
              {totalSelected === 1 ? 'service' : 'services'} selected
            </>
          )}
        </p>
        {totalSelected > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-xs font-bold text-blue-600 underline-offset-2 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {visibleCategories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center">
          <p className="text-sm font-bold text-slate-700">No matches</p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            No services match “{query}”. Try a different search.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {visibleCategories.map((category) => {
            const subs = visibleSubsByCategory.get(category.id) ?? []
            const entry = selectedById.get(category.id)
            const selectedSubIds = entry?.subcategory_ids ?? []
            const totalInCategory = subsByCategory.get(category.id)?.length ?? subs.length
            return (
              <ProfessionalCategoryGroup
                key={category.id}
                category={category}
                subs={subs}
                selectedSubIds={selectedSubIds}
                totalInCategory={totalInCategory}
                onToggleSub={(id) => toggleSub(category.id, id)}
                forceExpand={isSearching}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

function PickerSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="size-3.5" strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}

function ProfessionalCategoryGroup({
  category,
  subs,
  selectedSubIds,
  totalInCategory,
  onToggleSub,
  forceExpand,
}: {
  category: CategoryListItem
  subs: Subcategory[]
  selectedSubIds: string[]
  totalInCategory: number
  onToggleSub: (id: string) => void
  forceExpand: boolean
}) {
  // `null` defers to the derived state until the user clicks the row.
  const [userExpanded, setUserExpanded] = useState<boolean | null>(null)
  const selectedCount = selectedSubIds.length
  const expanded = userExpanded ?? (selectedCount > 0 || forceExpand)

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
        selectedCount > 0 ? 'border-blue-200' : 'border-slate-200'
      }`}
    >
      <button
        type="button"
        onClick={() => setUserExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-extrabold transition ${
              selectedCount > 0
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {category.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">{category.name}</p>
            <p className="text-[11px] font-medium text-slate-500">
              {selectedCount > 0
                ? `${selectedCount} of ${totalInCategory} selected`
                : `${totalInCategory} service${totalInCategory === 1 ? '' : 's'}`}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`size-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            expanded ? 'rotate-180 text-blue-600' : ''
          }`}
        />
      </button>

      {expanded && (
        <div className="border-t border-slate-200 bg-slate-50/60 px-3 py-3">
          <div className="flex flex-wrap gap-1.5">
            {subs.map((sub) => (
              <FieldChip
                key={sub.id}
                subcategory={sub}
                active={selectedSubIds.includes(sub.id)}
                onClick={() => onToggleSub(sub.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FieldChip({
  subcategory,
  active,
  onClick,
}: {
  subcategory: Subcategory
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`group inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all duration-150 active:scale-[0.97] ${
        active
          ? 'border-blue-600 bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.22)]'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <span
        className={`flex size-3.5 shrink-0 items-center justify-center rounded-full transition ${
          active ? 'bg-white/25 text-white' : 'bg-slate-200 text-transparent group-hover:bg-slate-300'
        }`}
      >
        <Check className="size-2.5" strokeWidth={4} />
      </span>
      {subcategory.name}
    </button>
  )
}
