// Form validation utilities

// Single field-level validation issue shown in booking forms.
export interface ValidationError {
  field: string
  message: string
}

// Client-side booking form state before submission.
export interface BookingFormData {
  // Personal Details
  fullName: string
  email: string
  phone: string
  // Academic Details
  school: string
  educationLevel: string
  guardianPhone?: string
  // Preparation
  message: string
  // Payment
  cardNumber: string
  expiry: string
  cvc: string
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  // Check if it has 10-15 digits (international format)
  return cleaned.length >= 10 && cleaned.length <= 15
}

export const validateCardNumber = (cardNumber: string): boolean => {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '')
  // Check if it's 13-19 digits (standard card lengths)
  if (!/^\d{13,19}$/.test(cleaned)) return false

  // Luhn algorithm for card validation
  let sum = 0
  let isEven = false

  for (let i = cleaned.length - 1; i >= 0; i--) {
    const char = cleaned.charAt(i)
    let digit = parseInt(char, 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

export const validateExpiry = (expiry: string): boolean => {
  // Format: MM/YY or MM / YY
  const cleaned = expiry.replace(/\s/g, '')
  const match = cleaned.match(/^(\d{2})\/(\d{2})$/)

  if (!match || !match[1] || !match[2]) return false

  const month = parseInt(match[1], 10)
  const year = parseInt(match[2], 10)

  if (month < 1 || month > 12) return false

  // Check if card is not expired
  const now = new Date()
  const currentYear = now.getFullYear() % 100
  const currentMonth = now.getMonth() + 1

  if (year < currentYear) return false
  if (year === currentYear && month < currentMonth) return false

  return true
}

export const validateCVC = (cvc: string): boolean => {
  return /^\d{3,4}$/.test(cvc)
}

export const validateBookingForm = (data: BookingFormData): ValidationError[] => {
  const errors: ValidationError[] = []

  // Personal Details
  if (!data.fullName.trim()) {
    errors.push({ field: 'fullName', message: 'Full name is required' })
  } else if (data.fullName.trim().length < 2) {
    errors.push({ field: 'fullName', message: 'Name must be at least 2 characters' })
  }

  if (!data.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' })
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' })
  }

  if (!data.phone.trim()) {
    errors.push({ field: 'phone', message: 'Phone number is required' })
  } else if (!validatePhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' })
  }

  // Academic Details
  if (!data.school.trim()) {
    errors.push({ field: 'school', message: 'School/College is required' })
  }

  if (!data.educationLevel) {
    errors.push({ field: 'educationLevel', message: 'Please select your education level' })
  }

  // Guardian phone is optional but validate if provided
  if (data.guardianPhone && data.guardianPhone.trim() && !validatePhone(data.guardianPhone)) {
    errors.push({ field: 'guardianPhone', message: 'Please enter a valid phone number' })
  }

  // Preparation
  if (!data.message.trim()) {
    errors.push({ field: 'message', message: 'Please describe how the mentor can help you' })
  }

  // Note: card fields (cardNumber, expiry, cvc) are no longer validated here
  // because payment is handled by Fonepay after booking creation.

  return errors
}

// Format helpers
export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  const groups = cleaned.match(/.{1,4}/g) || []
  return groups.join(' ').substring(0, 19) // Max 16 digits + 3 spaces
}

export const formatExpiry = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length >= 2) {
    return `${cleaned.substring(0, 2)} / ${cleaned.substring(2, 4)}`
  }
  return cleaned
}

export const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length <= 3) return cleaned
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
  if (cleaned.length <= 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return `+${cleaned.slice(0, cleaned.length - 10)} (${cleaned.slice(-10, -7)}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`
}
