import { ChevronDown, UserRound } from 'lucide-react'

export type GeneralInfoForm = {
  fullName: string
  professionalTitle: string
  education: string
  currentCompany: string
  experience: string
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

      <div className="mt-7 grid gap-x-6 gap-y-7 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <Field
          label="Full Name"
          value={value.fullName}
          placeholder="Enter your full name"
          onChange={(nextValue) => updateField('fullName', nextValue)}
        />
        <Field
          label="Professional Title"
          value={value.professionalTitle}
          placeholder="Enter your professional title"
          onChange={(nextValue) => updateField('professionalTitle', nextValue)}
        />
        <Field
          label="Email Address"
          type="email"
          value={value.emailAddress}
          placeholder="Enter your email address"
          onChange={(nextValue) => updateField('emailAddress', nextValue)}
        />
        <Field
          label="Phone Number"
          type="tel"
          value={value.phoneNumber}
          placeholder="Enter your phone number"
          onChange={(nextValue) => updateField('phoneNumber', nextValue)}
        />
      </div>

      <div className="mt-7">
        <p className="text-xs font-bold tracking-[0.16em] text-slate-600 uppercase">
          Location / Timezone
        </p>
        <div className="mt-2 flex min-h-14 items-center justify-between gap-3 rounded-2xl bg-[#eef4ff] px-4 text-sm font-medium text-slate-800 sm:px-5">
          <input
            type="text"
            value={value.timezone}
            placeholder="Select or enter your timezone"
            onChange={(event) => updateField('timezone', event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
          />
          <ChevronDown className="size-4 text-slate-500" />
        </div>
      </div>

      <div className="mt-7 space-y-7">
        <Field
          label="Education"
          value={value.education}
          placeholder="Education"
          onChange={(nextValue) => updateField('education', nextValue)}
        />
        <Field
          label="Current Company"
          value={value.currentCompany}
          placeholder="Current company"
          onChange={(nextValue) => updateField('currentCompany', nextValue)}
        />
        <div className="max-w-[132px]">
          <Label>Experience</Label>
          <div className="mt-2 grid min-h-14 grid-cols-[1fr_auto] items-center gap-3 rounded-2xl bg-[#eef4ff] px-5 text-sm font-medium text-slate-800">
            <input
              type="text"
              inputMode="numeric"
              value={value.experience}
              placeholder="0"
              onChange={(event) => updateField('experience', event.target.value)}
              className="min-w-0 bg-transparent outline-none placeholder:text-slate-400"
            />
            <span className="text-xs font-extrabold text-slate-700 uppercase">Yrs</span>
          </div>
        </div>
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
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 flex min-h-14 w-full items-center rounded-2xl bg-[#eef4ff] px-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200 sm:px-5"
      />
    </label>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-bold tracking-[0.16em] text-slate-600 uppercase">{children}</span>
}
