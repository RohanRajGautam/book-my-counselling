'use client'

import { useState } from 'react'
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
import { BOOKING_SUMMARY, EDUCATION_LEVEL_OPTIONS } from '@/features/booking/lib/booking.constants'

export function BookingPageContent() {
  // Form state (card fields removed — payment handled by Fonepay)
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
  // bookingId will come from the API after form submission; using placeholder for now
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [bookingAmount] = useState<number>(BOOKING_SUMMARY.price)
  // mentorId will come from the booking context / route params in production
  const [mentorId] = useState<string>(BOOKING_SUMMARY.mentorId ?? '')
  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handlePhoneChange = (field: 'phone' | 'guardianPhone', value: string) => {
    const formatted = formatPhone(value)
    handleInputChange(field, formatted)
  }

  const handleBlur = (field: keyof BookingFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async () => {
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    setTouched(allTouched)

    // Validate form
    const validationErrors = validateBookingForm(formData)

    if (validationErrors.length > 0) {
      const errorMap = validationErrors.reduce(
        (acc, error) => ({ ...acc, [error.field]: error.message }),
        {}
      )
      setErrors(errorMap)

      // Scroll to first error
      const firstError = validationErrors[0]
      if (firstError) {
        const element = document.getElementById(firstError.field)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          element.focus()
        }
      }
      return
    }

    // Submit form
    setIsSubmitting(true)
    try {
      // TODO: Replace with real booking API call
      // const booking = await createBooking(formData)
      // setBookingId(booking.id)
      // setBookingAmount(booking.agreed_price)

      // Simulate API call — in production this creates the booking and returns an ID
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const mockBookingId = 'mock-booking-id-' + Date.now()
      setBookingId(mockBookingId)
      console.log('Booking created, proceeding to payment:', mockBookingId)
    } catch (error) {
      console.error('Booking error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
      {/* Header */}
      <div className="my-12">
        <h1 className="my-4 font-[family-name:var(--font-headline)] text-4xl font-bold tracking-tight text-[#121c2a] md:text-5xl">
          Complete your booking
        </h1>
        <p className="text-lg text-[#434655]">
          Please provide your details to secure your session.
        </p>
      </div>

      {/* Main Content */}
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
                  placeholder="+1 (555) 000-0000"
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
                  placeholder="e.g. Stanford University"
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
                placeholder="+1 (555) 000-0000"
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
            <OrderSummary
              mentor={BOOKING_SUMMARY.mentor}
              session={BOOKING_SUMMARY.session}
              price={BOOKING_SUMMARY.price}
            />
            {bookingId ? (
              <>
                <FonepayPaymentSection
                  bookingId={bookingId}
                  amount={bookingAmount}
                  onSuccess={() => {
                    // TODO: redirect to a success page or show inline confirmation
                    console.log('Payment successful for booking:', bookingId)
                    alert('Payment successful!')
                  }}
                />
                {mentorId && (
                  <CalendlySection
                    mentorId={mentorId}
                    bookingId={bookingId}
                    onScheduled={() => {
                      alert('Your intro call is scheduled! Check your email for details.')
                    }}
                  />
                )}
              </>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full rounded-[24px] bg-gradient-to-br from-[#004ac6] to-[#2563eb] py-4 font-[family-name:var(--font-headline)] text-lg font-bold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Creating booking…' : 'Proceed to Payment'}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
