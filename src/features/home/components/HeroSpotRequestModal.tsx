'use client'

import { type FormEvent, type ReactNode, useState } from 'react'
import { ArrowRight, CheckCircle2, Loader2, X } from 'lucide-react'

type HeroSpotForm = {
  name: string
  email: string
  phone: string
  address: string
  schoolOrganization: string
}

type Errors = Partial<Record<keyof HeroSpotForm, string>>

type HeroSpotRequestModalProps = {
  isOpen: boolean
  onClose: () => void
  eventName: string
}

const initialForm: HeroSpotForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  schoolOrganization: '',
}

export function HeroSpotRequestModal({ isOpen, onClose, eventName }: HeroSpotRequestModalProps) {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState<Errors>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!isOpen) return null

  function updateField(field: keyof HeroSpotForm, value: string) {
    setFormData((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
    setSubmitError('')
  }

  function updatePhone(value: string) {
    updateField('phone', value.replace(/[^0-9+\-\s()]/g, ''))
  }

  function validateForm() {
    const nextErrors: Errors = {}
    const digitOnlyPhone = formData.phone.replace(/[^\d]/g, '')

    if (formData.name.trim().length < 2) {
      nextErrors.name = 'Enter your full name'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = 'Enter a valid email address'
    }

    if (digitOnlyPhone.length < 7 || digitOnlyPhone.length > 15) {
      nextErrors.phone = 'Enter a valid phone number'
    }

    if (formData.address.trim().length < 3) {
      nextErrors.address = 'Enter your address'
    }

    if (formData.schoolOrganization.trim().length < 2) {
      nextErrors.schoolOrganization = 'Enter your school or organization'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting || !validateForm()) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const scriptUrl = process.env.NEXT_PUBLIC_HERO_SPOT_GOOGLE_SHEETS_SCRIPT_URL

      if (!scriptUrl) {
        throw new Error('Google Sheets script URL is not configured.')
      }

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          event: eventName,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          schoolOrganization: formData.schoolOrganization.trim(),
          submittedAt: new Date().toISOString(),
        }),
      })

      setIsSubmitted(true)
      setFormData(initialForm)

      window.setTimeout(() => {
        setIsSubmitted(false)
        onClose()
      }, 1400)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Unable to submit your request right now. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#121c2a]/65 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[1.5rem] border border-white/80 bg-white shadow-[0_28px_80px_rgba(18,28,42,0.22)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(135deg,#eef4ff_0%,#ffffff_52%,#e8fff3_100%)]" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 z-10 flex size-10 items-center justify-center rounded-full border border-[#d9e3f6] bg-white/85 text-[#121c2a] shadow-[0_10px_24px_rgba(18,28,42,0.12)] transition hover:bg-white focus:ring-3 focus:ring-[#004ac6]/20 focus:outline-none"
          aria-label="Close secure spot form"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <form onSubmit={handleSubmit} className="relative p-6 sm:p-8">
          <div className="max-w-xl pr-10">
            <p className="text-xs font-extrabold tracking-[0.16em] text-[#004ac6] uppercase">
              Secure your spot
            </p>
            <h3 className="mt-3 font-[family-name:var(--font-headline)] text-2xl leading-tight font-extrabold tracking-tight text-[#121c2a] sm:text-3xl">
              {eventName}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#5d6472] sm:text-base">
              Fill in your details and we will add you to the event registration list.
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <FormField
              label="Full name"
              error={errors.name}
              input={
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  className="h-12 w-full rounded-xl border border-[#d8e2f2] bg-white px-4 text-base transition outline-none placeholder:text-[#9aa3b2] focus:border-[#004ac6] focus:ring-3 focus:ring-[#004ac6]/12"
                />
              }
            />

            <FormField
              label="Email address"
              error={errors.email}
              input={
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  className="h-12 w-full rounded-xl border border-[#d8e2f2] bg-white px-4 text-base transition outline-none placeholder:text-[#9aa3b2] focus:border-[#004ac6] focus:ring-3 focus:ring-[#004ac6]/12"
                />
              }
            />

            <FormField
              label="Phone number"
              error={errors.phone}
              input={
                <input
                  type="tel"
                  inputMode="tel"
                  value={formData.phone}
                  onChange={(event) => updatePhone(event.target.value)}
                  placeholder="98XXXXXXXX"
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  className="h-12 w-full rounded-xl border border-[#d8e2f2] bg-white px-4 text-base transition outline-none placeholder:text-[#9aa3b2] focus:border-[#004ac6] focus:ring-3 focus:ring-[#004ac6]/12"
                />
              }
            />

            <FormField
              label="School / organization"
              error={errors.schoolOrganization}
              input={
                <input
                  type="text"
                  value={formData.schoolOrganization}
                  onChange={(event) => updateField('schoolOrganization', event.target.value)}
                  placeholder="School, college, or company"
                  autoComplete="organization"
                  aria-invalid={Boolean(errors.schoolOrganization)}
                  className="h-12 w-full rounded-xl border border-[#d8e2f2] bg-white px-4 text-base transition outline-none placeholder:text-[#9aa3b2] focus:border-[#004ac6] focus:ring-3 focus:ring-[#004ac6]/12"
                />
              }
            />

            <div className="sm:col-span-2">
              <FormField
                label="Address"
                error={errors.address}
                input={
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(event) => updateField('address', event.target.value)}
                    placeholder="City, district, or full address"
                    autoComplete="street-address"
                    aria-invalid={Boolean(errors.address)}
                    className="h-12 w-full rounded-xl border border-[#d8e2f2] bg-white px-4 text-base transition outline-none placeholder:text-[#9aa3b2] focus:border-[#004ac6] focus:ring-3 focus:ring-[#004ac6]/12"
                  />
                }
              />
            </div>
          </div>

          {submitError && (
            <p className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {submitError}
            </p>
          )}

          {isSubmitted && (
            <p className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[#bdf3d5] bg-[#e8fff3] px-4 py-3 text-center text-sm font-bold text-[#00824f]">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Spot request submitted successfully.
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#004ac6] px-5 font-[family-name:var(--font-headline)] text-base font-extrabold text-white shadow-[0_14px_28px_rgba(0,74,198,0.24)] transition hover:bg-[#003fa8] focus:ring-3 focus:ring-[#004ac6]/25 focus:outline-none disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Submitting
              </>
            ) : (
              <>
                Submit request
                <ArrowRight className="size-4" aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

function FormField({ label, error, input }: { label: string; error?: string; input: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-extrabold text-[#121c2a]">{label}</span>
      {input}
      {error && <span className="mt-2 block text-sm font-semibold text-red-600">{error}</span>}
    </label>
  )
}
