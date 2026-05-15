'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { FormInput } from '@/features/booking/components/FormInput'
import { FormSelect } from '@/features/booking/components/FormSelect'
import { FormTextarea } from '@/features/booking/components/FormTextarea'
import { OrderSummary } from '@/features/booking/components/OrderSummary'
import { FonepayPaymentSection } from '@/features/booking/components/FonepayPaymentSection'
import { CalendlySection } from '@/features/booking/components/CalendlySection'
import {
  validateBookingForm,
  formatPhone,
  type BookingFormData,
} from '@/features/booking/lib/validation'
import { EDUCATION_LEVEL_OPTIONS } from '@/features/booking/lib/booking.constants'
import { useMentor } from '@/features/mentors/hooks/useMentor'
import { useMentorPackages } from '@/features/service-packages/hooks/useMentorPackages'
import { createGuestBooking } from '@/features/booking/api/bookingApi'

export function BookingPageContent() {
  const searchParams = useSearchParams()
  const mentorId = searchParams.get('mentorId')
  const packageId = searchParams.get('packageId')
  // slotId is selected in the mentor profile modal and passed via URL
  const slotId = searchParams.get('slotId')
  const sessionStart = searchParams.get('sessionStart')
  const sessionEnd = searchParams.get('sessionEnd')
  const isEvent = searchParams.get('isEvent') === 'true'

  const { data: mentor, isPending: isMentorLoading } = useMentor(mentorId)
  const { data: packages = [], isPending: isPackagesLoading } = useMentorPackages(mentorId)

  const selectedPackage = packages.find((p) => p.id === packageId) ?? null

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [bookingAmount, setBookingAmount] = useState<number>(0)
  const [submitError, setSubmitError] = useState<string | null>(null)

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
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Record<string, boolean>,
    )
    setTouched(allTouched)
    setSubmitError(null)

    const validationErrors = validateBookingForm(formData)

    if (validationErrors.length > 0) {
      const errorMap = validationErrors.reduce(
        (acc, e) => ({ ...acc, [e.field]: e.message }),
        {} as Record<string, string>,
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

    if (!isEvent && (!mentorId || !slotId)) return

    setIsSubmitting(true)
    try {
      const result = await createGuestBooking({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        mentor_id: isEvent ? '00000000-0000-0000-0000-000000000000' : mentorId!,
        slot_id: isEvent ? '00000000-0000-0000-0000-000000000000' : slotId!,
        package_id: packageId ?? undefined,
        session_start: isEvent ? new Date().toISOString() : (sessionStart ?? undefined),
        session_end: isEvent
          ? new Date(Date.now() + 3600000).toISOString()
          : (sessionEnd ?? undefined),
        goals: formData.message,
        current_school: formData.school || undefined,
        guardian_phone: formData.guardianPhone || undefined,
        mentee_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        topic: isEvent ? 'AI skills for SEE and +2 Appeared Students' : undefined,
      })

      setBookingId(result.booking_id)
      setBookingAmount(parseFloat(result.agreed_price))
    } catch (err: unknown) {
      let msg = 'Failed to create booking. Please try again.'
      if (err && typeof err === 'object') {
        const axiosErr = err as {
          response?: { data?: { detail?: string } }
          message?: string
        }
        msg = axiosErr.response?.data?.detail || axiosErr.message || msg
      }
      setSubmitError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoading = !isEvent && (isMentorLoading || isPackagesLoading)

  const orderSummaryMentor = isEvent
    ? {
        name: 'Swikar Sharma',
        title: 'Founder, Swikar Codes',
        imageUrl: '/home/swikar.png',
      }
    : mentor
      ? {
          name: mentor.user?.full_name ?? '',
          title: mentor.title,
          imageUrl: mentor.user?.avatar_url ?? null,
        }
      : null

  const orderSummarySession = isEvent
    ? {
        type: 'AI skills for SEE and +2 Appeared Students',
        duration: '60 mins',
        startTime: null,
        endTime: null,
      }
    : selectedPackage
      ? {
          type: selectedPackage.title,
          duration: `${selectedPackage.duration_minutes} mins`,
          startTime: sessionStart,
          endTime: sessionEnd,
        }
      : null

  const orderSummaryPrice = isEvent ? 100 : selectedPackage ? Number(selectedPackage.price) : 0

  // Guard: if required URL params are missing, show a helpful message
  if (!isEvent && (!mentorId || !packageId || !slotId || !sessionStart || !sessionEnd)) {
    return (
      <main className="mx-auto min-h-dvh max-w-7xl flex flex-col justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-lg font-semibold text-[#121c2a]">Missing booking details</p>
        <p className="mt-2 text-[#434655]">
          Please go back and select a mentor, package, and session time.
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
        {/* Left Column: Form */}
        <div className="flex-1 space-y-12">
          {/* Personal Details */}
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

          {/* Academic Details */}
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

          {/* Preparation */}
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

        {/* Right Column: Summary & Payment */}
        <div className="w-full lg:w-[400px]">
          <div className="sticky top-32 space-y-8">
            {isLoading ? (
              <div className="h-[280px] animate-pulse rounded-[24px] bg-white shadow-[0_8px_24px_rgba(18,28,42,0.06)]" />
            ) : orderSummaryMentor && orderSummarySession ? (
              <OrderSummary
                mentor={orderSummaryMentor}
                session={orderSummarySession}
                price={orderSummaryPrice}
              />
            ) : null}

            {bookingId ? (
              <>
                <FonepayPaymentSection
                  bookingId={bookingId}
                  amount={bookingAmount}
                  onSuccess={() => {
                    console.log('Payment successful for booking:', bookingId)
                  }}
                />
                {/* {mentorId && (
                  <CalendlySection
                    mentorId={mentorId}
                    bookingId={bookingId}
                    onScheduled={() => {
                      console.log('Session scheduled for booking:', bookingId)
                    }}
                  />
                )} */}
              </>
            ) : (
              <div className="space-y-3">
                {submitError && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-[#ba1a1a]">
                    {submitError}
                  </p>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !orderSummaryMentor || !orderSummarySession}
                  className="w-full rounded-[24px] bg-gradient-to-br from-[#004ac6] to-[#2563eb] py-4 font-[family-name:var(--font-headline)] text-lg font-bold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating booking…' : 'Proceed to Payment'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

