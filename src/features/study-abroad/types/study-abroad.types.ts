export type StudyAbroadCountry =
  | 'usa'
  | 'australia'
  | 'canada'
  | 'uk'
  | 'finland'
  | 'austria'
  | 'germany'
  | 'japan'
  | 'portugal'

export type StudyAbroadSort = 'recommended' | 'rating' | 'price-low' | 'price-high' | 'newest'

export type StudyAbroadPackage = {
  durationMinutes: number
  price: number
}

type StudyAbroadConsultantBase = {
  id: string
  name: string
  imageUrl: string
  country: StudyAbroadCountry
  city?: string
  headline?: string
  bio?: string
  highlights?: string[]
  services: string[]
  rating: number
  reviews: number
  totalSessions: number
  verified?: boolean
  packages: StudyAbroadPackage[]
}

export type StudentConsultant = StudyAbroadConsultantBase & {
  profileType: 'student'
  universityName?: string
  program?: string
  research?: string
}

export type EmployeeConsultant = StudyAbroadConsultantBase & {
  profileType: 'employee'
  position?: string
  companyName?: string
  universityName?: string
  program?: string
  research?: string
}

export type StudyAbroadConsultant = StudentConsultant | EmployeeConsultant
