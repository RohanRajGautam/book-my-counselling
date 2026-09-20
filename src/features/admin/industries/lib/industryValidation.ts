import type { ValidationError } from '@/features/booking/lib/validation'

const NAME_MIN = 2
const NAME_MAX = 100
const DESCRIPTION_MAX = 255

export interface IndustryFormValues {
  name: string
  description: string
}

export function validateIndustryForm(
  form: IndustryFormValues,
): ValidationError[] {
  const errors: ValidationError[] = []

  const name = form.name.trim()
  if (!name) {
    errors.push({ field: 'name', message: 'Name is required.' })
  } else if (name.length < NAME_MIN) {
    errors.push({ field: 'name', message: `Name must be at least ${NAME_MIN} characters.` })
  } else if (name.length > NAME_MAX) {
    errors.push({ field: 'name', message: `Name must be ${NAME_MAX} characters or fewer.` })
  }

  if (form.description.length > DESCRIPTION_MAX) {
    errors.push({
      field: 'description',
      message: `Description must be ${DESCRIPTION_MAX} characters or fewer.`,
    })
  }

  return errors
}