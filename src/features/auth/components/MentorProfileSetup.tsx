'use client'

import { useMemo, useState } from 'react'
import { Briefcase, Check, ChevronRight, GraduationCap, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

import { useIndustries } from '@/features/industries/hooks/useIndustries'
import { useCreateMentorProfile } from '@/features/mentor-dashboard/hooks/useMentorProfile'
import {
  MentorProfileCreate,
  ProfessionalCategoryWithSubs,
} from '@/features/mentor-dashboard/types/mentor-dashboard.types'
import { AcademicSubcategoryPicker } from '@/features/mentor-onboarding/components/AcademicSubcategoryPicker'
import { AcademicTagPicker } from '@/features/mentor-onboarding/components/AcademicTagPicker'
import { ProfessionalCategoryPicker } from '@/features/mentor-onboarding/components/ProfessionalCategoryPicker'
import {
  COACH_FOR_FRESHERS_CATEGORIES,
  COACH_FOR_FRESHERS_SERVICE_SLUGS,
  COACH_FOR_FRESHERS_SERVICE_TAGS,
} from '@/features/coach-for-freshers/types/coach-for-freshers.types'
import { useTags } from '@/features/tags/hooks/useTags'
import { useAuth } from '../hooks/useAuth'

type Step = 'basics' | 'focus' | 'specialise' | 'profile'

type CounsellingChoice = 'academic' | 'professional' | 'both'

const STEPS: { id: Step; label: string }[] = [
  { id: 'basics', label: 'Basics' },
  { id: 'focus', label: 'Focus' },
  { id: 'specialise', label: 'Specialise' },
  { id: 'profile', label: 'Profile' },
]

interface FormState {
  // Basics
  title: string
  company: string
  hourly_rate: string
  years_of_experience: string
  booking_mode: 'instant' | 'approval_required'
  // Specialisation
  counselling: CounsellingChoice
  subcategory_ids: string[]
  professional_categories: ProfessionalCategoryWithSubs[]
  coaching_services: string[]
  academic_tags: string[]
  // Details
  bio: string
  industry_ids: string[]
  linkedin_url: string
  website_url: string
}

const EMPTY_FORM: FormState = {
  title: '',
  company: '',
  hourly_rate: '',
  years_of_experience: '',
  booking_mode: 'instant',
  counselling: 'academic',
  subcategory_ids: [],
  professional_categories: [],
  coaching_services: [],
  academic_tags: [],
  bio: '',
  industry_ids: [],
  linkedin_url: '',
  website_url: '',
}

export function MentorProfileSetup() {
  const { user, logout } = useAuth()
  const { data: industries = [], isLoading: loadingIndustries } = useIndustries()
  const { data: catalogTags = [] } = useTags()
  const { mutate: createProfile, isPending } = useCreateMentorProfile()

  const [step, setStep] = useState<Step>('basics')
  const stepIndex = STEPS.findIndex((s) => s.id === step)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const toggleIndustry = (id: string) => {
    update(
      'industry_ids',
      form.industry_ids.includes(id)
        ? form.industry_ids.filter((i) => i !== id)
        : [...form.industry_ids, id]
    )
  }

  const toggleServiceTag = (slug: string) => {
    // ≥1 service rule: keep at least one Coach for Freshers service selected.
    const isCurrentlySelected = form.coaching_services.includes(slug)
    if (isCurrentlySelected && form.coaching_services.length <= 1) return
    update(
      'coaching_services',
      isCurrentlySelected
        ? form.coaching_services.filter((s) => s !== slug)
        : [...form.coaching_services, slug]
    )
  }

  const isAcademic = form.counselling === 'academic' || form.counselling === 'both'
  const isProfessional = form.counselling === 'professional' || form.counselling === 'both'

  const basicsValid = form.title.trim().length >= 2 && form.hourly_rate.trim().length > 0
  const specialisationValid = useMemo(() => {
    if (form.counselling === 'academic' && form.subcategory_ids.length === 0) return false
    // Coach for Freshers flow requires at least one service selected.
    if (isProfessional && form.coaching_services.length === 0) return false
    return true
  }, [form.counselling, form.subcategory_ids, isProfessional, form.coaching_services.length])

  const handleSubmit = () => {
    const rate = parseFloat(form.hourly_rate)
    if (isNaN(rate) || rate < 0) {
      toast.error('Please enter a valid hourly rate.')
      return
    }

    // Defence in depth — should never trip because canProceedStep1 gates this.
    if (!basicsValid) {
      toast.error('Please complete the required basics fields first.')
      return
    }

    if (!specialisationValid) {
      toast.error('Pick at least one academic field before continuing.')
      return
    }

    const payload: MentorProfileCreate = {
      title: form.title.trim(),
      company: form.company.trim() || null,
      bio: form.bio.trim() || null,
      hourly_rate: rate,
      years_of_experience: form.years_of_experience ? parseInt(form.years_of_experience, 10) : 0,
      industry_ids: form.industry_ids,
      booking_mode: form.booking_mode,
      is_professional_counselor: isProfessional,
      is_academic_counselor: isAcademic,
      linkedin_url: form.linkedin_url.trim() || null,
      website_url: form.website_url.trim() || null,
    }

    if (isAcademic) payload.subcategory_ids = form.subcategory_ids
    if (isProfessional) {
      // Drop empty parent buckets (a parent with no subcategories) — the backend
      // rejects entries whose subcategory_ids[] is empty.
      const nonEmpty = form.professional_categories.filter((c) => c.subcategory_ids.length > 0)
      if (nonEmpty.length > 0) {
        payload.professional_categories = nonEmpty
      }
    }
    // Resolve selected tag slugs (from the academic picker and/or the curated
    // 3-service-tag picker) into backend tag UUIDs. The catalog/tags endpoint is
    // the source of truth. The coach-for-freshers group tag is added automatically
    // by the backend for professional counsellors — we still send any explicit
    // selection (dedup happens server-side).
    const selectedTagSlugs = [
      ...(isProfessional
        ? form.coaching_services.filter((slug) => COACH_FOR_FRESHERS_SERVICE_SLUGS.includes(slug))
        : []),
      ...(isAcademic ? form.academic_tags : []),
    ]
    if (selectedTagSlugs.length > 0) {
      const slugToId = new Map(catalogTags.map((t) => [t.slug, t.id]))
      const tagIds = selectedTagSlugs
        .map((slug) => slugToId.get(slug))
        .filter((id): id is string => Boolean(id))
      if (tagIds.length > 0) {
        payload.tag_ids = tagIds
      }
    }

    createProfile(payload, {
      onSuccess: () => toast.success('Profile created! Welcome to your dashboard.'),
      onError: (err: unknown) => {
        const msg = extractApiError(err) ?? 'Failed to create profile. Please try again.'
        toast.error(msg)
      },
    })
  }

  return (
    <div className="flex min-h-svh items-start justify-center bg-[#f0f4ff] px-4 py-12">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
            <Sparkles className="size-6 text-white" />
          </div>
          <h1 className="font-headline text-2xl font-extrabold text-slate-950">
            Set up your mentor profile
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Logged in as <span className="font-bold text-slate-700">{user?.email}</span>
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator currentIndex={stepIndex} />

        {/* Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          {step === 'basics' && (
            <BasicsStep
              form={form}
              update={update}
              canProceed={basicsValid}
              onNext={() => setStep('focus')}
            />
          )}
          {step === 'focus' && (
            <FocusStep
              form={form}
              update={update}
              onBack={() => setStep('basics')}
              onNext={() => setStep('specialise')}
            />
          )}
          {step === 'specialise' && (
            <SpecialiseStep
              form={form}
              update={update}
              toggleServiceTag={toggleServiceTag}
              canProceed={specialisationValid}
              onBack={() => setStep('focus')}
              onNext={() => setStep('profile')}
            />
          )}
          {step === 'profile' && (
            <ProfileStep
              form={form}
              update={update}
              industries={industries}
              loadingIndustries={loadingIndustries}
              toggleIndustry={toggleIndustry}
              isPending={isPending}
              onBack={() => setStep('specialise')}
              onSubmit={handleSubmit}
            />
          )}
        </div>

        <button
          type="button"
          onClick={logout}
          className="mt-5 block w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600"
        >
          Sign out and use a different account
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Shared step UI
// ---------------------------------------------------------------------------

function StepIndicator({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="mb-6 flex items-center justify-center gap-1.5">
      {STEPS.map((s, i) => {
        const done = i < currentIndex
        const active = i === currentIndex
        return (
          <div key={s.id} className="flex items-center gap-1.5">
            <div
              className={`flex size-6 items-center justify-center rounded-full text-[11px] font-extrabold transition ${
                done
                  ? 'bg-emerald-500 text-white'
                  : active
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-400'
              }`}
            >
              {done ? '✓' : i + 1}
            </div>
            <span
              className={`text-[11px] font-extrabold tracking-wide uppercase transition ${
                done ? 'text-slate-500' : active ? 'text-slate-950' : 'text-slate-400'
              }`}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-1 h-px w-5 transition ${done ? 'bg-emerald-500' : 'bg-slate-200'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function StepHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="font-headline text-lg font-extrabold text-slate-950">{title}</h2>
      {subtitle && <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 1 — Basics
// ---------------------------------------------------------------------------

function BasicsStep({
  form,
  update,
  canProceed,
  onNext,
}: {
  form: FormState
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void
  canProceed: boolean
  onNext: () => void
}) {
  return (
    <div className="p-8">
      <StepHeader
        title="Tell us about you"
        subtitle="The basics students will see on your profile."
      />

      <div className="mt-6 space-y-5">
        <Field
          label="Professional title *"
          placeholder="e.g. Senior Software Engineer, Academic Advisor"
          value={form.title}
          onChange={(v) => update('title', v)}
        />
        <Field
          label="Company / Institution"
          placeholder="e.g. Google, Oxford University"
          value={form.company}
          onChange={(v) => update('company', v)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Hourly rate (NPR) *"
            placeholder="e.g. 2000"
            type="number"
            value={form.hourly_rate}
            onChange={(v) => update('hourly_rate', v)}
          />
          <Field
            label="Years of experience"
            placeholder="e.g. 5"
            type="number"
            value={form.years_of_experience}
            onChange={(v) => update('years_of_experience', v)}
          />
        </div>

        <div>
          <FieldLabel>Booking mode</FieldLabel>
          <div className="mt-2 grid h-12 grid-cols-2 rounded-2xl bg-[#f0f4ff] p-1">
            {(['instant', 'approval_required'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => update('booking_mode', mode)}
                className={`rounded-xl text-xs font-extrabold transition ${
                  form.booking_mode === mode
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {mode === 'instant' ? 'Instant' : 'Approval Required'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={!canProceed}
        onClick={onNext}
        className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-extrabold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 2 — Focus
// ---------------------------------------------------------------------------

const COUNSELLING_CHOICES: {
  value: CounsellingChoice
  title: string
  description: string
  icon: React.ReactNode
  emphasis?: 'secondary'
}[] = [
  {
    value: 'academic',
    title: 'Academic Counsellor',
    description: 'University applications, thesis support, research strategy.',
    icon: <GraduationCap className="size-6" />,
  },
  {
    value: 'professional',
    title: 'Coach for Freshers',
    description: 'Career guidance, interview prep, first-job coaching.',
    icon: <Briefcase className="size-6" />,
  },
  {
    value: 'both',
    title: 'Both',
    description: 'I mentor both academically and professionally.',
    icon: <Sparkles className="size-6" />,
    emphasis: 'secondary',
  },
]

function FocusStep({
  form,
  update,
  onBack,
  onNext,
}: {
  form: FormState
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div className="p-6 sm:p-8">
      <StepHeader
        title="How will you mentor?"
        subtitle="Pick the kind of guidance you offer. You'll fill in the details on the next step."
      />

      <div className="mt-6 space-y-3">
        {COUNSELLING_CHOICES.map((c) => (
          <CounsellingChoiceCard
            key={c.value}
            active={form.counselling === c.value}
            icon={c.icon}
            title={c.title}
            description={c.description}
            emphasis={c.emphasis}
            onClick={() => update('counselling', c.value)}
          />
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex h-12 flex-[2] items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-extrabold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700"
        >
          Continue
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

function CounsellingChoiceCard({
  active,
  icon,
  title,
  description,
  emphasis,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  title: string
  description: string
  emphasis?: 'secondary'
  onClick: () => void
}) {
  const isSecondary = emphasis === 'secondary'
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex w-full items-start gap-4 rounded-2xl border-2 p-5 text-left transition ${
        active
          ? 'border-blue-600 bg-blue-50'
          : isSecondary
            ? 'border-dashed border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div
        className={`mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl transition ${
          active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-extrabold transition ${
            active ? 'text-blue-700' : 'text-slate-800'
          }`}
        >
          {title}
        </p>
        <p className="mt-1 text-xs font-medium leading-4 text-slate-500">{description}</p>
      </div>
      <div
        className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
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

// ---------------------------------------------------------------------------
// Step 3 — Specialise
// ---------------------------------------------------------------------------

function SpecialiseStep({
  form,
  update,
  toggleServiceTag,
  canProceed,
  onBack,
  onNext,
}: {
  form: FormState
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void
  toggleServiceTag: (slug: string) => void
  canProceed: boolean
  onBack: () => void
  onNext: () => void
}) {
  const isAcademic = form.counselling === 'academic' || form.counselling === 'both'
  const isProfessional = form.counselling === 'professional' || form.counselling === 'both'

  return (
    <div className="p-6 sm:p-8">
      <StepHeader
        title="What do you mentor on?"
        subtitle={
          isAcademic && isProfessional
            ? 'Pick the academic fields and professional domains that match your expertise.'
            : isAcademic
              ? 'Pick the academic fields that match your expertise.'
              : 'Pick the professional domains that match your expertise.'
        }
      />

      <div className="mt-6 space-y-4">
        {isAcademic && (
          <>
            <SectionPanel
              title="Academic fields"
              required
              description="This drives how students find you. Pick at least one."
            >
              <AcademicSubcategoryPicker
                value={form.subcategory_ids}
                onChange={(ids) => update('subcategory_ids', ids)}
              />
            </SectionPanel>

            <SectionPanel
              title="Tags"
              description="These tags will be displayed in your mentor card."
            >
              <AcademicTagPicker
                value={form.academic_tags}
                onChange={(slugs) => update('academic_tags', slugs)}
              />
            </SectionPanel>
          </>
        )}

        {isProfessional && (
          <>
            <SectionPanel
              title="Professional categories"
              description="Pick the domains you coach in (IT, Management, General)."
            >
              <ProfessionalCategoryPicker
                value={form.professional_categories}
                onChange={(ids) => update('professional_categories', ids)}
                restrictToNames={[...COACH_FOR_FRESHERS_CATEGORIES]}
              />
            </SectionPanel>

            <SectionPanel
              title="Coach for Freshers services"
              description="Pick at least one early-career service. These appear on the matching Coach for Freshers pages."
            >
              <div className="grid gap-2 sm:grid-cols-2">
                {COACH_FOR_FRESHERS_SERVICE_TAGS.map((service) => {
                  const active = form.coaching_services.includes(service.tag)
                  const isOnlySelected = active && form.coaching_services.length === 1
                  return (
                    <button
                      key={service.tag}
                      type="button"
                      onClick={() => toggleServiceTag(service.tag)}
                      aria-pressed={active}
                      title={isOnlySelected ? 'At least one service must stay selected' : undefined}
                      className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left text-sm font-bold transition ${
                        active
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
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
            </SectionPanel>
          </>
        )}
      </div>

      {!canProceed && isAcademic && (
        <p className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-xs font-bold text-amber-900">
          Pick at least one academic field to continue.
        </p>
      )}
      {!canProceed && isProfessional && form.coaching_services.length === 0 && (
        <p className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-xs font-bold text-amber-900">
          Pick at least one Coach for Freshers service to continue.
        </p>
      )}

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
        >
          Back
        </button>
        <button
          type="button"
          disabled={!canProceed}
          onClick={onNext}
          className="flex h-12 flex-[2] items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-extrabold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

function SectionPanel({
  title,
  description,
  required,
  action,
  children,
}: {
  title: string
  description?: string
  required?: boolean
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border-2 border-blue-100 bg-blue-50/40 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-slate-800">
            {title}
            {required && <span className="ml-1 text-blue-600">*</span>}
          </p>
          {description && (
            <p className="mt-1 text-xs font-medium text-slate-500">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Step 4 — Profile
// ---------------------------------------------------------------------------

function ProfileStep({
  form,
  update,
  industries,
  loadingIndustries,
  toggleIndustry,
  isPending,
  onBack,
  onSubmit,
}: {
  form: FormState
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void
  industries: { id: string; name: string }[]
  loadingIndustries: boolean
  toggleIndustry: (id: string) => void
  isPending: boolean
  onBack: () => void
  onSubmit: () => void
}) {
  return (
    <div className="p-6 sm:p-8">
      <StepHeader
        title="Add the finishing touches"
        subtitle="Help students learn more about you before they book."
      />

      <div className="mt-6 space-y-5">
        <div>
          <FieldLabel>Bio</FieldLabel>
          <textarea
            value={form.bio}
            onChange={(e) => update('bio', e.target.value)}
            placeholder="Tell students about your background, expertise, and how you can help them…"
            rows={4}
            className="mt-2 w-full resize-none rounded-2xl bg-[#f0f4ff] px-4 py-3 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <FieldLabel>Industries</FieldLabel>
          {loadingIndustries ? (
            <div className="mt-2 flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-slate-200" />
              ))}
            </div>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {industries.map((ind) => (
                <ToggleChip
                  key={ind.id}
                  active={form.industry_ids.includes(ind.id)}
                  onClick={() => toggleIndustry(ind.id)}
                >
                  {ind.name}
                </ToggleChip>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="LinkedIn URL"
            placeholder="https://linkedin.com/in/yourname"
            type="url"
            value={form.linkedin_url}
            onChange={(v) => update('linkedin_url', v)}
          />
          <Field
            label="Website / Portfolio"
            placeholder="https://yourwebsite.com"
            type="url"
            value={form.website_url}
            onChange={(v) => update('website_url', v)}
          />
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isPending}
          className="flex h-12 flex-[2] items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-extrabold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating profile…
            </>
          ) : (
            'Create Profile & Go to Dashboard'
          )}
        </button>
      </div>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-extrabold tracking-[0.12em] text-slate-500 uppercase">{children}</p>
  )
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-2xl bg-[#f0f4ff] px-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200"
      />
    </label>
  )
}

function ToggleChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-extrabold transition ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-[#f0f4ff] text-slate-600 hover:bg-blue-50 hover:text-blue-700'
      }`}
    >
      {children}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Error helper — mirrors ProfileSettingsPage.
// ---------------------------------------------------------------------------

function extractApiError(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null
  const e = err as Record<string, unknown>
  const response = e['response'] as Record<string, unknown> | undefined
  const data = response?.['data'] as Record<string, unknown> | undefined
  if (!data) return null

  // 422 from Pydantic — detail is an array of {loc, msg, type}.
  if (Array.isArray(data['detail'])) {
    const items = (data['detail'] as Array<Record<string, unknown>>)
      .map((row) => {
        const loc = Array.isArray(row['loc'])
          ? (row['loc'] as unknown[]).filter((l) => l !== 'body').join('.')
          : ''
        const msg = typeof row['msg'] === 'string' ? row['msg'] : ''
        return loc && msg ? `${loc}: ${msg}` : msg
      })
      .filter(Boolean)
    if (items.length > 0) return items.join('\n')
  }

  // 400 from service layer — detail is a flat string.
  if (typeof data['detail'] === 'string') return data['detail']

  return null
}
