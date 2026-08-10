'use client'

import { UserRound } from 'lucide-react'

export type AdminCreateMentorGeneralInfoForm = {
  title: string
  company: string
  yearsOfExperience: string
  hourlyRate: string
  mentorSharePct: string
}

type Props = {
  value: AdminCreateMentorGeneralInfoForm
  onChange: (next: AdminCreateMentorGeneralInfoForm) => void
  errors?: Partial<Record<keyof AdminCreateMentorGeneralInfoForm, string>>
}

export function AdminCreateMentorGeneralInfoCard({ value, onChange, errors = {} }: Props) {
  const updateField = (field: keyof AdminCreateMentorGeneralInfoForm, nextValue: string) => {
    onChange({ ...value, [field]: nextValue })
  }

  return (
    <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
      <div className="flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-300 text-emerald-900">
          <UserRound className="size-5" />
        </div>
        <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
          General Information
        </h2>
      </div>

      <p className="mt-2 text-sm font-medium text-slate-500">
        The mentor&apos;s headline, experience, and hourly rate. These appear on their public
        profile.
      </p>

      <div className="mt-7 grid gap-x-6 gap-y-7 md:grid-cols-2">
        <Field
          label="Professional Title *"
          value={value.title}
          placeholder="e.g. Senior Academic Advisor"
          onChange={(v) => updateField('title', v)}
          error={errors.title}
        />
        <Field
          label="Company / Institution"
          value={value.company}
          placeholder="e.g. Oxford University"
          onChange={(v) => updateField('company', v)}
          error={errors.company}
        />
        <Field
          label="Years of Experience"
          value={value.yearsOfExperience}
          placeholder="e.g. 8"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={(v) => updateField('yearsOfExperience', v)}
          error={errors.yearsOfExperience}
        />
        <Field
          label="Hourly Rate (NPR) *"
          value={value.hourlyRate}
          placeholder="e.g. 2000"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={(v) => updateField('hourlyRate', v)}
          error={errors.hourlyRate}
        />
        <Field
          label="Mentor Share (%)"
          value={value.mentorSharePct}
          placeholder="e.g. 50"
          helper="Default 50. Mentor earns this percent of the gross booking price."
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={(v) => updateField('mentorSharePct', v)}
          error={errors.mentorSharePct}
        />
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  inputMode,
  pattern,
  helper,
  error,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  type?: React.HTMLInputTypeAttribute
  inputMode?: 'numeric' | 'decimal' | 'text'
  pattern?: string
  helper?: string
  error?: string
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        type={type}
        inputMode={inputMode}
        pattern={pattern}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={
          'mt-2 flex min-h-14 w-full items-center rounded-2xl bg-[#eef4ff] px-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200 sm:px-5' +
          (error ? ' ring-2 ring-red-200' : '')
        }
      />
      {error ? (
        <p className="mt-1.5 text-xs font-bold text-red-600">{error}</p>
      ) : helper ? (
        <p className="mt-1.5 text-xs font-medium text-slate-500">{helper}</p>
      ) : null}
    </label>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-bold tracking-[0.16em] text-slate-600 uppercase">{children}</span>
  )
}
