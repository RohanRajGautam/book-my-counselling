import Image from 'next/image'

const team = [
  {
    name: 'Sonam Sherpa',
    role: 'Chief Executive Officer (CEO)',
    image: '/about/sonam-sherpa.jpeg',
  },
  {
    name: 'Ashutosh Kc',
    role: 'Chief of Business (CBO)',
    image: '/about/ashutosh-kc.jpeg',
  },
  {
    name: 'Nabin Paudel',
    role: 'Chief Product Officer (CPO)',
    image: '/about/nabin-paudel.webp',
  },
  {
    name: 'Subigya Ojha',
    role: 'Chief of Customer Success (CXO)',
    image: '/about/subigya-ojha.jpeg',
  },
]

export function AboutTeam() {
  return (
    <section className="bg-[#f8f9ff] px-6 pt-16 pb-20 sm:px-8 lg:pt-24 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <h2 className="font-[family-name:var(--font-headline)] text-3xl leading-[1.05] font-extrabold tracking-tight text-balance text-slate-950 sm:text-4xl lg:text-5xl">
            Meet the Visionaries
          </h2>
          <p className="mt-4 text-base leading-7 font-medium text-slate-500 sm:text-lg">
            The architects of Book Your Counselling come from diverse backgrounds in academia,
            technology, and career strategy.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-10">
          {team.map((member, index) => {
            const isLast = index === team.length - 1
            return (
              <article key={member.name}>
                <Image
                  src={member.image}
                  alt={member.name}
                  width={720}
                  height={900}
                  className={`aspect-[0.82] w-full rounded-[24px] object-cover shadow-[0_12px_28px_rgba(18,28,42,0.08)] ${
                    isLast ? 'object-top' : ''
                  }`}
                />
              <h3 className="mt-5 font-[family-name:var(--font-headline)] text-lg font-extrabold tracking-tight text-slate-950">
                {member.name}
              </h3>
              <p className="mt-1 text-sm font-bold text-[var(--brand-blue)]">{member.role}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
