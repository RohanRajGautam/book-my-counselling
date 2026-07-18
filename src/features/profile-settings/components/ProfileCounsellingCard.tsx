'use client'

import { BriefcaseBusiness, GraduationCap, Briefcase, Check, Factory, Loader2 } from 'lucide-react'

import {
  COACH_FOR_FRESHERS_CATEGORIES,
  COACH_FOR_FRESHERS_SERVICE_TAGS,
} from '@/features/coach-for-freshers/types/coach-for-freshers.types'
import { ProfessionalCategoryWithSubs } from '@/features/mentor-dashboard/types/mentor-dashboard.types'
import { AcademicSubcategoryPicker } from '@/features/mentor-onboarding/components/AcademicSubcategoryPicker'
import { AcademicTagPicker } from '@/features/mentor-onboarding/components/AcademicTagPicker'
import { ProfessionalCategoryPicker } from '@/features/mentor-onboarding/components/ProfessionalCategoryPicker'
import { useIndustries } from '@/features/industries/hooks/useIndustries'

export type CounsellingType = {
  is_professional_counselor: boolean
  is_academic_counselor: boolean
  /** Slugs of selected Coach-for-Freshers service tags — mapped to tag_ids on save. */
  coaching_services: string[]
  /** Selected academic subcategory IDs. */
  subcategory_ids: string[]
  /** Selected professional (parent category, subcategories) pairs. */
  professional_categories: ProfessionalCategoryWithSubs[]
  /** Slugs of selected academic tags — mapped to tag_ids on save. */
  academic_tags: string[]
  /** Selected industry IDs — surfaced on the mentor's public profile. */
  industry_ids: string[]
}

type ProfileCounsellingCardProps = {
  value: CounsellingType
  onChange: (value: CounsellingType) => void
  /**
   * Show the professional-categories picker. Defaults to true; pass `false` to hide
   * (e.g. on read-only profile previews).
   */
  showProfessionalCategories?: boolean
  /**
   * Show a loading state inside the card instead of the form body. Used by
   * the page once `profile` has arrived but the form-state seed hasn't run
   * yet — avoids flashing empty toggles/services/tags before the mentor's
   * existing selections paint in.
   */
  loading?: boolean
}

