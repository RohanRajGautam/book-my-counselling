import { UserRound } from 'lucide-react'

export type GeneralInfoForm = {
  professionalTitle: string
  currentCompany: string
  experience: string
  hourlyRate: string
}

type ProfileGeneralInfoCardProps = {
  value: GeneralInfoForm
  onChange: (value: GeneralInfoForm) => void
  readOnlyName?: string
  readOnlyEmail?: string
}

export function ProfileGeneralInfoCard({
  value,
  onChange,
  readOnlyName,
  readOnlyEmail,
}: ProfileGeneralInfoCardProps) {
  const updateField = (field: keyof GeneralInfoForm, nextValue: string) => {
    onChange({ ...value, [field]: nextValue })
  }

  return (
    <section
      id="general-info"
      className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8"
    >
      <div className="flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-300 text-emerald-900">
          <UserRound className="size-5" />
        </div>
        <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
          General Information
        </h2>
      </div>

      {/* Read-only account fields */}
      {(readOnlyName || readOnlyEmail) && (
        <div className="mt-7 grid gap-x-6 gap-y-5 md:grid-cols-2">
          {readOnlyName && (
            <ReadOnlyField label="Full Name" value={readOnlyName} />
          )}
          {readOnlyEmail && (
            <ReadOnlyField label="Email Address" value={readOnlyEmail} />
          )}
        </div>
      )}

      {/* Editable mentor profile fields */}
      <div className={`grid gap-x-6 gap-y-7 md:grid-cols-2 ${readOnlyName || readOnlyEmail ? 'mt-7' : 'mt-7'}`}>
        <Field
          label="Professional Title *"
          value={value.professionalTitle}
          placeholder="e.g. Senior Academic Advisor"
          onChange={(v) => updateField('professionalTitle', v)}
        />
        <Field
          label="Company / Institution"
          value={value.currentCompany}
          placeholder="e.g. Oxford University"
          onChange={(v) => updateField('currentCompany', v)}
        />
        <Field
          label="Years of Experience"
          value={value.experience}
          placeholder="e.g. 8"
          type="number"
          onChange={(v) => updateField('experience', v)}
        />
        <Field
          label="Hourly Rate (NPR)"
          value={value.hourlyRate}
          placeholder="e.g. 2000"
          type="number"
          onChange={(v) => updateField('hourlyRate', v)}
        />
      </div>

      <p className="mt-5 text-xs font-medium text-slate-400">
        * Required. Changes are saved when you click &quot;Save Changes&quot; above.
      </p>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  type?: React.HTMLInputTypeAttribute
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 flex min-h-14 w-full items-center rounded-2xl bg-[#eef4ff] px-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200 sm:px-5"
      />
    </label>
  )
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 flex min-h-14 items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 sm:px-5">
        <span className="text-sm font-medium text-slate-500">{value}</span>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-bold tracking-[0.16em] text-slate-600 uppercase">
      {children}
    </span>
  )
}
