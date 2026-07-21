'use client'

import {
  Briefcase,
  BriefcaseBusiness,
  Check,
  Factory,
  GraduationCap,
} from 'lucide-react'

import {
  COACH_FOR_FRESHERS_CATEGORIES,
  COACH_FOR_FRESHERS_SERVICE_TAGS,
} from '@/features/coach-for-freshers/types/coach-for-freshers.types'
import { ProfessionalCategoryWithSubs } from '@/features/mentor-dashboard/types/mentor-dashboard.types'
import { AcademicSubcategoryPicker } from '@/features/mentor-onboarding/components/AcademicSubcategoryPicker'
import { AcademicTagPicker } from '@/features/mentor-onboarding/components/AcademicTagPicker'
import { ProfessionalCategoryPicker } from '@/features/mentor-onboarding/components/ProfessionalCategoryPicker'
import { useIndustries } from '@/features/industries/hooks/useIndustries'

export type AdminCounsellingForm = {
  isProfessionalCounselor: boolean
  isAcademicCounselor: boolean
  coachingServices: string[]
  subcategoryIds: string[]
  professionalCategories: ProfessionalCategoryWithSubs[]
  academicTags: string[]
  industryIds: string[]
}

type Props = {
  value: AdminCounsellingForm
  onChange: (next: AdminCounsellingForm) => void
  errors?: {
    counsellingType?: string
    subcategoryIds?: string
    coachingServices?: string
  }
}

export function AdminCreateMentorCounsellingCard({ value, onChange, errors = {} }: Props) {
  const toggleProfessional = () => {
    const next = !value.isProfessionalCounselor
    onChange({
      ...value,
      isProfessionalCounselor: next,
      coachingServices: next
        ? value.coachingServices.length > 0
          ? value.coachingServices
          : [COACH_FOR_FRESHERS_SERVICE_TAGS[0]!.tag]
        : [],
      professionalCategories: next ? value.professionalCategories : [],
    })
  }

  const toggleService = (slug: string) => {
    const isCurrentlySelected = value.coachingServices.includes(slug)
    if (isCurrentlySelected && value.coachingServices.length <= 1) return
    onChange({
      ...value,
      isProfessionalCounselor: isCurrentlySelected ? value.isProfessionalCounselor : true,
      coachingServices: isCurrentlySelected
        ? value.coachingServices.filter((s) => s !== slug)
        : [...value.coachingServices, slug],
    })
  }

  const toggleAcademic = () => {
    const next = !value.isAcademicCounselor
    onChange({
      ...value,
      isAcademicCounselor: next,
      subcategoryIds: next ? value.subcategoryIds : [],
      academicTags: next ? value.academicTags : [],
    })
  }

  const toggleIndustry = (id: string) => {
    onChange({
      ...value,
      industryIds: value.industryIds.includes(id)
        ? value.industryIds.filter((i) => i !== id)
        : [...value.industryIds, id],
    })
  }

  const counsellingTypeError =
    !value.isProfessionalCounselor &&
    !value.isAcademicCounselor &&
    errors.counsellingType

  return (
    <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
      <div className="flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-amber-200 text-amber-900">
          <BriefcaseBusiness className="size-5" />
        </div>
        <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
          Counselling Provided
        </h2>
      </div>

      <p className="mt-2 text-sm font-medium text-slate-500">
        Pick at least one counselling type. This appears on the mentor&apos;s public profile.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <CounsellingToggle
          active={value.isProfessionalCounselor}
          icon={<Briefcase className="size-5" />}
          title="Professional Coaching"
          description="Career guidance, industry transitions, interview prep"
          onClick={toggleProfessional}
        />
        <CounsellingToggle
          active={value.isAcademicCounselor}
          icon={<GraduationCap className="size-5" />}
          title="Academic Counselling"
          description="University applications, thesis support, research strategy"
          onClick={toggleAcademic}
        />
      </div>

      {counsellingTypeError ? (
        <p className="mt-3 text-xs font-bold text-red-600">{counsellingTypeError}</p>
      ) : null}

      {value.isAcademicCounselor && (
        <div className="mt-6 rounded-2xl border-2 border-blue-100 bg-blue-50/40 p-4 sm:p-5">
          <p className="text-sm font-extrabold text-slate-800">Academic fields</p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Pick at least one. We use these to surface the profile to the right students.
          </p>
          <div className="mt-3">
            <AcademicSubcategoryPicker
              value={value.subcategoryIds}
              onChange={(ids) => onChange({ ...value, subcategoryIds: ids })}
            />
          </div>
          {errors.subcategoryIds ? (
            <p className="mt-2 text-xs font-bold text-red-600">{errors.subcategoryIds}</p>
          ) : null}

          <div className="mt-4">
            <p className="text-sm font-extrabold text-slate-800">Tags</p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              These tags appear on the mentor&apos;s public card.
            </p>
            <div className="mt-3">
              <AcademicTagPicker
                value={value.academicTags}
                onChange={(slugs) => onChange({ ...value, academicTags: slugs })}
              />
            </div>
          </div>
        </div>
      )}

      {value.isProfessionalCounselor && (
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl border-2 border-blue-100 bg-blue-50/40 p-4 sm:p-5">
            <p className="text-sm font-extrabold text-slate-800">Professional categories</p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Pick the domains they coach in. Optional, but recommended.
            </p>
            <div className="mt-3">
              <ProfessionalCategoryPicker
                value={value.professionalCategories}
                onChange={(ids) => onChange({ ...value, professionalCategories: ids })}
                restrictToNames={[...COACH_FOR_FRESHERS_CATEGORIES]}
              />
            </div>
          </div>

          <div className="rounded-2xl border-2 border-blue-100 bg-blue-50/40 p-4 sm:p-5">
            <p className="text-sm font-extrabold text-slate-800">Coach for Freshers services</p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Pick at least one. These appear on the Coach for Freshers pages.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {COACH_FOR_FRESHERS_SERVICE_TAGS.map((service) => {
                const active = value.coachingServices.includes(service.tag)
                const isOnlySelected = active && value.coachingServices.length === 1
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
            {errors.coachingServices ? (
              <p className="mt-2 text-xs font-bold text-red-600">{errors.coachingServices}</p>
            ) : null}
          </div>
        </div>
      )}

      <IndustriesSection selectedIds={value.industryIds} onToggle={toggleIndustry} />
    </section>
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
            Pick the industries they mentor in. Helps industry-specific questions find them.
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
