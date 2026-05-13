'use client'

import { BriefcaseBusiness, GraduationCap, Briefcase } from 'lucide-react'

export type CounsellingType = {
  is_professional_counselor: boolean
  is_academic_counselor: boolean
}

type ProfileCounsellingCardProps = {
  value: CounsellingType
  onChange: (value: CounsellingType) => void
}

export function ProfileCounsellingCard({ value, onChange }: ProfileCounsellingCardProps) {
  return (
    <section
      id="counselling-provided"
      className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8"
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

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <CounsellingToggle
          active={value.is_professional_counselor}
          icon={<Briefcase className="size-5" />}
          title="Professional Coaching"
          description="Career guidance, industry transitions, interview prep"
          onClick={() =>
            onChange({ ...value, is_professional_counselor: !value.is_professional_counselor })
          }
        />
        <CounsellingToggle
          active={value.is_academic_counselor}
          icon={<GraduationCap className="size-5" />}
          title="Academic Counselling"
          description="University applications, thesis support, research strategy"
          onClick={() =>
            onChange({ ...value, is_academic_counselor: !value.is_academic_counselor })
          }
        />
      </div>
    </section>
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
          active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
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
        <p className="mt-0.5 text-xs font-medium leading-4 text-slate-500">{description}</p>
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
