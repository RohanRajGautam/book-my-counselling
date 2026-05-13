import { BadgePlus, BriefcaseBusiness, X } from 'lucide-react'

export type ProfessionalBioForm = {
  headline: string
  specializedFields: string[]
  fullBiography: string
}

type ProfileProfessionalBioCardProps = {
  value: ProfessionalBioForm
  onChange: (value: ProfessionalBioForm) => void
}

export function ProfileProfessionalBioCard({ value, onChange }: ProfileProfessionalBioCardProps) {
  const updateField = (field: keyof ProfessionalBioForm, nextValue: string | string[]) => {
    onChange({ ...value, [field]: nextValue })
  }

  const updateSpecializedField = (index: number, nextValue: string) => {
    updateField(
      'specializedFields',
      value.specializedFields.map((field, fieldIndex) => (fieldIndex === index ? nextValue : field))
    )
  }

  const removeSpecializedField = (index: number) => {
    updateField(
      'specializedFields',
      value.specializedFields.filter((_, fieldIndex) => fieldIndex !== index)
    )
  }

  return (
    <section
      id="professional-bio"
      className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8"
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
            onChange={(event) => updateField('headline', event.target.value)}
            className="mt-2 min-h-14 w-full rounded-2xl bg-[#eef4ff] px-4 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-200 sm:px-5"
          />
        </label>

        <div>
          <Label>Specialized Fields</Label>
          <div className="mt-2 min-h-24 rounded-2xl bg-[#eef4ff] p-3">
            <div className="flex flex-wrap gap-2">
              {value.specializedFields.map((field, index) => (
                <span
                  key={index}
                  className="inline-flex min-h-9 items-center gap-1 rounded-full bg-emerald-300 px-3 text-sm font-bold text-emerald-900"
                >
                  <input
                    type="text"
                    aria-label={`Specialized field ${index + 1}`}
                    value={field}
                    onChange={(event) => updateSpecializedField(index, event.target.value)}
                    className="w-[12ch] bg-transparent text-sm font-bold text-emerald-900 outline-none"
                  />
                  <button
                    type="button"
                    aria-label={`Remove ${field || 'specialized field'}`}
                    onClick={() => removeSpecializedField(index)}
                    className="rounded-full p-0.5 text-emerald-900 hover:bg-emerald-200"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={() =>
                  updateField('specializedFields', [...value.specializedFields, 'New Field'])
                }
                className="inline-flex min-h-9 items-center gap-2 rounded-full border border-dashed border-slate-400 px-4 text-sm font-bold text-slate-700 hover:border-blue-700 hover:text-blue-700"
              >
                <BadgePlus className="size-4" />
                Add Field
              </button>
            </div>
          </div>
        </div>

        <label className="block">
          <Label>Full Biography</Label>
          <textarea
            value={value.fullBiography}
            onChange={(event) => updateField('fullBiography', event.target.value)}
            rows={6}
            className="mt-2 min-h-40 w-full resize-y rounded-2xl bg-[#eef4ff] px-4 py-4 text-sm leading-6 font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-200 sm:px-5"
          />
        </label>
      </div>
    </section>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold tracking-[0.16em] text-slate-600 uppercase">{children}</p>
}
