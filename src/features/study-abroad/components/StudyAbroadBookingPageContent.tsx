'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { FormInput } from '@/features/booking/components/FormInput'
import { FormSelect } from '@/features/booking/components/FormSelect'
import { FormTextarea } from '@/features/booking/components/FormTextarea'
import { OrderSummary } from '@/features/booking/components/OrderSummary'
import { EDUCATION_LEVEL_OPTIONS } from '@/features/booking/lib/booking.constants'
import {
  formatPhone,
  validateBookingForm,
  type BookingFormData,
} from '@/features/booking/lib/validation'
import {
  STUDY_ABROAD_CONSULTANTS,
  STUDY_ABROAD_COUNTRIES,
} from '@/features/study-abroad/lib/study-abroad.constants'
import type { StudyAbroadConsultant } from '@/features/study-abroad/types/study-abroad.types'

const STUDY_ABROAD_BOOKING_SCRIPT_URL =
  process.env.NEXT_PUBLIC_STUDY_ABROAD_GOOGLE_SHEETS_SCRIPT_URL ?? ''

function formatDisplayName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) =>
      part === part.toUpperCase() && /\p{L}/u.test(part)
        ? part
        : part.toLowerCase().replace(/^\p{L}/u, (letter) => letter.toUpperCase())
    )
    .join(' ')
}

function getConsultantTitle(consultant: StudyAbroadConsultant) {
  const profileParts =
    consultant.profileType === 'student'
      ? [consultant.universityName, consultant.program]
      : [consultant.position, consultant.companyName]

  const profileTitle = profileParts.filter(Boolean).join(', ')

  return profileTitle || `${consultant.city}, ${getCountryLabel(consultant.country)}`
}

function getCountryLabel(country: StudyAbroadConsultant['country']) {
  return STUDY_ABROAD_COUNTRIES.find((item) => item.value === country)?.label ?? country
}

