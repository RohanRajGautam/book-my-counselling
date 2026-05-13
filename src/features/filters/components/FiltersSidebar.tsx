'use client'

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
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
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
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
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
  updateFilter,
}: CategoryFilterRowProps) {
  const isSelected = selectedCategories.includes(category.name)
  const Icon = isSelected ? ChevronUp : ChevronDown
  const { data: subcategories = [], isFetching: isFetchingSubcategories } =
    useCategorySubcategories(isSelected ? category.id : undefined)

  const handleCategoryClick = () => {
    updateFilter('counselingType', counselingType)

    if (isSelected) {
      const categorySubcategoryNames = new Set(subcategories.map((subcategory) => subcategory.name))

      updateFilter(
        categoryKey,
        selectedCategories.filter((selectedCategory) => selectedCategory !== category.name)
      )
      updateFilter(
        subcategoryKey,
        selectedSubcategories.filter(
          (selectedSubcategory) => !categorySubcategoryNames.has(selectedSubcategory)
        )
      )
      updateFilter(
        subcategoryParentKey,
        Object.fromEntries(
          Object.entries(subcategoryParents).filter(
            ([subcategory]) => !categorySubcategoryNames.has(subcategory)
          )
        )
      )
      return
    }

    updateFilter(categoryKey, [...selectedCategories, category.name])
  }

  const handleSubcategoryClick = (subcategoryName: string) => {
    updateFilter('counselingType', counselingType)

    if (selectedSubcategories.includes(subcategoryName)) {
      const nextSubcategoryParents = { ...subcategoryParents }
      delete nextSubcategoryParents[subcategoryName]

      updateFilter(
        subcategoryKey,
        selectedSubcategories.filter((subcategory) => subcategory !== subcategoryName)
      )
      updateFilter(subcategoryParentKey, nextSubcategoryParents)
      return
    }

    updateFilter(subcategoryKey, toggleSelectedValue(selectedSubcategories, subcategoryName))
    updateFilter(subcategoryParentKey, {
      ...subcategoryParents,
      [subcategoryName]: category.name,
    })
  }

  return (
    <div className="border-b border-[#f1f4f8] last:border-b-0">
      <button
        type="button"
        onClick={handleCategoryClick}
        aria-expanded={isSelected}
        aria-pressed={isSelected}
        className={`flex min-h-12 w-full items-center justify-between gap-3 px-5 py-3 text-left text-sm font-extrabold transition ${
          isSelected
            ? 'bg-[#f8fbff] text-[#111827]'
            : 'text-[#4b5563] hover:bg-[#fbfdff] hover:text-[#111827]'
        }`}
      >
        <span
          className={`flex size-5 shrink-0 items-center justify-center rounded-md ring-1 ring-inset ${
            isSelected ? 'bg-[#0053db] text-white ring-[#0053db]' : 'bg-white ring-[#cfd9ea]'
          }`}
        >
          {isSelected && <Check className="size-3.5" strokeWidth={3.5} />}
        </span>
        <span className="min-w-0 flex-1">{category.name}</span>
        <Icon
          className={`size-4 shrink-0 ${isSelected ? 'text-[#0053db]' : 'text-[#7a8494]'}`}
          strokeWidth={2.4}
        />
      </button>

      {isSelected && (
        <div className="pb-2">
          {isFetchingSubcategories && (
            <div className="space-y-2 px-6 py-2">
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
                  className={`flex min-h-10 w-full items-center gap-3 px-6 py-2 text-left text-sm font-semibold transition ${
                    isSubcategorySelected
                      ? 'bg-[#eef5ff] text-[#0053db]'
                      : 'text-[#4b5563] hover:bg-[#f8f9ff] hover:text-[#111827]'
                  }`}
                >
                  <span
                    className={`flex size-4 shrink-0 items-center justify-center rounded ring-1 ring-inset ${
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
            <div className="px-6 py-3 text-sm font-semibold text-[#737686]">
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
  updateFilter,
}: CategoryFilterGroupProps) {
  const selectedCount = selectedCategories.length + selectedSubcategories.length

  const clearGroup = () => {
    updateFilter(categoryKey, [])
    updateFilter(subcategoryKey, [])
    updateFilter(subcategoryParentKey, {})
  }

  return (
    <section className="overflow-hidden rounded-[22px] bg-white shadow">
      <div className="border-b border-[#eef2f7] px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg leading-tight font-extrabold text-[#111827]">{title}</h3>
          </div>
          {selectedCount > 0 && (
            <button
              type="button"
              onClick={clearGroup}
              className="rounded-full bg-[#f4f7fb] px-3 py-1 text-[11px] font-extrabold text-[#0053db] transition hover:bg-[#e8f0ff]"
            >
              Clear
            </button>
          )}
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
              updateFilter={updateFilter}
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
  const { filters, updateFilter } = useFilters()
  const { data: activeCategories = [], isLoading: isLoadingActiveCategories } =
    useCounselingCategories(filters.counselingType)

  return (
    <aside className="h-full border-r border-gray-200 px-4 py-8 lg:sticky lg:top-[73px] lg:min-h-[calc(100vh-73px)]">
      {/* <div className="mt-5 mb-7 rounded-[18px] bg-white p-4 ring-1 ring-[#dfe7f5] ring-inset">
        <h2 className="flex items-center gap-3 font-[family-name:var(--font-headline)] text-lg font-extrabold text-[#121c2a]">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#e6eeff]">
            <ListFilter className="size-5 text-[#004ac6]" strokeWidth={3} />
          </span>
          Filters
        </h2>
      </div> */}

      <div className="space-y-7">
        <h3 className="mb-4 text-[11px] font-extrabold tracking-wider text-[#434655] uppercase">
          Categories
        </h3>
        {/* <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-[11px] font-extrabold tracking-wider text-[#434655] uppercase">
              Field / Industry
            </h3>
            {filters.industries.length > 0 && (
              <button
                type="button"
                onClick={() => updateFilter('industries', [])}
                className="text-[11px] font-extrabold text-[#0053db] transition hover:text-[#003fa8]"
              >
                Clear
              </button>
            )}
          </div>
          <div className="mb-3 flex h-11 items-center rounded-xl bg-white px-3 shadow-sm ring-1 ring-[#dfe7f5] ring-inset">
            <Search className="mr-2 size-4 shrink-0 text-[#0053db]" />
            <input
              type="search"
              value={industrySearch}
              onChange={(event) => setIndustrySearch(event.target.value)}
              placeholder="Search industries"
              className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#121c2a] outline-none placeholder:text-[#9aa3b2]"
            />
          </div>
          <div className="custom-scrollbar max-h-[280px] space-y-2 overflow-y-auto pr-2">
            {visibleIndustries.map((industry) => {
              const isSelected = filters.industries.includes(industry.name)

              return (
                <button
                  key={industry.id}
                  type="button"
                  onClick={() => toggleIndustry(industry.name)}
                  aria-pressed={isSelected}
                  className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-bold shadow-sm ring-1 transition ring-inset ${
                    isSelected
                      ? 'bg-[#0053db] text-white shadow-[0_8px_18px_rgba(0,83,219,0.18)] ring-[#0053db]'
                      : 'bg-white text-[#121c2a] ring-[#e2e8f0] hover:bg-[#f8f9ff]'
                  }`}
                >
                  <span className="min-w-0 flex-1">{industry.name}</span>
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
                      isSelected ? 'bg-white/20' : 'bg-[#eff4ff]'
                    }`}
                  >
                    {isSelected && <Check className="size-3.5 text-white" strokeWidth={4} />}
                  </span>
                </button>
              )
            })}
            {industries.length === 0 && (
              <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#737686] shadow-sm ring-1 ring-[#dfe7f5] ring-inset">
                No industries available.
              </div>
            )}
            {industries.length > 0 && visibleIndustries.length === 0 && (
              <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#737686] shadow-sm ring-1 ring-[#dfe7f5] ring-inset">
                No matching industries.
              </div>
            )}
          </div>
          {filters.industries.length > 0 && (
            <p className="mt-3 text-xs font-bold text-[#737686]">
              {filters.industries.length} selected
            </p>
          )}
        </section> */}

        <CategoryFilterGroup
          title={
            filters.counselingType === 'academic'
              ? 'Academic Counseling'
              : 'Professional Counseling'
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
            filters.counselingType === 'academic'
              ? 'academicSubcategory'
              : 'professionalSubcategory'
          }
          subcategoryParentKey={
            filters.counselingType === 'academic'
              ? 'academicSubcategoryParents'
              : 'professionalSubcategoryParents'
          }
          counselingType={filters.counselingType}
          isLoading={isLoadingActiveCategories}
          updateFilter={updateFilter}
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
          <h3 className="mb-4 text-[11px] font-extrabold tracking-wider text-[#434655] uppercase">
            Availability
          </h3>
          <div className="space-y-4">
            {/* <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#434655]">
              <input
                type="radio"
                name="availability"
                checked={Boolean(filters.availableToday)}
                onChange={() => {
                  updateFilter('availableToday', true)
                  updateFilter('availableThisWeek', false)
                }}
                className="size-4 border-0 bg-white text-[#0053db] shadow-sm ring-1 ring-[#e2e8f0] ring-inset focus:ring-2 focus:ring-[#0053db]/20"
              />
              <span>Available Today</span>
            </label> */}
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
      </div>
    </aside>
  )
}
