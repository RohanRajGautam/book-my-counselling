'use client'

import { FormEvent, useMemo, useState } from 'react'
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  GraduationCap,
  Link2,
  Search,
  Sparkles,
} from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'
import {
  useCategorySubcategories,
  useCounselingCategories,
} from '@/features/categories/hooks/useCounselingCategories'
import { CategoryListItem } from '@/features/categories/types/categories.types'
import { CounselingType } from '@/features/filters/types/filter.types'

type ApplicationFormState = {
  fullName: string
  linkedinUrl: string
  portfolioUrl: string
}

type SelectedSubcategory = {
  name: string
  parent: string
}

const COUNSELLOR_APPLICATION_SCRIPT_URL =
  process.env.NEXT_PUBLIC_COUNSELLOR_APPLICATION_SCRIPT_URL ?? ''

const COUNSELLING_OPTIONS: Array<{
  value: CounselingType
  label: string
  description: string
  icon: typeof GraduationCap
}> = [
  {
    value: 'academic',
    label: 'Academic Counselling',
    description: 'Guide students on programs, applications, schools, and study decisions.',
    icon: GraduationCap,
  },
  {
    value: 'professional',
    label: 'Professional Coaching',
    description: 'Help professionals with career direction, skills, interviews, and growth.',
    icon: BriefcaseBusiness,
  },
]

const isValidUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const buildFieldOfInterestSummary = (
  selectedCategories: string[],
  selectedSubcategories: SelectedSubcategory[]
) => {
  return selectedCategories
    .map((category) => {
      const subcategories = selectedSubcategories
        .filter((subcategory) => subcategory.parent === category)
        .map((subcategory) => subcategory.name)

      return subcategories.length > 0 ? `${category}: ${subcategories.join(', ')}` : category
    })
    .join(' | ')
}