export function StudyAbroadBookingPageContent() {
  const searchParams = useSearchParams()
  const consultantId = searchParams.get('consultantId')
  const duration = Number(searchParams.get('duration'))

  const consultant = STUDY_ABROAD_CONSULTANTS.find((item) => item.id === consultantId) ?? null
  const selectedPackage =
    consultant?.packages.find((item) => item.durationMinutes === duration) ?? null

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    email: '',
    phone: '',
    school: '',
    educationLevel: '',
    guardianPhone: '',
    message: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setSubmitError(null)
    setIsSubmitted(false)
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handlePhoneChange = (field: 'phone' | 'guardianPhone', value: string) => {
    handleInputChange(field, formatPhone(value))
  }

  const handleBlur = (field: keyof BookingFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async () => {
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Record<string, boolean>
    )
    setTouched(allTouched)

    const validationErrors = validateBookingForm(formData)
    if (validationErrors.length > 0) {
      const errorMap = validationErrors.reduce(
        (acc, error) => ({ ...acc, [error.field]: error.message }),
        {} as Record<string, string>
      )
      setErrors(errorMap)

      const firstError = validationErrors[0]
      if (firstError) {
        const element = document.getElementById(firstError.field)
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element?.focus()
      }
      return
    }

    if (!consultant || !selectedPackage) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      if (!STUDY_ABROAD_BOOKING_SCRIPT_URL) {
        throw new Error('Google Sheets submission URL is not configured yet.')
      }

      const consultantName = formatDisplayName(consultant.name)
      const consultantTitle = getConsultantTitle(consultant)

      await fetch(STUDY_ABROAD_BOOKING_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          sheetName: 'Study Abroad Requests',
          submittedAt: new Date().toISOString(),
          consultantId: consultant.id,
          consultantName,
          consultantProfileType: consultant.profileType,
          consultantTitle,
          consultantCountry: getCountryLabel(consultant.country),
          consultantCity: consultant.city,
          consultantUniversity: consultant.universityName ?? '',
          consultantProgram: consultant.program ?? '',
          consultantCompany:
            consultant.profileType === 'employee' ? (consultant.companyName ?? '') : '',
          consultantPosition:
            consultant.profileType === 'employee' ? (consultant.position ?? '') : '',
          consultationType: 'Study Abroad Consultation',
          durationMinutes: selectedPackage.durationMinutes,
          durationLabel: `${selectedPackage.durationMinutes} mins`,
          price: selectedPackage.price,
          priceLabel: `NPR ${selectedPackage.price.toLocaleString()}`,
          services: consultant.services.join(', '),
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          school: formData.school.trim(),
          educationLevel: formData.educationLevel,
          guardianPhone: formData.guardianPhone?.trim() ?? '',
          message: formData.message.trim(),
        }),
      })

      setIsSubmitted(true)
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to submit your request. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!consultant || !selectedPackage) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-7xl flex-col justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-lg font-semibold text-[#121c2a]">Missing consultation details</p>
        <p className="mt-2 text-[#434655]">
          Please go back and choose a consultant and session package.
        </p>
      </main>
    )
  }

  const consultantTitle = getConsultantTitle(consultant)

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="my-12">
        <h1 className="my-4 font-[family-name:var(--font-headline)] text-4xl font-bold tracking-tight text-[#121c2a] md:text-5xl">
          Complete your request
        </h1>
        <p className="text-lg text-[#434655]">
          Please provide your details so we can prepare your study abroad consultation.
        </p>
      </div>

      <div className="flex flex-col gap-12 lg:flex-row lg:gap-24">
        <div className="flex-1 space-y-12">
          <section className="rounded-[24px] bg-[#eff4ff] p-8">
            <h2 className="mb-8 font-[family-name:var(--font-headline)] text-2xl font-bold text-[#121c2a]">
              Personal Details
            </h2>
            <div className="space-y-6">
              <FormInput
                id="fullName"
                label="Full Name"
                type="text"
                placeholder="e.g. Jane Doe"
                value={formData.fullName}
                onChange={(event) => handleInputChange('fullName', event.target.value)}
                onBlur={() => handleBlur('fullName')}
                error={touched.fullName ? errors.fullName : undefined}
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormInput
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={(event) => handleInputChange('email', event.target.value)}
                  onBlur={() => handleBlur('email')}
                  error={touched.email ? errors.email : undefined}
                />
                <FormInput
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="+977 98XXXXXXXX"
                  value={formData.phone}
                  onChange={(event) => handlePhoneChange('phone', event.target.value)}
                  onBlur={() => handleBlur('phone')}
                  error={touched.phone ? errors.phone : undefined}
                />
              </div>
            </div>
          </section>

          <section className="rounded-[24px] bg-[#eff4ff] p-8">
            <h2 className="mb-8 font-[family-name:var(--font-headline)] text-2xl font-bold text-[#121c2a]">
              Academic Details
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormInput
                  id="school"
                  label="Current School/College"
                  type="text"
                  placeholder="e.g. Tribhuvan University"
                  value={formData.school}
                  onChange={(event) => handleInputChange('school', event.target.value)}
                  onBlur={() => handleBlur('school')}
                  error={touched.school ? errors.school : undefined}
                />
                <FormSelect
                  id="educationLevel"
                  label="Education Level"
                  options={EDUCATION_LEVEL_OPTIONS}
                  value={formData.educationLevel}
                  onChange={(event) => handleInputChange('educationLevel', event.target.value)}
                  onBlur={() => handleBlur('educationLevel')}
                  error={touched.educationLevel ? errors.educationLevel : undefined}
                />
              </div>
              <FormInput
                id="guardianPhone"
                label="Guardian's Phone Number"
                type="tel"
                placeholder="+977 98XXXXXXXX"
                value={formData.guardianPhone || ''}
                onChange={(event) => handlePhoneChange('guardianPhone', event.target.value)}
                onBlur={() => handleBlur('guardianPhone')}
                error={touched.guardianPhone ? errors.guardianPhone : undefined}
                optional
              />
            </div>
          </section>

          <section className="rounded-[24px] bg-[#eff4ff] p-8">
            <h2 className="mb-8 font-[family-name:var(--font-headline)] text-2xl font-bold text-[#121c2a]">
              Preparation
            </h2>
            <FormTextarea
              id="message"
              label="How can this consultant help you prepare?"
              placeholder="Briefly describe your goals and what you'd like to discuss during the session..."
              rows={5}
              value={formData.message}
              onChange={(event) => handleInputChange('message', event.target.value)}
              onBlur={() => handleBlur('message')}
              error={touched.message ? errors.message : undefined}
            />
          </section>
        </div>

        <div className="w-full lg:w-[400px]">
          <div className="sticky top-32 space-y-8">
            <OrderSummary
              mentor={{
                name: formatDisplayName(consultant.name),
                title: consultantTitle,
                imageUrl: null,
              }}
              session={{
                type: 'Study Abroad Consultation',
                duration: `${selectedPackage.durationMinutes} mins`,
              }}
              price={selectedPackage.price}
            />

            <div className="space-y-3">
              {isSubmitted && (
                <p className="rounded-xl bg-[#e6f7ef] px-4 py-3 text-sm font-semibold text-[#00714d]">
                  Request submitted. We will contact you soon.
                </p>
              )}
              {submitError && (
                <p className="rounded-xl bg-[#fff1f0] px-4 py-3 text-sm font-semibold text-[#c62828]">
                  {submitError}
                </p>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full rounded-[24px] bg-gradient-to-br from-[#004ac6] to-[#2563eb] py-4 font-[family-name:var(--font-headline)] text-lg font-bold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-65"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Your Request'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
