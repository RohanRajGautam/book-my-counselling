import type { CoachForFreshersVariety } from '../types/coach-for-freshers.types'

export function CoachForFreshersListingHeader({ variety }: { variety: CoachForFreshersVariety }) {
  const words = variety.title.split(' ')
  const lastWord = words.at(-1) ?? variety.title
  const firstWords = words.length > 1 ? words.slice(0, -1).join(' ') : ''

  return (
    <section className="px-5 pt-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="rounded-[24px] py-5">
        <div>
          <h1 className="font-[family-name:var(--font-headline)] text-[clamp(2.4rem,5.5vw,3rem)] leading-tight font-extrabold text-[#121c2a]">
            {firstWords}
            {firstWords && ' '}
            <span className="text-[#0053db]">{lastWord}</span>
          </h1>
          <p className="mt-4 text-base leading-8 font-medium text-[#5f6472]">{variety.subtitle}</p>
        </div>
      </div>
    </section>
  )
}
