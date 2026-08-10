import type { CoachForFreshersVariety } from '../types/coach-for-freshers.types'

export function CoachForFreshersListingHeader({ variety }: { variety: CoachForFreshersVariety }) {
  const words = variety.title.split(' ')
  const lastWord = words.at(-1) ?? variety.title
  const firstWords = words.length > 1 ? words.slice(0, -1).join(' ') : ''

  return (
    <section className="px-6 pt-6 sm:px-8">
      <div>
        <h1 className="font-[family-name:var(--font-headline)] text-[clamp(2.25rem,5vw,3rem)] leading-[1.05] font-extrabold text-[var(--foreground)]">
          {firstWords}
          {firstWords && ' '}
          <span className="text-[var(--brand-blue)]">{lastWord}</span>
        </h1>
        <p className="my-4 text-base leading-7 font-medium text-[var(--color-on-surface-variant)] sm:leading-8">
          {variety.subtitle}
        </p>
      </div>
    </section>
  )
}
