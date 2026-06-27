export type CoachServiceAudience = 'freshers' | 'professionals'

export type CoachServicePageConfig = {
  audience: CoachServiceAudience
  navLabel: string
  title: string
  subtitle: string
  href: string
  services: string[]
  serviceTags: Record<string, string>
}

export type StaticCoachMentor = {
  id: string
  audience: CoachServiceAudience
  name: string
  role: string
  company: string
  services: string[]
  rating: number
  reviews: number
  totalSessions: number
  packageTiers: {
    duration_minutes: number
    price: number
  }[]
  availableThisWeek: boolean
}

export const COACH_SERVICE_PAGES: Record<CoachServiceAudience, CoachServicePageConfig> = {
  freshers: {
    audience: 'freshers',
    navLabel: 'Coach for Freshers',
    title: 'Kickstart Your Career',
    subtitle: 'Book practical career guidance from verified mentors for your first big step.',
    href: '/coaches/freshers',
    services: ['Career Clarity Roadmap', 'First-Job CV Builder', 'Mock Interview Lab'],
    serviceTags: {
      'Career Clarity Roadmap': 'career-clarity',
      'First-Job CV Builder': 'cv',
      'Mock Interview Lab': 'mock-interview',
    },
  },
  professionals: {
    audience: 'professionals',
    navLabel: 'Coach for Professionals',
    title: 'Accelerate Your Growth',
    subtitle: 'Prototype services for working professionals planning their next move.',
    href: '/coaches/professionals',
    services: ['1% ATS Resume Upgrade', 'Corporate Interview Cracker'],
    serviceTags: {
      '1% ATS Resume Upgrade': 'ats-resume',
      'Corporate Interview Cracker': 'corporate-interview',
    },
  },
}

export const STATIC_COACH_MENTORS: StaticCoachMentor[] = [
  {
    id: 'professionals-bikram',
    audience: 'professionals',
    name: 'Bikram Thapa',
    role: 'ATS Resume Strategist',
    company: 'Talent Growth Studio',
    services: ['1% ATS Resume Upgrade', 'Corporate Interview Cracker'],
    rating: 4.9,
    reviews: 57,
    totalSessions: 164,
    packageTiers: [
      { duration_minutes: 30, price: 1200 },
      { duration_minutes: 60, price: 2200 },
      { duration_minutes: 90, price: 3200 },
    ],
    availableThisWeek: true,
  },
  {
    id: 'professionals-nisha',
    audience: 'professionals',
    name: 'Nisha Gurung',
    role: 'Corporate Interview Coach',
    company: 'Promotion Pathways',
    services: ['Corporate Interview Cracker'],
    rating: 4.8,
    reviews: 46,
    totalSessions: 139,
    packageTiers: [
      { duration_minutes: 30, price: 1100 },
      { duration_minutes: 60, price: 2000 },
      { duration_minutes: 90, price: 2900 },
    ],
    availableThisWeek: true,
  },
  {
    id: 'professionals-roshan',
    audience: 'professionals',
    name: 'Roshan Poudel',
    role: 'Career Growth Consultant',
    company: 'Next Role Advisory',
    services: ['1% ATS Resume Upgrade'],
    rating: 4.7,
    reviews: 31,
    totalSessions: 91,
    packageTiers: [
      { duration_minutes: 30, price: 1000 },
      { duration_minutes: 60, price: 1800 },
      { duration_minutes: 90, price: 2600 },
    ],
    availableThisWeek: false,
  },
]

export function getFreshersServiceTag(service: string) {
  return COACH_SERVICE_PAGES.freshers.serviceTags[service] ?? null
}

export function isFreshersServiceTag(tag: string | undefined): tag is string {
  if (!tag) return false

  return Object.values(COACH_SERVICE_PAGES.freshers.serviceTags).includes(tag)
}
