export type CoachForFreshersVarietySlug =
  | 'career-clarity-roadmap'
  | 'first-job-cv-builder'
  | 'mock-interview-lab'

export interface CoachForFreshersVariety {
  slug: CoachForFreshersVarietySlug
  tag: string
  navLabel: string
  title: string
  subtitle: string
}

export const COACH_FOR_FRESHERS_VARIETIES: Record<CoachForFreshersVarietySlug, CoachForFreshersVariety> = {
  'career-clarity-roadmap': {
    slug: 'career-clarity-roadmap',
    tag: 'career-clarity',
    navLabel: 'Career Clarity Roadmap',
    title: 'Career Clarity Roadmap',
    subtitle:
      'Build a clear, practical plan for your early career — what to learn, which roles to target, and how to stand out.',
  },
  'first-job-cv-builder': {
    slug: 'first-job-cv-builder',
    tag: 'cv',
    navLabel: 'First-Job CV Builder',
    title: 'First-Job CV Builder',
    subtitle:
      'Turn your projects, internships, and skills into a CV that gets callbacks from recruiters.',
  },
  'mock-interview-lab': {
    slug: 'mock-interview-lab',
    tag: 'mock-interview',
    navLabel: 'Mock Interview Lab',
    title: 'Mock Interview Lab',
    subtitle:
      'Practice real interview rounds with mentors who have sat on both sides of the table and sharpen your answers.',
  },
}

export const COACH_FOR_FRESHERS_CATEGORIES = ['IT', 'Management', 'General'] as const

export type CoachForFreshersCategory = (typeof COACH_FOR_FRESHERS_CATEGORIES)[number]

export function isCoachForFreshersCategory(value: string): value is CoachForFreshersCategory {
  return (COACH_FOR_FRESHERS_CATEGORIES as readonly string[]).includes(value)
}

export function getCoachForFreshersVariety(slug: string | undefined): CoachForFreshersVariety {
  if (slug && slug in COACH_FOR_FRESHERS_VARIETIES) {
    return COACH_FOR_FRESHERS_VARIETIES[slug as CoachForFreshersVarietySlug]
  }

  return COACH_FOR_FRESHERS_VARIETIES['career-clarity-roadmap']
}
