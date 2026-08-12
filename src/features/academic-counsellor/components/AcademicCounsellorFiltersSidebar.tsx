'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'

import {
  useAcademicCounsellorCategories,
  useAcademicCounsellorSubcategories,
} from '../hooks/useAcademicCounsellorCategories'
import { useAcademicFilters } from '../context/AcademicFiltersContext'

function toggleId(ids: string[], id: string) {
  return ids.includes(id) ? ids.filter((current) => current !== id) : [...ids, id]
}

interface CategoryRowProps {
  categoryId: string
  categoryName: string
  isExpanded: boolean
  onToggleExpanded: (id: string) => void
}

function CategoryRow({ categoryId, categoryName, isExpanded, onToggleExpanded }: CategoryRowProps) {
  const { filters, updateFilters } = useAcademicFilters()
  const isSelected = filters.academicCategory.includes(categoryName)
  const hasSelectedSubcategories = Object.values(filters.academicSubcategoryParents).some(
    (parent) => parent === categoryName
  )
  const isActive = isSelected || hasSelectedSubcategories
  const { data: subcategories = [], isFetching } = useAcademicCounsellorSubcategories(
    isExpanded ? categoryId : undefined
  )

  useEffect(() => {
    if (subcategories.length === 0) return
    let changed = false
    const nextParents = { ...filters.academicSubcategoryParents }
    for (const sub of subcategories) {
      if (
        filters.academicSubcategory.includes(sub.name) &&
        nextParents[sub.name] !== categoryName
      ) {
        nextParents[sub.name] = categoryName
        changed = true
      }
    }
    if (changed) {
      updateFilters({ academicSubcategoryParents: nextParents }, false)
    }
  }, [
    subcategories,
    filters.academicSubcategory,
    filters.academicSubcategoryParents,
    categoryName,
    updateFilters,
  ])

  const handleCategoryClick = () => {
    if (isSelected) {
      const removedSubcategories = new Set<string>()
      const nextParents: Record<string, string> = {}

      for (const [subcategory, parent] of Object.entries(filters.academicSubcategoryParents)) {
        if (parent === categoryName) {
          removedSubcategories.add(subcategory)
        } else {
          nextParents[subcategory] = parent
        }
      }

      for (const sub of subcategories) {
        if (filters.academicSubcategory.includes(sub.name)) {
          removedSubcategories.add(sub.name)
        }
      }

      if (isExpanded) onToggleExpanded(categoryId)

      updateFilters({
        academicCategory: filters.academicCategory.filter((name) => name !== categoryName),
        academicSubcategory: filters.academicSubcategory.filter(
          (name) => !removedSubcategories.has(name)
        ),
        academicSubcategoryParents: nextParents,
      })
      return
    }

    if (!isExpanded) onToggleExpanded(categoryId)
    updateFilters({
      academicCategory: [...filters.academicCategory, categoryName],
    })
  }

  const handleSubcategoryClick = (subcategoryName: string) => {
    const isSubcategorySelected = filters.academicSubcategory.includes(subcategoryName)

    if (isSubcategorySelected) {
      const nextParents = { ...filters.academicSubcategoryParents }
      delete nextParents[subcategoryName]

      updateFilters({
        academicSubcategory: filters.academicSubcategory.filter((name) => name !== subcategoryName),
        academicSubcategoryParents: nextParents,
      })
      return
    }

    updateFilters({
      academicCategory: filters.academicCategory.includes(categoryName)
        ? filters.academicCategory
        : [...filters.academicCategory, categoryName],
      academicSubcategory: [...filters.academicSubcategory, subcategoryName],
      academicSubcategoryParents: {
        ...filters.academicSubcategoryParents,
        [subcategoryName]: categoryName,
      },
    })
  }

  return (
    <div className="px-2 py-1.5">
      <div
        className={`flex min-h-[52px] w-full items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-sm font-extrabold transition-colors ${
          isActive
            ? 'bg-[#4b63e9] text-white ring-1 ring-[#cfe0ff] ring-inset'
            : 'text-[var(--color-on-surface-variant)] hover:bg-[#f8fbff] hover:text-[var(--foreground)]'
        }`}
      >
        <button
          type="button"
          onClick={handleCategoryClick}
          aria-pressed={isSelected}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/30 focus-visible:outline-none"
        >
          <span
            className={`flex size-5 shrink-0 items-center justify-center rounded-md text-white ring-1 transition-all ring-inset ${
              isSelected
                ? 'scale-110 bg-[#0053db] ring-[#0053db]'
                : 'bg-white ring-[#cfd9ea]'
            }`}
          >
            {isSelected && <Check className="size-3.5" strokeWidth={3.5} />}
          </span>
          <span className="min-w-0 flex-1">{categoryName}</span>
        </button>
        <button
          type="button"
          onClick={() => onToggleExpanded(categoryId)}
          aria-expanded={isExpanded}
          className={`flex size-8 shrink-0 items-center justify-center rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/30 focus-visible:outline-none ${
            isExpanded
              ? 'bg-white text-[#0053db] shadow-sm'
              : 'text-[var(--color-outline)] hover:bg-[#eef5ff] hover:text-[#0053db]'
          }`}
          aria-label={`${isExpanded ? 'Hide' : 'Show'} ${categoryName} subcategories`}
        >
          {isExpanded ? (
            <ChevronUp className="size-4 text-[#0053db]" strokeWidth={2.4} />
          ) : (
            <ChevronDown className="size-4" strokeWidth={2.4} />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="rounded bg-[#4b63e9] py-2 ring-1 ring-[#edf2fb] ring-inset">
          {isFetching && (
            <div className="space-y-2 px-5 py-2">
              <div className="h-4 w-9/12 animate-pulse rounded-full bg-white/20" />
              <div className="h-4 w-7/12 animate-pulse rounded-full bg-white/20" />
              <div className="h-4 w-8/12 animate-pulse rounded-full bg-white/20" />
            </div>
          )}

          {!isFetching &&
            subcategories.map((subcategory) => {
              const isSubcategorySelected = filters.academicSubcategory.includes(subcategory.name)

              return (
                <button
                  key={subcategory.id}
                  type="button"
                  onClick={() => handleSubcategoryClick(subcategory.name)}
                  aria-pressed={isSubcategorySelected}
                  className={`mx-2 flex min-h-10 w-[calc(100%-1rem)] items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none ${
                    isSubcategorySelected
                      ? 'bg-[#3c56e8] font-extrabold text-white'
                      : 'font-semibold text-white/85 hover:bg-[#3c56e8]/85 hover:text-white'
                  }`}
                >
                  <span
                    className={`flex size-4 shrink-0 items-center justify-center rounded text-[#0053db] ring-1 transition-all ring-inset ${
                      isSubcategorySelected
                        ? 'scale-110 bg-white ring-white'
                        : 'bg-white/15 ring-white/40'
                    }`}
                  >
                    {isSubcategorySelected && <Check className="size-3" strokeWidth={3.5} />}
                  </span>
                  <span className="min-w-0 flex-1">{subcategory.name}</span>
                </button>
              )
            })}

          {!isFetching && subcategories.length === 0 && (
            <div className="px-5 py-3 text-sm font-semibold text-white/70">
              No subfilters available.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function AcademicCounsellorFiltersSidebar() {
  const { filters, updateFilters } = useAcademicFilters()
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>([])
  const { data: categories = [], isLoading } = useAcademicCounsellorCategories()
  const initialExpandDoneRef = useRef(false)

  useEffect(() => {
    if (initialExpandDoneRef.current || categories.length === 0) return
    initialExpandDoneRef.current = true
    const selectedIds = filters.academicCategory
      .map((name) => categories.find((category) => category.name === name)?.id)
      .filter((id): id is string => Boolean(id))
    if (selectedIds.length === 0) return
    setExpandedCategoryIds((prev) => Array.from(new Set([...prev, ...selectedIds])))
  }, [categories, filters.academicCategory])

  const toggleExpandedCategory = (categoryId: string) =>
    setExpandedCategoryIds((current) => toggleId(current, categoryId))

  return (
    <aside className="bg-[#eff4ff] px-4 py-8 lg:sticky lg:top-[73px] lg:min-h-[calc(100vh-73px)]">
      <section className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b border-[var(--color-surface-container-high)] px-5 py-4">
          <div className="flex items-center gap-2">
            <Image
              src="/home/byc-logo.svg"
              alt="Book Your Counselling"
              width={88}
              height={24}
              className="h-4 w-auto"
            />
            <h3 className="font-[family-name:var(--font-headline)] text-sm leading-tight font-extrabold text-[var(--foreground)]">
              Academic Counselling
            </h3>
          </div>
        </div>

        <div className="custom-scrollbar max-h-[900px] overflow-y-auto py-2">
          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              categoryId={category.id}
              categoryName={category.name}
              isExpanded={expandedCategoryIds.includes(category.id)}
              onToggleExpanded={toggleExpandedCategory}
            />
          ))}

          {isLoading && (
            <div className="space-y-3 px-5 py-4">
              <div className="h-5 w-10/12 animate-pulse rounded-full bg-[var(--color-surface-container-high)]" />
              <div className="h-5 w-8/12 animate-pulse rounded-full bg-[var(--color-surface-container-high)]" />
              <div className="h-5 w-9/12 animate-pulse rounded-full bg-[var(--color-surface-container-high)]" />
            </div>
          )}
          {!isLoading && categories.length === 0 && (
            <div className="px-4 py-3 text-sm font-semibold text-[var(--color-outline)]">
              No categories available.
            </div>
          )}
        </div>
      </section>

      <section>
        <h3 className="my-4 font-[family-name:var(--font-headline)] text-[11px] font-extrabold tracking-wider text-[var(--color-on-surface-variant)] uppercase">
          Availability
        </h3>
        <label className="flex cursor-pointer items-center gap-3 rounded-[18px] bg-white p-4 text-sm font-semibold text-[var(--color-on-surface-variant)] shadow-sm ring-1 ring-[var(--color-surface-container-high)] ring-inset transition-colors hover:text-[var(--foreground)]">
          <input
            type="checkbox"
            checked={Boolean(filters.availableThisWeek)}
            onChange={(event) => updateFilters({ availableThisWeek: event.target.checked })}
            className="size-4 rounded-[4px] border-0 bg-white text-[#0053db] shadow-sm ring-1 ring-[var(--color-surface-container-high)] ring-inset transition-colors focus:ring-2 focus:ring-[var(--brand-blue)]/30"
          />
          <span>This Week</span>
        </label>
      </section>
    </aside>
  )
}
