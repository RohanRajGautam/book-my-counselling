import { ChevronDown, UserRound } from 'lucide-react'

export type GeneralInfoForm = {
  fullName: string
  professionalTitle: string
  emailAddress: string
  phoneNumber: string
  timezone: string
}

type ProfileGeneralInfoCardProps = {
  value: GeneralInfoForm
  onChange: (value: GeneralInfoForm) => void
}

export function ProfileGeneralInfoCard({ value, onChange }: ProfileGeneralInfoCardProps) {
  const updateField = (field: keyof GeneralInfoForm, nextValue: string) => {
    onChange({ ...value, [field]: nextValue })
  }

  return (
    <section id="general-info" className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
      <div className="flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-300 text-emerald-900">
          <UserRound className="size-5" />
        </div>
        <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
          General Information
        </h2>
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <Field
          label="Full Name"
          value={value.fullName}
          onChange={(nextValue) => updateField('fullName', nextValue)}
        />
        <Field
          label="Professional Title"
          value={value.professionalTitle}
          onChange={(nextValue) => updateField('professionalTitle', nextValue)}
        />
        <Field
          label="Email Address"
          type="email"
          value={value.emailAddress}
          onChange={(nextValue) => updateField('emailAddress', nextValue)}
        />
        <Field
          label="Phone Number"
          type="tel"
          value={value.phoneNumber}
          onChange={(nextValue) => updateField('phoneNumber', nextValue)}
        />
      </div>

      <div className="mt-6">
        <p className="text-xs font-bold tracking-[0.16em] text-slate-600 uppercase">
          Location / Timezone
        </p>
        <div className="mt-2 flex min-h-14 items-center justify-between gap-3 rounded-2xl bg-[#eef4ff] px-4 text-sm font-medium text-slate-800 sm:px-5">
          <input
            type="text"
            value={value.timezone}
            onChange={(event) => updateField('timezone', event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none"
          />
          <ChevronDown className="size-4 text-slate-500" />
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: React.HTMLInputTypeAttribute
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold tracking-[0.16em] text-slate-600 uppercase">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 flex min-h-14 w-full items-center rounded-2xl bg-[#eef4ff] px-4 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-200 sm:px-5"
      />
    </label>
  )
}
