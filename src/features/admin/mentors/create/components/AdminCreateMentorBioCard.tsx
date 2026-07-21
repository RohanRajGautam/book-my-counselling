'use client'

import { BriefcaseBusiness, Link as LinkIcon } from 'lucide-react'

export type AdminCreateMentorBioForm = {
  bio: string
  linkedinUrl: string
  websiteUrl: string
  calendlyLink: string
}

type Props = {
  value: AdminCreateMentorBioForm
  onChange: (next: AdminCreateMentorBioForm) => void
  errors?: Partial<Record<keyof AdminCreateMentorBioForm, string>>
}

export function AdminCreateMentorBioCard({ value, onChange, errors = {} }: Props) {
  const updateField = (field: keyof AdminCreateMentorBioForm, nextValue: string) => {
    onChange({ ...value, [field]: nextValue })
  }

  return (
    <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
      <div className="flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-amber-200 text-amber-900">
          <BriefcaseBusiness className="size-5" />
        </div>
        <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
          Professional Bio &amp; Links
        </h2>
      </div>

      <p className="mt-2 text-sm font-medium text-slate-500">
        The mentor&apos;s bio and any external links. All fields here are optional.
      </p>

      <div className="mt-7 space-y-7">
        <label className="block">
          <Label>Full Biography</Label>
          <textarea
            value={value.bio}
            placeholder="Tell students about the mentor's experience, approach, and the support they offer"
            onChange={(e) => updateField('bio', e.target.value)}
            rows={6}
            className={
              'mt-2 min-h-40 w-full resize-y rounded-2xl bg-[#eef4ff] px-4 py-4 text-sm leading-6 font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200 sm:px-5' +
              (errors.bio ? ' ring-2 ring-red-200' : '')
            }
          />
          {errors.bio ? <p className="mt-1.5 text-xs font-bold text-red-600">{errors.bio}</p> : null}
        </label>

        <UrlField
          label="LinkedIn URL"
          value={value.linkedinUrl}
          placeholder="https://linkedin.com/in/…"
          onChange={(v) => updateField('linkedinUrl', v)}
          error={errors.linkedinUrl}
        />

        <UrlField
          label="Website / Portfolio"
          value={value.websiteUrl}
          placeholder="https://example.com"
          onChange={(v) => updateField('websiteUrl', v)}
          error={errors.websiteUrl}
        />

        <UrlField
          label="Calendly Link"
          value={value.calendlyLink}
          placeholder="https://calendly.com/…"
          onChange={(v) => updateField('calendlyLink', v)}
          error={errors.calendlyLink}
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
  error,
}: {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
  error?: string
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <div
        className={
          'mt-2 flex min-h-14 items-center gap-4 rounded-2xl bg-[#eef4ff] px-4 text-sm font-medium text-slate-800 focus-within:ring-2 focus-within:ring-blue-200 sm:px-5' +
          (error ? ' ring-2 ring-red-200' : '')
        }
      >
        <LinkIcon className="size-5 shrink-0 text-slate-300" />
        <input
          type="url"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-300"
        />
      </div>
      {error ? <p className="mt-1.5 text-xs font-bold text-red-600">{error}</p> : null}
    </label>
  )
}
