'use client'

import { useState } from 'react'
import { Briefcase, ChevronRight, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useIndustries } from '@/features/industries/hooks/useIndustries'
import { useCreateMentorProfile } from '@/features/mentor-dashboard/hooks/useMentorProfile'
import { useAuth } from '../hooks/useAuth'

type Step = 'basics' | 'details'

interface FormState {
  title: string
  company: string
  bio: string
  hourly_rate: string
  years_of_experience: string
  industry_ids: string[]
  booking_mode: 'instant' | 'approval_required'
  is_professional_counselor: boolean
  is_academic_counselor: boolean
  linkedin_url: string
  website_url: string
}

const EMPTY_FORM: FormState = {
  title: '',
  company: '',
  bio: '',
  hourly_rate: '',
  years_of_experience: '',
  industry_ids: [],
  booking_mode: 'instant',
  is_professional_counselor: true,
  is_academic_counselor: false,
  linkedin_url: '',
  website_url: '',
}

export function MentorProfileSetup() {
  const { user, logout } = useAuth()
  const { data: industries = [], isLoading: loadingIndustries } = useIndustries()
  const { mutate: createProfile, isPending } = useCreateMentorProfile()

  const [step, setStep] = useState<Step>('basics')
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

  const canProceedStep1 = form.title.trim().length >= 2 && form.hourly_rate.trim().length > 0

  const handleSubmit = () => {
    const rate = parseFloat(form.hourly_rate)
    if (isNaN(rate) || rate < 0) {
      toast.error('Please enter a valid hourly rate.')
      return
    }

    createProfile(
      {
        title: form.title.trim(),
        company: form.company.trim() || null,
        bio: form.bio.trim() || null,
        hourly_rate: rate,
        years_of_experience: form.years_of_experience ? parseInt(form.years_of_experience, 10) : 0,
        industry_ids: form.industry_ids,
        booking_mode: form.booking_mode,
        is_professional_counselor: form.is_professional_counselor,
        is_academic_counselor: form.is_academic_counselor,
        linkedin_url: form.linkedin_url.trim() || null,
        website_url: form.website_url.trim() || null,
      },
      {
        onSuccess: () => toast.success('Profile created! Welcome to your dashboard.'),
        onError: (err: unknown) => {
          const msg = extractErrorMessage(err) ?? 'Failed to create profile. Please try again.'
          toast.error(msg)
        },
      }
    )
  }

  return (
    <div className="flex min-h-svh items-start justify-center bg-[#f0f4ff] px-4 py-12">
      <div className="w-full max-w-lg">
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
        <div className="mb-6 flex items-center justify-center gap-3">
          <StepDot active={step === 'basics'} done={step === 'details'} label="1" />
          <div className="h-px w-10 bg-slate-200" />
          <StepDot active={step === 'details'} done={false} label="2" />
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          {step === 'basics' ? (
            <BasicsStep
              form={form}
              update={update}
              canProceed={canProceedStep1}
              onNext={() => setStep('details')}
            />
          ) : (
            <DetailsStep
              form={form}
              update={update}
              industries={industries}
              loadingIndustries={loadingIndustries}
              toggleIndustry={toggleIndustry}
              isPending={isPending}
              onBack={() => setStep('basics')}
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
      <SectionTitle icon={<Briefcase className="size-4" />}>Basic Information</SectionTitle>

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

        <div>
          <FieldLabel>Counselling type</FieldLabel>
          <div className="mt-2 flex flex-wrap gap-2">
            <ToggleChip
              active={form.is_professional_counselor}
              onClick={() => update('is_professional_counselor', !form.is_professional_counselor)}
            >
              Professional Coaching
            </ToggleChip>
            <ToggleChip
              active={form.is_academic_counselor}
              onClick={() => update('is_academic_counselor', !form.is_academic_counselor)}
            >
              Academic Counselling
            </ToggleChip>
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
// Step 2 — Details
// ---------------------------------------------------------------------------

function DetailsStep({
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
    <div className="p-8">
      <SectionTitle icon={<Sparkles className="size-4" />}>Profile Details</SectionTitle>

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

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>
      <h2 className="font-headline text-lg font-extrabold text-slate-950">{children}</h2>
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

function StepDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <div
      className={`flex size-8 items-center justify-center rounded-full text-xs font-extrabold transition ${
        done
          ? 'bg-emerald-500 text-white'
          : active
            ? 'bg-blue-600 text-white'
            : 'bg-slate-200 text-slate-400'
      }`}
    >
      {done ? '✓' : label}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Error helper
// ---------------------------------------------------------------------------

function extractErrorMessage(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null
  const e = err as Record<string, unknown>
  const response = e['response'] as Record<string, unknown> | undefined
  const data = response?.['data'] as Record<string, unknown> | undefined
  if (typeof data?.['detail'] === 'string') return data['detail']
  return null
}