function CategoryOption({
  category,
  isSelected,
  selectedSubcategories,
  onToggleCategory,
  onToggleSubcategory,
}: {
  category: CategoryListItem
  isSelected: boolean
  selectedSubcategories: SelectedSubcategory[]
  onToggleCategory: (categoryName: string) => void
  onToggleSubcategory: (subcategory: SelectedSubcategory) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { data: subcategories = [], isFetching } = useCategorySubcategories(
    isOpen || isSelected ? category.id : undefined
  )

  const selectedCount = selectedSubcategories.filter(
    (subcategory) => subcategory.parent === category.name
  ).length

  return (
    <div
      className={`rounded-2xl border bg-white/82 transition ${
        isSelected || selectedCount > 0
          ? 'border-[#b4c5ff] shadow-[0_14px_34px_rgba(0,74,198,0.08)]'
          : 'border-[#d9e3f6] hover:border-[#b4c5ff]'
      }`}
    >
      <div className="flex items-center gap-3 p-3">
        <button
          type="button"
          onClick={() => {
            onToggleCategory(category.name)
            setIsOpen(true)
          }}
          aria-pressed={isSelected}
          className={`flex size-9 shrink-0 items-center justify-center rounded-xl border transition ${
            isSelected
              ? 'border-[#004ac6] bg-[#004ac6] text-white'
              : 'border-[#d9e3f6] bg-[#f8f9ff] text-transparent'
          }`}
        >
          <Check className="size-4" strokeWidth={3.5} />
        </button>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
        >
          <span className="min-w-0">
            <span className="block truncate font-[family-name:var(--font-headline)] text-sm font-extrabold text-[#121c2a]">
              {category.name}
            </span>
            <span className="mt-1 block text-xs font-semibold text-[#737686]">
              {selectedCount > 0 ? `${selectedCount} subcategory selected` : 'Choose subcategories'}
            </span>
          </span>
          <ChevronDown
            className={`size-4 shrink-0 text-[#004ac6] transition ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-[#eff4ff] px-3 pt-3 pb-4">
          {isFetching ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : subcategories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {subcategories.map((subcategory) => {
                const isSubcategorySelected = selectedSubcategories.some(
                  (selected) =>
                    selected.name === subcategory.name && selected.parent === category.name
                )

                return (
                  <button
                    key={subcategory.id}
                    type="button"
                    onClick={() =>
                      onToggleSubcategory({
                        name: subcategory.name,
                        parent: category.name,
                      })
                    }
                    aria-pressed={isSubcategorySelected}
                    className={`rounded-full px-3 py-2 text-xs font-extrabold transition ${
                      isSubcategorySelected
                        ? 'bg-[#004ac6] text-white shadow-[0_10px_20px_rgba(0,74,198,0.18)]'
                        : 'bg-[#eff4ff] text-[#004ac6] hover:bg-[#e6eeff]'
                    }`}
                  >
                    {subcategory.name}
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="rounded-xl bg-[#f8f9ff] px-3 py-3 text-sm font-semibold text-[#737686]">
              No subcategories available.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function CounsellorApplicationForm() {
  const [form, setForm] = useState<ApplicationFormState>({
    fullName: '',
    linkedinUrl: '',
    portfolioUrl: '',
  })
  const [counselingType, setCounselingType] = useState<CounselingType>('academic')
  const [categoryQuery, setCategoryQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSubcategories, setSelectedSubcategories] = useState<SelectedSubcategory[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const { data: categories = [], isLoading: isLoadingCategories } =
    useCounselingCategories(counselingType)

  const filteredCategories = useMemo(
    () =>
      categories.filter((category) =>
        category.name.toLowerCase().includes(categoryQuery.trim().toLowerCase())
      ),
    [categories, categoryQuery]
  )

  const selectedInterestCount = selectedCategories.length + selectedSubcategories.length

  const updateField = (field: keyof ApplicationFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
    setSubmitError('')
    setSubmitted(false)
  }

  const handleCounselingTypeChange = (nextType: CounselingType) => {
    setCounselingType(nextType)
    setSelectedCategories([])
    setSelectedSubcategories([])
    setCategoryQuery('')
    setErrors((current) => ({ ...current, interests: '' }))
    setSubmitError('')
    setSubmitted(false)
  }

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((current) =>
      current.includes(categoryName)
        ? current.filter((category) => category !== categoryName)
        : [...current, categoryName]
    )
    setErrors((current) => ({ ...current, interests: '' }))
    setSubmitError('')
    setSubmitted(false)
  }

  const toggleSubcategory = (subcategory: SelectedSubcategory) => {
    setSelectedSubcategories((current) => {
      const exists = current.some(
        (selected) => selected.name === subcategory.name && selected.parent === subcategory.parent
      )

      if (exists) {
        return current.filter(
          (selected) => selected.name !== subcategory.name || selected.parent !== subcategory.parent
        )
      }

      return [...current, subcategory]
    })
    setSelectedCategories((current) =>
      current.includes(subcategory.parent) ? current : [...current, subcategory.parent]
    )
    setErrors((current) => ({ ...current, interests: '' }))
    setSubmitError('')
    setSubmitted(false)
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {}

    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required'
    if (!isValidUrl(form.linkedinUrl) || !/linkedin\.com/i.test(form.linkedinUrl)) {
      nextErrors.linkedinUrl = 'Enter a valid LinkedIn profile URL'
    }
    if (!isValidUrl(form.portfolioUrl)) {
      nextErrors.portfolioUrl = 'Enter a valid portfolio, website, or work sample URL'
    }
    if (selectedInterestCount === 0) {
      nextErrors.interests = 'Choose at least one category or subcategory'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate() || isSubmitting) return

    setIsSubmitting(true)
    setSubmitError('')

    if (!COUNSELLOR_APPLICATION_SCRIPT_URL) {
      setIsSubmitting(false)
      setSubmitError('Google Sheets submission URL is not configured yet.')
      return
    }

    const applicationPayload = {
      sheetName: 'Counsellor Applications',
      submittedAt: new Date().toISOString(),
      fullName: form.fullName.trim(),
      linkedinUrl: form.linkedinUrl.trim(),
      portfolioUrl: form.portfolioUrl.trim(),
      counselingType,
      counselingTypeLabel:
        COUNSELLING_OPTIONS.find((option) => option.value === counselingType)?.label ??
        counselingType,
      fieldOfInterestSummary: buildFieldOfInterestSummary(
        selectedCategories,
        selectedSubcategories
      ),
    }

    try {
      await fetch(COUNSELLOR_APPLICATION_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(applicationPayload),
      })

      setSubmitted(true)
      setForm({
        fullName: '',
        linkedinUrl: '',
        portfolioUrl: '',
      })
      setCounselingType('academic')
      setCategoryQuery('')
      setSelectedCategories([])
      setSelectedSubcategories([])
    } catch (error) {
      console.log(error)
      setSubmitError('Something went wrong while submitting. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8f9ff_45%,#eef4ff_100%)] px-4 py-28 sm:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(#d9e3f6_1px,transparent_1px),linear-gradient(90deg,#d9e3f6_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_76%)] [background-size:72px_72px] opacity-[0.28]" />

      <div className="mx-auto flex w-full max-w-[780px] flex-col gap-18">
        <form
          onSubmit={handleSubmit}
          className="rounded-[24px] border border-white/80 bg-white/88 p-5 shadow-[0_28px_70px_rgba(18,28,42,0.11)] ring-1 ring-[#d9e3f6]/80 backdrop-blur sm:p-7 lg:p-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c9d7f4] bg-white px-4 py-2 text-xs font-extrabold tracking-[0.14em] text-[#003ea8] uppercase">
            <Sparkles className="size-4" aria-hidden="true" />
            Mentor application
          </div>

          <h1 className="my-6 font-[family-name:var(--font-headline)] text-4xl leading-tight font-extrabold tracking-tight text-[#121c2a] sm:text-5xl">
            Share your expertise with learners who need it.
          </h1>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-extrabold text-[#1f2533]">Full name</label>
              <input
                value={form.fullName}
                onChange={(event) => updateField('fullName', event.target.value)}
                placeholder="Your legal or professional name"
                className="h-13 w-full rounded-xl border border-[#d9e3f6] bg-[#f8f9ff] px-4 font-semibold text-[#121c2a] transition outline-none placeholder:text-[#aeb5c3] focus:border-[#004ac6] focus:bg-white focus:ring-3 focus:ring-[#004ac6]/15"
              />
              {errors.fullName && (
                <p className="mt-2 text-sm font-semibold text-[#ba1a1a]">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-extrabold text-[#1f2533]">
                LinkedIn URL
              </label>
              <div className="relative">
                <Link2 className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#737686]" />
                <input
                  value={form.linkedinUrl}
                  onChange={(event) => updateField('linkedinUrl', event.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="h-13 w-full rounded-xl border border-[#d9e3f6] bg-[#f8f9ff] pr-4 pl-11 font-semibold text-[#121c2a] transition outline-none placeholder:text-[#aeb5c3] focus:border-[#004ac6] focus:bg-white focus:ring-3 focus:ring-[#004ac6]/15"
                />
              </div>
              {errors.linkedinUrl && (
                <p className="mt-2 text-sm font-semibold text-[#ba1a1a]">{errors.linkedinUrl}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-extrabold text-[#1f2533]">
                Portfolio URL
              </label>
              <div className="relative">
                <Link2 className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#737686]" />
                <input
                  value={form.portfolioUrl}
                  onChange={(event) => updateField('portfolioUrl', event.target.value)}
                  placeholder="Website, portfolio, GitHub, case studies..."
                  className="h-13 w-full rounded-xl border border-[#d9e3f6] bg-[#f8f9ff] pr-4 pl-11 font-semibold text-[#121c2a] transition outline-none placeholder:text-[#aeb5c3] focus:border-[#004ac6] focus:bg-white focus:ring-3 focus:ring-[#004ac6]/15"
                />
              </div>
              {errors.portfolioUrl && (
                <p className="mt-2 text-sm font-semibold text-[#ba1a1a]">{errors.portfolioUrl}</p>
              )}
            </div>
          </div>

          <fieldset className="mt-7">
            <legend className="mb-3 text-sm font-extrabold text-[#1f2533]">Counselling type</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {COUNSELLING_OPTIONS.map((option) => {
                const Icon = option.icon
                const isSelected = counselingType === option.value

                return (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      isSelected
                        ? 'border-[#004ac6] bg-[#eff4ff] shadow-[0_16px_34px_rgba(0,74,198,0.1)]'
                        : 'border-[#d9e3f6] bg-white hover:border-[#b4c5ff]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="counselingType"
                      value={option.value}
                      checked={isSelected}
                      onChange={() => handleCounselingTypeChange(option.value)}
                      className="sr-only"
                    />
                    <span className="flex items-start gap-3">
                      <span
                        className={`grid size-11 shrink-0 place-items-center rounded-xl ${
                          isSelected ? 'bg-[#004ac6] text-white' : 'bg-[#f8f9ff] text-[#004ac6]'
                        }`}
                      >
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block font-[family-name:var(--font-headline)] text-base font-extrabold text-[#121c2a]">
                          {option.label}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-[#434655]">
                          {option.description}
                        </span>
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <div className="mt-7">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-[#1f2533]">Field of interest</h2>
                <p className="mt-1 text-sm text-[#737686]">
                  Choose categories and subcategories that describe your mentoring strengths.
                </p>
              </div>
              <p className="text-xs font-extrabold tracking-[0.12em] text-[#004ac6] uppercase">
                {selectedInterestCount} selected
              </p>
            </div>

            <div className="relative mb-4">
              <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#737686]" />
              <input
                value={categoryQuery}
                onChange={(event) => setCategoryQuery(event.target.value)}
                placeholder="Search categories..."
                className="h-12 w-full rounded-xl border border-[#d9e3f6] bg-[#f8f9ff] pr-4 pl-11 font-semibold text-[#121c2a] transition outline-none placeholder:text-[#aeb5c3] focus:border-[#004ac6] focus:bg-white focus:ring-3 focus:ring-[#004ac6]/15"
              />
            </div>

            <div className="max-h-[430px] space-y-3 overflow-y-auto rounded-2xl border border-[#d9e3f6] bg-[#f8f9ff]/70 p-3">
              {isLoadingCategories ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full rounded-xl bg-slate-100" />
                  ))}
                </div>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <CategoryOption
                    key={category.id}
                    category={category}
                    isSelected={selectedCategories.includes(category.name)}
                    selectedSubcategories={selectedSubcategories}
                    onToggleCategory={toggleCategory}
                    onToggleSubcategory={toggleSubcategory}
                  />
                ))
              ) : (
                <div className="flex min-h-36 items-center justify-center rounded-2xl bg-white px-4 text-center text-sm font-bold text-[#737686]">
                  No categories match your search.
                </div>
              )}
            </div>
            {errors.interests && (
              <p className="mt-2 text-sm font-semibold text-[#ba1a1a]">{errors.interests}</p>
            )}
          </div>

          {submitted && (
            <p className="mt-7 rounded-xl bg-[#e5fff4] px-4 py-3 text-center text-sm font-extrabold text-[#006c49]">
              Application submitted. We&apos;ll review your profile and get back to you soon.
            </p>
          )}

          {submitError && (
            <p className="mt-7 rounded-xl bg-[#ffdad6] px-4 py-3 text-center text-sm font-extrabold text-[#93000a]">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 flex h-13 w-full items-center justify-center gap-3 rounded-xl bg-[#004ac6] px-6 font-[family-name:var(--font-headline)] text-sm font-extrabold text-white shadow-[0_18px_34px_rgba(0,74,198,0.22)] transition hover:bg-[#003fa8] focus:ring-3 focus:ring-[#004ac6]/25 focus:outline-none active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
            {!isSubmitting && <ArrowRight className="size-4" aria-hidden="true" />}
          </button>
        </form>
      </div>
    </section>
  )
}
