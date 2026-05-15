'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight, Link as LinkIcon } from 'lucide-react'

type PitchForm = {
  fullName: string
  email: string
  phone: string
  organization: string
  pitch: string
  links: string
}

const initialForm: PitchForm = {
  fullName: '',
  email: '',
  phone: '',
  organization: '',
  pitch: '',
  links: '',
}

export function SchoolToStartupForm() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<Partial<PitchForm>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (field: keyof PitchForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }))

    setSubmitted(false)
  }

  const validate = () => {
    const newErrors: Partial<PitchForm> = {}

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email'
    }

    if (form.phone.trim().length < 7) {
      newErrors.phone = 'Enter a valid phone number'
    }

    if (!form.organization.trim()) {
      newErrors.organization = 'Organization or school is required'
    }

    if (form.pitch.trim().length < 20) {
      newErrors.pitch = 'Tell us more about your idea'
    }

    if (form.links.trim() && !/^https?:\/\/.+\..+/i.test(form.links.trim())) {
      newErrors.links = 'Enter a valid URL'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validate() || loading) return

    setLoading(true)

    try {
      await fetch(
        'https://script.google.com/macros/s/AKfycbxxi68xKk_NNgoFuHtkr3az6mW92yigCZT2nIDHQs39_MA7dFqXNMo9o0sKtws71EsW/exec',
        {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: JSON.stringify(form),
        }
      )

      setSubmitted(true)
      setForm(initialForm)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="px-6 pt-4 md:px-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-4xl rounded-3xl bg-white px-6 py-9 shadow-[0_24px_70px_rgba(18,28,42,0.08)] sm:px-10 lg:px-12"
      >
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-headline)] text-3xl font-extrabold tracking-normal text-[#121c2a]">
            Pitch Submission
          </h2>

          <p className="mt-3 text-sm text-[#434655]">
            Tell us about your vision. We&apos;re looking for innovation, feasibility, and passion.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <label className="block">
            <span className="text-xs font-extrabold text-[#434655] uppercase">Full Name</span>

            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="e.g. Alex Johnson"
              className="mt-3 h-14 w-full rounded-lg border-0 bg-[#eaf1ff] px-5 text-sm text-[#121c2a] outline-none placeholder:text-[#aab6cf] focus:ring-3 focus:ring-[#0053db]/25"
            />

            {errors.fullName && <p className="mt-2 text-sm text-[#ba1a1a]">{errors.fullName}</p>}
          </label>

          <label className="block">
            <span className="text-xs font-extrabold text-[#434655] uppercase">Email Address</span>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="alex@university.edu"
              className="mt-3 h-14 w-full rounded-lg border-0 bg-[#eaf1ff] px-5 text-sm text-[#121c2a] outline-none placeholder:text-[#aab6cf] focus:ring-3 focus:ring-[#0053db]/25"
            />

            {errors.email && <p className="mt-2 text-sm text-[#ba1a1a]">{errors.email}</p>}
          </label>

          <label className="block">
            <span className="text-xs font-extrabold text-[#434655] uppercase">Phone Number</span>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+977 (988) 000-0000"
              className="mt-3 h-14 w-full rounded-lg border-0 bg-[#eaf1ff] px-5 text-sm text-[#121c2a] outline-none placeholder:text-[#aab6cf] focus:ring-3 focus:ring-[#0053db]/25"
            />

            {errors.phone && <p className="mt-2 text-sm text-[#ba1a1a]">{errors.phone}</p>}
          </label>

          <label className="block">
            <span className="text-xs font-extrabold text-[#434655] uppercase">
              Organization/School
            </span>

            <input
              type="text"
              name="organization"
              value={form.organization}
              onChange={(e) => handleChange('organization', e.target.value)}
              placeholder="e.g. Tribhuwan University"
              className="mt-3 h-14 w-full rounded-lg border-0 bg-[#eaf1ff] px-5 text-sm text-[#121c2a] outline-none placeholder:text-[#aab6cf] focus:ring-3 focus:ring-[#0053db]/25"
            />

            {errors.organization && (
              <p className="mt-2 text-sm text-[#ba1a1a]">{errors.organization}</p>
            )}
          </label>
        </div>

        <label className="mt-8 block">
          <span className="text-xs font-extrabold text-[#434655] uppercase">
            Pitch About Your Idea
          </span>

          <div className="relative mt-3">
            <textarea
              name="pitch"
              value={form.pitch}
              onChange={(e) => handleChange('pitch', e.target.value)}
              placeholder="Describe the problem you are solving, your solution, and your target audience..."
              className="min-h-52 w-full resize-none rounded-lg border-0 bg-[#eaf1ff] px-5 py-5 text-sm text-[#121c2a] outline-none placeholder:text-[#aab6cf] focus:ring-3 focus:ring-[#0053db]/25"
            />

            <span className="absolute right-4 bottom-4 rounded-md bg-white/45 px-3 py-1 text-[11px] font-medium text-[#6b7280]">
              Minimum 500 characters recommended
            </span>
          </div>

          {errors.pitch && <p className="mt-2 text-sm text-[#ba1a1a]">{errors.pitch}</p>}
        </label>

        <label className="mt-8 block">
          <span className="text-xs font-extrabold text-[#434655] uppercase">
            Links to Additional Documents (Optional)
          </span>

          <div className="relative mt-3">
            <LinkIcon className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 text-[#9ca8bf]" />

            <input
              type="url"
              name="links"
              value={form.links}
              onChange={(e) => handleChange('links', e.target.value)}
              placeholder="Pitch deck, Figma prototypes, or Website URLs..."
              className="h-14 w-full rounded-lg border-0 bg-[#eaf1ff] pr-5 pl-12 text-sm text-[#121c2a] outline-none placeholder:text-[#aab6cf] focus:ring-3 focus:ring-[#0053db]/25"
            />
          </div>

          {errors.links ? (
            <p className="mt-2 text-sm text-[#ba1a1a]">{errors.links}</p>
          ) : (
            <p className="mt-2 text-[11px] font-medium text-[#737686]">
              Provide public links to Google Drive, Dropbox, or Portfolio sites.
            </p>
          )}
        </label>

        {submitted && (
          <p className="mt-8 rounded-lg bg-[#e5fff4] px-4 py-3 text-center text-sm font-semibold text-[#006c49]">
            Pitch received. We&apos;ll review it and get back to you soon.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-12 inline-flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#0053db] to-[#2563eb] font-[family-name:var(--font-headline)] text-base font-extrabold text-white shadow-[0_16px_34px_rgba(0,83,219,0.26)] transition hover:brightness-105 focus:ring-3 focus:ring-[#0053db]/25 focus:outline-none active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Submitting...' : 'Submit Pitch'}
          {!loading && <ArrowRight className="size-5" />}
        </button>
      </form>
    </section>
  )
}
