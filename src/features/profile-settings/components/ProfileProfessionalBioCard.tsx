import { BriefcaseBusiness, Check, Link } from 'lucide-react'

import { COACH_FOR_FRESHERS_SERVICE_TAGS } from '@/features/coach-for-freshers/types/coach-for-freshers.types'

import type { CounsellingType } from './ProfileCounsellingCard'

export type ProfessionalBioForm = {
  headline: string
  fullBiography: string
  linkedinUrl: string
  portfolioUrl: string
}

type ProfileProfessionalBioCardProps = {
  value: ProfessionalBioForm
  onChange: (value: ProfessionalBioForm) => void
  counselling: CounsellingType
  onCounsellingChange: (value: CounsellingType) => void
}

const ACADEMIC_FIELD = 'academic-counselling'

export function ProfileProfessionalBioCard({
  value,
  onChange,
  counselling,
  onCounsellingChange,
}: ProfileProfessionalBioCardProps) {
  const updateField = (field: keyof ProfessionalBioForm, nextValue: string) => {
    onChange({ ...value, [field]: nextValue })
  }

  const specializedFields = [
    { id: ACADEMIC_FIELD, label: 'Academic Counselling' },
    ...COACH_FOR_FRESHERS_SERVICE_TAGS.map((s) => ({ id: s.tag, label: s.label })),
  ]

  const isFieldSelected = (id: string) =>
    id === ACADEMIC_FIELD
      ? counselling.is_academic_counselor
      : counselling.coaching_services.includes(id)

  const toggleSpecializedField = (id: string) => {
    if (id === ACADEMIC_FIELD) {
      onCounsellingChange({
        ...counselling,
        is_academic_counselor: !counselling.is_academic_counselor,
      })
      return
    }
    const selected = counselling.coaching_services.includes(id)
    onCounsellingChange({
      ...counselling,
      is_professional_counselor: selected ? counselling.is_professional_counselor : true,
      coaching_services: selected
        ? counselling.coaching_services.filter((s) => s !== id)
        : [...counselling.coaching_services, id],
    })
  }

  return (
    <section
      id="professional-bio"
      className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-10"
    >
      <div className="flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-amber-200 text-amber-900">
          <BriefcaseBusiness className="size-5" />
        </div>
        <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
          Professional Bio
        </h2>
      </div>

      <div className="mt-7 space-y-8">
        <label className="block">
          <Label>Headline</Label>
          <input
            type="text"
            value={value.headline}
            placeholder="Add a short headline for your profile"
            onChange={(event) => updateField('headline', event.target.value)}
            className="mt-2 min-h-14 w-full rounded-2xl bg-[#eef4ff] px-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200 sm:px-5"
          />
        </label>

        <div>
          <Label>Specialized Fields</Label>
          <div className="mt-2 min-h-24 rounded-2xl bg-[#eef4ff] p-3">
            <div className="flex flex-wrap gap-2">
              {specializedFields.map((field) => {
                const isSelected = isFieldSelected(field.id)

                return (
                  <button
                    key={field.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleSpecializedField(field.id)}
                    className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-bold transition ${
                      isSelected
                        ? 'bg-emerald-300 text-emerald-950'
                        : 'bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    {isSelected ? <Check className="size-4" /> : null}
                    {field.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <label className="block">
          <Label>Full Biography</Label>
          <textarea
            value={value.fullBiography}
            placeholder="Tell students about your experience, approach, and the support you offer"
            onChange={(event) => updateField('fullBiography', event.target.value)}
            rows={6}
            className="mt-2 min-h-40 w-full resize-y rounded-2xl bg-[#eef4ff] px-4 py-4 text-sm leading-6 font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200 sm:px-5"
          />
        </label>

        <UrlField
          label="LinkedIn URL"
          value={value.linkedinUrl}
          placeholder="Link to LinkedIn"
          onChange={(nextValue) => updateField('linkedinUrl', nextValue)}
        />

        <UrlField
          label="Portfolio Link"
          value={value.portfolioUrl}
          placeholder="If you have any links to display your portfolio, add here."
          onChange={(nextValue) => updateField('portfolioUrl', nextValue)}
        />
      </div>
    </section>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold tracking-[0.16em] text-slate-600 uppercase">{children}</p>
}

function UrlField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <div className="mt-2 flex min-h-14 items-center gap-4 rounded-2xl bg-[#eef4ff] px-4 text-sm font-medium text-slate-800 focus-within:ring-2 focus-within:ring-blue-200 sm:px-5">
        <Link className="size-5 shrink-0 text-slate-300" />
        <input
          type="url"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-300"
        />
      </div>
    </label>
  )
}
