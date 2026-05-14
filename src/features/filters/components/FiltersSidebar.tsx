'use client'

import { useState } from 'react'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'

import {
  useCategorySubcategories,
  useCounselingCategories,
} from '@/features/categories/hooks/useCounselingCategories'
import { CategoryListItem } from '@/features/categories/types/categories.types'
import { useFilters } from '@/features/filters/context/FilterContext'
import { CounselingType, FilterState } from '@/features/filters/types/filter.types'

type CategoryFilterGroupProps = {
  title: string
  categories: CategoryListItem[]
  selectedCategories: string[]
  selectedSubcategories: string[]
  selectedSubcategoryParents: Record<string, string>
  categoryKey: 'academicCategory' | 'professionalCategory'
  subcategoryKey: 'academicSubcategory' | 'professionalSubcategory'
  subcategoryParentKey: 'academicSubcategoryParents' | 'professionalSubcategoryParents'
  counselingType: CounselingType
  isLoading: boolean
  updateFilters: (nextFilters: Partial<FilterState>) => void
}

type CategoryFilterRowProps = {
  category: CategoryListItem
  selectedCategories: string[]
  selectedSubcategories: string[]
  subcategoryParents: Record<string, string>
  categoryKey: 'academicCategory' | 'professionalCategory'
  subcategoryKey: 'academicSubcategory' | 'professionalSubcategory'
  subcategoryParentKey: 'academicSubcategoryParents' | 'professionalSubcategoryParents'
  counselingType: CounselingType
  isExpanded: boolean
  onToggleExpanded: (categoryId: string) => void
  updateFilters: (nextFilters: Partial<FilterState>) => void
}

function toggleSelectedValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((currentValue) => currentValue !== value)
    : [...values, value]
}

