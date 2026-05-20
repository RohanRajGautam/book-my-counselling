'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
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

type EventBookingDetails = {
  guestName: string
  guestDesc: string
  imageUrl: string
  topic: string
}

const EVENT_BOOKING_SCRIPT_URL =
  process.env.NEXT_PUBLIC_EVENT_BOOKING_GOOGLE_SHEETS_SCRIPT_URL ?? ''

const emptyForm: BookingFormData = {
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
}

function readEventDetails(
  searchParams: ReturnType<typeof useSearchParams>
): EventBookingDetails | null {
  const guestName = searchParams.get('guestName')
  const guestDesc = searchParams.get('guestDesc')
  const imageUrl = searchParams.get('imageUrl')
  const topic = searchParams.get('topic')

  if (!guestName || !guestDesc || !imageUrl || !topic) return null

  return { guestName, guestDesc, imageUrl, topic }
}

export function EventBookingPageContent() {
  const searchParams = useSearchParams()
  const eventDetails = readEventDetails(searchParams)

  const [formData, setFormData] = useState<BookingFormData>(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
    if (!eventDetails) return

    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Record<string, boolean>
    )
    setTouched(allTouched)
    setSubmitError(null)

    const validationErrors = validateBookingForm(formData)

    if (validationErrors.length > 0) {
      const errorMap = validationErrors.reduce(
        (acc, e) => ({ ...acc, [e.field]: e.message }),
        {} as Record<string, string>
      )
      setErrors(errorMap)
      const firstError = validationErrors[0]
      if (firstError) {
        const el = document.getElementById(firstError.field)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el?.focus()
      }
      return
    }

    setIsSubmitting(true)
    try {
      if (!EVENT_BOOKING_SCRIPT_URL) {
        throw new Error('Google Sheets submission URL is not configured yet.')
      }

      await fetch(EVENT_BOOKING_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          sheetName: 'Event Bookings',
          submittedAt: new Date().toISOString(),
          eventTopic: eventDetails.topic,
          eventGuestName: eventDetails.guestName,
          eventGuestDesc: eventDetails.guestDesc,
          price: 'FREE',
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
        err instanceof Error ? err.message : 'Failed to secure your spot. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!eventDetails) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-7xl flex-col justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-lg font-semibold text-[#121c2a]">Missing event details</p>
        <p className="mt-2 text-[#434655]">
          Please go back to events and choose the event you want to join.
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
      <div className="my-12">
        <h1 className="my-4 font-[family-name:var(--font-headline)] text-4xl font-bold tracking-tight text-[#121c2a] md:text-5xl">
          Complete your booking
        </h1>
        <p className="text-lg text-[#434655]">
          Please provide your details to secure your session.
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
                onChange={(e) => handleInputChange('fullName', e.target.value)}
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
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  error={touched.email ? errors.email : undefined}
                />
                <FormInput
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="+977 98XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange('phone', e.target.value)}
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
                  onChange={(e) => handleInputChange('school', e.target.value)}
                  onBlur={() => handleBlur('school')}
                  error={touched.school ? errors.school : undefined}
                />
                <FormSelect
                  id="educationLevel"
                  label="Education Level"
                  options={EDUCATION_LEVEL_OPTIONS}
                  value={formData.educationLevel}
                  onChange={(e) => handleInputChange('educationLevel', e.target.value)}
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
                onChange={(e) => handlePhoneChange('guardianPhone', e.target.value)}
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
              label="How can this mentor help you prepare?"
              placeholder="Briefly describe your goals and what you'd like to discuss during the session..."
              rows={5}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              onBlur={() => handleBlur('message')}
              error={touched.message ? errors.message : undefined}
            />
          </section>
        </div>

        <div className="w-full lg:w-[400px]">
          <div className="sticky top-32 space-y-8">
            <OrderSummary
              mentor={{
                name: eventDetails.guestName,
                title: eventDetails.guestDesc,
                imageUrl: eventDetails.imageUrl,
              }}
              session={{
                type: eventDetails.topic,
                duration: '60 mins',
                startTime: null,
                endTime: null,
              }}
              price={0}
              priceLabel="FREE"
            />

            {isSubmitted ? (
              <div className="rounded-[24px] bg-[#ecfdf5] p-6 text-[#006c49]">
                <CheckCircle2 className="size-8" aria-hidden="true" />
                <p className="mt-4 font-[family-name:var(--font-headline)] text-xl font-bold">
                  Spot secured
                </p>
                <p className="mt-2 text-sm leading-6">
                  Your event booking details have been submitted successfully.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {submitError && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-[#ba1a1a]">
                    {submitError}
                  </p>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full rounded-[24px] bg-gradient-to-br from-[#004ac6] to-[#2563eb] py-4 font-[family-name:var(--font-headline)] text-lg font-bold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? 'Securing spot...' : 'Secure Free Spot'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