export function ProfileCounsellingCard({
  value,
  onChange,
  showProfessionalCategories = true,
  loading = false,
}: ProfileCounsellingCardProps) {
  const toggleProfessional = () => {
    const next = !value.is_professional_counselor
    onChange({
      ...value,
      is_professional_counselor: next,
      // When turning on, ensure at least one Coach for Freshers service is
      // selected — a Coach for Freshers mentor must offer at least one of the
      // three early-career services.
      coaching_services: next
        ? value.coaching_services.length > 0
          ? value.coaching_services
          : [COACH_FOR_FRESHERS_SERVICE_TAGS[0]!.tag]
        : [],
      professional_categories: next ? value.professional_categories : [],
    })
  }

  const toggleService = (slug: string) => {
    const isCurrentlySelected = value.coaching_services.includes(slug)
    // Refuse removal of the last remaining service while is_professional_counselor is on.
    if (isCurrentlySelected && value.coaching_services.length <= 1) return
    onChange({
      ...value,
      is_professional_counselor: isCurrentlySelected ? value.is_professional_counselor : true,
      coaching_services: isCurrentlySelected
        ? value.coaching_services.filter((s) => s !== slug)
        : [...value.coaching_services, slug],
    })
  }

  const allSlugs = COACH_FOR_FRESHERS_SERVICE_TAGS.map((s) => s.tag)

  const toggleAcademic = () => {
    const next = !value.is_academic_counselor
    onChange({
      ...value,
      is_academic_counselor: next,
      subcategory_ids: next ? value.subcategory_ids : [],
      academic_tags: next ? value.academic_tags : [],
    })
  }

  const toggleIndustry = (id: string) => {
    onChange({
      ...value,
      industry_ids: value.industry_ids.includes(id)
        ? value.industry_ids.filter((i) => i !== id)
        : [...value.industry_ids, id],
    })
  }

  return (
    <section
      id="counselling-provided"
      className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8"
    >
      <div className="flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-amber-200 text-amber-900">
          <BriefcaseBusiness className="size-5" />
        </div>
        <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
          Counselling Provided
        </h2>
      </div>

      <p className="mt-2 text-sm font-medium text-slate-500">
        Select the types of counselling you offer. This appears on your public profile.
      </p>

      {loading ? (
        <CounsellingCardSkeleton />
      ) : (
        <>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <CounsellingToggle
          active={value.is_professional_counselor}
          icon={<Briefcase className="size-5" />}
          title="Professional Coaching"
          description="Career guidance, industry transitions, interview prep"
          onClick={toggleProfessional}
        />
        <CounsellingToggle
          active={value.is_academic_counselor}
          icon={<GraduationCap className="size-5" />}
          title="Academic Counselling"
          description="University applications, thesis support, research strategy"
          onClick={toggleAcademic}
        />
      </div>

      {/* Academic — required subcategory selection */}
      {value.is_academic_counselor && (
        <div className="mt-6 rounded-2xl border-2 border-blue-100 bg-blue-50/40 p-4 sm:p-5">
          <p className="text-sm font-extrabold text-slate-800">Academic fields</p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Pick at least one academic field. We use these to surface your profile to the right students.
          </p>
          <div className="mt-3">
            <AcademicSubcategoryPicker
              value={value.subcategory_ids}
              onChange={(ids) => onChange({ ...value, subcategory_ids: ids })}
            />
          </div>
        </div>
      )}

      {/* Academic — tag picker (full catalog). Displayed on the public mentor card. */}
      {value.is_academic_counselor && (
        <div className="mt-4 rounded-2xl border-2 border-blue-100 bg-blue-50/40 p-4 sm:p-5">
          <p className="text-sm font-extrabold text-slate-800">Tags</p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            These tags will be displayed in your mentor card.
          </p>
          <div className="mt-3">
            <AcademicTagPicker
              value={value.academic_tags}
              onChange={(slugs) => onChange({ ...value, academic_tags: slugs })}
            />
          </div>
        </div>
      )}

      {/* Professional — optional category + 3 main service tags */}
      {value.is_professional_counselor && (
        <div className="mt-4 space-y-4">
          {showProfessionalCategories && (
            <div className="rounded-2xl border-2 border-blue-100 bg-blue-50/40 p-4 sm:p-5">
              <p className="text-sm font-extrabold text-slate-800">Professional categories</p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Pick the domains you coach in. Optional, but recommended — helps us match you with
                the right freshers.
              </p>
              <div className="mt-3">
                <ProfessionalCategoryPicker
                  value={value.professional_categories}
                  onChange={(ids) => onChange({ ...value, professional_categories: ids })}
                  restrictToNames={[...COACH_FOR_FRESHERS_CATEGORIES]}
                />
              </div>
            </div>
          )}
          <div className="rounded-2xl border-2 border-blue-100 bg-blue-50/40 p-4 sm:p-5">
            <p className="text-sm font-extrabold text-slate-800">Coach for Freshers services</p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Pick at least one early-career service. These appear on the matching Coach for
              Freshers pages.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {COACH_FOR_FRESHERS_SERVICE_TAGS.map((service) => {
                const active = value.coaching_services.includes(service.tag)
                const isOnlySelected = active && value.coaching_services.length === 1
                return (
                  <button
                    key={service.tag}
                    type="button"
                    onClick={() => toggleService(service.tag)}
                    aria-pressed={active}
                    title={isOnlySelected ? 'At least one service must stay selected' : undefined}
                    className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left text-sm font-bold transition ${
                      active
                        ? 'border-blue-600 bg-white text-blue-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
                        active ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {active && <Check className="size-3.5" strokeWidth={3} />}
                    </span>
                    {service.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Industries — surfaced on the mentor's public profile */}
      <IndustriesSection
        selectedIds={value.industry_ids}
        onToggle={toggleIndustry}
      />
        </>
      )}
    </section>
  )
}

function CounsellingCardSkeleton() {
  return (
    <div className="mt-6 space-y-4" aria-busy="true" aria-live="polite">
      <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
        <Loader2 className="size-3.5 animate-spin text-blue-600" />
        Loading your counselling preferences…
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-[88px] animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-[88px] animate-pulse rounded-2xl bg-slate-100" />
      </div>
      <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />
      <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
      <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
    </div>
  )
}

function IndustriesSection({
  selectedIds,
  onToggle,
}: {
  selectedIds: string[]
  onToggle: (id: string) => void
}) {
  const { data: industries = [], isLoading } = useIndustries()

  return (
    <div className="mt-4 rounded-2xl border-2 border-blue-100 bg-blue-50/40 p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
          <Factory className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-slate-800">Industries</p>
          <p className="mt-0.5 text-xs font-medium text-slate-600">
            Pick the industries you mentor in. Helps students with industry-specific questions find
            you.
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {isLoading
          ? [1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-white/70" />
            ))
          : industries.map((industry) => {
              const active = selectedIds.includes(industry.id)
              return (
                <button
                  key={industry.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onToggle(industry.id)}
                  className={`inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-bold transition ${
                    active
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {active && <Check className="size-3.5" strokeWidth={3} />}
                  {industry.name}
                </button>
              )
            })}
      </div>
    </div>
  )
}

function CounsellingToggle({
  active,
  icon,
  title,
  description,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-start gap-4 rounded-2xl border-2 p-4 text-left transition ${
        active
          ? 'border-blue-600 bg-blue-50'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div
        className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl transition ${
          active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p
          className={`text-sm font-extrabold transition ${
            active ? 'text-blue-700' : 'text-slate-800'
          }`}
        >
          {title}
        </p>
        <p className="mt-0.5 text-xs font-medium leading-4 text-slate-600">{description}</p>
      </div>
      {/* Checkmark indicator */}
      <div
        className={`ml-auto mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
          active ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
        }`}
      >
        {active && (
          <svg viewBox="0 0 10 8" className="size-3 fill-none stroke-white stroke-2">
            <polyline points="1,4 4,7 9,1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </button>
  )
}
