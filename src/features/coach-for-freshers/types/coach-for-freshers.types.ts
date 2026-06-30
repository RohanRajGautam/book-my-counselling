export type CoachForFreshersVarietySlug =
  | 'career-clarity-roadmap'
  | 'first-job-cv-builder'
  | 'mock-interview-lab'

export interface CoachForFreshersVariety {
  slug: string
  tag: string
  navLabel: string
  title: string
  subtitle: string
}

export const COACH_FOR_FRESHERS_VARIETIES: Record<CoachForFreshersVarietySlug, CoachForFreshersVariety> = {
  'career-clarity-roadmap': {
    slug: 'career-clarity-roadmap',
    tag: 'career-clarity-roadmap',
    navLabel: 'Career Clarity Roadmap',
    title: 'Career Clarity Roadmap',
    subtitle:
      'Build a clear, practical plan for your early career — what to learn, which roles to target, and how to stand out.',
  },
  'first-job-cv-builder': {
    slug: 'first-job-cv-builder',
    tag: 'first-job-builder',
    navLabel: 'First-Job CV Builder',
    title: 'First-Job CV Builder',
    subtitle:
      'Turn your projects, internships, and skills into a CV that gets callbacks from recruiters.',
  },
  'mock-interview-lab': {
    slug: 'mock-interview-lab',
    tag: 'mock-interview-lab',
    navLabel: 'Mock Interview Lab',
    title: 'Mock Interview Lab',
    subtitle:
      'Practice real interview rounds with mentors who have sat on both sides of the table and sharpen your answers.',
  },
}

export const COACH_FOR_FRESHERS_ROOT_VARIETY: CoachForFreshersVariety = {
  slug: 'coach-for-freshers',
  tag: 'coach-for-freshers',
  navLabel: 'Coach for Freshers',
  title: 'Coach for Freshers',
  subtitle:
    'Find mentors ready to help you with the early-career decisions that matter most — from career direction to CVs and interviews.',
}

export const COACH_FOR_FRESHERS_SERVICE_TAGS: { tag: string; label: string }[] =
  Object.values(COACH_FOR_FRESHERS_VARIETIES).map((v) => ({ tag: v.tag, label: v.navLabel }))

export const COACH_FOR_FRESHERS_SERVICE_SLUGS = COACH_FOR_FRESHERS_SERVICE_TAGS.map((s) => s.tag)

export const COACH_FOR_FRESHERS_TAG_LABELS: Record<string, string> = Object.fromEntries([
  ...COACH_FOR_FRESHERS_SERVICE_TAGS.map((s) => [s.tag, s.label]),
  [COACH_FOR_FRESHERS_ROOT_VARIETY.tag, COACH_FOR_FRESHERS_ROOT_VARIETY.navLabel],
])

export const COACH_FOR_FRESHERS_GROUP_TAG = COACH_FOR_FRESHERS_ROOT_VARIETY.tag

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