function CategoryFilterRow({
  category,
  selectedCategories,
  selectedSubcategories,
  subcategoryParents,
  categoryKey,
  subcategoryKey,
  subcategoryParentKey,
  counselingType,
  isExpanded,
  onToggleExpanded,
  updateFilters,
}: CategoryFilterRowProps) {
  const isSelected = selectedCategories.includes(category.name)
  const selectedSubcategoryCount = Object.values(subcategoryParents).filter(
    (parentCategory) => parentCategory === category.name
  ).length
  const hasSelectedSubcategories = selectedSubcategoryCount > 0
  const Icon = isExpanded ? ChevronUp : ChevronDown
  const { data: subcategories = [], isFetching: isFetchingSubcategories } =
    useCategorySubcategories(isExpanded ? category.id : undefined)

  const handleCategoryToggle = () => {
    if (!isSelected && !isExpanded) {
      onToggleExpanded(category.id)
    }

    updateFilters({
      counselingType,
      [categoryKey]: toggleSelectedValue(selectedCategories, category.name),
    })
  }

  const handleSubcategoryClick = (subcategoryName: string) => {
    if (selectedSubcategories.includes(subcategoryName)) {
      const nextSubcategoryParents = { ...subcategoryParents }
      delete nextSubcategoryParents[subcategoryName]

      updateFilters({
        counselingType,
        [subcategoryKey]: selectedSubcategories.filter(
          (subcategory) => subcategory !== subcategoryName
        ),
        [subcategoryParentKey]: nextSubcategoryParents,
      })
      return
    }

    updateFilters({
      counselingType,
      [categoryKey]: selectedCategories.includes(category.name)
        ? selectedCategories
        : [...selectedCategories, category.name],
      [subcategoryKey]: [...selectedSubcategories, subcategoryName],
      [subcategoryParentKey]: {
        ...subcategoryParents,
        [subcategoryName]: category.name,
      },
    })
  }

  return (
    <div className="px-2 py-1.5">
      <div
        className={`flex min-h-[52px] w-full items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-sm font-extrabold transition ${
          isSelected || hasSelectedSubcategories
            ? 'bg-[#eef5ff] text-[#111827] ring-1 ring-[#cfe0ff] ring-inset'
            : 'text-[#4b5563] hover:bg-[#f8fbff] hover:text-[#111827]'
        }`}
      >
        <button
          type="button"
          onClick={handleCategoryToggle}
          aria-pressed={isSelected}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left focus-visible:ring-2 focus-visible:ring-[#0053db]/30 focus-visible:outline-none"
        >
          <span
            className={`flex size-5 shrink-0 items-center justify-center rounded-md ring-1 transition ring-inset ${
              isSelected ? 'bg-[#0053db] text-white ring-[#0053db]' : 'bg-white ring-[#cfd9ea]'
            }`}
          >
            {isSelected && <Check className="size-3.5" strokeWidth={3.5} />}
          </span>
          <span className="min-w-0 flex-1">{category.name}</span>
        </button>
        <button
          type="button"
          onClick={() => onToggleExpanded(category.id)}
          aria-expanded={isExpanded}
          className={`flex size-8 shrink-0 items-center justify-center rounded-xl transition focus-visible:ring-2 focus-visible:ring-[#0053db]/30 focus-visible:outline-none ${
            isExpanded
              ? 'bg-white text-[#0053db] shadow-sm'
              : 'text-[#7a8494] hover:bg-[#eef5ff] hover:text-[#0053db]'
          }`}
          aria-label={`${isExpanded ? 'Hide' : 'Show'} ${category.name} subcategories`}
        >
          <Icon
            className={`size-4 transition-transform ${isExpanded || hasSelectedSubcategories ? 'text-[#0053db]' : ''}`}
            strokeWidth={2.4}
          />
        </button>
      </div>

      {isExpanded && (
        <div className="mt-1.5 rounded bg-[#f8fbff] py-2 ring-1 ring-[#edf2fb] ring-inset">
          {isFetchingSubcategories && (
            <div className="space-y-2 px-5 py-2">
              <div className="h-4 w-9/12 animate-pulse rounded-full bg-[#edf2f8]" />
              <div className="h-4 w-7/12 animate-pulse rounded-full bg-[#edf2f8]" />
              <div className="h-4 w-8/12 animate-pulse rounded-full bg-[#edf2f8]" />
            </div>
          )}

          {!isFetchingSubcategories &&
            subcategories.map((subcategory) => {
              const isSubcategorySelected = selectedSubcategories.includes(subcategory.name)

              return (
                <button
                  key={subcategory.id}
                  type="button"
                  onClick={() => handleSubcategoryClick(subcategory.name)}
                  aria-pressed={isSubcategorySelected}
                  className={`mx-2 flex min-h-10 w-[calc(100%-1rem)] items-center gap-3 px-3 py-2 text-left text-sm font-semibold transition ${
                    isSubcategorySelected
                      ? 'text-[#0053db]'
                      : 'text-[#4b5563] hover:bg-white hover:text-[#111827]'
                  }`}
                >
                  <span
                    className={`flex size-4 shrink-0 items-center justify-center rounded ring-1 transition ring-inset ${
                      isSubcategorySelected
                        ? 'bg-[#2563eb] text-white ring-[#2563eb]'
                        : 'bg-white ring-[#cfd9ea]'
                    }`}
                  >
                    {isSubcategorySelected && <Check className="size-3" strokeWidth={3.5} />}
                  </span>
                  <span className="min-w-0 flex-1">{subcategory.name}</span>
                </button>
              )
            })}

          {!isFetchingSubcategories && subcategories.length === 0 && (
            <div className="px-5 py-3 text-sm font-semibold text-[#737686]">
              No subfilters available.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CategoryFilterGroup({
  title,
  categories,
  selectedCategories,
  selectedSubcategories,
  selectedSubcategoryParents,
  categoryKey,
  subcategoryKey,
  subcategoryParentKey,
  counselingType,
  isLoading,
  updateFilters,
}: CategoryFilterGroupProps) {
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>([])
  const selectedCount = selectedCategories.length + selectedSubcategories.length

  const toggleExpandedCategory = (categoryId: string) => {
    setExpandedCategoryIds((currentIds) => toggleSelectedValue(currentIds, categoryId))
  }

  const clearGroup = () => {
    updateFilters({
      [categoryKey]: [],
      [subcategoryKey]: [],
      [subcategoryParentKey]: {},
    })
  }

  return (
    <section className="overflow-hidden rounded-lg bg-white shadow">
      <div className="border-b border-[#eef2f7] px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-md leading-tight font-extrabold text-[#111827]">{title}</h3>
          </div>
        </div>
      </div>

      <div className="py-2">
        <div className="custom-scrollbar max-h-[900px] overflow-y-auto">
          {categories.map((category) => (
            <CategoryFilterRow
              key={category.id}
              category={category}
              selectedCategories={selectedCategories}
              selectedSubcategories={selectedSubcategories}
              subcategoryParents={selectedSubcategoryParents}
              categoryKey={categoryKey}
              subcategoryKey={subcategoryKey}
              subcategoryParentKey={subcategoryParentKey}
              counselingType={counselingType}
              isExpanded={expandedCategoryIds.includes(category.id)}
              onToggleExpanded={toggleExpandedCategory}
              updateFilters={updateFilters}
            />
          ))}

          {isLoading && (
            <div className="space-y-3 px-5 py-4">
              <div className="h-5 w-10/12 animate-pulse rounded-full bg-[#edf2f8]" />
              <div className="h-5 w-8/12 animate-pulse rounded-full bg-[#edf2f8]" />
              <div className="h-5 w-9/12 animate-pulse rounded-full bg-[#edf2f8]" />
            </div>
          )}
          {!isLoading && categories.length === 0 && (
            <div className="px-4 py-3 text-sm font-semibold text-[#737686]">
              No categories available.
            </div>
          )}
        </div>

        {/* {selectedCount > 0 && (
          <p className="border-t border-[#f0f3f8] px-4 pt-3 pb-1 text-xs font-bold text-[#737686]">
            {selectedCount} selected
          </p>
        )} */}
      </div>
    </section>
  )
}

export function FiltersSidebar() {
  const { filters, updateFilter, updateFilters } = useFilters()
  const { data: activeCategories = [], isLoading: isLoadingActiveCategories } =
    useCounselingCategories(filters.counselingType)

  return (
    <aside className="h-full border-r border-gray-200 px-4 py-8 lg:sticky lg:top-[73px] lg:min-h-[calc(100vh-73px)]">
      <CategoryFilterGroup
        title={
          filters.counselingType === 'academic' ? 'Academic Counseling' : 'Professional Counseling'
        }
        categories={activeCategories}
        selectedCategories={
          filters.counselingType === 'academic'
            ? filters.academicCategory
            : filters.professionalCategory
        }
        selectedSubcategories={
          filters.counselingType === 'academic'
            ? filters.academicSubcategory
            : filters.professionalSubcategory
        }
        selectedSubcategoryParents={
          filters.counselingType === 'academic'
            ? filters.academicSubcategoryParents
            : filters.professionalSubcategoryParents
        }
        categoryKey={
          filters.counselingType === 'academic' ? 'academicCategory' : 'professionalCategory'
        }
        subcategoryKey={
          filters.counselingType === 'academic' ? 'academicSubcategory' : 'professionalSubcategory'
        }
        subcategoryParentKey={
          filters.counselingType === 'academic'
            ? 'academicSubcategoryParents'
            : 'professionalSubcategoryParents'
        }
        counselingType={filters.counselingType}
        isLoading={isLoadingActiveCategories}
        updateFilters={updateFilters}
      />

      {/* <section>
          <h3 className="mb-4 text-[11px] font-extrabold tracking-wider text-[#434655] uppercase">
            Experience Level
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {experienceLevels.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => updateFilter('experienceLevel', level)}
                className={`h-9 rounded-lg text-xs font-extrabold transition ${
                  filters.experienceLevel === level
                    ? 'bg-[#0053db] text-white shadow-[0_8px_18px_rgba(0,83,219,0.22)]'
                    : 'bg-white text-[#0053db]'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </section> */}

      {/* <section>
          <h3 className="mb-4 text-[11px] font-extrabold tracking-wider text-[#434655] uppercase">
            Hourly Rate
          </h3>
          <div className="rounded-[18px] bg-white p-4 shadow-sm ring-1 ring-[#dfe7f5] ring-inset">
            <input
              type="range"
              min="20"
              max="10000"
              step="100"
              value={filters.priceRange}
              onChange={(event) => updateFilter('priceRange', Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#d9e3f6] accent-[#0053db]"
            />
            <div className="mt-3 flex items-center justify-between text-sm font-semibold text-[#434655]">
              <span>NPR 20</span>
              <span className="font-extrabold text-[#121c2a]">
                NPR {filters.priceRange?.toLocaleString()}
              </span>
            </div>
          </div>
        </section> */}

      <section>
        <h3 className="my-4 text-[11px] font-extrabold tracking-wider text-[#434655] uppercase">
          Availability
        </h3>
        <div className="space-y-4">
          <label className="flex cursor-pointer items-center gap-3 rounded-[18px] bg-white p-4 text-sm font-semibold text-[#434655] shadow-sm ring-1 ring-[#dfe7f5] ring-inset">
            <input
              type="checkbox"
              checked={Boolean(filters.availableThisWeek)}
              onChange={(event) => updateFilter('availableThisWeek', event.target.checked)}
              className="size-4 border-0 bg-white text-[#0053db] shadow-sm ring-1 ring-[#e2e8f0] ring-inset focus:ring-2 focus:ring-[#0053db]/20"
            />
            <span>This Week</span>
          </label>
        </div>
      </section>
    </aside>
  )
}
