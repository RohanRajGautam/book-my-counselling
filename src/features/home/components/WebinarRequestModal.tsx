'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

type WebinarForm = {
  name: string
  email: string
  phone: string
  organization: string
}

type Errors = Partial<Record<keyof WebinarForm, string>>

type WebinarRequestModalProps = {
  isOpen: boolean
  onClose: () => void
  selectedEvent: string
}

const initialForm: WebinarForm = {
  name: '',
  email: '',
  phone: '',
  organization: '',
}

export function WebinarRequestModal({ isOpen, onClose, selectedEvent }: WebinarRequestModalProps) {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(field: keyof WebinarForm, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }))
  }

  // ✅ PHONE: only allow numbers
  function handlePhoneChange(value: string) {
    const onlyNumbers = value.replace(/[^0-9]/g, '')

    setFormData((prev) => ({
      ...prev,
      phone: onlyNumbers,
    }))

    setErrors((prev) => ({
      ...prev,
      phone: '',
    }))
  }

  function validate(): boolean {
    const newErrors: Errors = {}

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Enter a valid name'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    } else if (!/^[0-9]{10,10}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number (10 digits)'
    }

    if (!formData.organization.trim()) {
      newErrors.organization = 'This field is required'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (loading) return

    if (!validate()) return

    setLoading(true)

    try {
      await fetch(process.env.NEXT_PUBLIC_REQUEST_FOR_WEBINAR_SCRIPT_URL ?? '', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          event: selectedEvent,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          organization: formData.organization,
        }),
      })

      console.log({
        event: selectedEvent,
        ...formData,
      })

      setSubmitted(true)
      setFormData(initialForm)

      setTimeout(() => {
        onClose()
        setSubmitted(false)
      }, 1500)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121c2a]/60 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 flex size-10 items-center justify-center rounded-full bg-[#f3f6fc] text-[#121c2a]"
        >
          <X className="size-5" />
        </button>

        <div>
          <p className="text-sm font-bold tracking-[0.16em] text-[#004ac6] uppercase">
            Webinar Request
          </p>

          <h3 className="mt-3 text-3xl font-extrabold text-[#121c2a]">{selectedEvent}</h3>

          <p className="mt-2 text-base leading-7 text-[#5d6472]">
            Fill out the form below to request access to this webinar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-bold text-[#121c2a]">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-2xl border border-[#d8e2f2] bg-white px-4 py-3 text-base outline-none focus:border-[#004ac6]"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-bold text-[#121c2a]">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-2xl border border-[#d8e2f2] bg-white px-4 py-3 text-base outline-none focus:border-[#004ac6]"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Phone (numeric only) */}
          <div>
            <label className="mb-2 block text-sm font-bold text-[#121c2a]">Phone Number</label>
            <input
              type="text"
              inputMode="numeric"
              value={formData.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full rounded-2xl border border-[#d8e2f2] bg-white px-4 py-3 text-base outline-none focus:border-[#004ac6]"
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>

          {/* Organization */}
          <div>
            <label className="mb-2 block text-sm font-bold text-[#121c2a]">
              Education / Organization
            </label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => handleChange('organization', e.target.value)}
              placeholder="School, college, company, or organization"
              className="w-full rounded-2xl border border-[#d8e2f2] bg-white px-4 py-3 text-base outline-none focus:border-[#004ac6]"
            />
            {errors.organization && <p className="text-sm text-red-500">{errors.organization}</p>}
          </div>

          {submitted && (
            <p className="rounded-xl bg-[#e8fff3] px-4 py-3 text-center text-sm font-semibold text-[#00824f]">
              Webinar request submitted successfully.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#004ac6] px-5 py-4 text-base font-extrabold text-white shadow-[0_14px_28px_rgba(0,74,198,0.24)] transition hover:bg-[#003fa8] disabled:opacity-70"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  )
}
