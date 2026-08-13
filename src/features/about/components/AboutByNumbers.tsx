interface Stat {
  metric: string
  title: string
  description: string
}

const stats: Stat[] = [
  {
    metric: '10%',
    title: 'Acceptance Rate',
    description: 'We ruthlessly curate our mentor pool to keep our standards elite.',
  },
  {
    metric: '80+',
    title: 'Verified Industry Experts',
    description:
      "Active professionals shaping Nepal's top tech, corporate, and academic institutions.",
  },
  {
    metric: '100%',
    title: 'Unbiased Guidance',
    description: 'No gatekeepers, no hidden agendas. Just direct access to the networks you need.',
  },
]

export function AboutByNumbers() {
  return (
    <section className="bg-[#f8f9ff] px-6 pt-16 pb-20 sm:px-8 lg:pt-24 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          {/* <p className="text-xs font-extrabold tracking-[0.18em] text-[#003ea8] uppercase">
            By the Numbers
          </p> */}
          <h2 className="mt-3 font-[family-name:var(--font-headline)] text-3xl leading-[1.05] font-extrabold tracking-tight text-balance text-slate-950 sm:text-4xl lg:text-5xl">
            The momentum of the platform.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-3 lg:gap-8">
          {stats.map((stat) => (
            <article
              key={stat.title}
              className="flex flex-col rounded-[24px] bg-white p-6 ring-1 ring-slate-200/70 sm:p-8"
            >
              <span className="font-[family-name:var(--font-headline)] text-4xl leading-none font-extrabold tracking-tight text-[var(--brand-blue)] sm:text-5xl">
                {stat.metric}
              </span>
              <h3 className="mt-5 font-[family-name:var(--font-headline)] text-xl font-extrabold tracking-tight text-slate-950">
                {stat.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-[#434655]">{stat.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
