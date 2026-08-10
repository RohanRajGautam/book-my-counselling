const MENTOR_COMPANIES = [
  'Leapfrog',
  'Snappet',
  'Webpoint',
  'Legal Access Nepal',
  'Manab Dental Home',
  'Madhyapur Hospital',
  'Aspire Academy',
]

export function MentorCompaniesMarquee() {
  return (
    <section
      id="mentor-companies"
      className="scroll-mt-32 overflow-hidden bg-gradient-to-br from-[#024fd5] to-[#2f6aea] px-6 py-14 sm:px-8"
      aria-label="Mentor companies"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-xs font-extrabold tracking-[0.28em] text-[#ffffff] uppercase">
          Our mentors work at
        </p>

        <div className="relative mt-8 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 sm:w-36" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 sm:w-36" />

          <div className="logo-marquee-track flex w-max items-center">
            {[0, 1].map((groupIndex) => (
              <div
                key={groupIndex}
                className="flex shrink-0 items-center gap-16 pr-16 sm:gap-24 sm:pr-24"
                aria-hidden={groupIndex === 1}
              >
                {MENTOR_COMPANIES.map((company) => (
                  <span
                    key={`${company}-${groupIndex}`}
                    className="min-w-max font-[family-name:var(--font-headline)] text-xl font-extrabold tracking-tight text-[#ffffff] uppercase sm:text-2xl"
                  >
                    {company}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
